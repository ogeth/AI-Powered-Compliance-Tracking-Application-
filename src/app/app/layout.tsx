import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/app/AppShell";

// Everything under /app requires an authenticated Supabase session. The old
// TanStack `_authenticated` route used `beforeLoad` + `ssr: false`; since the
// session lives in localStorage and can't be read on the server, the
// equivalent here is a client-side guard (see AuthGuard) rather than
// middleware.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
