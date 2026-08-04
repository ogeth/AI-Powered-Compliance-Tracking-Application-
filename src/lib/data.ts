/**
 * Data access layer. Every query is scoped to the authenticated user by RLS;
 * the client also filters explicitly for clarity.
 */
import { supabase } from "@/integrations/supabase/client";

export type BusinessProfileRow = {
  id: string;
  user_id: string;
  legal_name: string;
  trading_name: string | null;
  state_of_formation: string;
  entity_type: string;
  formation_date: string | null;
  ownership_type: string;
  member_count: number;
  management_structure: string;
  user_role: string;
  operating_agreement_status: string;
  business_address: string | null;
  registered_agent: string | null;
  tax_classification: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessRecordRow = {
  id: string;
  business_id: string | null;
  user_id: string;
  title: string;
  record_type: string;
  status: string;
  event_description: string | null;
  event_date: string | null;
  effective_date: string | null;
  meeting_occurred: string | null;
  participants: string | null;
  approvers: string | null;
  generated_content: { sections?: { id: string; heading: string; body: string }[] };
  recommendation_reason: string | null;
  facts_used: string[];
  assumptions: string[];
  missing_information: string[];
  risk_flags: string[];
  professional_review_recommended: boolean;
  template_version: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type DocumentRow = {
  id: string;
  user_id: string;
  business_id: string | null;
  record_id: string | null;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  storage_path: string;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("You need to be signed in to do that.");
  return data.user.id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function logActivity(
  event_type: string,
  description: string,
  extra?: { business_id?: string | null; record_id?: string | null },
) {
  const user_id = await requireUserId();
  await db.from("activity_events").insert({
    user_id,
    event_type,
    description,
    business_id: extra?.business_id ?? null,
    record_id: extra?.record_id ?? null,
  });
}

export async function fetchBusinessProfile(): Promise<BusinessProfileRow | null> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("business_profiles")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as BusinessProfileRow | null;
}

export async function upsertBusinessProfile(
  values: Partial<BusinessProfileRow>,
): Promise<BusinessProfileRow> {
  const user_id = await requireUserId();
  const existing = await fetchBusinessProfile();
  if (existing) {
    const { data, error } = await db
      .from("business_profiles")
      .update(values)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    await logActivity("business_profile_updated", "Business profile updated", {
      business_id: existing.id,
    });
    return data as BusinessProfileRow;
  }
  const { data, error } = await db
    .from("business_profiles")
    .insert({ ...values, user_id, legal_name: values.legal_name ?? "My business" })
    .select()
    .single();
  if (error) throw error;
  await logActivity("business_profile_created", "Business profile created", {
    business_id: (data as BusinessProfileRow).id,
  });
  return data as BusinessProfileRow;
}

export async function fetchRecords(): Promise<BusinessRecordRow[]> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("business_records")
    .select("*")
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BusinessRecordRow[];
}

export async function fetchRecord(id: string): Promise<BusinessRecordRow | null> {
  const { data, error } = await db.from("business_records").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as BusinessRecordRow | null;
}

export async function createRecord(values: Partial<BusinessRecordRow>): Promise<BusinessRecordRow> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("business_records")
    .insert({ ...values, user_id, title: values.title ?? "Untitled record", record_type: values.record_type ?? "business_decision_record" })
    .select()
    .single();
  if (error) throw error;
  const row = data as BusinessRecordRow;
  await logActivity("record_created", `Draft generated: ${row.title}`, { record_id: row.id });
  return row;
}

export async function updateRecord(
  id: string,
  values: Partial<BusinessRecordRow>,
  activity?: string,
): Promise<BusinessRecordRow> {
  const { data, error } = await db.from("business_records").update(values).eq("id", id).select().single();
  if (error) throw error;
  if (activity) await logActivity("record_updated", activity, { record_id: id });
  return data as BusinessRecordRow;
}

export async function deleteRecord(id: string) {
  const { error } = await db.from("business_records").delete().eq("id", id);
  if (error) throw error;
  await logActivity("record_deleted", "Business record deleted");
}

export async function fetchActivity(limit = 8): Promise<ActivityRow[]> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("activity_events")
    .select("id, event_type, description, created_at")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ActivityRow[];
}

export async function fetchDocuments(): Promise<DocumentRow[]> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("supporting_documents")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function uploadDocument(
  file: File,
  options: { category?: string; record_id?: string | null; business_id?: string | null } = {},
): Promise<DocumentRow> {
  const user_id = await requireUserId();
  if (file.size > MAX_FILE_BYTES) throw new Error("That file is larger than the 15 MB limit.");
  if (file.type && !ALLOWED_TYPES.includes(file.type))
    throw new Error("That file type is not supported. Upload a PDF, image, Word file or text file.");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${user_id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("business-documents")
    .upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
  if (uploadError) throw new Error("The file could not be uploaded. Please try again.");

  const { data, error } = await db
    .from("supporting_documents")
    .insert({
      user_id,
      record_id: options.record_id ?? null,
      business_id: options.business_id ?? null,
      file_name: file.name,
      file_type: file.type || null,
      file_size: file.size,
      category: options.category ?? "other",
      storage_path: path,
    })
    .select()
    .single();
  if (error) throw error;
  await logActivity("document_uploaded", `Document uploaded: ${file.name}`, {
    record_id: options.record_id ?? null,
  });
  return data as DocumentRow;
}

export async function documentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("business-documents")
    .createSignedUrl(path, 60 * 5);
  if (error || !data) throw new Error("That file could not be opened.");
  return data.signedUrl;
}

export async function deleteDocument(doc: DocumentRow) {
  await supabase.storage.from("business-documents").remove([doc.storage_path]);
  const { error } = await db.from("supporting_documents").delete().eq("id", doc.id);
  if (error) throw error;
  await logActivity("document_deleted", `Document deleted: ${doc.file_name}`);
}

export async function renameDocument(id: string, file_name: string) {
  const { error } = await db.from("supporting_documents").update({ file_name }).eq("id", id);
  if (error) throw error;
}

export type NotificationPrefsRow = {
  id: string;
  product_updates: boolean;
  record_reminders: boolean;
  roadmap_updates: boolean;
  security_alerts: boolean;
};

export async function fetchNotificationPrefs(): Promise<NotificationPrefsRow | null> {
  const user_id = await requireUserId();
  const { data, error } = await db
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as NotificationPrefsRow;
  const { data: created } = await db
    .from("notification_preferences")
    .insert({ user_id })
    .select()
    .single();
  return (created ?? null) as NotificationPrefsRow | null;
}

export async function updateNotificationPrefs(id: string, values: Partial<NotificationPrefsRow>) {
  const { error } = await db.from("notification_preferences").update(values).eq("id", id);
  if (error) throw error;
}

export async function fetchProfile() {
  const user_id = await requireUserId();
  const { data, error } = await db.from("profiles").select("*").eq("id", user_id).maybeSingle();
  if (error) throw error;
  return data as { id: string; first_name: string | null; last_name: string | null; email: string | null } | null;
}

export async function updateProfile(values: { first_name?: string; last_name?: string }) {
  const user_id = await requireUserId();
  const { error } = await db.from("profiles").update(values).eq("id", user_id);
  if (error) throw error;
  await supabase.auth.updateUser({ data: values });
}
