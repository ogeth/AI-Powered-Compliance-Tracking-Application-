# Colorado Record Keeper

Paste this entire prompt into Lovable:

Act as a senior SaaS product designer, conversion strategist, UX writer and full-stack engineer.

Build a polished, responsive, production-quality MVP for a Colorado-first small-business compliance platform.

Do not ask me follow-up questions. Make sensible product and design decisions where details are unspecified.

Use [PRODUCT NAME] as the temporary product name throughout the application so it can easily be replaced later.

==================================================

1. PRODUCT VISION
   \==================================================

[PRODUCT NAME] helps busy freelancers, consultants, creative professionals and owner-operated small businesses organize their compliance responsibilities and business records without needing to interpret complicated government websites.

Long-term product promise:

“Know what applies. Know what is due. Keep proof that it was done.”

Initial geographic focus:

Colorado, United States.

Initial customer profile:

- Freelancers
- Independent consultants
- Product designers
- Creative professionals
- Solo service businesses
- Small agencies
- Single-member Colorado LLC owners
- Very small owner-operated businesses

Primary customer pain:

Business owners are highly capable at performing their professional work, but they often do not know:

- Which compliance obligations apply to them
- What is required versus merely recommended
- When filings or payments are due
- How to document important business decisions
- Which internal company record is appropriate
- Where to preserve evidence that something was completed

They are busy, uncertain and afraid of discovering too late that they missed something important.

The initial working MVP should solve one narrow, immediate problem exceptionally well:

Allow a business owner to describe an actual meeting or important business decision in ordinary language, recommend an appropriate business record, generate an editable draft, and save that draft in a secure records library.

The first working feature is:

AI Business Record Generator

It supports:

- Meeting minutes
- Sole-member written consent
- Member written consent
- Manager resolution
- General business decision record

Do not frame every business decision as meeting minutes.

Do not imply that Colorado LLCs are universally required to hold monthly meetings or prepare monthly meeting minutes.

Long-term modules should be visible inside the product as clearly labelled previews:

- Personalized Compliance Map
- Smart Compliance Calendar
- Colorado Periodic Report tracking
- Estimated-tax planning
- Registered-agent information review
- Business-change alerts
- Expanded Evidence Vault
- Accountant and lawyer collaboration

================================================== 2. LEGAL AND TRUST CONSTRAINTS
==================================================

The product is a compliance-organization and document-preparation tool.

It is not a law firm.

It does not provide legal representation.

It must not promise that users are fully compliant.

It must not guarantee that a generated document is legally valid or legally sufficient.

Never use these claims:

- Legally certified
- Guaranteed compliant
- Attorney approved, unless a real attorney-review process is later implemented
- Ready to file, for internal business records
- Guaranteed legal protection
- Avoid lawsuits
- Protect your LLC automatically
- Government approved
- Official Colorado partner

Every generated document must display:

“Draft for review”

Also display this contextual notice:

“This draft was generated from the information you provided. Review it for accuracy and confirm that it is consistent with your operating agreement and professional advice.”

For potentially high-risk decisions, display:

“Professional review recommended.”

Examples of higher-risk matters include:

- Adding or removing a member
- Changing ownership percentages
- Amending an operating agreement
- Issuing membership interests
- Major borrowing
- Selling substantial business assets
- Dissolution
- Mergers
- Large owner distributions
- Related-party transactions
- Tax elections

Never use fake:

- Testimonials
- User counts
- Customer logos
- Government endorsements
- Countdown timers
- Scarcity
- Ratings
- Reviews
- Filing statistics
- Legal-risk claims

Use “Built for Colorado freelancers and owner-operated businesses,” not “Used by thousands of Colorado businesses.”

================================================== 3. CONVERSION STRATEGY
==================================================

The public website should be highly conversion-focused but ethical.

Primary conversion goal:

Get a visitor to create an account and generate their first business record.

Primary CTA throughout the homepage:

“Create your first business record”

Secondary CTA:

“See how it works”

Supporting microcopy:

“Start free. No credit card required.”

Use the following conversion principles:

1. Immediate value

Show visitors exactly what they can create.

2. Specificity

Use a concrete example of a business decision and the resulting recommended record.

3. Progressive commitment

Homepage → signup → minimal business profile → generator → draft → saved record.

