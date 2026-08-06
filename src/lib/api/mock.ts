import { USE_MOCKS } from "./config";
import { delay } from "@/lib/utils";

/**
 * Wraps a service call so it resolves from local mock data while
 * NEXT_PUBLIC_USE_MOCKS is on, and hits the API once it's off.
 *
 *   export const listDomains = () =>
 *     withMock(() => mockDomains, () => apiRequest("/internship-domains"));
 *
 * Every service reads the same way whichever mode it's in, which is what makes
 * the cutover a one-line env change rather than a rewrite.
 */
export async function withMock<T>(
  mock: () => T | Promise<T>,
  live: () => Promise<T>,
  latencyMs = 300,
): Promise<T> {
  if (USE_MOCKS) {
    await delay(latencyMs);
    return mock();
  }
  return live();
}
