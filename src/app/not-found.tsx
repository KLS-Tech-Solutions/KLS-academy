import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
      </div>
      <div className="relative text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          404
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-body">
          The link may be broken or the page may have moved. Everything else is
          still where you left it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants({ variant: "primary" }))}>
            Back to home
          </Link>
          <Link
            href="/internships"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Browse internships
          </Link>
        </div>
      </div>
    </div>
  );
}
