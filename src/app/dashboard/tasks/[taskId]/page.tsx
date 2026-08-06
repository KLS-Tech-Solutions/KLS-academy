"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderGit2,
  RotateCcw,
} from "lucide-react";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { TaskSubmissionForm } from "@/components/dashboard/task-submission-form";
import { useJourney } from "@/hooks/use-journey";
import { hasReached } from "@/types";

export default function TaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const { journey, stage } = useJourney();

  const task = journey.tasks.find((t) => t.id === params.taskId);
  const submission = journey.submissions.find((s) => s.task_id === params.taskId);

  const [submitted, setSubmitted] = React.useState(false);

  if (!hasReached(stage, "linkedin_approved")) {
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="Technical tasks are locked"
          description="Complete Task 1 — sharing your offer letter on LinkedIn — before technical tasks open."
          unlockHint="Unlocks after LinkedIn verification"
          action={{ label: "Go to Task 1", href: "/dashboard/linkedin" }}
        />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="Task not found"
          description="This task doesn't exist in your current internship."
          action={{ label: "Back to tasks", href: "/dashboard/tasks" }}
        />
      </div>
    );
  }

  const readOnly =
    Boolean(submission) &&
    ["submitted", "under_review", "approved"].includes(submission!.status);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          All tasks
        </Link>
      </div>

      <DashboardHeader
        title={task.title}
        description={task.description}
        action={<SubmissionStatusBadge status={submission?.status ?? "not_started"} />}
      />

      {submission?.status === "approved" && submission.review && (
        <Alert variant="success" icon={<CheckCircle2 />} title="Approved">
          {submission.review.remarks} — reviewed{" "}
          {formatDate(submission.review.reviewed_at)}.
        </Alert>
      )}

      {submission?.status === "rejected" && submission.review && (
        <Alert variant="danger" icon={<RotateCcw />} title="Changes requested">
          {submission.review.remarks}
        </Alert>
      )}

      {submitted && (
        <Alert variant="success" icon={<CheckCircle2 />} title="Submission received">
          Your work is queued for review. You&apos;ll be notified once a reviewer has
          looked at it.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Card className="p-6 sm:p-8">
          {readOnly && submission ? (
            <>
              <h2 className="text-lg font-semibold">Your submission</h2>
              <dl className="mt-5 flex flex-col gap-5">
                <div>
                  <dt className="text-[13px] text-muted">Project title</dt>
                  <dd className="mt-1 text-[15px] font-medium text-ink">
                    {submission.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Repository</dt>
                  <dd className="mt-1">
                    <a
                      href={submission.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 break-all text-[15px] font-medium text-brand hover:underline"
                    >
                      {submission.github_url}
                      <ExternalLink className="size-4 shrink-0" />
                    </a>
                  </dd>
                </div>
                {submission.live_demo_url && (
                  <div>
                    <dt className="text-[13px] text-muted">Live demo</dt>
                    <dd className="mt-1">
                      <a
                        href={submission.live_demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 break-all text-[15px] font-medium text-brand hover:underline"
                      >
                        {submission.live_demo_url}
                        <ExternalLink className="size-4 shrink-0" />
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[13px] text-muted">Explanation</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-body">
                    {submission.description}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">
                    Screenshots ({submission.screenshots.length})
                  </dt>
                  <dd className="mt-2 grid grid-cols-3 gap-3">
                    {submission.screenshots.map((shot) => (
                      <div
                        key={shot.id}
                        className="flex h-24 items-center justify-center rounded-field border border-line bg-canvas text-[13px] text-muted"
                      >
                        {shot.display_order}
                      </div>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Submitted</dt>
                  <dd className="mt-1 text-[15px] font-medium text-ink">
                    {formatDateTime(submission.submitted_at)}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <TaskSubmissionForm
              taskId={task.id}
              isResubmission={submission?.status === "rejected"}
              onSubmitted={() => setSubmitted(true)}
            />
          )}
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Requirements</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {task.requirements.map((req) => (
                <li key={req} className="flex gap-3 text-[15px] leading-relaxed text-body">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  {req}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-[15px] font-semibold">Task details</h2>
            <dl className="mt-4 flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Deadline</dt>
                <dd className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <Clock className="size-4 text-muted" />
                  {formatDate(task.deadline)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Estimated effort</dt>
                <dd className="font-medium text-ink">~{task.estimated_hours} hours</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Task number</dt>
                <dd className="font-medium text-ink">{task.order_number}</dd>
              </div>
            </dl>
          </Card>

          <Card className="bg-canvas p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-ink shadow-soft">
              <FolderGit2 className="size-4" />
            </span>
            <h2 className="mt-4 text-[15px] font-semibold">Repository checklist</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Public visibility, a README explaining setup, meaningful commit messages,
              and no secrets committed.
            </p>
          </Card>

          <Link
            href="/dashboard/tasks"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Back to all tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
