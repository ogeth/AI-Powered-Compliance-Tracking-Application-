# PRD: Auto-Compliance Engine

> **Supersedes** `tasks/prd-colorado-compliance-checklist.md`. This PRD covers the same Colorado required/recommended requirements-checklist work as that document, plus one additional capability: instead of only flagging missing required items in a static panel, the wizard actively **prompts the user, item by item, to fill the gaps** before finalizing the draft. The older PRD file should be archived/deleted once this one is approved.

## 1. Introduction/Overview

**Problem Statement:** Business owners waste time worrying about whether their meeting minutes and resolutions are legally sufficient, and risk losing their liability shield because they don't know what Colorado law and IRS guidance actually require to be recorded — today they either guess, skip required elements entirely, or pay a professional to check compliance manually.

**Solution:** The Auto-Compliance Engine evaluates a user's plain-language description against a sourced Colorado requirements checklist, clearly separates what's legally required from what's merely recommended, and actively prompts the user for any required element that's missing — so the resulting document is complete and defensible without the user needing to know the law themselves or hire someone to check it.

MinuteMate's record generator (`src/app/app/records/new/page.tsx` + `src/lib/records.ts`) turns a user's free-text description of what happened into a draft meeting minutes / consent / resolution document. Today it produces generic, non-authoritative hints — `missingInformation` strings like "Attendance or quorum details — these were not invented for you" (`src/lib/records.ts:256`) — that are reasonable-sounding but don't reflect what Colorado law and IRS recordkeeping guidance actually require to be documented.

The Auto-Compliance Engine replaces that generic hint logic with a **data-driven Colorado legal-requirements checklist**. It evaluates the user's description and structured answers against a sourced list of required-vs-recommended elements, and — this is the new behavior beyond the superseded PRD — **actively prompts the user to supply each missing required element** (e.g., "Who confirmed quorum was met?") rather than just displaying a passive warning banner. The engine never invents or assumes facts on the user's behalf; it only asks better, more specific questions and clearly labels what's legally required vs. optional.

**Goal:** When a Colorado LLC owner describes what happened in plain language, MinuteMate tells them — based on a real, sourced Colorado requirements checklist — exactly which legally required elements are present, actively prompts them to supply what's missing, and produces a document with no unresolved required gaps, in under 5 minutes, without ever fabricating facts.

## 2. Goals

1. Encode a real, sourced checklist of legally required and recommended elements for Colorado LLC meeting minutes, written consents, and resolutions.
2. Automatically evaluate a user's draft (description + context answers) against that checklist and clearly separate **"legally required"** from **"recommended/optional"** items.
3. When a required item is missing, actively prompt the user with a specific, targeted question inline in the wizard — not just a static "something is missing" warning — so they can supply it before finishing.
4. Never fabricate or infer factual content on the user's behalf. The engine only asks; the user always supplies the actual fact.
5. Scope activation to businesses with `state_of_formation === "Colorado"`; all other states keep today's generic behavior unchanged.
6. Keep the whole flow — from pasting a description to a completed draft with zero unresolved required items — achievable in under 5 minutes.
7. Preserve the existing "not a law firm / not legal advice" posture (`src/lib/product.ts`) — the engine informs and prompts, it doesn't certify legal compliance.

## 3. User Stories

- **As a** Colorado LLC owner, **I want to** type what happened in my own words and see exactly which legally required elements are missing from my description, **so that** I know what compliance gaps exist without having to know the law myself.
- **As a** Colorado LLC owner, **I want to** be asked a direct question (e.g., "Who approved this decision?") right in the wizard when something required is missing, **so that** I can answer it on the spot instead of guessing what to add myself.
- **As a** Colorado LLC owner, **I want to** clearly see which suggested items are just best-practice recommendations and not legally required, **so that** I don't feel forced to fill in things that don't matter for compliance.
- **As a** Colorado LLC owner, **I want to** trust that the final document never contains an invented fact, only what I actually confirmed, **so that** I can rely on it as an accurate record if it's ever challenged.
- **As a** user whose business is formed outside Colorado, **I want to** have the generator behave as it does today with generic guidance, **so that** I'm not shown a checklist that claims to be state-specific but isn't accurate for my state.
- **As the** product owner, **I want to** keep the underlying checklist content in one reviewable place instead of scattered in UI strings, **so that** it can be updated or attorney-reviewed without a UI rewrite.

## 4. Functional Requirements

### 1. Compliance Data Model & Scoping

**4.1.1** The system SHALL provide a requirements data module (`src/lib/compliance/colorado.ts`) that, for each `RecordType` (`src/lib/records.ts:7`), lists discrete requirement items, each with a stable `id`, `label`, `severity` (`"required"` | `"recommended"`), a `why` explanation, a `promptQuestion`, and a deterministic `check` predicate over `GenerationInput`/`ContextAnswers`.

