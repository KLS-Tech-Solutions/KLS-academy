import { SERVER_API_BASE_URL } from "@/lib/api/config";
import type { InternshipBatch, InternshipDomain } from "@/types";

/**
 * Server-side catalogue reads.
 *
 * The public pages are rendered on the server so they are indexable and work
 * without JavaScript, which means they cannot go through the browser proxy.
 * These endpoints are public by design — no session is involved.
 *
 * Every function returns an empty result rather than throwing: a marketing
 * page with no domains listed is far better than a 500 error page.
 *
 * ---
 *
 * **Why these calls are time-boxed.**
 *
 * `/` and `/internships` are statically generated, so Next calls these during
 * `next build`. The API is a free-tier Render instance that sleeps after ~15
 * minutes idle and takes most of a minute to wake.
 *
 * `fetch` has no default timeout. A sleeping backend accepts the TCP
 * connection and then simply never replies, so the request hung until Next's
 * own 60-second per-page limit killed it — three retries per page, then
 * "Export encountered an error", then a failed deploy. The `catch` below never
 * fired, because a slow response is not an error.
 *
 * It passed locally and in CI for the opposite reason: with no `API_BASE_URL`
 * set, the base URL falls back to `localhost:8000`, nothing is listening, the
 * connection is refused *immediately*, the catch runs, and the page renders
 * with an empty catalogue in milliseconds. Only a real-but-asleep host
 * reproduces it.
 *
 * The fix is a bounded signal, not a change of rendering strategy: the pages
 * stay static with ISR, and a backend that is slow to wake costs the build a
 * few seconds instead of failing it.
 */

/**
 * How long to wait, in milliseconds.
 *
 * Short during the build, because nothing there is worth blocking a deploy
 * for — a warm API answers in well under a second, and a cold one will not
 * answer within any budget we would be willing to wait. Generous at runtime,
 * where an ISR regeneration *can* afford to wait out a cold start, and where
 * giving up early is what would leave the catalogue empty.
 */
function timeoutMs(): number {
  const building = process.env.NEXT_PHASE === "phase-production-build";
  return building ? 5_000 : 25_000;
}

async function publicGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(timeoutMs()),
    });
    if (!response.ok) {
      console.warn(
        `[catalogue] ${path} returned ${response.status}; using fallback`,
      );
      return fallback;
    }
    return (await response.json()) as T;
  } catch (error) {
    // Named explicitly rather than swallowed. An empty catalogue on the live
    // site is a symptom with two very different causes — the API being asleep
    // and the API being broken — and the build log is where that gets
    // distinguished. The path is logged; the base URL is not, so nothing from
    // the environment ends up in a public build log.
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? `did not respond within ${timeoutMs()}ms`
        : error instanceof Error
          ? error.name
          : "unknown error";
    console.warn(`[catalogue] ${path} ${reason}; using fallback`);
    return fallback;
  }
}

export function listDomainsOnServer() {
  return publicGet<InternshipDomain[]>("/internship-domains", []);
}

export async function getDomainOnServer(slug: string) {
  return publicGet<InternshipDomain | null>(
    `/internship-domains/${encodeURIComponent(slug)}`,
    null,
  );
}

export async function getBatchOnServer(domainId: string) {
  const batches = await publicGet<InternshipBatch[]>(
    `/internship-batches?domain_id=${encodeURIComponent(domainId)}`,
    [],
  );
  return batches[0] ?? null;
}