4. Loss avoidance without fearmongering

Use language such as:

“Important business decisions are easy to forget and difficult to reconstruct later.”

Do not say:

“You may lose your LLC protection unless you generate minutes today.”

5. Authority through transparency

Explain why a record type is recommended.

Show the facts and assumptions used.

6. Honest future value

Display future compliance modules as “Coming soon” or “Preview.”

Do not imply that unfinished functionality is already operational.

7. Low friction

The user should be able to reach the generator quickly after signup.

================================================== 4. TECHNICAL STACK
==================================================

Use the standard Lovable stack:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Supabase for authentication and persistence where available

Use reusable components and a clean application architecture.

Do not expose API secrets in client-side code.

Create a provider-agnostic AI generation service interface so a real AI API can be connected later.

If a live AI service is unavailable, implement realistic deterministic draft generation based on the user’s form answers.

If Supabase is not configured, use a clearly isolated mock-data service with local persistence so it can be replaced later.

Use proper routing and protected authenticated routes.

================================================== 5. ROUTES
==================================================

Public routes:

/
/login
/signup
/forgot-password
/privacy
/terms
/disclaimer

Authenticated routes:

/app
/app/onboarding
/app/records
/app/records/new
/app/records/:id
/app/compliance
/app/calendar
/app/documents
/app/business-profile
/app/settings

Redirect unauthenticated users who access /app routes to /login.

After signup:

1. Send the user to onboarding.
2. Ask only the minimum business-profile questions.
3. Send the user directly to /app/records/new.
4. Preserve the visitor’s original CTA intent.

================================================== 6. VISUAL DIRECTION
==================================================

Create a modern, trustworthy B2B SaaS design.

The visual identity should feel:

- Intelligent
- Calm
- Clear
- Secure
- Approachable
- Professional
- Modern
- Credible to accountants and lawyers
- Easy for non-expert business owners

Avoid:

- Gavels
- Courthouses
- Scales of justice
- Generic legal stock photography
- Aggressive red warning screens
- Dense government-portal aesthetics
- Excessive gradients
- Overly playful illustrations

Use:

- White and very light-gray page backgrounds
- Deep navy or charcoal text
- Restrained green as the primary action and success accent
- Amber for “needs attention”
- Red only for genuinely overdue or destructive states
- Soft shadows
- Medium-radius cards
- Spacious layouts
- Strong typography
- Subtle borders
- High readability

Suggested typography:

- Modern sans-serif
- Clear visual hierarchy
- Large, confident homepage headline
- Comfortable line height
- Minimum 16px body text where practical

Ensure:

- Responsive desktop, tablet and mobile layouts
- Accessible contrast
- Keyboard navigation
- Visible focus states
- Accessible labels
- Appropriate aria attributes
- Reduced-motion compatibility
- Clear validation and error messages

================================================== 7. PUBLIC HOMEPAGE
==================================================

Build a complete marketing homepage using the following structure and copy.

---

7.1 STICKY HEADER
--------------------------------------------------

Left:

[PRODUCT NAME] wordmark

Primary navigation:

- Product
- How It Works
- For Small Businesses
- Security
- Resources

Right:

- Log in
- Primary button: Create your first record

The header should become slightly more compact after scrolling.

On mobile, use an accessible navigation drawer.

---

7.2 HERO SECTION
--------------------------------------------------

Eyebrow:

“Colorado-first business records and compliance”

Headline:

“Document important business decisions without learning legal drafting.”

Supporting copy:

“Describe what happened in ordinary language. [PRODUCT NAME] recommends an appropriate company record, organizes the details and creates a structured draft for your review.”

Primary CTA:

“Create your first business record”

Secondary CTA:

“See how it works”

Microcopy:

“Start free. No credit card required.”

Trust indicators:

- Built for owner-operated businesses
- Structured, reviewable drafts
- Secure business-record storage
- Clear limitations and assumptions

Create a polished hero product preview on the right.

The preview should show:

Business:

Northstar Design LLC

Input:

“I decided to open a new business bank account and authorized myself to manage it on behalf of the company.”

Recommended record:

“Sole-Member Written Consent”

Status:

“Draft for review”

Show part of a realistic document containing:

- Company name
- Date
- Background
- Authorization
- Signature block

