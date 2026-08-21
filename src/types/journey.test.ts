import { describe, expect, it } from "vitest";

import { hasReached, JOURNEY_ORDER } from "@/types";
import type { JourneyStage } from "@/types";

/**
 * The journey gate.
 *
 * Every lock in the student dashboard is `hasReached(stage, target)`. Get this
 * wrong in one direction and a student sees a task they cannot do; wrong in the
 * other and they are stuck with no way forward and no error to explain it.
 * There is no server-side backstop for the UI — the API enforces its own rules,
 * but what the student can *see* is decided entirely here.
 */
describe("hasReached", () => {
  it("is true for the stage itself", () => {
    for (const stage of JOURNEY_ORDER) {
      expect(hasReached(stage, stage)).toBe(true);
    }
  });

  it("is true for every stage behind the current one", () => {
    expect(hasReached("tasks_in_progress", "not_enrolled")).toBe(true);
    expect(hasReached("tasks_in_progress", "enrolled")).toBe(true);
    expect(hasReached("tasks_in_progress", "linkedin_approved")).toBe(true);
  });

  it("is false for every stage ahead of it", () => {
    expect(hasReached("enrolled", "linkedin_approved")).toBe(false);
    expect(hasReached("linkedin_approved", "all_tasks_approved")).toBe(false);
    expect(hasReached("all_tasks_approved", "certificate_issued")).toBe(false);
  });

  it("orders the whole journey consistently", () => {
    // Every stage reaches everything before it and nothing after it. Written
    // as an exhaustive sweep rather than samples, because an ordering bug
    // tends to affect exactly one adjacent pair.
    JOURNEY_ORDER.forEach((stage, index) => {
      JOURNEY_ORDER.forEach((target, targetIndex) => {
        expect(hasReached(stage, target)).toBe(targetIndex <= index);
      });
    });
  });

  it("has no payment stage", () => {
    // The platform is free. A `paid` stage reappearing means the pivot has
    // been partly reverted, and locks would silently start referencing a
    // stage the API never returns.
    expect(JOURNEY_ORDER).not.toContain("paid" as JourneyStage);
    expect(JOURNEY_ORDER).not.toContain("payment_pending" as JourneyStage);
  });

  it("ends with the certificate", () => {
    expect(JOURNEY_ORDER.at(-1)).toBe("certificate_issued");
    expect(JOURNEY_ORDER.at(-2)).toBe("all_tasks_approved");
  });

  it("starts with not_enrolled", () => {
    expect(JOURNEY_ORDER[0]).toBe("not_enrolled");
    // Nothing is unlocked for someone who has not enrolled, beyond the
    // starting point itself.
    expect(hasReached("not_enrolled", "enrolled")).toBe(false);
  });
});
