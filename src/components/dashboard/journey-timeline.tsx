import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { JOURNEY_ORDER, hasReached, type JourneyStage } from "@/types";

const steps: { stage: JourneyStage; label: string; description: string }[] = [
  { stage: "enrolled", label: "Enrolled", description: "Internship domain selected" },
  { stage: "offer_letter_generated", label: "Offer letter", description: "Generated and ready to download" },
  { stage: "linkedin_approved", label: "LinkedIn verified", description: "Post approved, technical tasks unlocked" },
  { stage: "all_tasks_approved", label: "Tasks approved", description: "Every submission signed off" },
  { stage: "certificate_issued", label: "Certificate", description: "Issued with QR verification" },
];

export function JourneyTimeline({ stage }: { stage: JourneyStage }) {
  const currentIndex = JOURNEY_ORDER.indexOf(stage);

  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const done = hasReached(stage, step.stage);
        const isNext =
          !done && JOURNEY_ORDER.indexOf(step.stage) > currentIndex &&
          !steps.slice(0, i).some((s) => !hasReached(stage, s.stage));

        return (
          <li key={step.stage} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done
                    ? "bg-accent text-white"
                    : isNext
                      ? "bg-brand-gradient text-white"
                      : "bg-line-soft text-muted",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    done ? "bg-accent/40" : "bg-line",
                  )}
                />
              )}
            </div>

            <div className={cn("pb-6", i === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-[15px] font-semibold",
                  done || isNext ? "text-ink" : "text-muted",
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-sm text-body">{step.description}</p>
              {isNext && (
                <span className="mt-2 inline-flex rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Next up
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