Include a visible action:

“Review draft”

Do not show a fake compliance score.

---

7.3 TRUST STRIP
--------------------------------------------------

Below the hero, show four simple trust statements:

- Designed for busy business owners
- Clear record recommendations
- Editable before saving
- Private workspace

Do not use fictional media logos or customer logos.

---

7.4 PROBLEM SECTION
--------------------------------------------------

Heading:

“Important decisions should not disappear into emails, notebooks or memory.”

Supporting copy:

“Small-business owners make consequential decisions every week, but those decisions are often never organized into a clear company record.”

Create three cards.

Card 1:

Title:
“What should I document?”

Copy:
“Understand when a meaningful business decision may deserve a written company record.”

Card 2:

Title:
“What type of record fits?”

Copy:
“Distinguish between meeting minutes, written consents, resolutions and general decision records.”

Card 3:

Title:
“How do I prepare it?”

Copy:
“Answer straightforward questions and receive an organized draft that you can review, edit, sign and store.”

---

7.5 INTERACTIVE BEFORE-AND-AFTER DEMONSTRATION
--------------------------------------------------

Heading:

“Go from an ordinary note to an organized business record.”

Use a two-column interactive visual.

Left side:

Label:
“What the owner says”

Textarea-style card:

“This month I opened a new business bank account for Northstar Design LLC. I approved the account and authorized myself to manage deposits, payments and online banking.”

Right side:

Label:
“What [PRODUCT NAME] prepares”

Recommended document:

“Sole-Member Written Consent”

Show:

- Company name
- Decision date
- Background
- Resolution
- Authority granted
- Effective date
- Signature block
- Draft for review badge

CTA beneath the demonstration:

“Create a record from my notes”

---

7.6 HOW IT WORKS
--------------------------------------------------

Heading:

“Create a clear business record in three steps.”

Step 1:

Title:
“Describe what happened”

Copy:
“Write or speak naturally. You do not need to know formal legal terminology.”

Step 2:

Title:
“Confirm the business context”

Copy:
“Review the company structure, participants, decision date and approval details.”

Step 3:

Title:
“Review and save the draft”

Copy:
“Edit the generated record, export it, and store the completed version in your workspace.”

Use a visual connecting line on desktop and stacked steps on mobile.

---

7.7 RECORD-TYPE INTELLIGENCE
--------------------------------------------------

Heading:

“Not every business decision should become meeting minutes.”

Supporting copy:

“The appropriate format depends on whether a meeting occurred, who approved the decision and how the company is managed.”

Create five record-type cards:

1. Meeting Minutes

Description:
“For documenting an actual meeting, participants, discussion and decisions.”

2. Sole-Member Written Consent

Description:
“For recording a decision approved by the only member of an LLC without holding a formal meeting.”

3. Member Written Consent

Description:
“For decisions approved in writing by multiple LLC members.”

4. Manager Resolution

Description:
“For decisions made by an authorized manager in a manager-managed LLC.”

5. Business Decision Record

Description:
“For maintaining a clear internal record when a more formal document type is not appropriate or cannot yet be determined.”

Include:

“[PRODUCT NAME] recommends a starting format based on the information you provide. You remain responsible for reviewing the result.”

---

7.8 PRODUCT CAPABILITIES
--------------------------------------------------

Heading:

“One workspace for business records today—and broader compliance clarity tomorrow.”

Create four product cards.

Card 1:

Title:
“AI Business Record Generator”

Description:
“Turn descriptions of meetings and important decisions into structured, editable drafts.”

Badge:
“Available in beta”

Card 2:

Title:
“Business Records Library”

Description:
“Organize drafts, signed records and supporting documents in one searchable workspace.”

Badge:
“Available in beta”

Card 3:

Title:
“Personalized Compliance Map”

Description:
“See which supported obligations may apply based on the business structure, activities and location.”

Badge:
“Coming soon”

Card 4:

Title:
“Smart Compliance Calendar”

Description:
“Organize preparation dates, recurring obligations and important deadlines.”

Badge:
“Coming soon”

---

7.9 LONG-TERM PLATFORM PREVIEW
--------------------------------------------------

Heading:

“Your future compliance workspace.”

Supporting copy:

