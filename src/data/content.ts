/**
 * Static marketing copy. Lives in `data/` so it can move to a CMS later.
 *
 * One rule for everything in this file: it describes a platform that is free
 * and open source, where the study material is available on signup. Any
 * sentence implying a fee, a paywall, or a gate before the notes is wrong.
 */

import { FAQ } from "@/lib/seo";

/**
 * The visible FAQ.
 *
 * **Re-exported from `lib/seo.ts` rather than written out again**, and that is
 * the entire point. There used to be two arrays — one rendered in the
 * accordion, one emitted as FAQPage JSON-LD — and they drifted: the structured
 * data told Google the platform was free while the accordion on the same page
 * still promised a certificate fee. Beyond being untrue, mismatched FAQ schema
 * is exactly what Google demotes a rich result for. One array cannot disagree
 * with itself.
 */
export const faqs = FAQ;

/**
 * The student journey, in the order it happens.
 *
 * Reading the notes sits before the tasks because that is how the product
 * works — the material is available the moment an account exists, and the
 * technical work assumes it.
 */
export const journeySteps = [
  {
    title: "Sign up free",
    description: "Create your account in under a minute. No card, ever.",
  },
  {
    title: "Read the chapters",
    description:
      "Beginner-to-advanced study notes, as PDFs you download and keep.",
  },
  {
    title: "Choose a domain",
    description: "Pick the internship track that matches where you're heading.",
  },
  {
    title: "Get your offer letter",
    description: "A branded PDF offer letter is generated instantly.",
  },
  {
    title: "Share on LinkedIn",
    description: "Post your offer letter and submit the link for verification.",
  },
  {
    title: "Build real projects",
    description: "Work through technical tasks written from real briefs.",
  },
  {
    title: "Get reviewed",
    description:
      "A KLS engineer approves your work or returns it with specific notes.",
  },
  {
    title: "Earn your certificate",
    description:
      "Issued automatically when your last task is approved. Free, QR-verified.",
  },
];

export const whyKls = [
  {
    icon: "book",
    title: "Free learning library",
    description:
      "Chapter-wise study notes for every domain, beginner to advanced, as downloadable PDFs. Available the moment you sign up — no enrolment required to start reading.",
  },
  {
    icon: "briefcase",
    title: "Real project work",
    description:
      "Every task mirrors work our engineers actually do — no quizzes, no video-only modules, no certificate for watching something.",
  },
  {
    icon: "user-check",
    title: "Reviewed by humans",
    description:
      "A KLS engineer reads your code and your explanation, then approves it or returns it with specific notes. Nothing here is auto-graded.",
  },
  {
    icon: "shield-check",
    title: "Verifiable credentials",
    description:
      "Every certificate carries a unique number and a QR code that anyone can verify publicly, with no login and no email to us.",
  },
  {
    icon: "wallet",
    title: "Free, with nothing held back",
    description:
      "No enrolment fee, no certificate fee, no premium tier and no card details. The whole platform is free for everyone, permanently.",
  },
  {
    icon: "code",
    title: "Open source",
    description:
      "Released under the MIT licence. Read the code, run your own instance, or contribute — how your work is reviewed and stored is not a black box.",
  },
];

/**
 * The learning roadmap, as three rungs.
 *
 * Deliberately generic: the real chapters are per-domain and managed by admins,
 * so naming specific ones here would be a promise the catalogue has to keep.
 * What is true for every domain is the shape — ordered, cumulative, and it
 * ends where the internship tasks begin.
 */
export const roadmapStages = [
  {
    level: "Beginner",
    title: "Foundations",
    description:
      "The language, the tools and the vocabulary. Written for someone starting the domain from zero, with nothing assumed.",
    outcomes: [
      "Set up a working environment",
      "Core concepts, explained plainly",
      "Your first working build",
    ],
  },
  {
    level: "Intermediate",
    title: "Building properly",
    description:
      "Structure, patterns and the practices that separate code that runs from code someone else can work on.",
    outcomes: [
      "Project structure and conventions",
      "Working with data and APIs",
      "Testing and debugging",
    ],
  },
  {
    level: "Advanced",
    title: "Production thinking",
    description:
      "The parts most tutorials stop before: performance, security, deployment, and the judgement calls in between.",
    outcomes: [
      "Performance and security",
      "Deployment and operations",
      "Reviewing and being reviewed",
    ],
  },
];
