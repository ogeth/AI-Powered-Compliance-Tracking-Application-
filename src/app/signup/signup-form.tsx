"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { track } from "@/lib/product";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
];

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onboardingHref = `/app/onboarding?intent=${encodeURIComponent(intent ?? "record")}`;
  const loginHref = intent ? `/login?intent=${encodeURIComponent(intent)}` : "/login";

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    track("signup_started");

    if (!values.first_name.trim() || !values.last_name.trim()) {
      setError("Enter your first and last name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!RULES.every((r) => r.test(values.password))) {
      setError("Your password does not meet the requirements below.");
      return;
    }
    if (values.password !== values.confirm) {
      setError("The two passwords do not match.");
      return;
    }
    if (!accepted) {
      setError("You need to accept the Terms and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/onboarding`,
        data: { first_name: values.first_name.trim(), last_name: values.last_name.trim() },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "An account with that email already exists. Try logging in instead."
          : signUpError.message,
      );
      return;
    }

    track("signup_completed");
    router.push(onboardingHref);
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in is not available right now. Use email and password instead.");
      return;
    }
    if (result.redirected) return;
    track("signup_completed", { method: "google" });
    router.push(onboardingHref);
  }

  return (
    <AuthShell
      title="Create your first business record"
      subtitle="Start free. No credit card required."
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              autoComplete="given-name"
              value={values.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              autoComplete="family-name"
              value={values.last_name}
              onChange={(e) => set("last_name", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => set("password", e.target.value)}
              aria-describedby="password-rules"
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
          <ul id="password-rules" className="mt-2 space-y-1">
            {RULES.map((rule) => {
              const ok = rule.test(values.password);
              return (
                <li
                  key={rule.label}
                  className={`flex items-center gap-2 text-xs ${ok ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            required
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
            aria-label="Accept terms and privacy policy"
            className="mt-0.5"
          />
          <span>
            I accept the{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create account
        </Button>

        <div className="relative py-1 text-center">
          <span className="relative z-10 bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
            or
          </span>
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <Button type="button" variant="outline" size="lg" className="w-full" onClick={onGoogle}>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
