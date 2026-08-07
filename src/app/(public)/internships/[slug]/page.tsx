import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Layers, Signal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/disclosure";
import { Container, SectionHeader } from "@/components/shared/primitives";
import { Reveal } from "@/components/shared/reveal";
import { getBatchOnServer, getDomainOnServer } from "@/services/catalogue.server";
import { faqs } from "@/data/content";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const domain = await getDomainOnServer(slug);
  if (!domain) return { title: "Internship not found" };
  return { title: domain.title, description: domain.description };
}

export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = await getDomainOnServer(slug);
  if (!domain) notFound();

  const batch = await getBatchOnServer(domain.id);

  const facts = [
    { icon: Clock, label: "Duration", value: domain.duration },
    { icon: Layers, label: "Tasks", value: `${domain.task_count} reviewed submissions` },
    { icon: Signal, label: "Level", value: domain.difficulty },
    { icon: CheckCircle2, label: "Mode", value: "Fully remote" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid bg-grid-fade absolute inset-0" />
          <div className="absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-50 opacity-70 blur-3xl" />
        </div>

        <Container className="relative py-14 sm:py-16">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            All internships
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="capitalize">
              {domain.difficulty}
            </Badge>
            <Badge variant="neutral">{domain.duration}</Badge>
            {batch && <Badge variant="accent">{batch.seats_left} seats left</Badge>}
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl sm:text-5xl">{domain.title}</h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-body">
            {domain.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
            >
              Enrol in this domain
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/internships"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Compare domains
            </Link>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr] lg:items-start sm:py-20">
        <div className="flex flex-col gap-12">
          <div>
            <SectionHeader align="left" title="What you'll be able to do" />
            <ul className="mt-6 flex flex-col gap-3">
              {domain.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-body">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader
              align="left"
              title="How submissions are reviewed"
              description="Each technical task follows the same submission contract, so you always know what 'done' means."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Project title", body: "A clear name for what you built." },
                { title: "Detailed explanation", body: "How you implemented it and the decisions you made." },
                { title: "Minimum 3 screenshots", body: "Evidence of the working project across key screens." },
                { title: "Public GitHub repository", body: "Readable code with a README. A live demo link is optional." },
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="text-[15px] font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader align="left" title="Common questions" />
            <Accordion items={faqs.slice(0, 5)} className="mt-6" />
          </div>
        </div>

        <Reveal delay={0.1}>
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Programme details</h3>
              <dl className="mt-5 flex flex-col gap-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                      <fact.icon className="size-4" />
                    </span>
                    <div>
                      <dt className="text-[13px] text-muted">{fact.label}</dt>
                      <dd className="text-[15px] font-medium capitalize text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              {batch && (
                <div className="mt-6 rounded-field bg-canvas p-4">
                  <p className="text-[13px] text-muted">Next batch</p>
                  <p className="mt-1 text-[15px] font-medium text-ink">{batch.batch_name}</p>
                  <p className="mt-1 text-sm text-body">
                    {formatDate(batch.start_date)} — {formatDate(batch.end_date)}
                  </p>
                </div>
              )}

              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", full: true }), "mt-6")}
              >
                Enrol now — free
              </Link>
              <p className="mt-3 text-center text-[13px] text-muted">
                ₹50 applies only when you claim your certificate.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-[15px] font-semibold">Skills covered</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </aside>
        </Reveal>
      </Container>
    </>
  );
}
