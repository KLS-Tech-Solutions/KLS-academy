import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official KLS brand marks.
 *
 * - `mark`   — the KLS monogram, used wherever "Academy" appears beside it
 *              so the lockup never reads "KLS Solutions Academy".
 * - `lockup` — the full KLS Solutions lockup, used on formal documents
 *              (offer letter, certificate) where the issuing company is named.
 *
 * Source assets live in `public/brand/`.
 */
/**
 * Intrinsic sizes are set to roughly the largest on-screen size rather than the
 * source resolution, so Next serves a ~160px asset for a 32px-tall logo instead
 * of a 1920px one. The files themselves stay high-res for retina downscaling.
 */
const assets = {
  mark: { src: "/brand/kls-mark.png", width: 160, height: 97, alt: "KLS" },
  lockup: {
    src: "/brand/kls-logo.png",
    width: 220,
    height: 162,
    alt: "KLS Solutions",
  },
} as const;

export function Logo({
  variant = "mark",
  className,
  priority = false,
}: {
  variant?: keyof typeof assets;
  className?: string;
  priority?: boolean;
}) {
  const asset = assets[variant];

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      style={{ width: "auto" }}
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}
