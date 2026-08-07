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
 */

async function publicGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
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
