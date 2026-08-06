"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/misc";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { DomainCard } from "@/components/marketing/domain-card";
import { domains, getBatchForDomain } from "@/data/domains";
import { formatDate } from "@/lib/utils";
import { useJourney } from "@/hooks/use-journey";
import { useEnroll } from "@/hooks/mutations";
import { useToast } from "@/components/ui/toast";
import { isApiError } from "@/lib/api/errors";

export default function EnrollPage() {
  const router = useRouter();
  const { journey, setStage } = useJourney();
  const { toast } = useToast();
  const enroll = useEnroll();
  const [selected, setSelected] = React.useState<string | null>(null);

  const domain = domains.find((d) => d.id === selected) ?? null;
  const batch = domain ? getBatchForDomain(domain.id) : null;

  if (journey.enrollment && journey.domain) {
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
            Enrolled on {formatDate(journey.enrollment.enrolled_at)}. A student can hold
            one active internship at a time — finish this one to enrol in another.
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
        title="Choose your internship domain"
        description="Pick the track you want to work in. Your offer letter is generated immediately after you confirm."
      />

      <Alert variant="info">
        You can hold one active internship at a time. Choose carefully — switching later
        means starting the task sequence again.
      </Alert>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((d) => (
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
              disabled={enroll.isPending}
              onClick={async () => {
                if (!domain || !batch) return;
                try {
                  await enroll.mutateAsync({ domainId: domain.id, batchId: batch.id });
                  toast({
                    title: "You're enrolled",
                    description: "Your offer letter is ready to download.",
                    variant: "success",
                  });
                  setStage("offer_letter_generated");
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
              <dd className="font-medium text-ink">Free — ₹50 for the certificate</dd>
            </div>
          </dl>
        )}
      </Dialog>
    </div>
  );
}
