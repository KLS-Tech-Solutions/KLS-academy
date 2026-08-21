import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container, PageHero } from "@/components/shared/primitives";
import { SUPPORT_EMAIL } from "@/lib/api/config";
import { ContactForm } from "@/components/marketing/contact-form";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Get in touch with KLS Academy. Email klstechsolutions2025@gmail.com or use the form — we reply within two working days.",
  path: "/contact",
});


const details = [
  {
    icon: Mail,
    label: "Email",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  { icon: MapPin, label: "Location", value: "Bengaluru, Karnataka, India" },
  { icon: Clock, label: "Response time", value: "Within 1–2 working days" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Academy team"
        description="Questions about a domain, an existing submission, or a college partnership — send it across and we'll come back to you."
      />

      <Container className="grid gap-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-start sm:py-20">
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Direct details</h2>
            <dl className="mt-5 flex flex-col gap-4">
              {details.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <item.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[13px] text-muted">{item.label}</dt>
                    <dd className="break-words text-[15px] font-medium text-ink">
                      {item.href ? (
                        <a href={item.href} className="transition-colors hover:text-brand">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="bg-canvas p-6">
            <h2 className="text-[15px] font-semibold">Already enrolled?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-body">
              For anything about a specific submission or your certificate, message us
              from your dashboard so we can see your internship record alongside the
              question.
            </p>
          </Card>
        </div>
      </Container>
    </>
  );
}
