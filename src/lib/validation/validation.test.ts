import { describe, expect, it } from "vitest";

import {
  MINIMUM_AGE,
  certificateNumber,
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
  /** A date of birth `years` years and `days` days before today. */
  const dob = (years: number, days = 0) => {
    const now = new Date();
    const d = new Date(
      Date.UTC(now.getFullYear() - years, now.getMonth(), now.getDate() - days),
    );
    return d.toISOString().slice(0, 10);
  };

  const valid = {
    full_name: "Ananya Rao",
    email: "ananya@example.com",
    phone: "9845012345",
    // Derived, not written out. A literal date is an adult today and a test
    // failure in some future year.
    date_of_birth: dob(22),
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

  describe("date of birth", () => {
    it("requires one", () => {
      const { date_of_birth: _omitted, ...without } = valid;
      expect(registerSchema.safeParse(without).success).toBe(false);
      expect(
        registerSchema.safeParse({ ...valid, date_of_birth: "" }).success,
      ).toBe(false);
    });

    it("accepts someone exactly at the minimum age", () => {
      // The boundary in the direction that matters. Rejecting an adult on
      // their eighteenth birthday is a bug they cannot work around.
      expect(
        registerSchema.safeParse({ ...valid, date_of_birth: dob(MINIMUM_AGE) })
          .success,
      ).toBe(true);
    });

    it("rejects someone one day short of it", () => {
      const result = registerSchema.safeParse({
        ...valid,
        date_of_birth: dob(MINIMUM_AGE, -1),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // The message must say why, not "invalid" — otherwise they retype the
        // same date in three formats and give up.
        expect(result.error.issues[0].message).toContain(String(MINIMUM_AGE));
      }
    });

    it("rejects a child", () => {
      expect(
        registerSchema.safeParse({ ...valid, date_of_birth: dob(14) }).success,
      ).toBe(false);
    });

    it("rejects a future date", () => {
      const result = registerSchema.safeParse({
        ...valid,
        date_of_birth: dob(-1),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message.toLowerCase()).toContain("future");
      }
    });

    it("rejects a day that does not exist", () => {
      // `new Date("2000-02-31")` rolls forward to 2 March rather than failing,
      // so this has to be checked explicitly.
      for (const bad of ["2000-02-31", "2000-13-01", "2000-00-10"]) {
        expect(
          registerSchema.safeParse({ ...valid, date_of_birth: bad }).success,
        ).toBe(false);
      }
    });

    it("rejects a mistyped year", () => {
      expect(
        registerSchema.safeParse({ ...valid, date_of_birth: "1025-06-15" })
          .success,
      ).toBe(false);
    });

    it("rejects anything that is not YYYY-MM-DD", () => {
      for (const bad of ["15/06/2000", "2000-6-1", "not a date"]) {
        expect(
          registerSchema.safeParse({ ...valid, date_of_birth: bad }).success,
        ).toBe(false);
      }
    });
  });
});

describe("certificateNumber", () => {
  /**
   * This regex is the public verification form's front door. It once still
   * matched the old sequential `KLS-ACAD-2026-00184` scheme long after the API
   * had moved to random Crockford Base32, which meant it rejected every real
   * certificate before the request was ever sent.
   */
  it("accepts a number in the format the API issues", () => {
    expect(certificateNumber.safeParse("KLS-CERT-7F3K9QM2XZ").success).toBe(true);
  });

  it("accepts it in lower case", () => {
    // People paste from a PDF, or type it out. Case is not information here.
    const result = certificateNumber.safeParse("kls-cert-7f3k9qm2xz");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("KLS-CERT-7F3K9QM2XZ");
  });

  it("rejects the retired sequential format", () => {
    expect(certificateNumber.safeParse("KLS-CERT-2026-00184").success).toBe(false);
  });

  it("rejects the characters the alphabet deliberately excludes", () => {
    // I, L, O and U are not in Crockford Base32 — the whole reason being that
    // they are the ones misread off a printed certificate.
    for (const bad of [
      "KLS-CERT-IIIIIIIIII",
      "KLS-CERT-LLLLLLLLLL",
      "KLS-CERT-OOOOOOOOOO",
      "KLS-CERT-UUUUUUUUUU",
    ]) {
      expect(certificateNumber.safeParse(bad).success).toBe(false);
    }
  });

  it("rejects a suffix of the wrong length", () => {
    expect(certificateNumber.safeParse("KLS-CERT-7F3K9QM2X").success).toBe(false);
    expect(certificateNumber.safeParse("KLS-CERT-7F3K9QM2XZZ").success).toBe(false);
  });

  it("rejects an offer letter number", () => {
    // Same shape, different prefix. Offer letters are not verifiable.
    expect(certificateNumber.safeParse("KLS-ACAD-7F3K9QM2XZ").success).toBe(false);
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
