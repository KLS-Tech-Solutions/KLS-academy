"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { isApiError } from "@/lib/api/errors";

/** Shown while the journey aggregate loads. Mirrors the dashboard layout. */
export function JourneySkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <Skeleton className="h-44 w-full rounded-card" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-card" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-80 rounded-card" />
        <Skeleton className="h-80 rounded-card" />
      </div>
    </div>
  );
}

export function JourneyError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const message = isApiError(error)
    ? error.userMessage
    : "Something went wrong loading your internship.";

  return (
    <div className="mx-auto max-w-lg py-10">
      <Card className="p-8 text-center">
        <h1 className="text-xl font-semibold">We couldn&apos;t load your dashboard</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-body">{message}</p>
        <Button className="mt-6" onClick={retry}>
          <RefreshCw />
          Try again
        </Button>
      </Card>
    </div>
  );
}