“The initial beta focuses on business records. Additional Colorado-first compliance capabilities will be introduced progressively.”

Show a dashboard-style preview with disabled or preview modules:

- Colorado Periodic Report tracking
- Federal estimated-tax readiness
- Colorado estimated-tax readiness
- Registered-agent information review
- Business-address change alerts
- Evidence Vault
- Accountant collaboration
- Professional-review requests

Every unavailable item must visibly say:

“Coming soon”

Do not make these cards clickable unless they open a modal explaining that the feature is in development.

The modal CTA may say:

“Notify me when available”

---

7.10 TRUST AND TRANSPARENCY
--------------------------------------------------

Heading:

“Built for clarity, not false certainty.”

Create four principles.

1. Reviewable recommendations

“See which record type was recommended and why.”

2. Visible assumptions

“Review the business facts and assumptions used to generate each draft.”

3. Clear document status

“Generated content is labelled as a draft until you review and complete it.”

4. Professional escalation

“Higher-risk matters are flagged when accountant or lawyer review may be appropriate.”

Display a restrained disclaimer panel:

“[PRODUCT NAME] provides business-record organization and document-preparation tools. It is not a law firm and does not provide legal representation. Generated documents should be reviewed for accuracy and consistency with your governing documents and professional advice.”

---

7.11 TARGET AUDIENCE
--------------------------------------------------

Heading:

“Designed for busy owner-operated businesses.”

Create audience cards for:

- Freelancers
- Independent consultants
- Product and creative professionals
- Small agencies
- Solo service businesses
- Single-member LLC owners

Supporting copy:

“Start with one business record and build a more organized company history over time.”

---

7.12 FAQ
--------------------------------------------------

Create an accessible accordion.

Question:

“Does every Colorado LLC need monthly meeting minutes?”

Answer:

“No. The appropriate records depend on the company, its operating agreement, management structure and the decisions being made. [PRODUCT NAME] does not assume that every LLC must hold or document monthly meetings.”

Question:

“Does [PRODUCT NAME] provide legal advice?”

Answer:

“No. [PRODUCT NAME] helps organize information and prepare reviewable drafts. It does not provide legal representation or replace advice from a qualified professional.”

Question:

“What can I create during the beta?”

Answer:

“The beta supports meeting minutes, written consents, manager resolutions and general business decision records.”

Question:

“Can I edit the generated document?”

Answer:

“Yes. Review and edit the content before saving, printing or exporting it.”

Question:

“Will the product track other compliance requirements?”

Answer:

“Personalized obligations, Colorado Periodic Report tracking, calendar reminders and other compliance capabilities are planned for future releases.”

Question:

“Is my information private?”

Answer:

“Your records are stored in your authenticated workspace. The product should clearly explain its security and data-handling practices in the Privacy and Security pages.”

---

7.13 FINAL CTA
--------------------------------------------------

Heading:

“Create a clearer record of your next important business decision.”

Supporting copy:

“Describe what happened, review the recommended format and save an organized draft in your business workspace.”

Primary CTA:

“Create your first business record”

Microcopy:

“Free during beta. No credit card required.”

---

7.14 FOOTER
--------------------------------------------------

Column 1: Product

- Business Record Generator
- Records Library
- Compliance Map
- Compliance Calendar

Column 2: Company

- About
- Contact
- Security

Column 3: Resources

- Colorado LLC recordkeeping guide
- Business-record glossary
- Frequently asked questions

Column 4: Legal

- Privacy
- Terms
- Disclaimer

Footer notice:

“Initial coverage is limited to selected business-record scenarios. Unsupported or higher-risk matters may require professional review.”

================================================== 8. AUTHENTICATION
==================================================

Create polished signup, login and forgot-password pages.

Signup fields:

- First name
- Last name
- Email
- Password
- Confirm password
- Terms acceptance checkbox

Include:

- Show or hide password
- Password requirements
- Clear validation
- Loading states
- Error states
- Success states
- Google sign-in button when OAuth is configured
- Link to log in
- Link to Terms and Privacy

Login fields:

- Email
- Password
- Remember me
- Forgot password
- Log in button
- Google sign-in when configured
- Link to create account

Use secure authentication practices.

Do not store raw passwords.

================================================== 9. MINIMAL BUSINESS ONBOARDING
==================================================

