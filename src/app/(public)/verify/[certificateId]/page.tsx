import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/shared/primitives";
import { VerifyForm } from "@/components/marketing/verify-form";
import { CertificatePreview } from "@/components/marketing/certificate-preview";
import { verifyCertificateOnServer } from "@/services/certificates.server";

export const metadata: Metadata = {
  title: "Verification result",
  robots: { index: false },
};

export default async function VerificationResultPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const query = decodeURIComponent(certificateId);
  const result = await verifyCertificateOnServer(query);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
      </div>

      <Container size="md" className="relative py-16 sm:py-20">
        {result.status === "valid" ? (
          <>
            <div className="text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent-50 text-accent">
                <CheckCircle2 className="size-8" />
              </span>
              <h1 className="mt-6 text-3xl sm:text-4xl">Certificate verified</h1>
              <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-body">
                This certificate was issued by KLS Academy and its record is genuine.
              </p>
            </div>

            <Card className="mt-10 p-6 sm:p-8">
              <dl className="grid gap-6 sm:grid-cols-2">
                {[
                  { label: "Student name", value: result.certificate.student_name },
                  { label: "Internship domain", value: result.certificate.domain_title },
                  { label: "Duration", value: result.certificate.duration },
                  { label: "Batch", value: result.certificate.batch_name },
                  {
                    label: "Certificate number",
                    value: result.certificate.certificate_number,
                    mono: true,
                  },
                  { label: "Issued on", value: formatDate(result.certificate.issued_at) },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-[13px] text-muted">{row.label}</dt>
                    <dd
                      className={cn(
                        "mt-1 text-[15px] font-medium text-ink",
                        row.mono && "font-mono",
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>

            <CertificatePreview
              className="mt-6"
              name={result.certificate.student_name}
              domain={result.certificate.domain_title}
              certificateNumber={result.certificate.certificate_number}
              issuedOn={formatDate(result.certificate.issued_at)}
            />
          </>
        ) : (
          <>
            <div className="text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-danger-bg text-danger">
                <XCircle className="size-8" />
              </span>
              <h1 className="mt-6 text-3xl sm:text-4xl">No certificate found</h1>
              <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-body">
                We have no record matching{" "}
                <span className="font-mono text-ink">{query}</span>. Check the number
                for typos, or ask the holder to resend the QR code.
              </p>
            </div>

            <Card className="mt-10 p-6 sm:p-8">
              <p className="mb-4 text-center text-[15px] text-body">
                Try another certificate number
              </p>
              <VerifyForm defaultValue={query} />
            </Card>
          </>
        )}

        <div className="mt-10 text-center">
          <Link href="/verify" className={cn(buttonVariants({ variant: "secondary" }))}>
            Verify another certificate
          </Link>
        </div>
      </Container>
    </section>
  );
}
