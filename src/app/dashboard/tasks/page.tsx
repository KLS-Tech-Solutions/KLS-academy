"use client";

import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { useJourney } from "@/hooks/use-journey";
import { hasReached } from "@/types";

export default function TasksPage() {
  const { journey, stage } = useJourney();
  const { tasks, submissions } = journey;

  if (!hasReached(stage, "linkedin_approved")) {
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="Technical tasks are locked"
          description="Your LinkedIn post has to be verified by a reviewer before technical tasks open up. This is Task 1."
          unlockHint="Unlocks after LinkedIn verification"
          action={{ label: "Go to Task 1", href: "/dashboard/linkedin" }}
        />
      </div>
    );
  }

  const technical = tasks.filter((t) => t.order_number > 0);
  const approved = submissions.filter((s) => s.status === "approved").length;
  const progress = technical.length ? (approved / technical.length) * 100 : 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <DashboardHeader
        title="Technical tasks"
        description="Work through these in order. Each one needs a GitHub repository, at least three screenshots and a written explanation."
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-medium text-ink">
            {approved} of {technical.length} tasks approved
          </p>
          <p className="text-[13px] text-muted">
            All tasks must be approved before payment unlocks
          </p>
        </div>
        <Progress value={progress} showLabel className="mt-4" />
      </Card>

      <ul className="flex flex-col gap-4">
        {technical.map((task, i) => {
          const submission = submissions.find((s) => s.task_id === task.id);
          const previousApproved =
            i === 0 ||
            submissions.find((s) => s.task_id === technical[i - 1].id)?.status === "approved";
          const locked = !previousApproved;

          const content = (
            <Card
              interactive={!locked}
              className={cn("p-6", locked && "opacity-70")}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-sm font-semibold text-body">
                    {locked ? <Lock className="size-4" /> : task.order_number}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                    <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-body">
                      {task.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Due {formatDate(task.deadline)}
                      </span>
                      <span>~{task.estimated_hours} hours</span>
                      <span>{task.requirements.length} requirements</span>
                    </div>
                  </div>
                </div>

                <SubmissionStatusBadge status={submission?.status ?? "not_started"} />
              </div>
            </Card>
          );

          return (
            <li key={task.id}>
              {locked ? (
                content
              ) : (
                <Link href={`/dashboard/tasks/${task.id}`} className="block">
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
