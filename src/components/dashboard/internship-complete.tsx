"use client";

import Link from "next/link";
import { Award, PartyPopper, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DownloadButton } from "@/components/dashboard/download-button";
import { useJourney } from "@/hooks/use-journey";

/**
 * Replaces the "next action" card once an internship is certificated.
 *
 * At that point there is no next step in the journey, so a card telling the
 * student what to do next has nothing to say. This says the thing that
 * actually matters — you finished — and offers the two things they might want:
 * the certificate, and another internship.
 */
export function InternshipComplete() {
  const { journey } = useJourney();
  const { certificate, domain, history } = journey;

  const completed = history.filter((h) => h.certificate_number).length;

  return (
    <Card className="relative overflow-hidden border-brand-100 p-6 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand-50 opacity-70 blur-3xl"
      />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            <PartyPopper className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-ink">
              Congratulations — you&apos;ve completed{" "}
              {domain ? domain.title : "your internship"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              Every task was reviewed and approved, and your certificate is
              issued. It stays downloadable from{" "}
              <Link
                href="/dashboard/internships"
                className="font-medium text-brand hover:underline"
              >
                My internships
              </Link>{" "}
              for good, and any employer can verify it independently.
              {completed > 1 && (
                <>
                  {" "}
                  That&apos;s <strong className="text-ink">{completed}</strong>{" "}
                  completed at KLS Academy.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {certificate && (
            <DownloadButton
              path="/me/certificate/download"
              fallbackFilename={`KLS-Certificate-${certificate.certificate_number}.pdf`}
            >
              Download certificate
            </DownloadButton>
          )}

          <Link
            href="/dashboard/enroll"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Plus />
            Start another internship
          </Link>

          <Link
            href="/dashboard/internships"
            className={cn(buttonVariants({ variant: "ghost" }), "sm:ml-auto")}
          >
            <Award />
            My internships
          </Link>
        </div>
      </div>
    </Card>
  );
}
