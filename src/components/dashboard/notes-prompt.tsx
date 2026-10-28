"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { queryKeys } from "@/lib/query-keys";
import { getMyChapters } from "@/services/journey.service";

/**
 * The nudge to read the study notes before starting the technical tasks.
 *
 * **Deliberately not a gate.** Nothing is locked behind the notes — a student
 * who learned the material elsewhere can start immediately. Blocking them
 * would only produce support requests from people who cannot see why they are
 * stuck, and the notes exist to make the internship feel prepared rather than
 * to police anyone.
 *
 * Renders nothing when there are no chapters, so a domain whose material is
 * still being written does not show an empty promise.
 */
export function NotesPrompt() {
  const chapters = useQuery({
    queryKey: queryKeys.chapters,
    queryFn: getMyChapters,
  });

  const list = chapters.data ?? [];
  if (list.length === 0) return null;

  const read = list.filter((c) => c.is_read).length;
  const allRead = read === list.length;

  return (
    <Card
      className={cn(
        "p-5 sm:p-6",
        allRead ? "border-success/25 bg-success-bg/30" : "border-brand-100 bg-brand-50/50",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft",
            allRead ? "text-success" : "text-brand",
          )}
        >
          {allRead ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <BookOpen className="size-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold text-ink">
            {allRead
              ? "You've worked through all the notes"
              : "Before you start, go through the study notes"}
          </h2>
          <p className="mt-1 text-[15px] leading-relaxed text-body">
            {allRead
              ? `All ${list.length} chapters read. Come back to them any time while you build.`
              : `${list.length} chapters take you from the basics to what these tasks actually need. ${
                  read > 0 ? `You've read ${read} so far.` : "Reading them first makes the tasks considerably easier."
                }`}
          </p>
        </div>

        <Link
          href="/dashboard/notes"
          className={cn(
            buttonVariants({ variant: allRead ? "secondary" : "primary", size: "md" }),
            "shrink-0",
          )}
        >
          {allRead ? "Revisit notes" : "Open study notes"}
        </Link>
      </div>
    </Card>
  );
}
