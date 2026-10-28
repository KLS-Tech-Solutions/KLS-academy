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

/**
 * Which message reaches the screen.
 *
 * The bug this guards against: every 401 and 403 returned boilerplate, so a
 * wrong password on the sign-in page read "Your session has expired. Sign in
 * again to continue." — advice that makes no sense where it appeared, and
 * which hides the real reason. A suspended account read "You don't have access
 * to this", which sends someone to support for a problem support cannot see.
 */
describe("which message is shown", () => {
  it("keeps the API's wording for a refused account", () => {
    const error = parseErrorBody(403, { detail: "This account has been suspended" });
    expect(error.userMessage).toBe("This account has been suspended");
  });

  it("keeps the API's wording for a closed account", () => {
    const error = parseErrorBody(403, { detail: "This account has been closed" });
    expect(error.userMessage).toBe("This account has been closed");
  });

  it("exposes the API's wording separately for sign-in to use", () => {
    // The sign-in screen knows a 401 means bad credentials rather than an
    // expired session, so it reads this instead of `userMessage`.
    const error = parseErrorBody(401, { detail: "Incorrect email or password" });
    expect(error.serverMessage).toBe("Incorrect email or password");
  });

  it("still shows session copy for a 401 with no useful detail", () => {
    // An ordinary page load with an expired token. "Token is invalid" belongs
    // in a log, not on screen.
    const error = parseErrorBody(401, { detail: "Token is invalid" });
    expect(error.userMessage).toBe("Your session has expired. Sign in again to continue.");
  });

  it("never shows the server's words for a 500", () => {
    // A 5xx body can carry a traceback or an SQL fragment. That tells an
    // attacker more than it tells a student.
    const error = parseErrorBody(500, {
      detail: 'relation "users" does not exist at character 15',
    });
    expect(error.userMessage).toBe(
      "Something went wrong on our side. Please try again shortly.",
    );
    expect(error.userMessage).not.toContain("users");
  });

  it("has no serverMessage when the API sent no sentence", () => {
    expect(parseErrorBody(500, undefined).serverMessage).toBeNull();
    expect(parseErrorBody(422, { detail: [{ loc: ["body"], msg: "bad" }] }).serverMessage)
      .toBeNull();
  });

  it("surfaces a duplicate-email conflict as the API worded it", () => {
    // Registration raises 409 for exactly one reason, and the form puts this
    // on the email input rather than in a banner.
    const error = parseErrorBody(409, {
      detail: "An account with this email already exists",
    });
    expect(error.kind).toBe("conflict");
    expect(error.userMessage).toBe("An account with this email already exists");
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
