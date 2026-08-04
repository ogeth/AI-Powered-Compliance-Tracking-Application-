import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy";
import { PRODUCT_NAME } from "@/lib/product";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms of Service — ${PRODUCT_NAME}` },
      { name: "description", content: `The terms that apply when you use ${PRODUCT_NAME}.` },
      { property: "og:title", content: `Terms of Service — ${PRODUCT_NAME}` },
      { property: "og:description", content: "The terms that apply when you use the product." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Terms of service" updated="August 2026">
      <h2>What the product does</h2>
      <p>
        {PRODUCT_NAME} is a compliance-organization and document-preparation tool. It helps you
        describe business decisions, recommends a starting record format and prepares reviewable
        drafts.
      </p>
      <h2>What the product is not</h2>
      <p>
        {PRODUCT_NAME} is not a law firm, does not provide legal representation and does not provide
        legal or tax advice. Nothing in the product creates an attorney-client relationship.
      </p>
      <h2>Your responsibilities</h2>
      <p>
        You are responsible for the accuracy of the information you enter, for reviewing every draft
        before relying on it, and for confirming that a record is consistent with your governing
        documents and any professional advice you receive.
      </p>
      <h2>Beta software</h2>
      <p>
        The product is in beta. Features may change, and some modules shown in the product are labelled
        as coming soon and are not operational.
      </p>
      <h2>Account and termination</h2>
      <p>
        You may delete your account at any time. We may suspend accounts used for unlawful activity or
        in breach of these terms.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        The product is provided as-is. We do not guarantee that a generated document is legally valid
        or legally sufficient, and we do not guarantee compliance with any legal obligation.
      </p>
    </LegalPage>
  ),
});
