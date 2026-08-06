import { SERVER_API_BASE_URL, USE_MOCKS } from "@/lib/api/config";
import { findCertificate } from "@/data/certificates";
import type { Certificate } from "@/types";
import type { VerificationResult } from "./certificates.service";

/**
 * Server-side certificate lookup.
 *
 * The public verification page is rendered on the server so a shared link is
 * indexable and works without JavaScript. That means it cannot go through the
 * browser proxy — it calls FastAPI directly. No session is involved; this
 * endpoint is public by design.
 */
export async function verifyCertificateOnServer(
  query: string,
): Promise<VerificationResult> {
  const number = query.trim().toUpperCase();

  if (USE_MOCKS) {
    const certificate = findCertificate(number);
    return certificate ? { status: "valid", certificate } : { status: "not_found" };
  }

  try {
    const response = await fetch(
      `${SERVER_API_BASE_URL}/certificates/verify/${encodeURIComponent(number)}`,
      { next: { revalidate: 300 } },
    );

    if (response.status === 404) return { status: "not_found" };
    if (!response.ok) return { status: "not_found" };

    return { status: "valid", certificate: (await response.json()) as Certificate };
  } catch {
    return { status: "not_found" };
  }
}
