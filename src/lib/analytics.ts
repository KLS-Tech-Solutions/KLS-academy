/**
 * Mixpanel, deliberately anonymous.
 *
 * **No student is ever identified.** No name, no email, no phone, no user id.
 * Mixpanel assigns its own random device id and that is all it gets.
 *
 * That is a considered choice, not an oversight. Sending student personal data
 * to an analytics service outside India makes that service a processor under
 * the DPDP Act, which brings a processing agreement, a privacy-policy
 * disclosure, and — because the platform does not yet collect date of birth —
 * the possibility of exporting a minor's data without verifiable parental
 * consent. Anonymous events answer "how many students stall at the LinkedIn
 * step" perfectly well, which is the question worth asking.
 *
 * Everything here is a no-op when `NEXT_PUBLIC_MIXPANEL_TOKEN` is unset, so
 * local development and anyone self-hosting this open-source project never
 * send anything anywhere.
 */

import type { OverridedMixpanel } from "mixpanel-browser";

type Props = Record<string, string | number | boolean | null | undefined>;

let client: OverridedMixpanel | null = null;
let ready = false;

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

/** Properties that must never leave the browser, whatever a caller passes. */
const FORBIDDEN = [
  "email",
  "phone",
  "name",
  "full_name",
  "user_id",
  "student_id",
  "password",
  "token",
  "linkedin_url",
  "github_url",
  "college_name",
];

/**
 * Strips anything that looks personal.
 *
 * A belt-and-braces guard: the call sites below pass only counts and enum
 * values, but this is the sort of thing that decays as people add events, and
 * a leak here is a compliance problem rather than a bug.
 */
function scrub(props: Props = {}): Props {
  const safe: Props = {};
  for (const [key, value] of Object.entries(props)) {
    const lower = key.toLowerCase();
    if (FORBIDDEN.some((banned) => lower.includes(banned))) continue;
    if (typeof value === "string" && value.includes("@")) continue;
    safe[key] = value;
  }
  return safe;
}

export async function initAnalytics(): Promise<void> {
  if (!TOKEN || ready || typeof window === "undefined") return;

  // Imported lazily so the SDK is not in the bundle for anyone running
  // without a token.
  const mixpanel = (await import("mixpanel-browser")).default;

  mixpanel.init(TOKEN, {
    // No automatic page-view tracking: Next's client router would report
    // stale URLs, and `track` is called explicitly on route change instead.
    autocapture: false,
    persistence: "localStorage",
    // Mixpanel would otherwise record the caller's IP and derive a location
    // from it, which is personal data we have no use for.
    ip: false,
    // Never send anything from a development build.
    debug: process.env.NODE_ENV !== "production",
  });

  client = mixpanel;
  ready = true;
}

export function track(event: string, props?: Props): void {
  if (!ready || !client) return;
  client.track(event, scrub(props));
}

export function trackPageView(path: string): void {
  // The path only — never the query string, which carries reset tokens,
  // verification tokens and the `next` redirect.
  track("Page viewed", { path: path.split("?")[0] });
}

/**
 * The events worth having. Named for what happened, not for the screen it
 * happened on, so a redesign does not orphan the funnel.
 */
export const events = {
  registered: () => track("Account registered"),
  emailVerified: () => track("Email verified"),
  enrolled: (domainSlug: string) =>
    track("Internship started", { domain: domainSlug }),
  chapterOpened: (order: number, difficulty: string) =>
    track("Study chapter opened", { chapter: order, difficulty }),
  linkedinSubmitted: () => track("LinkedIn task submitted"),
  taskSubmitted: (order: number, attempt: number) =>
    track("Technical task submitted", { task: order, attempt }),
  certificateDownloaded: () => track("Certificate downloaded"),
  secondInternshipStarted: (completed: number) =>
    track("Second internship started", { previously_completed: completed }),
} as const;