Create a short, multi-step onboarding flow.

Progress indicator:

“Step 1 of 3”

Step 1: Business identity

Fields:

- Legal business name
- Optional trading name
- State of formation
- Entity type

Entity type options:

- LLC
- Corporation
- Sole proprietorship
- Other

For the initial beta, clearly state:

“The current document recommendations are optimized for LLCs.”

Step 2: Ownership and management

Fields:

- Single-member or multi-member
- Member-managed or manager-managed
- User’s role
- Number of members, when applicable

User-role options:

- Sole member
- Member
- Manager
- Officer
- Authorized representative
- Other

Step 3: Governing documents

Fields:

- Do you have an operating agreement?
  - Yes
  - No
  - Unsure

- Optional operating-agreement upload placeholder
- Optional business address
- Optional formation date

Final CTA:

“Create my first record”

Allow the user to edit all information later.

Store onboarding completion state.

================================================== 10. AUTHENTICATED APPLICATION SHELL
==================================================

Create a desktop sidebar and responsive mobile navigation.

Sidebar:

- Overview
- Create Record
- Business Records
- Documents
- Compliance Map
- Calendar
- Business Profile
- Settings

Show status badges:

Create Record:
“Beta”

Compliance Map:
“Coming soon”

Calendar:
“Coming soon”

Top bar:

- Business switcher
- Global search
- Notifications
- Help
- User avatar menu

Avatar menu:

- Profile
- Settings
- Log out

================================================== 11. DASHBOARD
==================================================

Dashboard greeting:

“Good morning, [First name].”

Subheading:

“Here is the latest activity for [Business name].”

Primary action:

“Create business record”

Create dashboard cards.

Card 1: Business records

Show:

- Total records
- Drafts
- Awaiting signature
- Completed

Card 2: Recent activity

Examples:

- Business profile created
- Draft generated
- Record edited
- Signed copy uploaded

Card 3: Business profile

Show:

- Entity type
- State
- Ownership
- Management structure
- Operating-agreement status

CTA:

“Review profile”

Card 4: Compliance workspace

Show a preview of:

- Compliance Map
- Calendar
- Deadline reminders

Display:

“Coming soon”

Create a beta notice:

“Your current workspace includes business-profile management and business-record generation. Personalized compliance requirements and deadline monitoring will be introduced progressively.”

Do not display fake live compliance data as though it has been verified.

Any demonstration content must be labelled:

“Sample data”

================================================== 12. AI BUSINESS RECORD GENERATOR
==================================================

Create a polished multi-step generator.

Show a horizontal stepper on desktop and compact step indicator on mobile.

Steps:

1. Describe
2. Context
3. Recommendation
4. Draft
5. Save

---

12.1 STEP 1: DESCRIBE
--------------------------------------------------

Heading:

“What happened?”

Supporting copy:

“Describe the meeting or business decision in your own words.”

Create tabs:

- Write
- Speak

The Speak tab may be a functional browser voice-input implementation where supported or a clearly labelled placeholder.

Large textarea placeholder:

“Example: On August 4, I decided to open a new business bank account for the company and authorized myself to manage deposits, payments and online banking.”

Additional fields:

- Decision or meeting date
- Effective date
- Did an actual meeting take place?
  - Yes
  - No
  - Unsure

- Who participated?
- Who approved the decision?
- Optional notes
- Optional supporting-document upload

Primary CTA:

“Continue”

Secondary action:

“Save and exit”

Validation:

- Require a meaningful description
- Require decision date
- Display helpful validation rather than generic errors

---

12.2 STEP 2: BUSINESS CONTEXT
--------------------------------------------------

Heading:

“Confirm the business context”

Show the stored business profile:

- Legal business name
- State of formation
- Entity type
- Single-member or multi-member
- Member-managed or manager-managed
- User’s role
- Operating-agreement status

Allow inline editing.

Ask contextual follow-up questions based on the description.

Examples:

- Was the decision approved unanimously?
- Was this decision made by the member or a manager?
- Does the decision involve another member?
- Does it change ownership?
- Does it involve borrowing?
- Does it amend the operating agreement?
- Does it involve a large distribution?
- Is the transaction with a related party?

Use conditional fields.

If a high-risk matter is detected, show:

