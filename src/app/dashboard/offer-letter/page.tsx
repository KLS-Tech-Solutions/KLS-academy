"use client";

import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { DownloadButton } from "@/components/dashboard/download-button";
import { Logo } from "@/components/shared/Logo";
import { MsmeBadge } from "@/components/shared/msme-badge";
import { useJourney } from "@/hooks/use-journey";

export default function OfferLetterPage() {
  const { journey } = useJourney();
  const { offerLetter, domain, batch, user } = journey;

  if (!offerLetter || !domain) {
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title="No offer letter yet"
          description="Your offer letter is generated automatically the moment you enrol in an internship domain."
          unlockHint="Unlocks after enrolment"
          action={{ label: "Choose a domain", href: "/dashboard/enroll" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <DashboardHeader
        title="Offer letter"
        description="Download your offer letter, then share it on LinkedIn to unlock your technical tasks."
        action={
          <DownloadButton
            path="/me/offer-letter/download"
            fallbackFilename="KLS-Offer-Letter.pdf"
          >
            Download PDF
          </DownloadButton>
        }
      />

      <Alert variant="warning" icon={<Share2 />} title="Task 1 is waiting">
        Post this offer letter on LinkedIn and submit the post URL for verification.
        Technical tasks stay locked until a reviewer approves it.
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Document preview */}
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-brand-gradient" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <Logo variant="lockup" className="h-11 w-auto" />
              <Badge variant="brand">Offer letter</Badge>
            </div>

            <p className="mt-8 font-mono text-[13px] text-muted">
              Ref: {offerLetter.offer_letter_number}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              Date: {formatDate(offerLetter.generated_at)}
            </p>

            <p className="mt-8 text-[15px] text-ink">Dear {user.full_name},</p>

            <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-body">
              <p>
                We are pleased to offer you a position as a{" "}
                <span className="font-semibold text-ink">Virtual Intern</span> in{" "}
                <span className="font-semibold text-ink">{domain.title}</span> with KLS
                Academy, the learning division of KLS Tech Solutions, an MSME
                registered organisation.
              </p>
              <p>
                This internship runs for {domain.duration} and is conducted entirely
                remotely{batch ? `, as part of ${batch.batch_name}` : ""}. You will
                complete {domain.task_count} structured technical tasks, each reviewed by
                a KLS engineer before approval.
              </p>
              <p>
                On successful completion of all assigned tasks, you will receive a
                QR-verified certificate of completion that can be independently verified
                by any employer.
              </p>
              <p>We look forward to seeing what you build.</p>
            </div>

            <div className="mt-10 flex items-end justify-between gap-6 border-t border-line pt-6">
              <div>
                <p className="text-[15px] font-semibold text-ink">KLS Tech Solutions</p>
                <p className="text-[13px] text-muted">Bengaluru, India</p>
                <p className="mt-1 text-[13px] text-muted">MSME registered</p>
              </div>
              <MsmeBadge align="right" caption={false} className="w-16 shrink-0" />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-5 flex flex-col gap-4 text-[15px]">
              {[
                { label: "Offer letter number", value: offerLetter.offer_letter_number, mono: true },
                { label: "Domain", value: domain.title },
                { label: "Duration", value: domain.duration },
                { label: "Generated on", value: formatDate(offerLetter.generated_at) },
                {
                  label: "LinkedIn verification",
                  value: offerLetter.linkedin_verified ? "Verified" : "Pending",
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <dt className="text-[13px] text-muted">{row.label}</dt>
                  <dd className={cn("font-medium text-ink", row.mono && "font-mono text-sm")}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <DownloadButton
              path="/me/offer-letter/download"
              fallbackFilename="KLS-Offer-Letter.pdf"
              variant="secondary"
              full
              className="mt-6"
            >
              Download a copy
            </DownloadButton>
          </Card>

          <Card className="bg-canvas p-6">
            <h2 className="text-[15px] font-semibold">Next step</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Share this letter on LinkedIn, tag KLS Tech Solutions, then submit the post
              URL for verification.
            </p>
            <Link
              href="/dashboard/linkedin"
              className={cn(buttonVariants({ full: true }), "group mt-5")}
            >
              Go to Task 1
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
