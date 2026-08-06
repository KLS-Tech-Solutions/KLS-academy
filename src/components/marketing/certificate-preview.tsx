import { QrCode, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { MsmeBadge } from "@/components/shared/msme-badge";

/**
 * Visual stand-in for the generated certificate. Replaced by the real
 * rendered PDF preview once the certificate service exists.
 */
export function CertificatePreview({
  name = "Ananya Rao",
  domain = "Full Stack Python Development",
  certificateNumber = "KLS-ACAD-2026-00184",
  issuedOn = "26 Sep 2026",
  className,
}: {
  name?: string;
  domain?: string;
  certificateNumber?: string;
  issuedOn?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-line bg-white p-6 shadow-card sm:p-8",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-gradient" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <Logo variant="lockup" className="h-11 w-auto" />
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-50 px-3 py-1 text-[11px] font-medium text-accent">
            <ShieldCheck className="size-3.5" />
            Verified
          </span>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted">
          Certificate of completion
        </p>
        <p className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{name}</p>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-body">
          has successfully completed the virtual internship in{" "}
          <span className="font-semibold text-ink">{domain}</span> at KLS Academy,
          including all reviewed project submissions.
        </p>

        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
          <div className="space-y-1 text-[13px]">
            <p className="text-muted">Certificate number</p>
            <p className="font-mono font-medium text-ink">{certificateNumber}</p>
            <p className="pt-2 text-muted">Issued on {issuedOn}</p>
          </div>

          <MsmeBadge className="w-16 sm:w-20" />

          <div className="flex size-20 shrink-0 items-center justify-center justify-self-end rounded-xl border border-line bg-canvas text-muted">
            <QrCode className="size-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
