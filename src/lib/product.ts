/**
 * Central product constants. Replace PRODUCT_NAME in one place when the real
 * brand name is chosen.
 */
export const PRODUCT_NAME = "MinuteMate";

export const DISCLAIMER_SHORT =
  "This draft was generated from the information you provided. Review it for accuracy and confirm that it is consistent with your operating agreement and professional advice.";

export const DISCLAIMER_LONG = `${PRODUCT_NAME} provides business-record organization and document-preparation tools. It is not a law firm and does not provide legal representation. Generated documents should be reviewed for accuracy and consistency with your governing documents and professional advice.`;

export type AnalyticsEvent =
  | "homepage_primary_cta_clicked"
  | "homepage_secondary_cta_clicked"
  | "sample_demo_viewed"
  | "signup_started"
  | "signup_completed"
  | "login_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "generator_started"
  | "description_submitted"
  | "recommendation_viewed"
  | "recommendation_changed"
  | "draft_generated"
  | "draft_edited"
  | "draft_saved"
  | "pdf_exported"
  | "record_marked_awaiting_signature"
  | "signed_copy_uploaded"
  | "coming_soon_interest_submitted";

/**
 * Analytics hook. Intentionally never receives document content — only
 * non-sensitive metadata such as record type or step name.
 */
export function track(event: AnalyticsEvent, meta?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const payload = { event, meta: meta ?? {}, at: new Date().toISOString() };
  const w = window as unknown as { __analytics?: unknown[] };
  w.__analytics = w.__analytics ?? [];
  w.__analytics.push(payload);
  if (import.meta.env.DEV) console.debug("[analytics]", payload);
}
