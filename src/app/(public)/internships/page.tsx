import type { Metadata } from "next";
import { Container, PageHero } from "@/components/shared/primitives";
import { Reveal } from "@/components/shared/reveal";
import { DomainCard } from "@/components/marketing/domain-card";
import { domains } from "@/data/domains";

export const metadata: Metadata = {
  title: "Internship domains",
  description:
    "Six verified virtual internship tracks — full stack, web, cyber security, generative AI, agentic AI and data science.",
};

export default function InternshipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Enrolment open"
        title={
          <>
            Choose your <span className="text-gradient-brand">internship domain</span>
          </>
        }
        description="Every track is fully remote, free to enrol, and finishes with a reviewed project portfolio and a verified certificate."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, i) => (
            <Reveal key={domain.id} delay={i * 0.05}>
              <DomainCard domain={domain} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
