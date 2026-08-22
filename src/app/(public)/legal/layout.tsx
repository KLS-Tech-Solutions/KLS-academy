import { Container } from "@/components/shared/primitives";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Container size="md" className="py-16 sm:py-20">
      <article
        className={[
          "flex flex-col gap-6",
          "[&_h1]:text-4xl",
          "[&_h2]:mt-6 [&_h2]:text-xl",
          // Sub-headings inside a section — smaller than h2 and tucked closer
          // to the text they introduce, so the hierarchy reads at a glance.
          "[&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink",
          "[&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-body",
          "[&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-body",
          "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
          "[&_strong]:font-semibold [&_strong]:text-ink",
          // `surface` is white, which on a white page is no background at all.
          "[&_code]:rounded [&_code]:bg-line-soft [&_code]:px-1.5 [&_code]:py-0.5",
          "[&_code]:font-mono [&_code]:text-[13px]",
        ].join(" ")}
      >
        {children}
      </article>
    </Container>
  );
}
