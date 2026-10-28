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
          "Free and open source virtual internships. Chapter-wise study notes as downloadable PDFs from beginner to advanced in every domain, engineer-reviewed project work, and QR-verified certificates. No fee at any stage.",
        slogan: SITE.tagline,
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
        // The free chapter-wise notes that come with this domain. Attached to
        // the Course so a crawler reading a single domain page still learns
        // that study material is included at no cost.
        hasPart: { "@id": `${SITE.url}#learning-material` },
        teaches: [
          "Practical project work reviewed by an engineer",
          "Domain fundamentals through to production practice",
        ],
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: duration,
          // A free course instance needs its own zero price; Google reads the
          // instance separately from the course.
          offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "INR",
            category: "Free",
          },
        },
      }}
    />
  );
}

/**
 * The free chapter-wise study notes, described as a `LearningResource`.
 *
 * Separate from `CourseSchema` on purpose. The notes are not the internship:
 * they are available on signup, without enrolling and without finishing
 * anything, and describing them as part of a Course would imply a gate that
 * does not exist. `isAccessibleForFree` and an explicit zero-price offer are
 * what stop an answer engine hedging with "pricing not stated" — the single
 * most common way a genuinely free product gets described as possibly paid.
 */
export function LearningResourceSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "@id": `${SITE.url}#learning-material`,
        name: "KLS Academy chapter-wise study notes",
        description:
          "Chapter-wise study notes for every internship domain, ordered from beginner to advanced and downloadable as PDFs. Free to anyone with a KLS Academy account; no enrolment or payment required to read them.",
        url: `${SITE.url}/#learning`,
        provider: { "@id": `${SITE.url}#organization` },
        learningResourceType: ["Study notes", "Reading material"],
        educationalLevel: ["Beginner", "Intermediate", "Advanced"],
        encodingFormat: "application/pdf",
        inLanguage: "en",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "INR",
          category: "Free",
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

/**
 * The platform itself, as `SoftwareSourceCode`.
 *
 * "Open source" is a claim a crawler cannot check from prose. A licence field
 * it can.
 */
export function OpenSourceSchema() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: SITE.name,
        description:
          "KLS Academy, the virtual internship and learning platform, released as open source under the MIT licence.",
        url: SITE.url,
        license: SITE.license,
        author: { "@id": `${SITE.url}#organization` },
        isAccessibleForFree: true,
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
