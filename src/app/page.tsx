import type { Metadata } from "next";
import { HomePage } from "./home-page";
import { PRODUCT_NAME } from "@/lib/product";

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — Colorado business records without legal drafting`,
  description:
    "Describe an important business decision in plain language and get a structured, editable company record draft you can review, sign and store. Built for Colorado owner-operated businesses.",
  openGraph: {
    title: `${PRODUCT_NAME} — Colorado-first business records`,
    description:
      "Turn meetings and decisions into organized, reviewable company records. Start free, no credit card required.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <HomePage />;
}
