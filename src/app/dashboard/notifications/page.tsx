"use client";

import * as React from "react";
import {
  Award,
  Bell,
  CheckCheck,
  CreditCard,
  FileText,
  Megaphone,
  Share2,
  ClipboardList,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/shared/primitives";
import { DashboardHeader } from "@/components/dashboard/page-header";
import { useJourney } from "@/hooks/use-journey";
import { useMarkNotificationsRead } from "@/hooks/mutations";
import type { NotificationType } from "@/types";

const icons: Record<NotificationType, LucideIcon> = {
  welcome: UserCheck,
  offer_letter: FileText,
  linkedin: Share2,
  task: ClipboardList,
  review: CheckCheck,
  payment: CreditCard,
  certificate: Award,
  announcement: Megaphone,
};

export default function NotificationsPage() {
  const { journey } = useJourney();
  const markRead = useMarkNotificationsRead();
  const [filter, setFilter] = React.useState("all");
  const [readIds, setReadIds] = React.useState<string[]>([]);

  /** Optimistic locally, then persisted — the list never flickers. */
  const markAsRead = (ids: string[]) => {
    setReadIds((prev) => [...new Set([...prev, ...ids])]);
    markRead.mutate(ids);
  };

  const notifications = journey.notifications.map((n) => ({
    ...n,
    is_read: n.is_read || readIds.includes(n.id),
  }));

  const unread = notifications.filter((n) => !n.is_read);
  const visible = filter === "unread" ? unread : notifications;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <DashboardHeader
        title="Notifications"
        description="Updates on your offer letter, submissions and certificate."
        action={
          unread.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAsRead(unread.map((n) => n.id))}
            >
              <CheckCheck />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Tabs
        value={filter}
        onValueChange={setFilter}
        tabs={[
          { value: "all", label: "All", count: notifications.length },
          { value: "unread", label: "Unread", count: unread.length },
        ]}
        className="self-start"
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell />}
          title="Nothing here"
          description={
            filter === "unread"
              ? "You're all caught up — no unread notifications."
              : "Notifications about your internship will appear here."
          }
        />
      ) : (
        <Card className="divide-y divide-line">
          {visible.map((n) => {
            const Icon = icons[n.type] ?? Bell;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => markAsRead([n.id])}
                className={cn(
                  "flex w-full gap-4 p-5 text-left transition-colors hover:bg-canvas/60",
                  !n.is_read && "bg-brand-50/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    n.is_read ? "bg-canvas text-muted" : "bg-brand-50 text-brand",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-semibold text-ink">{n.title}</p>
                    {!n.is_read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                    )}
                  </div>
                  <p className="mt-1 text-[15px] leading-relaxed text-body">{n.message}</p>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {formatDateTime(n.created_at)}
                  </p>
                </div>
              </button>
            );
          })}
        </Card>
      )}
    </div>
  );
}