“Professional review recommended”

Do not prevent the user from continuing, but explain why review may be appropriate.

---

12.3 STEP 3: RECORD RECOMMENDATION
--------------------------------------------------

Heading:

“Recommended business record”

Recommend one of:

- Meeting Minutes
- Sole-Member Written Consent
- Member Written Consent
- Manager Resolution
- Business Decision Record

Recommendation rules:

Meeting Minutes:

Recommend only when the user confirms that an actual meeting occurred.

Sole-Member Written Consent:

Recommend when:

- The entity is an LLC
- There is one member
- No actual meeting occurred
- The member approved the decision

Member Written Consent:

Recommend when:

- The LLC has multiple members
- No meeting occurred
- Members approved the decision in writing

Manager Resolution:

Recommend when:

- The LLC is manager-managed
- An authorized manager made or approved the decision

Business Decision Record:

Recommend when:

- A more specific formal record cannot safely be determined
- The user is documenting an operational decision
- Information is incomplete
- The user chooses a general internal record

Show:

- Recommended record type
- Plain-language reason
- Facts used
- Assumptions made
- Missing information
- Risk flags
- Professional-review recommendation

Allow:

- Accept recommendation
- Choose another record type
- Go back and edit answers

Include:

“This is a suggested starting format, not a legal determination.”

Primary CTA:

“Generate draft”

---

12.4 STEP 4: DRAFT EDITOR
--------------------------------------------------

Create a polished document-editor interface.

Desktop layout:

- Main editable document canvas
- Right-side review panel

Mobile layout:

- Document canvas
- Collapsible review panel

The document should include:

- Document title
- Legal company name
- State and entity type
- Date
- Participants or approving parties
- Background or recitals
- Decision or resolutions
- Authority granted
- Effective date
- Signature blocks
- Optional exhibits

Show a persistent badge:

“Draft for review”

Right-side review panel sections:

1. Document status
2. Facts used
3. Assumptions
4. Missing information
5. Risk flags
6. Template version
7. Professional-review recommendation

Actions:

- Edit document
- Regenerate selected section
- Undo
- Redo
- Save draft
- Print
- Export PDF
- Duplicate
- Mark as awaiting signature
- Upload signed copy

When regenerating a section, ask the user to confirm before overwriting manual edits.

Do not claim to generate an official EIN letter or government-issued document.

Do not use “ready to file” for internal records.

---

12.5 SAMPLE DRAFT STRUCTURE
--------------------------------------------------

For a sole-member written consent, generate a structure similar to:

SOLE-MEMBER WRITTEN CONSENT
OF
[LEGAL BUSINESS NAME]

The undersigned, being the sole member of [LEGAL BUSINESS NAME], a [STATE] limited liability company, adopts the following written consent as of [DATE].

BACKGROUND

[Plain-language description of the relevant context.]

RESOLUTION

The sole member approves [decision].

AUTHORIZATION

[Authorized person] is authorized to take actions reasonably necessary to carry out this decision.

EFFECTIVE DATE

This consent is effective as of [DATE].

SOLE MEMBER

Name:
Signature:
Date:

Footer:

“Draft generated from information provided by the user.”

For meeting minutes, include:

- Meeting date
- Location or meeting format
- Attendees
- Quorum or attendance statement, without inventing facts
- Agenda
- Discussion summary
- Decisions
- Resolutions
- Adjournment
- Signature or approval section

Never invent:

- Attendees
- Votes
- Quorum
- Discussion
- Approvals
- Dates
- Signatures

Missing facts must be flagged.

---

12.6 STEP 5: SAVE
--------------------------------------------------

After saving, show a success screen.

Heading:

“Your business record has been saved.”

Show:

- Document name
- Record type
- Business
- Created date
- Status
- Related event
- Last edited date

Actions:

- Open record
- Export PDF
- Upload signed copy
- Create another record
- Return to dashboard

================================================== 13. BUSINESS RECORDS LIBRARY
==================================================

Create a searchable records library.

Header:

“Business Records”

Primary CTA:

“Create new record”

Support:

- Search by title or content
- Filter by record type
- Filter by status
- Sort by date
- Grid view
- Table view

Statuses:

- Draft
- Awaiting review
- Professional review recommended
- Awaiting signature
- Completed
- Archived

