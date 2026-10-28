import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Traces the modules actually used and emits a self-contained server, so
  // the runtime image carries no node_modules and no build toolchain. It is
  // what keeps the Docker image small enough to be worth containerising.
  output: "standalone",
  images: {
    remotePatterns: [
      // Cloudflare R2 bucket — screenshots, offer letters, certificates.
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.klstechsolutions.in" },
    ],
  },
};

export default nextConfig;