**4.1.2** The system SHALL load and evaluate the compliance checklist only when `business.state_of_formation === "Colorado"`.

**4.1.3** The system SHALL leave generator behavior unchanged for any business whose `state_of_formation` is not Colorado — no checklist panel, no prompts, unchanged `missingInformation` behavior.

**4.1.4** The system SHALL structure the checklist data as state-keyed (`Record<StateName, ComplianceChecklist>`) even though only Colorado is populated at launch, so additional states can be added without restructuring.

### 2. Compliance Evaluation

**4.2.1** The system SHALL provide an `evaluateComplianceChecklist(input: GenerationInput): ComplianceChecklistResult` function returning, per requirement item, its satisfied/missing status, severity, label, why, and promptQuestion.

**4.2.2** The system SHALL use `evaluateComplianceChecklist` results, for Colorado businesses, in place of the ad hoc `missingInformation` strings currently produced in `buildDraft` (`src/lib/records.ts:247-259`).

**4.2.3** The system SHALL NOT write an invented or assumed fact into a form field, a prompt's default value, or the generated document under any circumstance.

**4.2.4** The system SHALL retain the existing explicit placeholder pattern (e.g., `"[Confirm whether attendance requirements were satisfied...]"`, `src/lib/records.ts:290`) in the generated draft for any required item the user does not answer.

**4.2.5** The system SHALL source all Colorado requirement content (item text, legal basis, required-vs-recommended classification, and prompt wording) from the Colorado Revised Uniform Limited Liability Company Act and applicable IRS recordkeeping guidance, not from AI generation.

### 3. Wizard Integration

**4.3.1** The system SHALL render, at the Context step of the wizard, an explicit inline prompt for every `required` item that is missing and maps to a wizard-answerable field, before the user can proceed to the Recommendation/Draft step.

**4.3.2** The system SHALL NOT infer answers to required-item prompts from the free-text `description` field.

**4.3.3** The system SHALL render a "Colorado compliance checklist" panel at the Recommendation/Draft step, alongside the existing Facts used / Assumptions / Missing information / Risk flags panel, grouped into **Required** and **Recommended**, each item showing a satisfied/missing indicator and its `why` text.

**4.3.4** The system SHALL display a warning banner (e.g., "2 legally required items are missing") at the Recommendation/Draft step when any required item remains unresolved, consistent with the existing `professional_review_recommended` pattern (`src/lib/records.ts:52-58`).

**4.3.5** The system SHALL NOT hard-block saving or generating a draft solely because a required item is unresolved.

**4.3.6** The system SHALL limit inline Context-step prompts to missing `required` items only — `recommended` items SHALL NOT generate a prompt — so the full flow remains achievable in under 5 minutes.

### 4. Persistence & Messaging

**4.4.1** The system SHALL persist the computed checklist result — including which items were required/recommended, satisfied/missing, and the user's answers to any prompts — alongside the saved record.

**4.4.2** The system SHALL make the persisted checklist result viewable from the record detail view after generation, not only during the generation flow.

**4.4.3** The system SHALL NOT display any compliance-checking claim for non-Colorado businesses, and MAY show a neutral note that state-specific checklists are currently available for Colorado only.

### 5. History, Editing & Export

**4.5.1** The system SHALL save every generated record to a history/library view (existing: `src/app/app/records/page.tsx`), listing its title, record type, status, and created/last-edited dates.

**4.5.2** The system SHALL allow users to open and edit a previously saved record (existing: `src/app/app/records/[id]/page.tsx`).

**4.5.3** The system SHALL re-evaluate the Colorado compliance checklist whenever a Colorado business's record is edited and saved, and SHALL update the persisted checklist result to reflect the edited content (resolves prior Open Question: checklist re-evaluation is required on edit, not generation-time-only).

**4.5.4** The system SHALL NOT retain multiple saved versions of a record's history — editing and saving a record SHALL overwrite its current content and checklist result rather than creating a new version.

**4.5.5** The system SHALL support exporting a record as a PDF (existing: `Print / Export PDF` in `records/[id]/page.tsx`).

**4.5.6** The system SHALL support exporting a record as an editable Word (`.docx`) document containing the same finalized content as the PDF export.

## 5. Non-Goals (Out of Scope)

- No AI/LLM-based extraction, inference, or invention of facts from free text at any point in this feature. All detection is deterministic (structured predicates over existing fields/answers); all gap-filling is done by the user answering a direct question, never by the system guessing.
- No support for states other than Colorado in this iteration (the data model should be state-keyed to allow future states, but only Colorado is populated now).
- No legally binding compliance certification, e-signature, or filing integration — this is informational guidance and prompting only.
- Not replacing or removing the existing generator wizard steps, or its current generic `missingInformation`/risk-flag logic for non-Colorado businesses.
- Not building an admin UI for editing the checklist content; it is maintained as code/data in the repo for this iteration.
- No hard-blocking of save/generate when required items remain unresolved — prompting is encouraged, not mandatory.
- No version history — only the current saved state of a record and its checklist result are kept; prior edits are not retained or diffable.
- No export formats beyond PDF and Word (`.docx`) in this iteration.

