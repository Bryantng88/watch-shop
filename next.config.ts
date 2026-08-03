import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: "standalone",
  eslint: {
    // Lint is a separate CI/deployment gate; generated Prisma/Zod code is not
    // allowed to block creation of the production artifact.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
