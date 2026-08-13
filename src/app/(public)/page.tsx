import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/disclosure";
import { Container, SectionHeader } from "@/components/shared/primitives";
import { Reveal } from "@/components/shared/reveal";
import { DomainCard } from "@/components/marketing/domain-card";
import { EmptyCatalogue } from "@/components/marketing/empty-catalogue";
import { CertificatePreview } from "@/components/marketing/certificate-preview";
import { listDomainsOnServer } from "@/services/catalogue.server";
import { faqs, journeySteps, whyKls } from "@/data/content";

const whyIcons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "user-check": UserCheck,
  "shield-check": ShieldCheck,
  wallet: Wallet,
  building: Building2,
  rocket: Rocket,
};

export default async function HomePage() {
  const domains = await listDomainsOnServer();

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid bg-grid-fade absolute inset-0" />
          <div className="absolute -top-40 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-brand-50 opacity-70 blur-3xl" />
        </div>

        <Container className="relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <Badge variant="accent">
              <Sparkles />
              Enrolment open for Batch 01
            </Badge>

            <h1 className="mt-6 text-[2.75rem] leading-[1.05] sm:text-6xl">
              Verified virtual internships,
              <br />
              <span className="text-gradient-brand">engineered for hiring</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-body sm:text-lg">
              Enrol in a technology internship, build real projects against real
              briefs, get every submission reviewed by a KLS engineer, and finish
              with a QR-verified certificate anyone can check.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
              >
                Start your internship
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/internships"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                Browse domains
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-body">
              {["Free to enrol", "100% remote", "Certificate on completion"].map(
                (item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-accent" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <Reveal delay={0.15}>
            <div className="grid gap-4">
              {[
                {
                  icon: Briefcase,
                  title: "Real project work",
                  body: "Task briefs written from the work our engineering teams actually ship.",
                },
                {
                  icon: UserCheck,
                  title: "Human review",
                  body: "Every submission is read by a reviewer who approves it or sends specific notes.",
                },
                {
                  icon: ShieldCheck,
                  title: "QR-verified certificate",
                  body: "A unique certificate number and QR code anyone can verify publicly.",
                },
              ].map((item) => (
                <Card key={item.title} className="flex gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">{item.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-body">
                      {item.body}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Domains                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Internship domains"
            title="Pick the track that matches where you're heading"
            description="Six domains, each with a fixed set of technical tasks, clear deadlines and a reviewed final submission."
          />

          {domains.length === 0 ? (
            <div className="mt-12">
              <EmptyCatalogue />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain, i) => (
                <Reveal key={domain.id} delay={i * 0.05}>
                  <DomainCard domain={domain} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Journey                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line bg-canvas py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title="From registration to a verified certificate"
            description="Eight steps. Nothing hidden, nothing automated that should be judged by a person."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.04}>
                <li className="h-full rounded-card border border-line bg-white p-5 shadow-soft">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why KLS                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Why KLS Academy"
            title="Built by a product company, not a course factory"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyKls.map((item, i) => {
              const Icon = whyIcons[item.icon] ?? Briefcase;
              return (
                <Reveal key={item.title} delay={i * 0.05}>
                  <Card className="h-full p-6">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-body">
                      {item.description}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Certificate                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line bg-canvas py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Certification"
              title="A certificate that survives scrutiny"
              description="Every certificate carries a unique number and a QR code. A recruiter can verify it on our public portal in seconds — no login, no email required."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "Issued only after every task is approved",
                "Unique certificate number per student",
                "Public QR verification page",
                "Shareable directly to LinkedIn",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-body">
                  <CheckCircle2 className="size-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/verify"
              className={cn(buttonVariants({ variant: "secondary" }), "mt-8")}
            >
              Verify a certificate
            </Link>
          </div>

          <Reveal delay={0.1}>
            <CertificatePreview />
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line bg-canvas py-20 sm:py-24">
        <Container size="md">
          <SectionHeader eyebrow="FAQ" title="Questions students ask first" />
          <Accordion items={faqs} className="mt-10" />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-[28px] bg-brand-gradient px-6 py-14 text-center shadow-card sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl text-white sm:text-4xl">
              Your next internship should be worth showing someone
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base">
              Enrolment is free. Pick a domain, get your offer letter today, and
              start building.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "inverse", size: "lg" }), "group")}
              >
                Create your account
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/internships"
                className="inline-flex h-12 items-center justify-center rounded-pill border border-white/30 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                See all domains
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