## 6. Design Considerations (Optional)

- Reuse existing UI primitives already in the generator (`Card`, `Badge`, `Checkbox`, form inputs from `src/components/ui`) for both the new inline Context-step prompts and the Recommendation/Draft checklist panel, to stay visually consistent.
- Use the existing `AlertTriangle` / `CheckCircle2` icon pattern already imported in `records/new/page.tsx` to distinguish required-missing (warning) vs satisfied (check) items.
- Group by severity (Required first, then Recommended) rather than by document section, so the most important gaps are seen first.
- Inline prompts at the Context step should read as natural follow-up questions ("Who confirmed quorum was met?"), not as legalese, so a non-lawyer user can answer confidently.
- The compliance checklist status (required-item satisfied/missing summary) SHOULD be visible on each card in the history/library view, not just inside the record detail page, so users can spot at a glance which saved records still have gaps.

## 7. Technical Considerations (Optional)

- Keep the checklist evaluation pure/deterministic and colocated near `records.ts` so it's unit-testable independent of UI.
- `ContextAnswers` (`src/lib/records.ts:85`) will likely need new explicit fields (e.g., `quorumConfirmed`, `meetingFormat`, and free-text answers to prompt questions) to back required-item checks and store prompt responses, rather than inferring them from free-text `description`.
- Keep the checklist data structure state-keyed (`Record<StateName, ComplianceChecklist>`) even though only Colorado is populated now, so adding a second state later doesn't require restructuring.
- Saved-record persistence likely needs a new column/JSON field on the record (see `supabase/migrations`) to store checklist results and prompt answers at time of generation.
- `buildDraft`'s `missingInformation` array (`src/lib/records.ts:247-259`) should, for Colorado businesses, be driven by unresolved items from `evaluateComplianceChecklist` rather than the current hardcoded checks, so the two systems don't produce conflicting or duplicate messaging.
- Word export needs a `.docx` generation approach (e.g., a library such as `docx` on the client, or a server route) that maps `DocumentSection[]` (`src/lib/records.ts:112`) to Word paragraphs/headings — reuse the same section data that already feeds `sectionsToPlainText` and the PDF print view so the three output paths (screen, PDF, Word) never drift from one saved source of truth.
- Editing a saved record and re-running `evaluateComplianceChecklist` should overwrite (not append to) the record's stored checklist result and `missingInformation`, consistent with the "no version history" non-goal.

## 8. Success Metrics

- 100% of Colorado-entity drafts generated through the wizard are evaluated against the checklist, and any missing required item triggers an inline prompt before the Recommendation/Draft step.
- Reduction in records saved with unresolved "required" items missing, tracked via the existing `track()` analytics helper (e.g., new `compliance_checklist_shown`, `compliance_prompt_answered`, `compliance_required_item_missing_at_save` events).
- Median time from starting the description to a draft with zero unresolved required items stays under 5 minutes.
- Zero instances (verified via code review / tests) of the engine writing a non-placeholder, non-user-supplied value into a required field.
- Qualitative: legal/professional reviewer sign-off that the Colorado checklist content and prompt wording are accurate before shipping to production users.
- 100% of edits to a saved Colorado record re-evaluate and overwrite its checklist result before the edit is saved.
- Word (`.docx`) export produces a document whose content matches the PDF export for the same record, verified via spot-check testing.

## 9. Open Questions

1. Who sources/approves the actual Colorado legal-requirements content (specific statute citations, required vs. recommended classification, prompt wording) — product/legal counsel, or is research needed as a follow-up task before implementation starts?
2. Should missing required items ever hard-block saving a record, or is a visible-but-non-blocking warning always sufficient after the user has been prompted (current assumption: non-blocking, matching the existing `professional_review_recommended` pattern)?
3. Do manager resolutions and written consents (not just meeting minutes) need their own distinct Colorado checklists and prompt sets, or does a single shared checklist with record-type-specific items cover all record types adequately?
4. If a user skips an inline prompt at the Context step, should they be asked again at the Recommendation/Draft step, or only shown the passive warning banner at that point?
5. Should the Word and PDF exports include the compliance checklist status (required/recommended, satisfied/missing) as an appendix, or only the finalized document content itself?
6. When an edit to a record changes its checklist result from "no required items missing" to "required items missing" (or vice versa), should the record's `status` (`src/lib/records.ts:52-58`) change automatically (e.g., back to `professional_review_recommended`)?
</content>
