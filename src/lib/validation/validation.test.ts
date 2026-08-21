import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation";

/**
 * Registration and password rules.
 *
 * These are a convenience — the API validates everything again — but they are
 * what a student actually experiences. A rule that is stricter here than on the
 * server rejects a perfectly good password with no explanation; looser, and the
 * form says fine and the server says no.
 */
describe("registerSchema", () => {
  const valid = {
    full_name: "Ananya Rao",
    email: "ananya@example.com",
    phone: "9845012345",
    password: "kls12345",
    confirm_password: "kls12345",
    accept_terms: true,
  };

  it("accepts a realistic registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a malformed email", () => {
    for (const email of ["not-an-email", "missing@tld", "@example.com", ""]) {
      expect(registerSchema.safeParse({ ...valid, email }).success).toBe(false);
    }
  });

  it("rejects a password shorter than the server's minimum", () => {
    // The API enforces 8. Anything shorter accepted here becomes a 422 the
    // student cannot act on.
    const short = "kls1234";
    expect(short.length).toBe(7);
    const result = registerSchema.safeParse({
      ...valid,
      password: short,
      confirm_password: short,
    });
    expect(result.success).toBe(false);
  });

  it("requires the two passwords to match", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirm_password: "somethingelse",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // The message has to land on the confirm field, or it appears under the
      // wrong input and reads like the first password is wrong.
      const paths = result.error.issues.flatMap((i) => i.path);
      expect(paths).toContain("confirm_password");
    }
  });

  it("requires the terms to be accepted", () => {
    expect(
      registerSchema.safeParse({ ...valid, accept_terms: false }).success,
    ).toBe(false);
  });

  it("rejects a name too short to be one", () => {
    expect(registerSchema.safeParse({ ...valid, full_name: "A" }).success).toBe(
      false,
    );
  });
});

describe("loginSchema", () => {
  it("accepts an email and any non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "ananya@example.com",
      password: "kls12345",
      remember: false,
    });
    expect(result.success).toBe(true);
  });

  it("does not apply the registration password rules to signing in", () => {
    // An account created before the rules tightened must still be able to log
    // in. Applying the strength rule here would lock those people out of
    // their own accounts with no route to a reset.
    const result = loginSchema.safeParse({
      email: "old@example.com",
      password: "short",
      remember: false,
    });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordSchema", () => {
  it("enforces the same strength as registration", () => {
    expect(
      resetPasswordSchema.safeParse({ password: "abc", confirm_password: "abc" })
        .success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        password: "kls12345",
        confirm_password: "kls12345",
      }).success,
    ).toBe(true);
  });

  it("requires confirmation to match", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "kls12345",
        confirm_password: "kls12346",
      }).success,
    ).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("needs a valid email and nothing else", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});
