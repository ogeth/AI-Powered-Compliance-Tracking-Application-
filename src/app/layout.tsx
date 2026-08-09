import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "[PRODUCT NAME] — Colorado business records and compliance",
    // Per-page `title` values already carry the product name, so nested titles
    // are used verbatim.
    template: "%s",
  },
  description:
    "Organize important business decisions into structured, reviewable company records. Built for Colorado freelancers and owner-operated businesses.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "[PRODUCT NAME] — Colorado business records",
    description:
      "Describe a business decision in plain language and get an organized, editable company record draft.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
