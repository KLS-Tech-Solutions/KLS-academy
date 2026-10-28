"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getMyJourney } from "@/services/journey.service";
import type { StudentJourney } from "@/types";

interface JourneyContextValue {
  journey: StudentJourney;
  stage: StudentJourney["stage"];
  refresh: () => void;
}

const JourneyContext = React.createContext<JourneyContextValue | null>(null);

/**
 * Loads the student's journey once and shares it with every dashboard screen.
 *
 * The provider owns the loading and error states so individual screens can
 * assume `journey` exists. Everything comes from the API — there is no
 * preview or demo mode.
 */
export function JourneyProvider({
  children,
  fallback,
  errorFallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: (error: unknown, retry: () => void) => React.ReactNode;
}) {
  const query = useQuery({
    queryKey: queryKeys.journey.all,
    queryFn: getMyJourney,
  });

  const value = React.useMemo<JourneyContextValue | null>(
    () =>
      query.data
        ? {
            journey: query.data,
            stage: query.data.stage,
            refresh: () => query.refetch(),
          }
        : null,
    [query],
  );

  if (query.isPending) return <>{fallback ?? null}</>;
  if (query.isError || !value) {
    return <>{errorFallback?.(query.error, () => query.refetch()) ?? null}</>;
  }

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const context = React.useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used inside <JourneyProvider>");
  }
  return context;
}
