import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/product";

const COLUMNS: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Business Record Generator", href: "/#product" },
      { label: "Records Library", href: "/#product" },
      { label: "Compliance Map", href: "/#platform" },
      { label: "Compliance Calendar", href: "/#platform" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#trust" },
      { label: "Contact", href: "mailto:hello@example.com" },
      { label: "Security", href: "/#trust" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Colorado LLC recordkeeping guide", href: "/#record-types" },
      { label: "Business-record glossary", href: "/#record-types" },
      { label: "Frequently asked questions", href: "/#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Disclaimer", to: "/disclaimer" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="text-base font-semibold">{PRODUCT_NAME}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Built for Colorado freelancers and owner-operated businesses.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold text-foreground">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        href={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Initial coverage is limited to selected business-record scenarios. Unsupported or
            higher-risk matters may require professional review.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {PRODUCT_NAME}. Not a law firm. No legal representation is
            provided.
          </p>
        </div>
      </div>
    </footer>
  );
}
