import { FAQ, SITE } from "@/lib/seo";

/**
 * JSON-LD, emitted server-side.
 *
 * This is what makes the site legible to things that are not a person with a
 * browser: Google's rich results, and increasingly the answer engines that
 * quote a page rather than link to it. A crawler reading `<Script>` with a
 * client strategy may never see it, so these render a plain `<script>` tag in
 * the server HTML.
 *
 * `dangerouslySetInnerHTML` is the only way to put JSON inside a script tag in
 * React. The content is our own constants, never user input.
 */
function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${SITE.url}#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        description:
          "Free virtual internships with engineer-reviewed project work and QR-verified certificates.",
        parentOrganization: {
          "@type": "Organization",
          name: SITE.legalName,
          url: SITE.company,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          postalCode: SITE.postalCode,
          addressCountry: SITE.country,
        },
        email: SITE.email,
        areaServed: "IN",
      }}
    />
  );
}

/**
 * The FAQ block. Both a rich result and the most quotable thing on the site —
 * each answer is written to stand alone when an answer engine lifts it.
 */
export function FaqSchema({
  items = FAQ,
}: {
  items?: { question: string; answer: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }}
    />
  );
}

/** One internship domain, described as a Course. */
export function CourseSchema({
  title,
  description,
  slug,
  duration,
  difficulty,
}: {
  title: string;
  description: string;
  slug: string;
  duration?: string;
  difficulty?: string;
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: title,
        description,
        url: `${SITE.url}/internships/${slug}`,
        provider: { "@id": `${SITE.url}#organization` },
        educationalLevel: difficulty,
        // Saying it is free explicitly is what stops an answer engine hedging
        // with "pricing not stated".
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "INR",
          category: "Free",
          availability: "https://schema.org/InStock",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: duration,
        },
      }}
    />
  );
}

export function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map(({ name, path }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          item: `${SITE.url}${path}`,
        })),
      }}
    />
  );
}
