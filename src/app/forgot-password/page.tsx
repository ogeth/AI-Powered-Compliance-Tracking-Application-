import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";
import { PRODUCT_NAME } from "@/lib/product";

export const metadata: Metadata = {
  title: `Reset your password — ${PRODUCT_NAME}`,
  description: `Request a password reset link for your ${PRODUCT_NAME} workspace.`,
  openGraph: {
    title: `Reset your password — ${PRODUCT_NAME}`,
    description: "Request a password reset link.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function Page() {
  return <ForgotPasswordForm />;
}
