import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ChartNoAxesColumn,
  Code2,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { InternshipDomain } from "@/types";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  layout: LayoutGrid,
  shield: ShieldCheck,
  sparkles: Sparkles,
  bot: Bot,
  chart: ChartNoAxesColumn,
};

const difficultyVariant = {
  beginner: "success",
  intermediate: "brand",
  advanced: "warning",
} as const;

export function DomainCard({
  domain,
  className,
}: {
  domain: InternshipDomain;
  className?: string;
}) {
  const Icon = icons[domain.icon] ?? Code2;

  return (
    <Card interactive className={cn("group flex flex-col p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors duration-300 group-hover:bg-brand-gradient group-hover:text-white">
          <Icon className="size-5" />
        </span>
        <Badge variant={difficultyVariant[domain.difficulty]} className="capitalize">
          {domain.difficulty}
        </Badge>
      </div>

      <h3 className="mt-5 text-lg font-semibold">{domain.title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-body">
        {domain.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
        <span>{domain.duration}</span>
        <span>{domain.task_count} tasks</span>
        <span>Remote</span>
      </div>

      <Link
        href={`/internships/${domain.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand"
      >
        View details
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}
