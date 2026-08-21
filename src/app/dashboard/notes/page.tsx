"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/misc";
import { EmptyState } from "@/components/shared/primitives";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { useToast } from "@/components/ui/toast";
import { queryKeys } from "@/lib/query-keys";
import { CLIENT_API_PREFIX } from "@/lib/api/config";
import { getMyChapters, markChapterRead } from "@/services/journey.service";
import { useJourney } from "@/hooks/use-journey";
import type { LearningChapter } from "@/types";

const DIFFICULTY: Record<
  LearningChapter["difficulty"],
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  beginner: { label: "Beginner", variant: "success" },
  intermediate: { label: "Intermediate", variant: "warning" },
  advanced: { label: "Advanced", variant: "danger" },
};

export default function NotesPage() {
  const { journey } = useJourney();
  const chapters = useQuery({
    queryKey: queryKeys.chapters,
    queryFn: getMyChapters,
  });

  const list = chapters.data ?? [];
  const read = list.filter((c) => c.is_read).length;
  const totalMinutes = list.reduce((sum, c) => sum + c.estimated_minutes, 0);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <DashboardHeader
        title="Study notes"
        description={
          journey.domain
            ? `Chapter-wise material for ${journey.domain.title}, beginner to advanced. Work through these before you start the technical tasks.`
            : "Enrol in an internship to see its study material."
        }
      />

      {list.length > 0 && (
        <Card className="flex flex-wrap items-center gap-x-8 gap-y-3 p-5">
          <Stat label="Chapters" value={`${list.length}`} />
          <Stat label="Read" value={`${read} of ${list.length}`} />
          <Stat
            label="Reading time"
            value={`${Math.round(totalMinutes / 60) || 1} hr`}
          />
          <div className="min-w-[10rem] flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-canvas">
              <div
                className="h-full rounded-pill bg-brand transition-all duration-500"
                style={{
                  width: `${list.length ? (read / list.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {chapters.isPending ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-card" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<BookOpen />}
            title={
              journey.domain
                ? "No notes published yet"
                : "You're not enrolled yet"
            }
            description={
              journey.domain
                ? "Your mentors are still preparing the material for this domain. It will appear here as soon as it's ready."
                : "Pick an internship domain and its study material appears here."
            }
            action={
              journey.domain ? undefined : (
                <Link
                  href="/dashboard/enroll"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  <GraduationCap />
                  Browse internships
                </Link>
              )
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: LearningChapter }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [opening, setOpening] = React.useState(false);

  const markRead = useMutation({
    mutationFn: () => markChapterRead(chapter.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.chapters }),
  });

  /**
   * Opens the PDF in a new tab.
   *
   * Fetched as a blob rather than linked directly: the notes are served from
   * an authenticated route, so a plain anchor would arrive without the session
   * and get a 401.
   */
  const open = async () => {
    setOpening(true);
    try {
      const response = await fetch(
        `${CLIENT_API_PREFIX}/me/chapters/${chapter.id}/download`,
        { credentials: "same-origin" },
      );
      if (!response.ok) throw new Error("Those notes couldn't be opened");

      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener");
      // Revoked on a delay so the new tab has time to load it first.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);

      if (!chapter.is_read) markRead.mutate();
    } catch (error) {
      toast({
        title: "Couldn't open the notes",
        description:
          error instanceof Error ? error.message : "Try again in a moment.",
        variant: "error",
      });
    } finally {
      setOpening(false);
    }
  };

  const difficulty = DIFFICULTY[chapter.difficulty];

  return (
    <Card className={cn("p-5", chapter.is_read && "bg-canvas/50")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl text-[15px] font-semibold",
            chapter.is_read
              ? "bg-success-bg text-success"
              : "bg-brand-50 text-brand",
          )}
        >
          {chapter.is_read ? (
            <CheckCircle2 className="size-5" />
          ) : (
            chapter.order_number
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-semibold text-ink">
              {chapter.title}
            </h2>
            <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
            {chapter.is_read && <Badge variant="neutral">Read</Badge>}
          </div>

          {chapter.summary && (
            <p className="mt-1.5 text-[15px] leading-relaxed text-body">
              {chapter.summary}
            </p>
          )}

          <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-muted">
            <Clock className="size-3.5" />
            About {chapter.estimated_minutes} minutes
          </p>
        </div>

        <div className="shrink-0">
          {chapter.pdf_url ? (
            <Button variant="secondary" size="sm" onClick={open} disabled={opening}>
              {opening ? <Loader2 className="animate-spin" /> : <Download />}
              {opening ? "Opening…" : "Read"}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              Coming soon
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
