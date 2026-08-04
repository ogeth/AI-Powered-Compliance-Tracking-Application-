/**
 * Domain model + deterministic record recommendation and drafting logic.
 * This module is provider-agnostic: `generation-service.ts` wraps it so a real
 * AI backend can be connected later without touching callers.
 */

export type RecordType =
  | "meeting_minutes"
  | "sole_member_written_consent"
  | "member_written_consent"
  | "manager_resolution"
  | "business_decision_record";

export const RECORD_TYPES: {
  value: RecordType;
  label: string;
  description: string;
}[] = [
  {
    value: "meeting_minutes",
    label: "Meeting Minutes",
    description:
      "For documenting an actual meeting, participants, discussion and decisions.",
  },
  {
    value: "sole_member_written_consent",
    label: "Sole-Member Written Consent",
    description:
      "For recording a decision approved by the only member of an LLC without holding a formal meeting.",
  },
  {
    value: "member_written_consent",
    label: "Member Written Consent",
    description: "For decisions approved in writing by multiple LLC members.",
  },
  {
    value: "manager_resolution",
    label: "Manager Resolution",
    description:
      "For decisions made by an authorized manager in a manager-managed LLC.",
  },
  {
    value: "business_decision_record",
    label: "Business Decision Record",
    description:
      "For maintaining a clear internal record when a more formal document type is not appropriate or cannot yet be determined.",
  },
];

export function recordTypeLabel(value: string): string {
  return RECORD_TYPES.find((r) => r.value === value)?.label ?? "Business Record";
}

export type RecordStatus =
  | "draft"
  | "awaiting_review"
  | "professional_review_recommended"
  | "awaiting_signature"
  | "completed"
  | "archived";

