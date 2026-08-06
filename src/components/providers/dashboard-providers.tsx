"use client";

import { JourneyProvider } from "@/hooks/use-journey";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RequireSession } from "@/components/providers/require-session";
import {
  JourneyError,
  JourneySkeleton,
} from "@/components/dashboard/journey-boundary";

/**
 * Client boundary for the dashboard. The loading and error fallbacks are
 * functions, which cannot cross a server → client boundary, so the whole
 * composition lives here and `layout.tsx` stays a thin server component.
 */
export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession>
      <JourneyProvider
        fallback={
          <DashboardShell chromeOnly>
            <JourneySkeleton />
          </DashboardShell>
        }
        errorFallback={(error, retry) => (
          <DashboardShell chromeOnly>
            <JourneyError error={error} retry={retry} />
          </DashboardShell>
        )}
      >
        <DashboardShell>{children}</DashboardShell>
      </JourneyProvider>
    </RequireSession>
  );
}
