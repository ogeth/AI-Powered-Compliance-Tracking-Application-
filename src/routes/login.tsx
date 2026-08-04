import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PRODUCT_NAME, track } from "@/lib/product";

const searchSchema = z.object({
  intent: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Log in — ${PRODUCT_NAME}` },
      { name: "description", content: `Log in to your ${PRODUCT_NAME} business-records workspace.` },
      { property: "og:title", content: `Log in — ${PRODUCT_NAME}` },
      { property: "og:description", content: "Access your private business-records workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { intent } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const destination = intent === "record" ? "/app/records/new" : "/app";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter your email address and password.");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "That email and password combination did not match an account."
          : signInError.message,
      );
      return;
    }
    track("login_completed");
    navigate({ to: destination });
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in is not available right now. Try email and password.");
      return;
    }
    if (result.redirected) return;
    track("login_completed", { method: "google" });
    navigate({ to: destination });
  }

  return (
    <AuthShell
      title="Log in to your workspace"
      subtitle="Continue organizing your business records."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Log in
        </Button>

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
            or
          </span>
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" size="lg" onClick={onGoogle}>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" search={{ intent }} className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="container-page flex h-20 items-center">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-navy-foreground">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </span>
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
