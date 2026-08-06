"use client";

import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/misc";
import { EmptyState } from "@/components/shared/primitives";
import { SubmissionStatusBadge } from "@/components/shared/status";
import { DashboardHeader, StatCard } from "@/components/dashboard/page-header";
import { JourneyTimeline } from "@/components/dashboard/journey-timeline";
import { NextActionCard } from "@/components/dashboard/next-action";
import { useJourney } from "@/hooks/use-journey";

export default function DashboardPage() {
  const { journey, stage } = useJourney();
  const { user, domain, submissions, tasks, certificate, notifications } = journey;

  const technicalTasks = tasks.filter((t) => t.order_number > 0);
  const approved = submissions.filter((s) => s.status === "approved").length;
  const progress =
    technicalTasks.length > 0 ? (approved / technicalTasks.length) * 100 : 0;

  const firstName = user.full_name.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <DashboardHeader
        title={`Welcome back, ${firstName}`}
        description={
          domain
            ? `You're enrolled in ${domain.title}. Keep learning, keep growing.`
            : "You haven't enrolled in an internship yet. Pick a domain to get started."
        }
      />

      <NextActionCard stage={stage} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active internship"
          value={domain ? "01" : "00"}
          hint={domain ? domain.title : "None selected"}
          icon={<ClipboardList />}
        />
        <StatCard
          label="Tasks approved"
          value={`${approved}/${technicalTasks.length || 0}`}
          hint="Technical submissions"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Certificates earned"
          value={certificate ? "01" : "00"}
          hint={certificate ? certificate.certificate_number : "Not issued yet"}
          icon={<Award />}
        />
        <StatCard
          label="Overall progress"
          value={`${Math.round(progress)}%`}
          hint="Across all tasks"
          icon={<TrendingUp />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Your tasks</h2>
              {technicalTasks.length > 0 && (
                <Link
                  href="/dashboard/tasks"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  View all
                </Link>
              )}
            </div>

            {technicalTasks.length === 0 ? (
              <EmptyState
                className="mt-5"
                icon={<ClipboardList />}
                title="No tasks yet"
                description="Tasks appear here once you enrol and your LinkedIn post is verified."
                action={
                  <Link
                    href="/dashboard/enroll"
                    className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                  >
                    Choose a domain
                  </Link>
                }
              />
            ) : (
              <>
                <Progress value={progress} showLabel className="mt-5" />
                <ul className="mt-6 divide-y divide-line">
                  {technicalTasks.map((task) => {
                    const submission = submissions.find((s) => s.task_id === task.id);
                    return (
                      <li key={task.id}>
                        <Link
                          href={`/dashboard/tasks/${task.id}`}
                          className="flex items-center gap-4 py-4 transition-colors hover:bg-canvas/60"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-canvas text-sm font-semibold text-body">
                            {task.order_number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-medium text-ink">
                              {task.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
                              <Clock className="size-3.5" />
                              Due {formatDate(task.deadline)}
                            </p>
                          </div>
                          <SubmissionStatusBadge
                            status={submission?.status ?? "not_started"}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Recent notifications</h2>
            <ul className="mt-4 divide-y divide-line">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="flex gap-3 py-3.5">
                  <span
                    className={cn(
                      "mt-2 size-2 shrink-0 rounded-full",
                      n.is_read ? "bg-line" : "bg-brand",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-body">{n.message}</p>
                    <p className="mt-1 text-[13px] text-muted">{formatDate(n.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/notifications"
              className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
            >
              See all notifications
            </Link>
          </Card>
        </div>

        <Card className="p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Internship progress</h2>
          <p className="mt-1 text-sm text-body">
            Each step unlocks the next. Nothing skips ahead.
          </p>
          <div className="mt-6">
            <JourneyTimeline stage={stage} />
          </div>

          {journey.offerLetter && (
            <Link
              href="/dashboard/offer-letter"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm", full: true }),
                "mt-6",
              )}
            >
              <FileText />
              View offer letter
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
