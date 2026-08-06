"use client";

import { FlaskConical } from "lucide-react";
import { useJourney } from "@/hooks/use-journey";
import { JOURNEY_ORDER, type JourneyStage } from "@/types";

const labels: Record<JourneyStage, string> = {
  not_enrolled: "1 · Not enrolled",
  enrolled: "2 · Enrolled",
  offer_letter_generated: "3 · Offer letter ready",
  linkedin_submitted: "4 · LinkedIn submitted",
  linkedin_approved: "5 · LinkedIn approved",
  tasks_in_progress: "6 · Tasks in progress",
  all_tasks_approved: "7 · All tasks approved",
  payment_pending: "8 · Payment pending",
  paid: "9 · Paid",
  certificate_issued: "10 · Certificate issued",
};

/**
 * Development-only control. Lets the team preview every screen state without
 * a backend. Hidden automatically in production builds.
 */
export function StageSwitcher() {
  const { stage, setStage } = useJourney();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <label className="hidden items-center gap-2 rounded-pill border border-dashed border-brand/40 bg-brand-50/60 px-3 py-1.5 md:flex">
      <FlaskConical className="size-3.5 text-brand" />
      <span className="sr-only">Preview journey stage</span>
      <select
        value={stage}
        onChange={(e) => setStage(e.target.value as JourneyStage)}
        className="bg-transparent text-xs font-medium text-brand-700 outline-none"
      >
        {JOURNEY_ORDER.map((s) => (
          <option key={s} value={s}>
            {labels[s]}
          </option>
        ))}
      </select>
    </label>
  );
}
