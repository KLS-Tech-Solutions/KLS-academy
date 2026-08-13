"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  ClipboardList,
  GraduationCap,
  CreditCard,
  FileText,
  LayoutDashboard,
  Share2,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Avatar } from "@/components/ui/misc";
import { useJourney } from "@/hooks/use-journey";
import { hasReached } from "@/types";
import { useLogout } from "@/hooks/use-session";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, unlocksAt: null },
  { href: "/dashboard/offer-letter", label: "Offer letter", icon: FileText, unlocksAt: "offer_letter_generated" },
  { href: "/dashboard/linkedin", label: "LinkedIn task", icon: Share2, unlocksAt: "offer_letter_generated" },
  { href: "/dashboard/tasks", label: "Tasks", icon: ClipboardList, unlocksAt: "linkedin_approved" },
  { href: "/dashboard/payment", label: "Payment", icon: CreditCard, unlocksAt: "all_tasks_approved" },
  { href: "/dashboard/certificate", label: "Certificate", icon: Award, unlocksAt: "certificate_issued" },
  // Always available: a student who has taken anything at all has something
  // here, and the documents from past internships never expire.
  { href: "/dashboard/internships", label: "My internships", icon: GraduationCap, unlocksAt: null },
] as const;

const secondaryNav = [
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardShell({
  children,
  chromeOnly = false,
}: {
  children: React.ReactNode;
  /** Renders the frame without reading the journey — used while it loads. */
  chromeOnly?: boolean;
}) {
  if (chromeOnly) return <ShellFrame>{children}</ShellFrame>;
  return <ShellWithJourney>{children}</ShellWithJourney>;
}

function ShellWithJourney({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { journey, stage } = useJourney();
  const logout = useLogout();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  const unread = journey.notifications.filter((n) => !n.is_read).length;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  /*
    Brand pinned at the top, account actions pinned at the bottom, nav scrolls
    between them — so sign-out stays reachable on short windows.
  */
  const sidebar = (
    <div className="flex h-full min-h-0 flex-col p-4">
      <Link href="/" className="mb-6 flex shrink-0 items-center gap-2.5 px-2 pr-10 text-ink">
        <Logo className="h-7 w-auto" />
        <span className="text-[15px] font-semibold">Academy</span>
      </Link>

      <nav className="-mr-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-2">
        {nav.map((item) => {
          const locked = item.unlocksAt ? !hasReached(stage, item.unlocksAt) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-disabled={locked}
              className={cn(
                "flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : locked
                    ? "text-muted"
                    : "text-body hover:bg-canvas hover:text-ink",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {locked && (
                <span className="ml-auto text-[11px] font-medium text-muted">Locked</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 shrink-0 flex flex-col gap-1 border-t border-line pt-4">
        {secondaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-brand-50 text-brand-700"
                : "text-body hover:bg-canvas hover:text-ink",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
            {item.label === "Notifications" && unread > 0 && (
              <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
                {unread}
              </span>
            )}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex items-center gap-3 rounded-field px-3 py-2.5 text-left text-sm font-medium text-body transition-colors hover:bg-canvas hover:text-ink"
        >
          <LogOut className="size-4 shrink-0" />
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white shadow-lift">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-full p-2 text-muted hover:bg-canvas"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-full text-ink lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {journey.domain ? journey.domain.title : "KLS Academy"}
            </p>
            <p className="truncate text-xs text-muted">
              {journey.batch ? journey.batch.batch_name : "No active internship"}
            </p>
          </div>

          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-body transition-colors hover:bg-canvas hover:text-ink"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand ring-2 ring-white" />
            )}
          </Link>

          <Link href="/dashboard/profile" aria-label="Profile">
            <Avatar name={journey.user.full_name} className="size-9" />
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/**
 * The dashboard frame without any journey data — sidebar links all unlocked-
 * looking, no student name. Used for the loading and error boundaries so the
 * page doesn't visibly jump once the data lands.
 */
function ShellFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">
        <div className="flex h-full min-h-0 flex-col p-4">
          <Link href="/" className="mb-6 flex shrink-0 items-center gap-2.5 px-2 pr-10 text-ink">
            <Logo className="h-7 w-auto" />
            <span className="text-[15px] font-semibold">Academy</span>
          </Link>
          <nav className="-mr-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-2">
            {nav.map((item) => (
              <span
                key={item.href}
                className="flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium text-muted"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </span>
            ))}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <p className="text-sm font-semibold text-ink">KLS Academy</p>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