export const RECORD_STATUSES: { value: RecordStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "awaiting_review", label: "Awaiting review" },
  { value: "professional_review_recommended", label: "Professional review recommended" },
  { value: "awaiting_signature", label: "Awaiting signature" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function statusLabel(value: string): string {
  return RECORD_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export type BusinessContext = {
  legal_name: string;
  trading_name?: string | null;
  state_of_formation: string;
  entity_type: string;
  ownership_type: string; // single_member | multi_member
  member_count: number;
  management_structure: string; // member_managed | manager_managed
  user_role: string;
  operating_agreement_status: string; // yes | no | unsure
};

export type ContextAnswers = {
  unanimous?: string;
  decidedBy?: string; // member | manager | officer
  involvesAnotherMember?: boolean;
  changesOwnership?: boolean;
  involvesBorrowing?: boolean;
  amendsOperatingAgreement?: boolean;
  largeDistribution?: boolean;
  relatedParty?: boolean;
  taxElection?: boolean;
  sellsAssets?: boolean;
  dissolution?: boolean;
};

export type GenerationInput = {
  business: BusinessContext;
  description: string;
  eventDate: string;
  effectiveDate?: string;
  meetingOccurred: "yes" | "no" | "unsure";
  participants?: string;
  approvers?: string;
  notes?: string;
  answers: ContextAnswers;
  selectedRecordType?: RecordType;
};

export type DocumentSection = { id: string; heading: string; body: string };

export type GenerationOutput = {
  recordType: RecordType;
  reason: string;
  factsUsed: string[];
  assumptions: string[];
  missingInformation: string[];
  riskFlags: string[];
  professionalReviewRecommended: boolean;
  title: string;
  sections: DocumentSection[];
  templateVersion: string;
};

const RISK_RULES: { key: keyof ContextAnswers; label: string }[] = [
  { key: "changesOwnership", label: "Changes ownership percentages or membership interests" },
  { key: "involvesAnotherMember", label: "Involves adding, removing or transacting with another member" },
  { key: "amendsOperatingAgreement", label: "Amends the operating agreement" },
  { key: "involvesBorrowing", label: "Involves borrowing or pledging company assets" },
  { key: "largeDistribution", label: "Involves a large owner distribution" },
  { key: "relatedParty", label: "Involves a related-party transaction" },
  { key: "taxElection", label: "Involves a tax election" },
  { key: "sellsAssets", label: "Involves selling substantial business assets" },
  { key: "dissolution", label: "Involves dissolution, merger or winding up" },
];

export function detectRiskFlags(answers: ContextAnswers): string[] {
  return RISK_RULES.filter((r) => answers[r.key] === true).map((r) => r.label);
}

export function recommendRecordType(input: GenerationInput): {
  recordType: RecordType;
  reason: string;
} {
  const { business, meetingOccurred, answers } = input;
  const isLLC = business.entity_type.toLowerCase() === "llc";
  const singleMember = business.ownership_type === "single_member" && business.member_count <= 1;
  const managerManaged = business.management_structure === "manager_managed";

  if (meetingOccurred === "yes") {
    return {
      recordType: "meeting_minutes",
      reason:
        "You confirmed that an actual meeting took place, so minutes are the format that matches what happened.",
    };
  }

  if (isLLC && managerManaged && (answers.decidedBy === "manager" || business.user_role === "manager")) {
    return {
      recordType: "manager_resolution",
      reason:
        "The company is manager-managed and the decision was made or approved by an authorized manager, so a manager resolution matches the approval path.",
    };
  }

  if (isLLC && singleMember && meetingOccurred === "no") {
    return {
      recordType: "sole_member_written_consent",
      reason:
        "The company is a single-member LLC, no meeting took place and the member approved the decision, so a written consent records the approval without implying a meeting occurred.",
    };
  }

  if (isLLC && !singleMember && meetingOccurred === "no") {
    return {
      recordType: "member_written_consent",
      reason:
        "The LLC has more than one member and the decision was approved in writing rather than at a meeting, so a member written consent fits.",
    };
  }

  return {
    recordType: "business_decision_record",
    reason:
      "There is not enough confirmed information to select a more specific formal record, so a general internal business decision record keeps a clear history without over-formalizing.",
  };
}

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function buildDraft(input: GenerationInput): GenerationOutput {
  const { business, description } = input;
  const recommendation = input.selectedRecordType
    ? {
        recordType: input.selectedRecordType,
        reason: recommendRecordType(input).reason,
      }
    : recommendRecordType(input);

  const recordType = recommendation.recordType;
  const eventDate = formatDate(input.eventDate);
  const effectiveDate = formatDate(input.effectiveDate || input.eventDate);
  const entity = `${business.state_of_formation} ${business.entity_type === "LLC" ? "limited liability company" : business.entity_type.toLowerCase()}`;

  const factsUsed = [
    `Legal business name: ${business.legal_name}`,
    `State of formation: ${business.state_of_formation}`,
    `Entity type: ${business.entity_type}`,
    `Ownership: ${business.ownership_type === "single_member" ? "Single-member" : `Multi-member (${business.member_count} members)`}`,
    `Management: ${business.management_structure === "manager_managed" ? "Manager-managed" : "Member-managed"}`,
    `Your role: ${business.user_role.replace(/_/g, " ")}`,
    `Decision or meeting date: ${eventDate || "not provided"}`,
    `An actual meeting took place: ${input.meetingOccurred}`,
  ];
  if (input.participants) factsUsed.push(`Participants as described: ${input.participants}`);
  if (input.approvers) factsUsed.push(`Approvers as described: ${input.approvers}`);

  const assumptions: string[] = [
    "The description you provided accurately reflects what happened.",
    `The decision was documented under ${business.state_of_formation} law for a ${business.entity_type}.`,
  ];
  if (input.effectiveDate && input.effectiveDate !== input.eventDate) {
    assumptions.push("The effective date differs from the decision date, as you indicated.");
  } else {
    assumptions.push("The decision is effective on the decision date unless you change it.");
  }
  if (business.operating_agreement_status !== "yes") {
    assumptions.push(
      "No operating agreement terms were reviewed, so this draft does not reflect specific approval thresholds in your governing documents.",
    );
  }

  const missingInformation: string[] = [];
  if (!input.participants) missingInformation.push("Names of the people who participated.");
  if (!input.approvers) missingInformation.push("Names of the people who approved the decision.");
  if (input.meetingOccurred === "unsure")
    missingInformation.push("Whether an actual meeting took place — this changes the appropriate record type.");
  if (recordType === "meeting_minutes") {
    missingInformation.push("Meeting location or format (in person, video, phone).");
    missingInformation.push("Attendance or quorum details — these were not invented for you.");
  }
  if (business.operating_agreement_status === "unsure")
    missingInformation.push("Whether the company has an operating agreement and what it requires.");

  const riskFlags = detectRiskFlags(input.answers);
  const professionalReviewRecommended = riskFlags.length > 0;

  const participantList = input.participants?.trim() || "[Add the names of the participants]";
  const approverList = input.approvers?.trim() || "[Add the names of the approving parties]";
  const authorized = input.approvers?.trim() || "[Add the authorized person]";

  const header = (title: string) => `${title.toUpperCase()}\nOF\n${business.legal_name.toUpperCase()}`;

  let title = "";
  let sections: DocumentSection[] = [];

  const background = `On ${eventDate || "[date]"}, ${business.legal_name} considered the following matter, described by the business owner: ${description.trim()}`;

  switch (recordType) {
    case "meeting_minutes":
      title = `Meeting Minutes — ${business.legal_name} — ${eventDate}`;
      sections = [
        { id: "heading", heading: "Document", body: header("Minutes of meeting") },
        {
          id: "meeting_details",
          heading: "Meeting details",
          body: `Company: ${business.legal_name}, a ${entity}\nDate of meeting: ${eventDate || "[date]"}\nLocation or format: [Add the meeting location or format]`,
        },
        { id: "attendees", heading: "Attendees", body: participantList },
        {
          id: "quorum",
          heading: "Attendance statement",
          body: "[Confirm whether the attendance requirements in your operating agreement were satisfied. This statement was not generated for you because attendance and quorum are facts only you can confirm.]",
        },
        { id: "agenda", heading: "Agenda", body: `Discussion and approval of the matter described below.` },
        { id: "discussion", heading: "Discussion summary", body: background },
        {
          id: "decisions",
          heading: "Decisions",
          body: `The following decision was recorded: ${description.trim()}\n\nApproved by: ${approverList}`,
        },
        {
          id: "resolutions",
          heading: "Resolutions",
          body: `RESOLVED, that the company approves the matter described above, and that ${authorized} is authorized to take the actions reasonably necessary to carry it out.`,
        },
        { id: "adjournment", heading: "Adjournment", body: "There being no further business, the meeting was adjourned." },
        {
          id: "signature",
          heading: "Approval",
          body: `Name:\nSignature:\nDate:`,
        },
      ];
      break;

    case "sole_member_written_consent":
      title = `Sole-Member Written Consent — ${business.legal_name} — ${eventDate}`;
      sections = [
        { id: "heading", heading: "Document", body: header("Sole-member written consent") },
        {
          id: "intro",
          heading: "Introduction",
          body: `The undersigned, being the sole member of ${business.legal_name}, a ${entity}, adopts the following written consent as of ${eventDate || "[date]"}.`,
        },
        { id: "background", heading: "Background", body: background },
        {
          id: "resolution",
          heading: "Resolution",
          body: `RESOLVED, that the sole member approves the matter described above.`,
        },
        {
          id: "authorization",
          heading: "Authorization",
          body: `${authorized} is authorized to take the actions reasonably necessary to carry out this decision, including signing documents on behalf of the company.`,
        },
        { id: "effective", heading: "Effective date", body: `This consent is effective as of ${effectiveDate || "[date]"}.` },
        { id: "signature", heading: "Sole member", body: `Name:\nSignature:\nDate:` },
      ];
      break;

    case "member_written_consent":
      title = `Member Written Consent — ${business.legal_name} — ${eventDate}`;
      sections = [
        { id: "heading", heading: "Document", body: header("Written consent of the members") },
        {
          id: "intro",
          heading: "Introduction",
          body: `The undersigned members of ${business.legal_name}, a ${entity}, adopt the following written consent as of ${eventDate || "[date]"}, without a meeting.`,
        },
        { id: "background", heading: "Background", body: background },
        {
          id: "resolution",
          heading: "Resolution",
          body: `RESOLVED, that the members approve the matter described above.\n\nApproving members: ${approverList}\n\n[Confirm that the approval satisfies the voting requirements in your operating agreement. Voting thresholds were not assumed for you.]`,
        },
        {
          id: "authorization",
          heading: "Authorization",
          body: `${authorized} is authorized to take the actions reasonably necessary to carry out this decision.`,
        },
        { id: "effective", heading: "Effective date", body: `This consent is effective as of ${effectiveDate || "[date]"}.` },
        {
          id: "signature",
          heading: "Members",
          body: `Name:\nSignature:\nDate:\n\nName:\nSignature:\nDate:`,
        },
      ];
      break;

    case "manager_resolution":
      title = `Manager Resolution — ${business.legal_name} — ${eventDate}`;
      sections = [
        { id: "heading", heading: "Document", body: header("Resolution of the manager") },
        {
          id: "intro",
          heading: "Introduction",
          body: `The undersigned, acting as an authorized manager of ${business.legal_name}, a ${entity}, adopts the following resolution as of ${eventDate || "[date]"}.`,
        },
        { id: "background", heading: "Background", body: background },
        {
          id: "resolution",
          heading: "Resolution",
          body: `RESOLVED, that the manager approves the matter described above within the authority granted by the company's governing documents.`,
        },
        {
          id: "authorization",
          heading: "Authority granted",
          body: `${authorized} is authorized to take the actions reasonably necessary to carry out this decision.`,
        },
        { id: "effective", heading: "Effective date", body: `This resolution is effective as of ${effectiveDate || "[date]"}.` },
        { id: "signature", heading: "Manager", body: `Name:\nSignature:\nDate:` },
      ];
      break;

    default:
      title = `Business Decision Record — ${business.legal_name} — ${eventDate}`;
      sections = [
        { id: "heading", heading: "Document", body: header("Internal business decision record") },
        {
          id: "intro",
          heading: "Company",
          body: `${business.legal_name}, a ${entity}\nPrepared by: ${business.user_role.replace(/_/g, " ")}\nDate of decision: ${eventDate || "[date]"}`,
        },
        { id: "background", heading: "Background", body: background },
        {
          id: "decision",
          heading: "Decision",
          body: `${description.trim()}\n\nApproved by: ${approverList}`,
        },
        {
          id: "authorization",
          heading: "Follow-up authority",
          body: `${authorized} will carry out the actions needed to implement this decision.`,
        },
        { id: "effective", heading: "Effective date", body: `This decision is effective as of ${effectiveDate || "[date]"}.` },
        { id: "signature", heading: "Prepared by", body: `Name:\nSignature:\nDate:` },
      ];
  }

  if (input.notes?.trim()) {
    sections.push({ id: "exhibits", heading: "Additional notes", body: input.notes.trim() });
  }

  return {
    recordType,
    reason: recommendation.reason,
    factsUsed,
    assumptions,
    missingInformation,
    riskFlags,
    professionalReviewRecommended,
    title,
    sections,
    templateVersion: "v1.0",
  };
}

export function sectionsToPlainText(sections: DocumentSection[]): string {
  return sections
    .map((s) => (s.id === "heading" ? s.body : `${s.heading.toUpperCase()}\n${s.body}`))
    .join("\n\n");
}
