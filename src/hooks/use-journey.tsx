"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { USE_MOCKS } from "@/lib/api/config";
import { getMyJourney } from "@/services/journey.service";
import { DEFAULT_STAGE } from "@/data/journey";
import type { JourneyStage, StudentJourney } from "@/types";

interface JourneyContextValue {
  journey: StudentJourney;
  stage: JourneyStage;
  /** Development only — previews a stage without touching the backend. */
  setStage: (stage: JourneyStage) => void;
  refresh: () => void;
}

const JourneyContext = React.createContext<JourneyContextValue | null>(null);

/**
 * Loads the student's journey once and shares it with every dashboard screen.
 *
 * The provider owns the loading and error states so individual screens can
 * assume `journey` exists — that is what kept Phase 1's components unchanged
 * when real fetching replaced the mock context.
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
  const queryClient = useQueryClient();
  const [previewStage, setPreviewStage] = React.useState<JourneyStage>(DEFAULT_STAGE);

  const query = useQuery({
    // In mock mode the previewed stage is part of the identity of the data.
    queryKey: USE_MOCKS
      ? [...queryKeys.journey.all, previewStage]
      : queryKeys.journey.all,
    queryFn: () => getMyJourney(previewStage),
  });

  const setStage = React.useCallback(
    (stage: JourneyStage) => {
      setPreviewStage(stage);
      queryClient.invalidateQueries({ queryKey: queryKeys.journey.all });
    },
    [queryClient],
  );

  const value = React.useMemo<JourneyContextValue | null>(
    () =>
      query.data
        ? {
            journey: query.data,
            stage: query.data.stage,
            setStage,
            refresh: () => query.refetch(),
          }
        : null,
    [query, setStage],
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
