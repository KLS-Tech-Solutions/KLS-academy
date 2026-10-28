import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
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
import {
  BreadcrumbSchema,
  FaqSchema,
  LearningResourceSchema,
  OpenSourceSchema,
} from "@/components/shared/structured-data";
import { pageMeta } from "@/lib/seo";
import { faqs, journeySteps, roadmapStages, whyKls } from "@/data/content";

export const metadata = pageMeta({
  title: "Free Virtual Internships with Free Chapter-Wise Learning Material",
  description:
    "Free and open source. Sign up and get chapter-wise study notes as PDFs, beginner to advanced, in every domain — then take engineer-reviewed project tasks and earn a QR-verified certificate. No fee at any stage.",
  path: "/",
  keywords: [
    // Phrased the way people search, not the way we describe ourselves.
    "free virtual internship",
    "free internship with certificate India",
    "open source internship platform",
    "free chapter wise study material pdf",
    "beginner to advanced learning roadmap",
    "online internship with certificate India",
    "verified internship certificate",
    "remote internship for students",
    "free coding internship with certificate",
  ],
});

const whyIcons: Record<string, LucideIcon> = {
  book: BookOpen,
  briefcase: Briefcase,
  code: Code2,
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
      <FaqSchema />
      <LearningResourceSchema />
      <OpenSourceSchema />
      <BreadcrumbSchema trail={[{ name: "Home", path: "/" }]} />
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
              Free forever · Open source · Enrolment open
            </Badge>

            {/*
              The h1 is the single strongest signal on the page, for readers
              and for answer engines alike. It leads with the two things that
              are actually distinctive — free, and learning material included —
              rather than with a claim every internship site makes.
            */}
            <h1 className="mt-6 text-[2.75rem] leading-[1.05] sm:text-6xl">
              Learn it free.
              <br />
              <span className="text-gradient-brand">Then prove you can do it.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-body sm:text-lg">
              Sign up and get <strong className="font-semibold text-ink">chapter-wise
              study notes as PDFs — beginner to advanced, in every domain</strong>. Then
              take real project tasks, get each one reviewed by a KLS engineer, and
              finish with a QR-verified certificate anyone can check.
            </p>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-body">
              No fee at any stage. No card details. The whole platform is open
              source.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
              >
                Sign up and start learning
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
              {[
                "Free study material",
                "No fee, ever",
                "Open source (MIT)",
                "100% remote",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Reveal delay={0.15}>
            <div className="grid gap-4">
              {[
                {
                  icon: BookOpen,
                  title: "Free chapter-wise notes",
                  body: "Downloadable PDFs per domain, ordered beginner to advanced. Yours on signup.",
                },
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
            // Not "six domains". The catalogue is managed from the admin
            // console and starts empty, so a hard-coded count is a claim the
            // page cannot keep — and it would be wrong on launch day.
            description="Each domain comes with its own chapter-wise study notes, a fixed set of technical tasks, and a reviewed final submission."
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
      {/* Learning roadmap                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="learning"
        className="border-t border-line bg-canvas py-20 sm:py-24"
      >
        <Container>
          <SectionHeader
            eyebrow="Free learning material"
            title="A chapter-wise roadmap, beginner to advanced"
            description="Every domain comes with its own set of study notes as downloadable PDFs, ordered so each chapter builds on the last. Sign up and they are yours — you do not have to enrol in an internship, finish anything, or pay to read them."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roadmapStages.map((stage, i) => (
              <Reveal key={stage.level} delay={i * 0.06}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <Badge variant="accent">{stage.level}</Badge>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">{stage.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">
                    {stage.description}
                  </p>

                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
                    {stage.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-body"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="max-w-2xl text-[15px] leading-relaxed text-body">
              Read the chapters, then apply them on the internship tasks in the
              same domain. The learning and the work sit in one place, and both
              cost nothing.
            </p>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "primary" }), "group")}
            >
              Get the notes free
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Journey                                                           */}
      {/* ---------------------------------------------------------------- */}
      {/* Plain, because the roadmap section above it is already on canvas and
          two tinted bands in a row read as one very long section. */}
      <section className="border-t border-line py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            title="From signing up to a verified certificate"
            description="Eight steps, and none of them involve a payment. Nothing hidden, and nothing automated that should be judged by a person."
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
      <section className="border-t border-line bg-canvas py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Why KLS Academy"
            title="Built by a product company, not a course factory"
            description="Free material, real work, human review, and code you can read for yourself."
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
      {/* Open source                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <Card className="flex flex-col gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:gap-10">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand">
              <Code2 className="size-7" />
            </span>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-[1.75rem]">
                Open source, under the MIT licence
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-body">
                KLS Academy is free in both senses. Anyone can read the code, run
                their own instance, or contribute to it — how your submissions are
                reviewed, how your data is stored and how a certificate is issued
                are all things you can check rather than take on trust.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The KLS Tech Solutions name, logo and seal are not covered by the
                licence. Only certificates verifiable on this site were issued by
                us.
              </p>
            </div>

            <ul className="flex shrink-0 flex-col gap-2.5 lg:w-52">
              {[
                "MIT licensed",
                "No paid tier",
                "Self-hostable",
                "Contributions welcome",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-body"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
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
              All you have to do is sign up
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base">
              The chapter-wise notes are free, the internship is free, and the
              certificate is free. Create an account and start reading today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "inverse", size: "lg" }), "group")}
              >
                Sign up free
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
