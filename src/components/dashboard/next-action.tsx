import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { JourneyStage } from "@/types";

const actions: Record<
  JourneyStage,
  { title: string; body: string; cta: string; href: string }
> = {
  not_enrolled: {
    title: "Choose your internship domain",
    body: "Pick a track to enrol in. Your offer letter is generated the moment you do.",
    cta: "Browse domains",
    href: "/dashboard/enroll",
  },
  enrolled: {
    title: "Your offer letter is being generated",
    body: "This takes a few seconds. You'll be notified as soon as it's ready to download.",
    cta: "Go to offer letter",
    href: "/dashboard/offer-letter",
  },
  offer_letter_generated: {
    title: "Download your offer letter and post it on LinkedIn",
    body: "Task 1 is to share your offer letter publicly and submit the post URL for verification.",
    cta: "Start Task 1",
    href: "/dashboard/linkedin",
  },
  linkedin_submitted: {
    title: "Your LinkedIn post is awaiting verification",
    body: "A reviewer is checking your post. Technical tasks unlock as soon as it's approved.",
    cta: "View submission",
    href: "/dashboard/linkedin",
  },
  linkedin_approved: {
    title: "Technical tasks are unlocked",
    body: "Your LinkedIn post was verified. Start with Task 1 and work through in order.",
    cta: "View tasks",
    href: "/dashboard/tasks",
  },
  tasks_in_progress: {
    title: "Keep going on your technical tasks",
    body: "Submit your GitHub repository, three screenshots and a written explanation for each task.",
    cta: "Continue tasks",
    href: "/dashboard/tasks",
  },
  all_tasks_approved: {
    title: "Every task is approved",
    body: "Your certificate is being issued — it appears here in a moment.",
    cta: "View certificate",
    href: "/dashboard/certificate",
  },
  certificate_issued: {
    title: "Your certificate is ready",
    body: "Download it, share it on LinkedIn, or send anyone the verification link.",
    cta: "Download certificate",
    href: "/dashboard/certificate",
  },
};

export function NextActionCard({ stage }: { stage: JourneyStage }) {
  const action = actions[stage];

  return (
    <div className="relative overflow-hidden rounded-card bg-brand-gradient p-6 shadow-card sm:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
          Your next step
        </span>
        <h2 className="mt-4 max-w-lg text-2xl text-white">{action.title}</h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/80">
          {action.body}
        </p>
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "inverse" }), "group mt-6")}
        >
          {action.cta}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
