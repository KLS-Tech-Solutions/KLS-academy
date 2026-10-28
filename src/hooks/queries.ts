"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getDomain, listBatches, listDomains } from "@/services/internships.service";

export function useDomains() {
  return useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: listDomains,
    staleTime: 5 * 60_000,
  });
}

export function useDomain(slug: string) {
  return useQuery({
    queryKey: queryKeys.domains.detail(slug),
    queryFn: () => getDomain(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
}

export function useBatches(domainId?: string) {
  return useQuery({
    queryKey: [...queryKeys.domains.all, "batches", domainId ?? "all"],
    queryFn: () => listBatches(domainId),
    staleTime: 5 * 60_000,
  });
}
