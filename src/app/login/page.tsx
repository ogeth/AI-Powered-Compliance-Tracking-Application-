import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { AuthShell } from "@/components/auth/AuthShell";
import { PRODUCT_NAME } from "@/lib/product";

export const metadata: Metadata = {
  title: `Log in — ${PRODUCT_NAME}`,
  description: `Log in to your ${PRODUCT_NAME} business-records workspace.`,
  openGraph: {
    title: `Log in — ${PRODUCT_NAME}`,
    description: "Access your private business-records workspace.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function Page() {
  // `useSearchParams` in LoginForm needs a Suspense boundary so the shell can
  // still be prerendered.
  return (
    <Suspense
      fallback={
        <AuthShell
          title="Log in to your workspace"
          subtitle="Continue organizing your business records."
        >
          <div className="h-64" />
        </AuthShell>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
