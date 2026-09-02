# PRD: Colorado Compliance Checklist for Meeting Minutes & Resolutions

## 1. Introduction/Overview

MinuteMate's record generator (`src/app/app/records/new/page.tsx` + `src/lib/records.ts`) already turns a user's free-text description into a draft meeting minutes / consent / resolution document, with generic "missing information" and "risk flag" detection. That detection is currently a set of reasonable-sounding but non-authoritative hints (e.g., "Attendance or quorum details — these were not invented for you") — it does not reflect what Colorado law and IRS guidance actually require to be recorded.

This feature adds a **Colorado-specific legal-requirements checklist**: a data-driven list of elements that are legally required vs. merely recommended for each record type, scoped to the entity's state of formation. At launch this is scoped to Colorado only, since `state_of_formation` is already captured at onboarding (`src/app/app/onboarding/page.tsx`) and already defaults to "Colorado." The generator wizard is augmented — not replaced — to run the user's description and context answers against this checklist and clearly show what's legally required, what's present, and what's missing, before the user finalizes a draft.

**Goal:** When a Colorado business owner describes what happened, MinuteMate tells them — based on an actual, sourced Colorado requirements checklist, not a generic guess — exactly which legally required elements are covered and which are missing, so the resulting document better protects their liability shield.

## 2. Goals

1. Encode a real, sourced checklist of legally required and recommended elements for Colorado LLC meeting minutes, written/manager consents, and resolutions.
2. Automatically evaluate a user's draft (description + context answers) against that checklist and clearly separate **"legally required"** from **"recommended/optional"** items.
3. Surface required-vs-missing status inside the existing generator wizard (Recommendation/Draft steps) without adding a new top-level flow.
4. Scope the feature so it activates only when the business's `state_of_formation` is Colorado, and degrades gracefully (falls back to today's generic behavior) for any other state.
5. Keep the existing "not a law firm / not legal advice" posture intact — the checklist informs the user, it doesn't certify legal compliance.

## 3. User Stories

- As a Colorado LLC owner filling out the generator, I want to see which legally required elements (e.g., quorum confirmation, resolution language, approver names) are missing from my description, so I can add them before generating the final document.
- As a Colorado LLC owner, I want to clearly see which suggested items are just best-practice recommendations (not legally required), so I don't feel forced to fill in things that don't matter for compliance.
- As a user whose business is formed outside Colorado, I want the generator to behave as it does today (generic guidance) rather than show me a checklist that claims to be state-specific but isn't accurate for my state.
- As the product owner, I want the underlying checklist content to live in one reviewable place (not scattered in UI strings), so it can be updated or attorney-reviewed without a UI rewrite.

## 4. Functional Requirements

1. **Requirements data model.** Add a new data structure (e.g., `src/lib/compliance/colorado.ts`) that, for each `RecordType`, lists discrete requirement items, each with:
   - a stable `id`
   - `label` (what it is)
   - `severity`: `"required"` | `"recommended"`
   - a short `why` explanation the UI can display
   - a `check`: a deterministic predicate over the existing `GenerationInput`/`ContextAnswers`/form fields that determines whether the item is satisfied (e.g., "attendees present" → `participants` non-empty; "quorum confirmed" → a new explicit yes/no context answer, not inferred from free text).
2. **Colorado scoping.** The checklist is only loaded/evaluated when `business.state_of_formation === "Colorado"`. For any other state, the generator behaves exactly as it does today (no checklist section rendered).
3. **New evaluation function.** Add `evaluateComplianceChecklist(input: GenerationInput): ComplianceChecklistResult` in `src/lib/records.ts` (or a co-located module) returning, per requirement item: satisfied/missing status, severity, label, and why. This replaces the ad hoc `missingInformation` strings for Colorado users but does not change `missingInformation` behavior for other states.
4. **Wizard integration — no new top-level step.** Surface the checklist inside the existing wizard:
   - At the **Context** step, any requirement item that maps to an existing context question (e.g., quorum confirmation, meeting format) should be asked explicitly there if not already covered, rather than guessed from free text.
   - At the **Recommendation/Draft** step, render a "Colorado compliance checklist" panel alongside the existing Facts used / Assumptions / Missing information / Risk flags panel, grouped into **Required** and **Recommended**, each item showing a satisfied/missing indicator and its `why` text.