Each record card or row should show:

- Document title
- Record type
- Business name
- Created date
- Last edited date
- Status
- Related event

Actions:

- Open
- Rename
- Duplicate
- Export PDF
- Print
- Upload signed copy
- Archive
- Delete

Require confirmation before deletion.

Create useful empty states.

Example:

“No records yet. Document your first important business decision.”

CTA:

“Create business record”

================================================== 14. DOCUMENTS AREA
==================================================

Create a basic Documents area for:

- Signed business records
- Supporting documents
- Operating agreements
- Formation documents
- Receipts
- Other company files

This can be a limited beta feature.

Support:

- Upload
- Rename
- Categorize
- Link to a business record
- Download
- Delete
- Basic metadata

Show:

- File name
- File type
- Category
- Upload date
- Linked record
- Uploaded by

================================================== 15. COMING-SOON COMPLIANCE MAP
==================================================

Create a polished but disabled preview page.

Heading:

“Personalized Compliance Map”

Copy:

“Understand which supported obligations may apply to your business and why.”

Show preview cards for:

- Colorado Periodic Report
- Federal estimated-tax readiness
- Colorado estimated-tax readiness
- Registered-agent information review
- Principal-office information review
- Business-change follow-up actions

Each card should show example classifications:

- Required
- Conditional
- Recommended
- More information needed

Add a prominent label:

“Coming soon”

Add:

“Join the beta notification list”

Do not present sample results as actual determinations for the logged-in business.

================================================== 16. COMING-SOON CALENDAR
==================================================

Create a polished preview page.

Heading:

“Smart Compliance Calendar”

Copy:

“Organize preparation dates, official deadlines and recurring compliance actions.”

Show example calendar items clearly labelled as sample data:

- Colorado Periodic Report
- Estimated-tax readiness review
- Business-profile review
- Document follow-up

Include:

- Month view
- Upcoming list
- Urgency labels
- Preparation date
- Due date
- Completion state

Prominent label:

“Coming soon”

================================================== 17. BUSINESS PROFILE
==================================================

Allow users to edit:

- Legal business name
- Trading name
- State of formation
- Entity type
- Formation date
- Number of members
- Management structure
- User role
- Operating-agreement status
- Business address
- Registered-agent information placeholder
- Tax-classification placeholder

Profile changes should create an activity log entry.

Show:

“Changes to your business structure may affect future compliance recommendations.”

================================================== 18. SETTINGS
==================================================

Create settings sections:

- Personal profile
- Business preferences
- Notifications
- Security
- Data and privacy
- Delete account

Notification toggles:

- Product updates
- Record reminders
- Coming-soon module announcements
- Security alerts

Security section:

- Change password
- Active sessions placeholder
- Two-factor authentication placeholder

Account deletion must require confirmation.

================================================== 19. DATA MODEL
==================================================

Create the following logical data models.

User

- id
- first_name
- last_name
- email
- created_at
- updated_at

BusinessProfile

- id
- user_id
- legal_name
- trading_name
- state_of_formation
- entity_type
- formation_date
- ownership_type
- member_count
- management_structure
- user_role
- operating_agreement_status
- business_address
- onboarding_completed
- created_at
- updated_at

BusinessRecord

- id
- business_id
- user_id
- title
- record_type
- status
- event_description
- event_date
- effective_date
- participants
- approvers
- generated_content
- assumptions
- missing_information
- risk_flags
- professional_review_recommended
- template_version
- created_at
- updated_at
- completed_at

SupportingDocument

- id
- business_id
- record_id
- file_name
- file_type
- category
- storage_path
- created_at

ActivityEvent

- id
- user_id
- business_id
- record_id
- event_type
- description
- created_at

NotificationPreference

- id
- user_id
- product_updates
- record_reminders
- roadmap_updates
- security_alerts

================================================== 20. AI GENERATION LOGIC
==================================================

Create a clean AI service abstraction.

Input should include:

- Business profile
- Event description
- Event date
- Effective date
- Whether an actual meeting occurred
- Participants
- Approvers
- Management structure
- Ownership type
- User role
- Operating-agreement status
- Contextual answers
- Selected or recommended record type

Output should include:

