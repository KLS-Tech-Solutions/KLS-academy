"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDomain, listDomains } from "@/services/internships.service";
import { verifyCertificate } from "@/services/certificates.service";
import { listNotifications } from "@/services/journey.service";

export function useDomains() {
  return useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: listDomains,
    staleTime: 10 * 60_000,
  });
}

export function useDomain(slug: string) {
  return useQuery({
    queryKey: queryKeys.domains.detail(slug),
    queryFn: () => getDomain(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60_000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: listNotifications,
  });
}

/** Public certificate lookup. Only runs once a number is supplied. */
export function useCertificateVerification(certificateNumber: string) {
  return useQuery({
    queryKey: queryKeys.certificate.verify(certificateNumber),
    queryFn: () => verifyCertificate(certificateNumber),
    enabled: Boolean(certificateNumber),
    staleTime: 60 * 60_000,
  });
}
