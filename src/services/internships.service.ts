import { apiRequest } from "@/lib/api/client";
import type { InternshipBatch, InternshipDomain } from "@/types";

/** GET /internship-domains */
export function listDomains() {
  return apiRequest<InternshipDomain[]>("/internship-domains");
}

/** GET /internship-domains/{slug} */
export function getDomain(slug: string) {
  return apiRequest<InternshipDomain>(`/internship-domains/${slug}`);
}

/** GET /internship-batches */
export function listBatches(domainId?: string) {
  return apiRequest<InternshipBatch[]>("/internship-batches", {
    query: { domain_id: domainId },
  });
}
