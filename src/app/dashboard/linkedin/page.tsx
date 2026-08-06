"use client";

import { CheckCircle2, ExternalLink, Share2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { ReviewStatusBadge } from "@/components/shared/status";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { LinkedInSubmissionForm } from "@/components/dashboard/linkedin-form";
import { useJourney } from "@/hooks/use-journey";

const checklist = [
  "Download your offer letter as a PDF or image",
  "Post it publicly on LinkedIn — not to connections only",
  "Tag KLS Tech Solutions in the post",
  "Copy the direct URL of the post and paste it below",
];

export default function LinkedInTaskPage() {
  const { journey, setStage } = useJourney();
  const { offerLetter, linkedinSubmission } = journey;

  if (!offerLetter) {
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="Task 1 is locked"
          description="Your offer letter has to exist before you can share it. Enrol in a domain to generate it."
          unlockHint="Unlocks after your offer letter is generated"
          action={{ label: "Choose a domain", href: "/dashboard/enroll" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <DashboardHeader
        title="Task 1 — Share your offer letter"
        description="This is the onboarding task. Technical tasks unlock once a reviewer verifies your LinkedIn post."
        action={linkedinSubmission ? <ReviewStatusBadge status={linkedinSubmission.status} /> : undefined}
      />

      {linkedinSubmission?.status === "approved" && (
        <Alert variant="success" icon={<CheckCircle2 />} title="Verified">
          {linkedinSubmission.admin_comment ??
            "Your post was verified. All technical tasks are now unlocked."}
        </Alert>
      )}

      {linkedinSubmission?.status === "pending" && (
        <Alert variant="warning" title="Awaiting verification">
          A reviewer is checking your post. This usually takes less than one working day —
          you&apos;ll be notified as soon as it&apos;s done.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card className="p-6 sm:p-8">
          {linkedinSubmission ? (
            <>
              <h2 className="text-lg font-semibold">Your submission</h2>
              <dl className="mt-5 flex flex-col gap-4">
                <div>
                  <dt className="text-[13px] text-muted">LinkedIn post</dt>
                  <dd className="mt-1">
                    <a
                      href={linkedinSubmission.linkedin_post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 break-all text-[15px] font-medium text-brand hover:underline"
                    >
                      {linkedinSubmission.linkedin_post_url}
                      <ExternalLink className="size-4 shrink-0" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] text-muted">Submitted</dt>
                  <dd className="mt-1 text-[15px] font-medium text-ink">
                    {formatDateTime(linkedinSubmission.submitted_at)}
                  </dd>
                </div>
                {linkedinSubmission.admin_comment && (
                  <div>
                    <dt className="text-[13px] text-muted">Reviewer comment</dt>
                    <dd className="mt-1 rounded-field bg-canvas p-4 text-[15px] leading-relaxed text-body">
                      {linkedinSubmission.admin_comment}
                    </dd>
                  </div>
                )}
              </dl>

              {linkedinSubmission.status === "rejected" && (
                <Button className="mt-6" onClick={() => setStage("offer_letter_generated")}>
                  Resubmit post URL
                </Button>
              )}
            </>
          ) : (
            <LinkedInSubmissionForm onSubmitted={() => setStage("linkedin_submitted")} />
          )}
        </Card>

        <Card className="p-6">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
            <Share2 className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">What we check</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {checklist.map((item, i) => (
              <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-body">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
