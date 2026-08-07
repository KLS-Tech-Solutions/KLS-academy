import { apiRequest, isApiError } from "@/lib/api";
import type { Certificate } from "@/types";

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "not_found" };

/** GET /certificates/verify/{certificate_number} — public. */
export async function verifyCertificate(query: string): Promise<VerificationResult> {
  const number = query.trim().toUpperCase();

  try {
    const certificate = await apiRequest<Certificate>(
      `/certificates/verify/${encodeURIComponent(number)}`,
    );
    return { status: "valid", certificate };
  } catch (error) {
    // A missing certificate is a normal answer here, not a failure.
    if (isApiError(error) && error.kind === "not_found") {
      return { status: "not_found" };
    }
    throw error;
  }
}
