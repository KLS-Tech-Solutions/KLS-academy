import type { Metadata } from "next";
import { QrCode, ScanLine, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container, PageHero, SectionHeader } from "@/components/shared/primitives";
import { VerifyForm } from "@/components/marketing/verify-form";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Verify a Certificate",
  description:
    "Check any KLS Academy certificate instantly. Enter the certificate number to confirm the holder, the domain and the issue date.",
  path: "/verify",
});


export default function VerifyPage() {
  return (
    <>
      <PageHero
        eyebrow="Certificate verification"
        title="Verify a KLS Academy certificate"
        description="Enter the certificate number printed on the document, or scan its QR code. No account needed."
      >
        <VerifyForm />
      </PageHero>

      <Container size="md" className="py-16 sm:py-20">
        <SectionHeader
          title="How verification works"
          description="Every certificate is issued with a unique number and a QR code that resolves to this portal."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: QrCode,
              title: "Scan or type",
              body: "Scan the QR code on the certificate, or enter the certificate number by hand.",
            },
            {
              icon: ScanLine,
              title: "We look it up",
              body: "The number is checked against the issuing record held by KLS Academy.",
            },
            {
              icon: ShieldCheck,
              title: "See the result",
              body: "A valid certificate shows the student, domain and issue date. Anything else is not genuine.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{item.body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-canvas p-6 text-center">
          <p className="text-[15px] text-body">
            Try a sample:{" "}
            <span className="font-mono font-medium text-ink">KLS-CERT-7F3K9QM2XZ</span>
          </p>
        </Card>
      </Container>
    </>
  );
}
