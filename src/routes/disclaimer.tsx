import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";
import { DISCLAIMER_LONG, PRODUCT_NAME } from "@/lib/product";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: `Disclaimer — ${PRODUCT_NAME}` },
      {
        name: "description",
        content: `What ${PRODUCT_NAME} does and does not do, and when professional review is recommended.`,
      },
      { property: "og:title", content: `Disclaimer — ${PRODUCT_NAME}` },
      { property: "og:description", content: "Scope, limitations and professional review guidance." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Disclaimer" updated="August 2026">
      <p>{DISCLAIMER_LONG}</p>
      <h2>Drafts, not filings</h2>
      <p>
        Documents created here are internal company records. They are labelled “Draft for review” until
        you review and complete them, and they are not government filings or official documents.
      </p>
      <h2>Recommendations are a starting point</h2>
      <p>
        The recommended record type is a suggested starting format based on the information you
        provide, not a legal determination. You can choose a different format at any time.
      </p>
      <h2>When professional review is recommended</h2>
      <p>
        Higher-risk matters — adding or removing a member, changing ownership percentages, amending an
        operating agreement, issuing membership interests, major borrowing, selling substantial assets,
        dissolution, mergers, large owner distributions, related-party transactions and tax elections —
        are flagged in the product so you can involve an accountant or lawyer.
      </p>
      <h2>Colorado focus</h2>
      <p>
        The initial beta is focused on Colorado LLCs and owner-operated businesses. Coverage is limited
        to selected business-record scenarios.
      </p>
    </LegalPage>
  ),
});
