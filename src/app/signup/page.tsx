import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "./signup-form";
import { AuthShell } from "@/components/auth/AuthShell";
import { PRODUCT_NAME } from "@/lib/product";

export const metadata: Metadata = {
  title: `Create your account — ${PRODUCT_NAME}`,
  description: `Create a free ${PRODUCT_NAME} account and generate your first business record draft.`,
  openGraph: {
    title: `Create your account — ${PRODUCT_NAME}`,
    description: "Start free. No credit card required. Generate your first business record.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <AuthShell
          title="Create your first business record"
          subtitle="Start free. No credit card required."
        >
          <div className="h-96" />
        </AuthShell>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
