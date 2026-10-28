"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/internships", label: "Internships" },
  { href: "/about", label: "About" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-pill border border-line bg-white/85 px-4 py-2.5 backdrop-blur-xl transition-shadow duration-300 sm:px-5",
          scrolled ? "shadow-nav" : "shadow-soft",
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-ink"
          aria-label="KLS Academy home"
        >
          <Logo className="h-8 w-auto" priority />
          {/* At 360px the mark, the wordmark, the CTA and the menu button do
              not all fit. The mark alone carries the brand on a phone. */}
          <span className="hidden text-[15px] font-semibold sm:inline">Academy</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-body hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "group")}
          >
            Get started
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-full text-ink lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-card border border-line bg-white p-2 shadow-card lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-field px-4 py-3 text-[15px] font-medium transition-colors",
                isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-body hover:bg-canvas",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block rounded-field px-4 py-3 text-[15px] font-medium text-body transition-colors hover:bg-canvas sm:hidden"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
