import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SUPPORT_EMAIL } from "@/lib/api/config";
import { Container } from "@/components/shared/primitives";

const columns = [
  {
    title: "Academy",
    links: [
      { href: "/internships", label: "Internships" },
      { href: "/about", label: "About" },
      { href: "/verify", label: "Verify a certificate" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Students",
    links: [
      { href: "/register", label: "Create an account" },
      { href: "/login", label: "Login" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/refund", label: "Refund policy" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-ink">
              <Logo className="h-7 w-auto" />
              <span className="text-[15px] font-semibold">Academy</span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-body">
              Verified virtual internships with real project work and QR-verified
              certificates, by KLS Tech Solutions.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-body">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand"
              >
                <Mail className="size-4 text-muted" />
                {SUPPORT_EMAIL}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-muted" />
                Bengaluru, India
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-ink">{column.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-body transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} KLS Tech Solutions
            <span className="mx-2 text-line">|</span>
            MSME registered
          </p>
          <a
            href="https://klstechsolutions.in"
            className="transition-colors hover:text-brand"
          >
            klstechsolutions.in
          </a>
        </div>
      </Container>
    </footer>
  );
}
