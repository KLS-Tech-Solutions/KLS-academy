import type { Metadata } from "next";

/**
 * One place for everything the site says about itself.
 *
 * Search engines, social cards and the JSON-LD graph all draw from here, so a
 * change to the tagline or the contact address cannot end up applied in three
 * places and forgotten in a fourth.
 */
export const SITE = {
  name: "KLS Academy",
  url: "https://academy.klstechsolutions.in",
  company: "https://www.klstechsolutions.in",
  legalName: "KLS Tech Solutions",
  email: "klstechsolutions2025@gmail.com",
  locality: "Bangalore",
  region: "Karnataka",
  postalCode: "560027",
  country: "IN",
  tagline: "Free verified virtual internships",
} as const;

/**
 * Page metadata with the canonical URL filled in.
 *
 * Every public page must declare a canonical. Without one, the same page
 * reachable with a tracking parameter or a trailing slash competes with itself
 * in the index.
 */
export function pageMeta({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_IN",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: ["/og.png"],
    },
  };
}

/**
 * Questions phrased the way people actually ask them.
 *
 * This is the GEO and AEO surface. An answer engine — Google's AI overview,
 * ChatGPT, Perplexity — lifts a short, self-contained, factual answer far more
 * readily than it summarises a marketing paragraph. Each answer below stands
 * on its own without the question, because that is how they get quoted.
 */
export const FAQ: { question: string; answer: string }[] = [
  {
    question: "Is KLS Academy free?",
    answer:
      "Yes. KLS Academy is completely free. There is no enrolment fee, no certificate fee and no payment of any kind at any stage. The platform is open source under the MIT licence.",
  },
  {
    question: "How do I get a certificate from KLS Academy?",
    answer:
      "Enrol in a domain, share your offer letter on LinkedIn for verification, then complete each technical task. Every submission is reviewed by a KLS engineer. Your certificate is issued automatically the moment your final task is approved.",
  },
  {
    question: "Are KLS Academy certificates verifiable by employers?",
    answer:
      "Yes. Every certificate carries a unique number and a QR code linking to a public verification page. An employer can confirm it independently in seconds, without contacting KLS Tech Solutions.",
  },
  {
    question: "How long does a KLS Academy internship take?",
    answer:
      "Most domains run for four to eight weeks, self-paced within the batch window. You set your own hours. The next task unlocks as soon as you submit the previous one, so waiting for a review never stops you working.",
  },
  {
    question: "What do I need to submit for each task?",
    answer:
      "Typically a public GitHub repository, at least three screenshots of your working project, and a short written explanation of what you built and why. The exact requirements are shown on each task.",
  },
  {
    question: "Do I get study material?",
    answer:
      "Yes. Each domain includes chapter-wise study notes as downloadable PDFs, ordered from beginner to advanced. They are optional but strongly recommended before starting the technical tasks.",
  },
  {
    question: "Can I do more than one internship at KLS Academy?",
    answer:
      "Yes. Once your current internship is complete and your certificate is issued, you can start another in a different domain. Every certificate and offer letter you earn stays downloadable for good.",
  },
  {
    question: "Who runs KLS Academy?",
    answer:
      "KLS Academy is the learning division of KLS Tech Solutions, an MSME registered organisation based in Bangalore, India.",
  },
];
