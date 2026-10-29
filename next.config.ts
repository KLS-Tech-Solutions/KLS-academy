import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Standalone output — everywhere except Vercel.
   *
   * `output: "standalone"` traces the modules actually used and emits a
   * self-contained server, which is what `docs/DEPLOYMENT.md` runs under
   * systemd when the frontends are self-hosted. That path still matters as the
   * fallback, so this is gated rather than deleted.
   *
   * On Vercel it must be off. Next 16.3.x has a bug where Vercel's build
   * adapter suppresses `.next/next-server.js.nft.json` while the standalone
   * writer still expects it, so the build dies in `onBuildComplete` with:
   *
   *     ENOENT: no such file or directory,
   *     open '/vercel/path0/.next/next-server.js.nft.json'
   *
   * Upstream: vercel/next.js#96646. Reported fixed somewhere in 16.3.5–16.3.6,
   * but gating on the environment is deterministic and does not require
   * tracking which patch release landed it.
   *
   * Vercel sets `VERCEL=1` on every build. Vercel then produces its own
   * optimised output, so nothing is lost by leaving this undefined there.
   */
  output: process.env.VERCEL ? undefined : "standalone",

  images: {
    remotePatterns: [
      // Documents are served through authenticated API routes, not from a
      // bucket — these remain only for any legacy absolute URLs still stored.
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.klstechsolutions.in" },
    ],
  },
};

export default nextConfig;
