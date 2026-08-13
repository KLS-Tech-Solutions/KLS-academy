"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Alert, Skeleton } from "@/components/ui/misc";
import { EmptyState } from "@/components/shared/primitives";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { DomainCard } from "@/components/marketing/domain-card";
import { useBatches, useDomains } from "@/hooks/queries";
import { formatDate } from "@/lib/utils";
import { useJourney } from "@/hooks/use-journey";
import { useEnroll } from "@/hooks/mutations";
import { useToast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/errors";

export default function EnrollPage() {
  const router = useRouter();
  const { journey, refresh } = useJourney();
  const { toast } = useToast();
  const enroll = useEnroll();
  const [selected, setSelected] = React.useState<string | null>(null);

  const domainsQuery = useDomains();
  const domains = React.useMemo(() => domainsQuery.data ?? [], [domainsQuery.data]);

  const domain = domains.find((d) => d.id === selected) ?? null;
  const batchesQuery = useBatches(domain?.id);
  const batch = batchesQuery.data?.[0] ?? null;

  // `enrollment` is the *current* internship, which may be a completed one.
  // Only an unfinished internship blocks starting another — otherwise a
  // student who has finished would be told to finish it.
  const inProgress = Boolean(
    journey.enrollment && journey.domain && !journey.can_enroll_again,
  );

  const startingAnother = journey.history.length > 0;

  // A domain already taken is not offered again. Submissions are keyed by
  // task, so re-enrolling in the same batch would count the old approvals
  // towards the new internship — the API refuses it with a 409, and offering
  // it here would only produce that error.
  const available = React.useMemo(() => {
    const taken = new Set(
      journey.history
        .map((entry) => entry.domain_slug)
        .filter((slug): slug is string => Boolean(slug)),
    );
    return domains.filter((d) => !taken.has(d.slug));
  }, [domains, journey.history]);

  if (inProgress && journey.domain && journey.enrollment) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <DashboardHeader title="Enrolment" />
        <Card className="p-6 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
            <CheckCircle2 className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">
            You&apos;re enrolled in {journey.domain.title}
          </h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-body">
            Enrolled on {formatDate(journey.enrollment.enrolled_at)}. Finish this
            internship — every task approved and the certificate issued — and you
            can start another in a different domain.
          </p>
          <Button className="mt-6" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <DashboardHeader
        title={
          startingAnother
            ? "Choose your next internship"
            : "Choose your internship domain"
        }
        description="Pick the track you want to work in. Your offer letter is generated immediately after you confirm."
      />

      <Alert variant="info">
        {startingAnother
          ? "Your previous internships and their certificates stay in My internships — nothing is replaced. A domain you have already completed is not shown again."
          : "You hold one internship at a time. Once it's finished and your certificate is issued, you can start another in a different domain."}
      </Alert>

      {domainsQuery.isPending ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-card" />
          ))}
        </div>
      ) : domainsQuery.isError ? (
        <Card className="p-6">
          <EmptyState
            title="Couldn't load the internship domains"
            description={
              isApiError(domainsQuery.error)
                ? domainsQuery.error.userMessage
                : "Please try again in a moment."
            }
            action={
              <Button variant="secondary" onClick={() => domainsQuery.refetch()}>
                Try again
              </Button>
            }
          />
        </Card>
      ) : available.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title={
              startingAnother
                ? "You've taken every internship we offer"
                : "No internships are open yet"
            }
            description={
              startingAnother
                ? "New domains are added regularly — we'll let you know as soon as one opens."
                : "Enrolment opens as soon as the next batch is published. We'll notify you."
            }
            action={
              <Button
                variant="secondary"
                onClick={() => router.push("/dashboard/internships")}
              >
                My internships
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              className="text-left"
            >
              <DomainCard domain={d} className="h-full" />
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(domain)}
        onClose={() => setSelected(null)}
        title={domain ? `Enrol in ${domain.title}?` : ""}
        description="Confirming generates your offer letter and starts your internship timeline."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              disabled={enroll.isPending || !batch}
              onClick={async () => {
                if (!domain || !batch) return;
                try {
                  await enroll.mutateAsync({ domainId: domain.id, batchId: batch.id });
                  toast({
                    title: "You're enrolled",
                    description: "Your offer letter is ready to download.",
                    variant: "success",
                  });
                  refresh();
                  router.push("/dashboard/offer-letter");
                } catch (error) {
                  toast({
                    title: "Enrolment failed",
                    description: isApiError(error)
                      ? error.userMessage
                      : "Please try again.",
                    variant: "error",
                  });
                }
              }}
            >
              {enroll.isPending ? "Enrolling…" : "Confirm enrolment"}
            </Button>
          </>
        }
      >
        {domain && (
          <dl className="flex flex-col gap-3 rounded-field bg-canvas p-4 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Duration</dt>
              <dd className="font-medium text-ink">{domain.duration}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Tasks</dt>
              <dd className="font-medium text-ink">{domain.task_count} reviewed</dd>
            </div>
            {batch && (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Batch</dt>
                  <dd className="font-medium text-ink">{batch.batch_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Starts</dt>
                  <dd className="font-medium text-ink">{formatDate(batch.start_date)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Cost</dt>
              <dd className="font-medium text-ink">Free to enrol</dd>
            </div>
          </dl>
        )}
      </Dialog>
    </div>
  );
}
