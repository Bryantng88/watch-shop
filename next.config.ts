import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development compiler isolated from `next build`. Both commands
  // otherwise write to `.next`, so building a deployment artifact while the
  // dev server is running can remove its CSS chunks and leave an unstyled page.
  distDir:
    process.env.NEXT_DIST_DIR ??
    (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  reactStrictMode: false,
  output: "standalone",
  eslint: {
    // Lint is a separate CI/deployment gate; generated Prisma/Zod code is not
    // allowed to block creation of the production artifact.
    ignoreDuringBuilds: true,
  },
  async headers() {
    const publicSecurityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      {
        key: "Content-Security-Policy",
        value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; worker-src 'self'; manifest-src 'self'",
      },
    ];
    return [
      { source: "/", headers: publicSecurityHeaders },
      { source: "/products/:path*", headers: publicSecurityHeaders },
      { source: "/request", headers: publicSecurityHeaders },
      { source: "/offline", headers: publicSecurityHeaders },
      { source: "/api/public/:path*", headers: [...publicSecurityHeaders, { key: "Cache-Control", value: "no-store" }] },
      { source: "/api/integrations/zalo/:path*", headers: [...publicSecurityHeaders, { key: "Cache-Control", value: "no-store" }] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/" }] },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: "public, max-age=3600" }] },
    ];
  },
};

export default nextConfig;
