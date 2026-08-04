import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCT_NAME } from "@/lib/product";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
          {children}
        </div>
        <p className="mt-10 text-sm">
          <Link to="/" className="font-medium text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${PRODUCT_NAME}` },
      {
        name: "description",
        content: `How ${PRODUCT_NAME} collects, stores and protects the business information you enter.`,
      },
      { property: "og:title", content: `Privacy Policy — ${PRODUCT_NAME}` },
      { property: "og:description", content: "Our data handling and security approach." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy and security" updated="August 2026">
      <p>
        This page is maintained by the {PRODUCT_NAME} team to answer common privacy and security
        questions about the product. It describes current practices and is not an independent
        certification or audit.
      </p>
      <h2>Information we collect</h2>
      <p>
        We collect the account details you provide (name and email), the business-profile details you
        enter, the descriptions and answers you submit to the record generator, the records you
        generate or edit, and any files you upload.
      </p>
      <h2>How your information is used</h2>
      <p>
        Your information is used to recommend a record format, prepare drafts, and keep your records
        organized in your workspace. Document content is never sent to product analytics.
      </p>
      <h2>Access and storage</h2>
      <p>
        Records and uploaded files are stored in your authenticated workspace. Database access rules
        scope every query to your own account, and uploaded files are stored privately with no public
        URLs.
      </p>
      <h2>Retention and deletion</h2>
      <p>
        You can delete individual records and documents at any time, and you can request deletion of
        your account from Settings. Deleting your account removes your workspace data.
      </p>
      <h2>Compliance claims</h2>
      <p>
        We do not claim SOC 2, ISO 27001 or HIPAA compliance, and we make no certification claims. We
        describe only the controls that are actually implemented in the product.
      </p>
      <h2>Contact</h2>
      <p>For privacy questions or security reports, contact hello@example.com.</p>
    </LegalPage>
  );
}
