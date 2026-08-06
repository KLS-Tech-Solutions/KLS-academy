import { apiRequest, isApiError, withMock } from "@/lib/api";
import { findCertificate } from "@/data/certificates";
import type { Certificate } from "@/types";

export type VerificationResult =
  | { status: "valid"; certificate: Certificate }
  | { status: "not_found" };

/**
 * GET /certificates/verify/{certificate_number}
 * Public — no session required.
 */
export function verifyCertificate(query: string) {
  const number = query.trim().toUpperCase();

  return withMock<VerificationResult>(
    () => {
      const certificate = findCertificate(number);
      return certificate ? { status: "valid", certificate } : { status: "not_found" };
    },
    async () => {
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
    },
    600,
  );
}

/** GET /me/certificate */
export function getMyCertificate() {
  return withMock<Certificate | null>(
    () => null,
    () => apiRequest("/me/certificate"),
  );
}
