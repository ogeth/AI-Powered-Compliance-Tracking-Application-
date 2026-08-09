import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Supabase session lives in localStorage, so every authenticated screen
  // renders on the client. Keeping `poweredByHeader` off is just hygiene.
  poweredByHeader: false,
};

export default nextConfig;
