## Relevant Files

- `src/lib/compliance/colorado.ts` - New Colorado requirements data model (per-`RecordType` checklist items: id, label, severity, why, promptQuestion, check).
- `src/lib/compliance/colorado.test.ts` - Unit tests for the Colorado requirements data model.
- `src/lib/records.ts` - Add `evaluateComplianceChecklist`, wire its results into `buildDraft`'s `missingInformation`, extend `ContextAnswers`.
- `src/lib/records.test.ts` - Unit tests for `evaluateComplianceChecklist` and updated `buildDraft` behavior.
- `src/app/app/records/new/page.tsx` - Context-step inline prompting for missing required items; Recommendation/Draft-step checklist panel.
- `src/app/app/records/[id]/page.tsx` - Record detail display of checklist status, edit re-evaluation, PDF export, new Word export action.
- `src/app/app/records/page.tsx` - History/library list: compliance status indicator per record card.
- `src/lib/data.ts` - Fetch/create/update record functions; read/write new checklist and audit-trail fields.
- `src/lib/docx-export.ts` - New Word (`.docx`) export helper mapping `DocumentSection[]` to a Word document.
- `src/lib/docx-export.test.ts` - Unit tests for the Word export helper.
- `supabase/migrations/<timestamp>_add_compliance_checklist.sql` - New migration adding checklist result, rules-version, and audit-timestamp columns to records.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `colorado.ts` and `colorado.test.ts` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- All new Colorado checklist behavior must stay behind `business.state_of_formation === "Colorado"`; verify non-Colorado behavior is unchanged at every step.
- No requirement item, prompt, or export path may invent/infer a fact the user did not supply.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create Feature Branch: Set up an isolated branch for the Auto-Compliance Engine work
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/auto-compliance-engine`)

- [ ] 1.0 Build Colorado Compliance Requirements Data Model: Encode the sourced required-vs-recommended checklist items for each record type
  - [ ] 1.1 Create `src/lib/compliance/colorado.ts` defining a `ComplianceRequirementItem` type (`id`, `label`, `severity`, `why`, `promptQuestion`, `check`)
  - [ ] 1.2 Define a `ComplianceChecklist` type keyed by `RecordType`, nested under a state-keyed `Record<StateName, ComplianceChecklist>` structure so future states don't require restructuring (4.1.4)
  - [ ] 1.3 Populate Colorado requirement items for `meeting_minutes` (e.g., quorum confirmation, attendees, approvers, resolution language) sourced from the Colorado Revised Uniform LLC Act and IRS recordkeeping guidance; mark content as pending counsel review (Open Question 1)
  - [ ] 1.4 Populate Colorado requirement items for the remaining record types (`sole_member_written_consent`, `member_written_consent`, `manager_resolution`, `business_decision_record`) using a single shared checklist with record-type-specific items
  - [ ] 1.5 Write unit tests verifying item shape, severity classification, and that each item has a non-empty `promptQuestion` when `severity === "required"`

- [ ] 2.0 Implement Compliance Evaluation Engine: Evaluate a draft against the checklist and wire the results into `buildDraft` without ever fabricating facts
  - [ ] 2.1 Implement `evaluateComplianceChecklist(input: GenerationInput): ComplianceChecklistResult`, running each Colorado item's `check` predicate against `GenerationInput`/`ContextAnswers`
  - [ ] 2.2 Gate evaluation so it only executes when `business.state_of_formation === "Colorado"`; return `undefined`/skip for all other states
  - [ ] 2.3 Update `buildDraft` (`src/lib/records.ts:247-259`) so Colorado businesses derive `missingInformation` from `evaluateComplianceChecklist` results instead of the current hardcoded checks
  - [ ] 2.4 Confirm `buildDraft` still writes the existing explicit placeholder text (never an invented value) for any unresolved required item
  - [ ] 2.5 Write unit tests for `evaluateComplianceChecklist` covering satisfied/missing detection per severity and per record type
  - [ ] 2.6 Write/update unit tests for `buildDraft` confirming non-Colorado businesses retain today's exact `missingInformation` output unchanged

- [ ] 3.0 Implement Database Schema Migration: Extend the schema to support compliance metadata, versioning, and audit trails
  - [ ] 3.1 Design a Supabase migration adding a `compliance_checklist_result` (jsonb) column to the records table storing per-item satisfied/missing status, severity, and prompt answers
  - [ ] 3.2 Add a `compliance_rules_version` column stamping which checklist content version produced a given result, so future rule content changes don't retroactively alter past drafts
  - [ ] 3.3 Add audit-trail timestamp columns (e.g., `checklist_evaluated_at`, `checklist_updated_at`) recording first computation and last re-evaluation
  - [ ] 3.4 Write and apply the migration under `supabase/migrations/`, and regenerate any generated TypeScript types consumed by `src/lib/data.ts`
  - [ ] 3.5 Update `src/lib/data.ts` create/update/fetch functions to read and write the new checklist and audit-trail fields

- [ ] 4.0 Build Wizard Context-Step Prompting: Add inline questions that ask the user to supply any missing required element before proceeding
  - [ ] 4.1 Extend `ContextAnswers` (`src/lib/records.ts:85`) with fields needed to back required-item checks and store prompt responses (e.g., `quorumConfirmed`, `meetingFormat`)
  - [ ] 4.2 In the Context step of `records/new/page.tsx`, compute missing required items via `evaluateComplianceChecklist` and render an inline form control for each item's `promptQuestion`
  - [ ] 4.3 Limit prompts to missing `required` items only (never `recommended`) and allow navigation to proceed even if a prompt is left unanswered, tracking it as unresolved
  - [ ] 4.4 Ensure no prompt is pre-filled or inferred from the free-text `description` field
  - [ ] 4.5 Add component/integration tests verifying prompts render only for missing required Colorado items and disappear once answered

- [ ] 5.0 Build Compliance Checklist Panel UI: Show required-vs-recommended status and warnings at the Recommendation/Draft step
  - [ ] 5.1 Add a "Colorado compliance checklist" panel alongside the existing Facts used / Assumptions / Missing information / Risk flags panel
  - [ ] 5.2 Group items into Required and Recommended sections using the existing `Card`/`Badge`/`AlertTriangle`/`CheckCircle2` patterns
  - [ ] 5.3 Add a warning banner (e.g., "2 legally required items are missing") when unresolved required items remain, following the `professional_review_recommended` pattern
  - [ ] 5.4 Confirm the panel and banner never block the Save/Generate action
  - [ ] 5.5 For non-Colorado businesses, render nothing (or the neutral "Colorado only" note) instead of the panel
  - [ ] 5.6 Add component tests covering required-missing, recommended-only, and fully-satisfied panel states

- [ ] 6.0 Implement Checklist Persistence, Edit Re-Evaluation, and History Display: Save checklist results with each record, re-evaluate and overwrite them when a record is edited, and surface status on the record detail view and history/library list
  - [ ] 6.1 On record creation, persist the computed checklist result and prompt answers using the schema fields added in 3.0
  - [ ] 6.2 On record edit/save in `records/[id]/page.tsx`, re-run `evaluateComplianceChecklist` against the updated content and overwrite (not append to) the stored checklist result and audit timestamp
  - [ ] 6.3 Display the persisted checklist status/panel on the record detail view, not only during initial generation
  - [ ] 6.4 Add a compact compliance status indicator (e.g., "2 required items missing") to each record card in the history/library list (`records/page.tsx`)
  - [ ] 6.5 Add tests covering: creating a record persists the checklist; editing a record overwrites rather than duplicates the stored result

- [ ] 7.0 Implement Colorado Scoping and Non-Colorado Messaging: Restrict the engine to Colorado businesses and add analytics events
  - [ ] 7.1 Verify all new checklist code paths (data loading, evaluation, prompting, panel, persistence) are gated behind `business.state_of_formation === "Colorado"`
  - [ ] 7.2 Confirm non-Colorado businesses see unchanged legacy `missingInformation`/`riskFlags` behavior with no checklist UI
  - [ ] 7.3 Add a neutral "compliance checklists currently available for Colorado only" note for non-Colorado businesses where appropriate
  - [ ] 7.4 Add analytics events via the existing `track()` helper: `compliance_checklist_shown`, `compliance_prompt_answered`, `compliance_required_item_missing_at_save`
  - [ ] 7.5 Add tests/verification confirming no compliance-related analytics events fire for non-Colorado businesses

- [ ] 8.0 Implement Word and PDF Document Export: Add `.docx` export alongside the existing PDF export so both formats share the same finalized record content
  - [ ] 8.1 Confirm/refactor the existing PDF export (`Print / Export PDF` in `records/[id]/page.tsx`) so it consumes `DocumentSection[]` as its single source of truth
  - [ ] 8.2 Add a Word (`.docx`) export helper (`src/lib/docx-export.ts`) using a library such as `docx`, mapping `DocumentSection[]` to Word headings/paragraphs, mirroring `sectionsToPlainText`'s structure
  - [ ] 8.3 Add an "Export Word" action next to the existing "Print / Export PDF" action in the record detail view
  - [ ] 8.4 Track a `docx_exported` analytics event alongside the existing `pdf_exported` event
  - [ ] 8.5 Add tests verifying the Word export contains the same section content as the PDF/plain-text output for a given record
