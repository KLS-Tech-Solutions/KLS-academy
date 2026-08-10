"use client";

import * as React from "react";
import Link from "next/link";
import { UserCog, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useJourney } from "@/hooks/use-journey";
import type { StudentProfile } from "@/types";

/** The fields that appear on the offer letter and certificate. */
const REQUIRED_FIELDS: (keyof StudentProfile)[] = [
  "college_name",
  "degree",
  "branch",
  "year",
];

function isComplete(profile: StudentProfile | null): boolean {
  if (!profile) return false;
  return REQUIRED_FIELDS.every((field) => {
    const value = profile[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}

/**
 * Asks a new student to finish their profile.
 *
 * Two rules, both of which the previous behaviour got wrong:
 *
 *  - It disappears **permanently** the moment the profile is complete. The
 *    check runs against live journey data on every render, so it cannot
 *    reappear once the fields are filled.
 *  - Dismissing it is remembered per account, so it does not nag on every
 *    page load within a session.
 */
export function ProfilePrompt() {
  const { journey } = useJourney();
  const [dismissed, setDismissed] = React.useState(true);

  const storageKey = `kls_profile_prompt_dismissed_${journey.user.id}`;
  const complete = isComplete(journey.profile);

  React.useEffect(() => {
    if (complete) return;
    try {
      setDismissed(window.sessionStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [complete, storageKey]);

  // A complete profile never shows the prompt again, dismissal or not.
  if (complete || dismissed) return null;

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = journey.profile?.[field];
    return !(typeof value === "string" && value.trim().length > 0);
  }).length;

  return (
    <div className="relative flex flex-col gap-4 rounded-card border border-brand-100 bg-brand-50/70 p-5 sm:flex-row sm:items-center">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
        <UserCog className="size-5" />
      </span>

      <div className="min-w-0 flex-1 pr-8 sm:pr-0">
        <p className="text-[15px] font-semibold text-ink">Complete your profile</p>
        <p className="mt-1 text-[15px] leading-relaxed text-body">
          {missing === REQUIRED_FIELDS.length
            ? "Add your college and course details — they appear on your offer letter and certificate."
            : `${missing} detail${missing === 1 ? "" : "s"} still missing. These appear on your offer letter and certificate.`}
        </p>
      </div>

      <Link
        href="/dashboard/profile"
        className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
      >
        Complete profile
      </Link>

      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          try {
            window.sessionStorage.setItem(storageKey, "1");
          } catch {
            // Storage unavailable — dismissal lasts for this page view only.
          }
        }}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-full p-1.5 text-muted transition-colors hover:bg-white hover:text-ink sm:static sm:ml-1"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
