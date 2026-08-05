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
};

export default nextConfig;
