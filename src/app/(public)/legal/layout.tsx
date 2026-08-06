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
          "[&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-body",
          "[&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-body",
          "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
        ].join(" ")}
      >
        {children}
      </article>
    </Container>
  );
}
