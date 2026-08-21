import type { Metadata } from "next";
import { Container, PageHero } from "@/components/shared/primitives";
import { Reveal } from "@/components/shared/reveal";
import { DomainCard } from "@/components/marketing/domain-card";
import { EmptyCatalogue } from "@/components/marketing/empty-catalogue";
import { listDomainsOnServer } from "@/services/catalogue.server";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Internship Domains",
  description:
    "Browse every free virtual internship at KLS Academy. Real project work, engineer-reviewed, with a QR-verified certificate on completion.",
  path: "/internships",
});


export default async function InternshipsPage() {
  const domains = await listDomainsOnServer();

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
        {domains.length === 0 ? (
          <EmptyCatalogue />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain, i) => (
              <Reveal key={domain.id} delay={i * 0.05}>
                <DomainCard domain={domain} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
