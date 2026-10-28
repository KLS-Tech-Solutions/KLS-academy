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
  tagline:
    "Free, open-source virtual internships with free chapter-wise learning material",
  /** MIT. Named here so the licence claim has one source. */
  license: "https://opensource.org/licenses/MIT",
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
      "Yes. KLS Academy is completely free. There is no enrolment fee, no certificate fee, and no payment of any kind at any stage. We never ask for card or bank details. The platform itself is open source under the MIT licence.",
  },
  {
    question: "Does KLS Academy provide free study material?",
    answer:
      "Yes. Every internship domain includes a full set of chapter-wise study notes as downloadable PDFs, ordered from beginner to advanced. They are free, they are yours to keep, and you get them the moment you sign up — you do not have to enrol, finish anything, or pay to unlock them.",
  },
  {
    question: "How do I start learning on KLS Academy?",
    answer:
      "Sign up with your name, email and date of birth. That is the whole gate. You can then read the chapter-wise PDF notes for any domain, and enrol in an internship whenever you are ready to start the project tasks.",
  },
  {
    question: "What is the KLS Academy learning roadmap?",
    answer:
      "Each domain has a chapter-by-chapter roadmap that runs from beginner to advanced. You read the chapters in order as downloadable PDFs, then apply them on the internship's technical tasks, which are reviewed by a KLS engineer. Learning and doing sit in the same place.",
  },
  {
    question: "How do I get a certificate from KLS Academy?",
    answer:
      "Enrol in a domain, share your offer letter on LinkedIn for verification, then complete each technical task. Every submission is reviewed by a KLS engineer. Your certificate is issued automatically the moment your final task is approved, at no cost.",
  },
  {
    question: "Are KLS Academy certificates verifiable by employers?",
    answer:
      "Yes. Every certificate carries a unique number and a QR code linking to a public verification page. An employer can confirm it independently in seconds, without contacting KLS Tech Solutions and without needing an account.",
  },
  {
    question: "Is KLS Academy open source?",
    answer:
      "Yes. The KLS Academy platform is released under the MIT licence, so anyone can read the code, run their own instance, or contribute to it. The KLS Tech Solutions name, logo and seal are not covered by that licence, and only certificates verifiable at academy.klstechsolutions.in were issued by us.",
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
    question: "What happens if my submission is rejected?",
    answer:
      "You get specific written feedback and can resubmit. There is no limit on resubmissions and no penalty for one. The aim is to get the work right, not to fail you.",
  },
  {
    question: "Can I do more than one internship at KLS Academy?",
    answer:
      "Yes. Once your current internship is complete and your certificate is issued, you can start another in a different domain. Every certificate and offer letter you earn stays downloadable for good.",
  },
  {
    question: "Who can join KLS Academy?",
    answer:
      "Anyone aged 18 or over can register. We ask for a date of birth because India's Digital Personal Data Protection Act, 2023 requires verifiable parental consent to process data belonging to under-18s, which we do not collect.",
  },
  {
    question: "Who runs KLS Academy?",
    answer:
      "KLS Academy is the learning division of KLS Tech Solutions, an MSME registered organisation based in Bangalore, India, which builds IoT, SaaS and AI products.",
  },
];
