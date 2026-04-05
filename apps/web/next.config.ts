import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // When SSR/API routes are needed, remove 'output: export' and add @opennextjs/cloudflare
};

export default nextConfig;
