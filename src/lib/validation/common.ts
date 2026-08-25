import { z } from "zod";

/* ==========================================================================
   Shared field rules. Every constraint here mirrors a database constraint or
   a business rule from the MVP spec — keep the two in step.
   ========================================================================== */

export const MIN_SCREENSHOTS = 3;
export const MAX_SCREENSHOTS = 8;
export const MAX_SCREENSHOT_MB = 5;
export const MIN_EXPLANATION = 120;
export const MAX_EXPLANATION = 5000;

export const fullName = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(100, "Name must be under 100 characters")
  .regex(/^[\p{L}][\p{L}\s.'-]*$/u, "Use letters, spaces, hyphens and apostrophes only");

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(255, "Email must be under 255 characters")
  .pipe(z.email("Enter a valid email address"));

/** Indian mobile number, with or without the +91 prefix. */
export const phone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .transform((value) => value.replace(/[\s-()]/g, ""))
  .pipe(
    z
      .string()
      .regex(
        /^(\+91)?[6-9]\d{9}$/,
        "Enter a valid 10-digit Indian mobile number",
      ),
  );

/**
 * The same rule, but the field may be left empty.
 *
 * Nothing in the platform sends an SMS or places a call — every workflow runs
 * on email — so requiring a number was collecting personal data with no use
 * for it. Still validated when given: a number that is present and wrong is
 * worse than no number, because it looks like a way to reach someone.
 *
 * Empty becomes `undefined`, not `""`, so the API stores NULL rather than a
 * blank that later reads as "they gave us a number".
 */
export const optionalPhone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-()]/g, ""))
  .refine(
    (value) => value === "" || /^(\+91)?[6-9]\d{9}$/.test(value),
    "Enter a valid 10-digit Indian mobile number, or leave this blank",
  )
  .transform((value) => (value === "" ? undefined : value))
  // `.optional()` on the outside, so the key may be absent altogether and not
  // merely empty. Without it the field is still required — it just has to be
  // present and blank, which is not what "optional" means to anything calling
  // this, and it would reject a payload that the API accepts happily.
  .optional();

/**
 * States and union territories of India.
 *
 * A picker rather than a free-text box, because "Karnataka", "karnataka",
 * "KA" and "Bangalore" in the same column make the data useless for the one
 * thing it is for — knowing where students are coming from.
 */
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union territories.
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
] as const;

/**
 * Countries offered in the picker.
 *
 * Not the full ISO list. India first because that is nearly everyone, then the
 * places students most often write from, then an escape hatch — a 195-entry
 * dropdown to choose the obvious answer is worse than a short one that admits
 * it is short.
 */
export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "United Arab Emirates", "Singapore", "Germany", "Nepal", "Sri Lanka",
  "Bangladesh", "Other",
] as const;

export const state = z
  .string()
  .trim()
  .min(1, "Select your state")
  .max(80, "State must be under 80 characters");

export const country = z
  .string()
  .trim()
  .min(1, "Select your country")
  .max(80, "Country must be under 80 characters");

/**
 * The minimum age to register.
 *
 * The DPDP Act 2023 treats anyone under 18 as a child and requires verifiable
 * parental consent before their data may be processed. We have no consent
 * mechanism, so we do not take their data at all. Mirrors `MINIMUM_AGE` on
 * the API — the server is the authority, this is here so the person finds out
 * before submitting rather than after.
 */
export const MINIMUM_AGE = 18;

/**
 * Completed years between two dates.
 *
 * Reads UTC components throughout. Both arguments are built from `Date.UTC`,
 * and mixing in a local getter here would shift the month and day by a day in
 * any zone west of Greenwich — enough to move a birthday across the boundary.
 */
function completedYears(born: Date, today: Date): number {
  const hadBirthday =
    today.getUTCMonth() > born.getUTCMonth() ||
    (today.getUTCMonth() === born.getUTCMonth() &&
      today.getUTCDate() >= born.getUTCDate());
  return today.getUTCFullYear() - born.getUTCFullYear() - (hadBirthday ? 0 : 1);
}

