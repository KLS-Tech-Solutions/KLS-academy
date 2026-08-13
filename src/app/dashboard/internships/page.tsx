"use client";

import Link from "next/link";
import {
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
} from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DownloadButton } from "@/components/dashboard/download-button";
import { useJourney } from "@/hooks/use-journey";
import type { InternshipHistoryEntry } from "@/types";

export default function InternshipsPage() {
  const { journey } = useJourney();
  const { history, can_enroll_again: canEnrolAgain } = journey;

  const completed = history.filter((h) => h.certificate_number).length;

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <Header count={0} completed={0} />
        <Card className="mt-6 flex flex-col items-center px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-canvas text-muted">
            <GraduationCap className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No internships yet</h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">
            Pick a domain to get started. Your offer letter is generated the
            moment you enrol.
          </p>
          <Link
            href="/dashboard/enroll"
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            Browse internships
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Header count={history.length} completed={completed} />

      {canEnrolAgain && <ReadyForTheNextOne />}

      <div className="mt-6 flex flex-col gap-4">
        {history.map((entry) => (
          <InternshipCard key={entry.enrollment_id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function Header({ count, completed }: { count: number; completed: number }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl">My internships</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-body">
        {count === 0
          ? "Everything you take at KLS Academy will be listed here."
          : `${count} internship${count === 1 ? "" : "s"}${
              completed > 0 ? `, ${completed} completed` : ""
            }. Your offer letters and certificates stay downloadable here for good.`}
      </p>
    </div>
  );
}

/**
 * Shown the moment the current internship is certificated. This is the
 * prompt to go again — the student has finished everything, and without it
 * the dashboard would just sit there looking done.
 */
function ReadyForTheNextOne() {
  return (
    <Card className="mt-6 overflow-hidden border-brand-100 bg-brand-50/60 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold text-ink">
            You&apos;ve finished — ready for another?
          </h2>
          <p className="mt-1 text-[15px] leading-relaxed text-body">
            Your certificate is issued, so you can start a new internship in a
            different domain whenever you like.
          </p>
        </div>
        <Link
          href="/dashboard/enroll"
          className={cn(buttonVariants({ size: "md" }), "shrink-0")}
        >
          <Plus />
          Start another
        </Link>
      </div>
    </Card>
  );
}

function InternshipCard({ entry }: { entry: InternshipHistoryEntry }) {
  const certificated = Boolean(entry.certificate_number);
  const progress =
    entry.tasks_total > 0
      ? Math.round((entry.tasks_approved / entry.tasks_total) * 100)
      : 0;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-semibold text-ink">
              {entry.domain_title}
            </h2>
            {entry.is_current && <Badge variant="brand">Current</Badge>}
            {certificated ? (
              <Badge variant="success">
                <CheckCircle2 />
                Completed
              </Badge>
            ) : (
              <Badge variant="warning">In progress</Badge>
            )}
          </div>
          <p className="mt-1 text-[13px] text-muted">
            {entry.batch_name}
            {entry.duration ? ` · ${entry.duration}` : ""} · Enrolled{" "}
            {formatDate(entry.enrolled_at)}
            {entry.completed_at ? ` · Completed ${formatDate(entry.completed_at)}` : ""}
          </p>
        </div>
      </div>

      {entry.tasks_total > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Tasks approved</span>
            <span className="font-semibold text-ink">
              {entry.tasks_approved} of {entry.tasks_total}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-canvas">
            <div
              className={cn(
                "h-full rounded-pill transition-all duration-500",
                certificated ? "bg-success" : "bg-brand",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap">
        {entry.offer_letter_number ? (
          <DownloadButton
            variant="secondary"
            size="sm"
            path={`/me/internships/${entry.enrollment_id}/offer-letter/download`}
            fallbackFilename={`KLS-Offer-Letter-${entry.offer_letter_number}.pdf`}
          >
            Offer letter
          </DownloadButton>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            <FileText />
            No offer letter
          </Button>
        )}

        {certificated ? (
          <DownloadButton
            size="sm"
            path={`/me/internships/${entry.enrollment_id}/certificate/download`}
            fallbackFilename={`KLS-Certificate-${entry.certificate_number}.pdf`}
          >
            Certificate
          </DownloadButton>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            <Award />
            Certificate pending
          </Button>
        )}

        {certificated && (
          <Link
            href={`/verify/${entry.certificate_number}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "sm:ml-auto",
            )}
          >
            Public verification page
          </Link>
        )}
      </div>

      {certificated && (
        <p className="mt-3 text-[13px] text-muted">
          Certificate {entry.certificate_number}
          {entry.certificate_issued_at
            ? ` · issued ${formatDate(entry.certificate_issued_at)}`
            : ""}
        </p>
      )}
    </Card>
  );
}
