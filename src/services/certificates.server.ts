import { SERVER_API_BASE_URL } from "@/lib/api/config";
import type { Certificate } from "@/types";
import type { VerificationResult } from "./certificates.service";

/**
 * Server-side certificate lookup.
 *
 * The verification page renders on the server so a shared link is indexable and
 * works without JavaScript. It calls FastAPI directly — this endpoint is public
 * by design and no session is involved.
 */
export async function verifyCertificateOnServer(
  query: string,
): Promise<VerificationResult> {
  const number = query.trim().toUpperCase();

  try {
    const response = await fetch(
      `${SERVER_API_BASE_URL}/certificates/verify/${encodeURIComponent(number)}`,
      { cache: "no-store" },
    );

    if (!response.ok) return { status: "not_found" };
    return { status: "valid", certificate: (await response.json()) as Certificate };
  } catch {
    return { status: "not_found" };
  }
}