5. **Blocking vs. non-blocking.** Missing **required** items must not silently disappear into the draft — they should be visibly flagged (e.g., a warning banner: "2 legally required items are missing") but must not hard-block saving/generating the draft (consistent with the app's existing "professional review recommended" pattern rather than a hard gate).
6. **Draft content stays truthful.** The generator must continue to never fabricate facts (e.g., inventing a quorum statement) — the checklist calls out what's missing; it does not silently fill it in with invented content. This preserves existing behavior in `buildDraft` (e.g., the explicit "[Confirm whether attendance requirements were satisfied...]" placeholder pattern).
7. **Content sourcing.** The actual Colorado requirement items (text, legal basis, required vs. recommended classification) must be sourced from actual Colorado statute (Colorado Revised Uniform Limited Liability Company Act) and applicable IRS recordkeeping guidance — not generated/invented by AI. This PRD does not itself certify specific statute citations; populating accurate legal content is a distinct content task (see Open Questions) that should be reviewed by counsel before shipping to production, consistent with the app's existing "not a law firm" disclaimer (`src/lib/product.ts`).
8. **Persistence.** Store the computed checklist result (or at minimum, which required items were missing at generation time) alongside the saved record, so it's visible later from the record detail view, not just during generation.
9. **Non-Colorado messaging.** For non-Colorado businesses, no false claim of compliance checking should appear; optionally show a neutral note that state-specific compliance checklists are currently only available for Colorado.

## 5. Non-Goals (Out of Scope)

- No AI/LLM-based extraction of facts from free text in this feature. Detection is fully deterministic, based on structured context answers and existing form fields.
- No support for states other than Colorado in this iteration.
- No legally binding compliance certification, e-signature, or filing integration — this is informational guidance only.
- Not replacing or removing the existing generator wizard steps or its current generic `missingInformation`/risk-flag logic for non-Colorado businesses.
- Not building an admin UI for editing the checklist content; it is maintained as code/data in the repo for this iteration.

## 6. Design Considerations (Optional)

- Reuse existing UI primitives already in the generator (`Card`, `Badge`, `Checkbox` from `src/components/ui`) for the new checklist panel to stay visually consistent.
- Use the existing `AlertTriangle` / `CheckCircle2` icon pattern already imported in `records/new/page.tsx` to distinguish required-missing (warning) vs satisfied (check) items.
- Group by severity (Required first, then Recommended) rather than by document section, so the most important gaps are seen first.

## 7. Technical Considerations (Optional)

- Keep the checklist evaluation pure/deterministic and colocated near `records.ts` so it's unit-testable independent of UI.
- `ContextAnswers` will likely need 1-2 new explicit fields (e.g., `quorumConfirmed`, `meetingFormat`) to back required-item checks accurately, rather than inferring them from the free-text `description`.
- Keep the checklist data structure state-keyed (`Record<StateName, ComplianceChecklist>`) even though only Colorado is populated now, so adding a second state later doesn't require restructuring.
- Saved-record persistence likely needs a new column/JSON field on the record (see `supabase/migrations`) to store checklist results at time of generation.

## 8. Success Metrics

- 100% of Colorado-entity drafts generated through the wizard show the compliance checklist panel before save.
- Reduction in records saved with unresolved "required" items missing, tracked via the existing `track()` analytics helper (e.g., new `compliance_checklist_shown` / `compliance_required_item_missing` events).
- Qualitative: legal/professional reviewer sign-off that the Colorado checklist content is accurate before it ships to production users.

## 9. Open Questions

1. Who sources/approves the actual Colorado legal-requirements content (specific statute citations, required vs. recommended classification) — product/legal counsel, or is research needed as a follow-up task before implementation starts?
2. Should missing required items ever hard-block saving a record, or is a visible-but-non-blocking warning always sufficient (current assumption: non-blocking, matching the existing `professional_review_recommended` pattern)?
3. Do manager resolutions and written consents (not just meeting minutes) need their own distinct Colorado checklists, or does a single shared checklist with record-type-specific items cover all record types adequately?
4. Should the checklist result be re-evaluated if a user edits/saves a record later, or only computed once at generation time?
