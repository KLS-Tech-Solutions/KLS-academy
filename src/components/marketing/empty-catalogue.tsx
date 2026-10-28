import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/lib/api/config";

/**
 * Shown when the catalogue has no published domains — either none have been
 * created yet, or the API is unreachable. Either way a visitor gets a real
 * next step rather than an empty grid.
 */
export function EmptyCatalogue() {
  return (
    <div className="mx-auto max-w-lg rounded-card border border-dashed border-line bg-canvas/60 px-6 py-14 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-muted shadow-soft">
        <CalendarClock className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">Enrolment opens shortly</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-body">
        Our next set of internship domains is being finalised. Leave us a note and
        we&apos;ll tell you the moment they open.
      </p>
      <Link
        href="/contact"
        className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}
      >
        Get in touch
      </Link>
      <p className="mt-4 text-[13px] text-muted">{SUPPORT_EMAIL}</p>
    </div>
  );
}
