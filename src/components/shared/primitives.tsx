import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function Container({
  className,
  size = "lg",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "md" | "lg" | "xl" }) {
  const width = { md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl" }[size];
  return <div className={cn("mx-auto w-full px-5 sm:px-6", width, className)} {...props} />;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em] text-brand",
            align === "center" && "mx-auto",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-[17px] leading-relaxed text-body">{description}</p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-50 opacity-70 blur-3xl" />
      </div>
      <Container className="relative py-16 text-center sm:py-20">
        {eyebrow && (
          <Badge variant="brand" className="mb-5">
            {eyebrow}
          </Badge>
        )}
        <h1 className="mx-auto max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-body">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border border-dashed border-line bg-canvas/60 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-muted shadow-soft [&_svg]:size-5">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LockedState({
  title,
  description,
  unlockHint,
  action,
}: {
  title: string;
  description: string;
  unlockHint?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-white px-6 py-14 text-center shadow-soft">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-canvas text-muted">
        <Lock className="size-6" />
      </span>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body">{description}</p>
      {unlockHint && (
        <p className="mt-4 rounded-pill bg-warning-bg px-4 py-1.5 text-[13px] font-medium text-warning">
          {unlockHint}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
