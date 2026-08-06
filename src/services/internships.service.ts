import { apiRequest, withMock } from "@/lib/api";
import { batches, domains, getBatchForDomain, getDomainBySlug } from "@/data/domains";
import type { InternshipBatch, InternshipDomain } from "@/types";

/** GET /internship-domains */
export function listDomains() {
  return withMock<InternshipDomain[]>(
    () => domains.filter((d) => d.status === "active"),
    () => apiRequest("/internship-domains", { query: { status: "active" } }),
    200,
  );
}

/** GET /internship-domains/{slug} */
export function getDomain(slug: string) {
  return withMock<InternshipDomain | null>(
    () => getDomainBySlug(slug),
    () => apiRequest(`/internship-domains/${slug}`),
    200,
  );
}

/** GET /internship-batches */
export function listBatches() {
  return withMock<InternshipBatch[]>(
    () => batches,
    () => apiRequest("/internship-batches"),
    150,
  );
}

/** GET /internship-batches?domain_id= */
export function getBatch(domainId: string) {
  return withMock<InternshipBatch | null>(
    () => getBatchForDomain(domainId),
    () => apiRequest("/internship-batches", { query: { domain_id: domainId } }),
    150,
  );
}
