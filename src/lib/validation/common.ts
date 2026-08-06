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

export const certificateNumber = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, "Certificate number is required")
  .regex(
    /^KLS-ACAD-\d{4}-\d{5}$/,
    "Certificate numbers look like KLS-ACAD-2026-00184",
  );

/** Optional text field: empty string is allowed, anything else must validate. */
export function optionalField<T extends z.ZodType>(schema: T) {
  return z
    .union([z.literal(""), schema])
    .transform((value) => (value === "" ? undefined : value));
}
