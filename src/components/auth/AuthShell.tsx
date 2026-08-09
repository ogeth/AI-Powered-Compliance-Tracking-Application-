import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PRODUCT_NAME } from "@/lib/product";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="container-page flex h-20 items-center">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <ShieldCheck className="size-6 text-primary" aria-hidden="true" />
          {PRODUCT_NAME}
        </Link>
      </header>
      <main className="container-page flex flex-1 items-start justify-center pb-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
      </main>
    </div>
  );
}