- Recommended record type
- Recommendation reason
- Facts used
- Assumptions
- Missing information
- Risk flags
- Professional-review recommendation
- Structured document sections

The generation service must:

- Never invent missing legal facts
- Clearly flag uncertainty
- Preserve manual edits
- Return structured JSON
- Validate output before rendering
- Fail gracefully
- Never expose secret API keys

Use a deterministic mock generator if an AI backend is not configured.

================================================== 21. PDF EXPORT
==================================================

Implement PDF export where technically practical.

PDF output should:

- Use professional margins
- Include the document title
- Include company information
- Preserve headings
- Include signature blocks
- Include page numbers
- Include “Draft for review” when not completed
- Include a small footer noting that the draft was generated from user-provided information

Do not include application navigation or dashboard UI in the PDF.

================================================== 22. ANALYTICS EVENTS
==================================================

Create event hooks for:

- homepage_primary_cta_clicked
- homepage_secondary_cta_clicked
- sample_demo_viewed
- signup_started
- signup_completed
- login_completed
- onboarding_started
- onboarding_completed
- generator_started
- description_submitted
- recommendation_viewed
- recommendation_changed
- draft_generated
- draft_edited
- draft_saved
- pdf_exported
- record_marked_awaiting_signature
- signed_copy_uploaded
- coming_soon_interest_submitted

Do not send sensitive document content to analytics.

================================================== 23. APPLICATION STATES
==================================================

Design:

- Loading states
- Empty states
- Success states
- Validation states
- Error states
- Offline or network-failure states
- Permission-denied states
- Missing-profile states
- AI-generation failure states
- File-upload failure states

Example AI error:

“We could not generate the draft. Your answers have been preserved. Please try again.”

Example empty-record state:

“You have not created any business records yet.”

CTA:

“Create your first record”

================================================== 24. SECURITY AND PRIVACY
==================================================

Treat business records as sensitive information.

Implement or prepare for:

- Authenticated access
- User-scoped database queries
- Supabase Row Level Security
- Secure file storage
- No public document URLs
- Session management
- Safe file-type validation
- File-size limits
- User-controlled deletion
- No document content in analytics
- No client-side API secrets

Add a Security page describing the product’s security approach without making unsupported certifications.

Do not claim SOC 2, ISO 27001, HIPAA compliance or encryption certifications unless they are actually implemented and verified.

================================================== 25. ACCEPTANCE CRITERIA
==================================================

The MVP is complete when:

1. A visitor can understand the product from the homepage.

2. The homepage has one dominant CTA:
   “Create your first business record.”

3. A new user can sign up and log in.

4. The user completes minimal business onboarding.

5. The user is redirected to the record generator.

6. The user can describe a meeting or business decision.

7. The system can distinguish between an actual meeting and a non-meeting decision.

8. The system recommends an appropriate record type.

9. The recommendation includes a reason, facts, assumptions and missing information.

10. The user can generate and edit a structured draft.

11. Every generated document is labelled:
    “Draft for review.”

12. The user can save the draft.

13. Saved records appear in the Business Records library.

14. The user can reopen and edit a saved record.

15. The user can print or export a record.

16. The user can upload a signed copy.

17. The dashboard displays real user activity and record counts.

18. The Compliance Map and Calendar appear as clearly disabled “Coming soon” modules.

19. The application does not use fake testimonials, customer counts, endorsements or urgency.

20. The application does not guarantee legal compliance.

21. The application is fully responsive.

22. Forms are accessible and keyboard navigable.

23. Data access is scoped to the authenticated user.

24. Loading, error and empty states are implemented.

25. The code is modular and prepared for future expansion.

================================================== 26. FINAL BUILD PRIORITY
==================================================

Prioritize implementation in this order:

1. Public homepage
2. Signup and login
3. Business onboarding
4. Authenticated application shell
5. AI Business Record Generator
6. Draft editor
7. Save and retrieve records
8. Records library
9. PDF export
10. Signed-copy upload
11. Dashboard
12. Coming-soon Compliance Map
13. Coming-soon Calendar
14. Settings and profile
15. Final responsive and accessibility review

Build the product as a credible first version of a much larger small-business compliance platform, while remaining honest about what is functional today.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://decision-document.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d53bb780-cd36-42b4-a36f-75bb404ad84c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
