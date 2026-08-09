/**
 * Explicit env declarations.
 *
 * Two reasons this file exists:
 *  1. Next.js only inlines browser env vars written as literal
 *     `process.env.NEXT_PUBLIC_FOO` member expressions. Bracket access
 *     (`process.env["NEXT_PUBLIC_FOO"]`) is left untouched and resolves to
 *     `undefined` in the client bundle.
 *  2. `noPropertyAccessFromIndexSignature` in tsconfig forbids dot access on
 *     the index signature of `ProcessEnv`. Declaring the keys explicitly makes
 *     dot access legal again without weakening the rule everywhere else.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";

    /** Browser-visible Supabase project URL. */
    readonly NEXT_PUBLIC_SUPABASE_URL?: string;
    /** Browser-visible Supabase publishable (anon) key. */
    readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;

    /** Server-only Supabase project URL. */
    readonly SUPABASE_URL?: string;
    /** Server-only Supabase publishable (anon) key. */
    readonly SUPABASE_PUBLISHABLE_KEY?: string;
    /** Server-only Supabase service-role key. Never expose to the browser. */
    readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  }
}
