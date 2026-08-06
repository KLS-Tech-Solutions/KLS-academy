import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Cloudflare R2 bucket — screenshots, offer letters, certificates.
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.klstechsolutions.in" },
    ],
  },
};

export default nextConfig;
