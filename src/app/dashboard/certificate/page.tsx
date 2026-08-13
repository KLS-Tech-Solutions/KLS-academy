"use client";

import { Award, ExternalLink, QrCode, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/misc";
import { LockedState } from "@/components/shared/primitives";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { DownloadButton } from "@/components/dashboard/download-button";
import { CertificatePreview } from "@/components/marketing/certificate-preview";
import { useJourney } from "@/hooks/use-journey";
import { hasReached } from "@/types";

export default function CertificatePage() {
  const { journey, stage } = useJourney();
  const { certificate } = journey;

  if (!certificate) {
    const paid = hasReached(stage, "paid");
    return (
      <div className="mx-auto max-w-4xl">
        <LockedState
          title={paid ? "Your certificate is being issued" : "Certificate is locked"}
          description={
            paid
              ? "Payment is confirmed. Your certificate is being generated and will appear here in a moment."
              : "Your certificate is generated once every task is approved and the issuance fee is paid."
          }
          unlockHint={paid ? "Generating now" : "Unlocks after payment"}
          action={{ label: paid ? "Back to dashboard" : "Go to payment", href: paid ? "/dashboard" : "/dashboard/payment" }}
        />
      </div>
    );
  }

  const verifyUrl = `https://academy.klstechsolutions.in/verify/${certificate.certificate_number}`;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <DashboardHeader
        title="Your certificate"
        description="Issued and verifiable. Download it, or share the verification link with anyone who asks."
        action={
          <DownloadButton
            path="/me/certificate/download"
            fallbackFilename="KLS-Certificate.pdf"
          >
            Download PDF
          </DownloadButton>
        }
      />

      <Alert variant="success" icon={<Award />} title="Internship complete">
        Congratulations — every task was approved and your certificate has been issued.
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <CertificatePreview
          name={certificate.student_name}
          domain={certificate.domain_title}
          certificateNumber={certificate.certificate_number}
          issuedOn={formatDate(certificate.issued_at)}
        />

        <div className="flex flex-col gap-5">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Certificate details</h2>
            <dl className="mt-5 flex flex-col gap-4 text-[15px]">
              {[
                { label: "Certificate number", value: certificate.certificate_number, mono: true },
                { label: "Domain", value: certificate.domain_title },
                { label: "Duration", value: certificate.duration },
                { label: "Batch", value: certificate.batch_name },
                { label: "Issued on", value: formatDate(certificate.issued_at) },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <dt className="text-[13px] text-muted">{row.label}</dt>
                  <dd
                    className={
                      row.mono ? "font-mono text-sm font-medium text-ink" : "font-medium text-ink"
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-muted">
                <QrCode className="size-8" />
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold">Verification link</h2>
                <p className="mt-1 break-all text-sm text-body">{verifyUrl}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" size="sm" full>
                <ExternalLink />
                Open link
              </Button>
              <Button variant="secondary" size="sm" full>
                <Share2 />
                Share on LinkedIn
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
