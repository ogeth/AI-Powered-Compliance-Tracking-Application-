"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side replacement for the old TanStack `_authenticated` route guard.
 *
 * The Supabase session is persisted in `localStorage`, so it is unreadable from
 * a server component or from middleware. The guard therefore runs after mount:
 * nothing under it renders until a user is confirmed, and an unauthenticated
 * visitor is redirected to /login — the same behaviour as the previous
 * `beforeLoad` + `ssr: false` route.
 *
 * If cookie-based sessions are adopted later (via `@supabase/ssr`), this can be
 * replaced by a check in `middleware.ts` or in the layout's server component.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data.user) {
          router.replace("/login");
          return;
        }
        setAuthorized(true);
      })
      .catch(() => {
        if (active) router.replace("/login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-surface"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
