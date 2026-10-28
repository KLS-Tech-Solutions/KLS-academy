import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Ministry of Micro, Small & Medium Enterprises mark.
 *
 * Appears on every issued document — offer letters and certificates — so a
 * recipient can see the issuing organisation is MSME registered.
 *
 * NOTE: the current asset is a cleaned-up raster. Replace it with the official
 * artwork from the Udyam / MSME portal before anything is printed or issued.
 */
export function MsmeBadge({
  className,
  caption = true,
  align = "center",
}: {
  className?: string;
  caption?: boolean;
  align?: "center" | "right";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "center" ? "items-center text-center" : "items-end text-right",
        className,
      )}
    >
      <Image
        src="/brand/msme.png"
        alt="Ministry of Micro, Small and Medium Enterprises"
        width={110}
        height={127}
        className="h-auto w-auto select-none"
        style={{ width: "auto" }}
      />
      {caption && (
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          MSME registered
        </p>
      )}
    </div>
  );
}