/**
 * Date of birth, as an `<input type="date">` gives it: `YYYY-MM-DD`.
 *
 * Parsed with `Date.UTC` rather than `new Date(string)`, because the latter
 * reads a bare date string as UTC midnight and then reports it in local time —
 * which in India (UTC+5:30) is the same day, but west of Greenwich is the day
 * before. A birthday that shifts by a day decides the boundary case wrongly.
 */
export const dateOfBirth = z
  .string()
  .min(1, "Date of birth is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth")
  .superRefine((value, ctx) => {
    const [year, month, day] = value.split("-").map(Number);
    const born = new Date(Date.UTC(year, month - 1, day));

    // Rejects 2026-02-31, which the constructor would roll forward to March.
    if (
      born.getUTCFullYear() !== year ||
      born.getUTCMonth() !== month - 1 ||
      born.getUTCDate() !== day
    ) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date of birth" });
      return;
    }

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );

    if (born > today) {
      ctx.addIssue({
        code: "custom",
        message: "Date of birth cannot be in the future",
      });
      return;
    }
    if (year < 1900) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date of birth" });
      return;
    }
    if (completedYears(born, today) < MINIMUM_AGE) {
      ctx.addIssue({
        code: "custom",
        message: `You must be at least ${MINIMUM_AGE} to register`,
      });
    }
  });

export const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Password must be under 72 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/\d/, "Include at least one number");

export const httpsUrl = z
  .string()
  .trim()
  .min(1, "This field is required")
  .pipe(z.url("Enter a valid URL"))
  .refine((value) => value.startsWith("https://"), "URL must start with https://");

/** A public repository, not just the GitHub domain. */
export const githubRepoUrl = z
  .string()
  .trim()
  .min(1, "GitHub repository URL is required")
  .pipe(z.url("Enter a valid URL"))
  .refine(
    (value) => /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(value),
    "Use the repository URL, e.g. https://github.com/username/repository",
  );

export const githubProfileUrl = z
  .string()
  .trim()
  .pipe(z.url("Enter a valid URL"))
  .refine(
    (value) => /^https:\/\/(www\.)?github\.com\/[\w.-]+\/?$/.test(value),
    "Use your profile URL, e.g. https://github.com/username",
  );

export const linkedinProfileUrl = z
  .string()
  .trim()
  .pipe(z.url("Enter a valid URL"))
  .refine(
    (value) => /^https:\/\/(www\.)?linkedin\.com\/in\/[\w%-]+\/?$/.test(value),
    "Use your profile URL, e.g. https://linkedin.com/in/username",
  );

/** A specific post, not a profile or feed root — the reviewer has to open it. */
export const linkedinPostUrl = z
  .string()
  .trim()
  .min(1, "LinkedIn post URL is required")
  .pipe(z.url("Enter a valid URL"))
  .refine(
    (value) =>
      /^https:\/\/(www\.)?linkedin\.com\/(posts\/[\w%-]+|feed\/update\/urn:li:[\w:]+)\/?/.test(
        value,
      ),
    "Link directly to the post, e.g. https://linkedin.com/posts/…",
  );

/**
 * A certificate number: `KLS-CERT-` plus ten Crockford Base32 characters.
 *
 * The alphabet excludes I, L, O and U, so a number read off a printed
 * certificate cannot be mistyped into a different valid one. This regex must
 * track `ALPHABET` and `LENGTH` in `app/services/numbering.py` — it replaced
 * a pattern for the old sequential `KLS-ACAD-2026-00184` scheme, which by then
 * matched nothing the platform issues and rejected every real number before it
 * reached the server.
 */
export const certificateNumber = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, "Certificate number is required")
  .regex(
    /^KLS-CERT-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{10}$/,
    "Certificate numbers look like KLS-CERT-7F3K9QM2XZ",
  );

/** Optional text field: empty string is allowed, anything else must validate. */
export function optionalField<T extends z.ZodType>(schema: T) {
  return z
    .union([z.literal(""), schema])
    .transform((value) => (value === "" ? undefined : value));
}
