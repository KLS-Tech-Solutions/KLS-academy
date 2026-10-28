import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye, GraduationCap, Handshake, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, PageHero, SectionHeader } from "@/components/shared/primitives";
import { Reveal } from "@/components/shared/reveal";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About",
  description:
    "KLS Academy is the learning division of KLS Tech Solutions, an MSME registered organisation in Bangalore. Free, open-source virtual internships.",
  path: "/about",
});


const philosophy = [
  {
    title: "Build first, explain second",
    body: "Every task ends in something that runs. The written explanation exists to prove you understand what you built, not to replace it.",
  },
  {
    title: "Feedback beats grades",
    body: "A rejected submission comes back with specific notes and no penalty. Resubmission is expected, not punished.",
  },
  {
    title: "Proof over participation",
    body: "The certificate is issued only when every task is approved. That constraint is what makes it mean something.",
  },
  {
    title: "Public by default",
    body: "Repositories are public, demos are deployed, certificates are verifiable. Your work should be checkable by anyone.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About KLS Academy"
        title={
          <>
            The learning arm of a{" "}
            <span className="text-gradient-brand">product engineering company</span>
          </>
        }
        description="KLS Tech Solutions builds IoT systems, enterprise SaaS platforms and AI applications from Bengaluru. KLS Academy exists so students can learn from that work directly."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                <Target className="size-5" />
              </span>
              <h2 className="mt-6 text-2xl">Mission</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-body">
                Give every student access to structured, affordable, industry-shaped
                internship experience — with real project work, honest review, and a
                credential that holds up when someone checks it.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="h-full p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
                <Eye className="size-5" />
              </span>
              <h2 className="mt-6 text-2xl">Vision</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-body">
                A scalable internship ecosystem where evaluation is fast, feedback is
                specific, and every graduate leaves with a portfolio a hiring manager
                can open and read.
              </p>
            </Card>
          </Reveal>
        </div>
      </Container>

      <section className="border-y border-line bg-canvas py-20 sm:py-24">
        <Container>
          <SectionHeader
            eyebrow="Learning philosophy"
            title="Four principles the whole platform is built around"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {philosophy.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <Card className="h-full p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand shadow-soft">
                    <Compass className="size-4" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-20 sm:py-24">
        <SectionHeader
          eyebrow="Why KLS Academy"
          title="Curriculum written by the people who ship the product"
          description="The tasks you work through are shaped by the same engineering standards we hold our own delivery work to — code review, documentation, deployment."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { icon: GraduationCap, stat: "6", label: "Internship domains" },
            { icon: Handshake, stat: "100%", label: "Human-reviewed submissions" },
            { icon: Target, stat: "Free", label: "To enrol and complete" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <Card className="h-full p-6 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                  <item.icon className="size-5" />
                </span>
                <p className="mt-5 text-3xl font-bold text-ink">{item.stat}</p>
                <p className="mt-1 text-[15px] text-body">{item.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="border-t border-line bg-canvas py-16 sm:py-20">
        <Container size="md" className="text-center">
          <SectionHeader
            eyebrow="Industry partnerships"
            title="Partner programmes are being set up"
            description="We are building relationships with colleges and hiring partners so verified KLS Academy certificates carry weight at the point of recruitment. Details will be published here as each partnership is confirmed."
          />
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "primary" }), "group mt-8")}
          >
            Partner with us
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Container>
      </section>
    </>
  );
}
