import { describe, expect, it } from "vitest";

import { ApiError, isApiError, parseErrorBody } from "@/lib/api/errors";

/**
 * Error mapping.
 *
 * Every failure the student sees comes through here. FastAPI returns three
 * different shapes for `detail` — a string, a list of validation objects, or
 * nothing at all — and each one has to become a sentence a person can read.
 * When this is wrong the symptom is "[object Object]" on screen, which tells
 * the student nothing and us nothing.
 */
describe("parseErrorBody", () => {
  it("uses a plain string detail as the message", () => {
    const error = parseErrorBody(409, { detail: "You already hold an internship" });
    expect(error.userMessage).toBe("You already hold an internship");
  });

  it("flattens FastAPI's validation array into readable text", () => {
    const error = parseErrorBody(422, {
      detail: [
        { loc: ["body", "email"], msg: "value is not a valid email address", type: "value_error" },
      ],
    });
    expect(error.userMessage).toContain("email");
    expect(error.userMessage).not.toContain("[object Object]");
  });

  it("never renders an object into the message", () => {
    // The shape that produced "[object Object]" on screen.
    const error = parseErrorBody(422, { detail: [{ loc: ["body"], msg: "bad", type: "x" }] });
    expect(error.userMessage).not.toMatch(/\[object/);
  });

  it("falls back to something sensible when there is no body", () => {
    const error = parseErrorBody(500, undefined);
    expect(error.userMessage.length).toBeGreaterThan(0);
    expect(error.userMessage).not.toContain("undefined");
  });

  it("classifies statuses so callers can branch without reading numbers", () => {
    expect(parseErrorBody(401, {}).kind).toBe("unauthorized");
    expect(parseErrorBody(403, {}).kind).toBe("forbidden");
    expect(parseErrorBody(404, {}).kind).toBe("not_found");
    expect(parseErrorBody(422, {}).kind).toBe("validation");
    expect(parseErrorBody(500, {}).kind).toBe("server");
  });

  it("keeps the status code for anything that needs the detail", () => {
    expect(parseErrorBody(429, { detail: "Too many attempts" }).status).toBe(429);
  });
});

describe("isApiError", () => {
  it("recognises our own errors", () => {
    expect(isApiError(parseErrorBody(400, { detail: "no" }))).toBe(true);
    expect(
      isApiError(new ApiError({ message: "x", kind: "network", status: 0 })),
    ).toBe(true);
  });

  it("rejects anything else", () => {
    // The guard exists so `catch (e)` blocks can safely read `userMessage`.
    // A plain Error slipping through is how undefined reaches the UI.
    expect(isApiError(new Error("ordinary"))).toBe(false);
    expect(isApiError("a string")).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
    expect(isApiError({ userMessage: "impostor" })).toBe(false);
  });
});
