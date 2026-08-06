import { z } from "zod";
import {
  MAX_EXPLANATION,
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_MB,
  MIN_EXPLANATION,
  MIN_SCREENSHOTS,
  githubRepoUrl,
  httpsUrl,
  linkedinPostUrl,
  optionalField,
} from "./common";

export const linkedinSubmissionSchema = z.object({
  linkedin_post_url: linkedinPostUrl,
});
export type LinkedInSubmissionValues = z.input<typeof linkedinSubmissionSchema>;

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

/** One uploaded screenshot, held locally until Phase 3 sends it to R2. */
export const screenshotSchema = z.object({
  id: z.string(),
  file: z
    .instanceof(File, { error: "Attach an image file" })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Screenshots must be PNG, JPG or WebP",
    )
    .refine(
      (file) => file.size <= MAX_SCREENSHOT_MB * 1024 * 1024,
      `Each screenshot must be under ${MAX_SCREENSHOT_MB} MB`,
    ),
  previewUrl: z.string(),
});

export const taskSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Give your project a descriptive title")
    .max(120, "Keep the title under 120 characters"),
  github_url: githubRepoUrl,
  live_demo_url: optionalField(httpsUrl),
  description: z
    .string()
    .trim()
    .min(
      MIN_EXPLANATION,
      `Explain your implementation in at least ${MIN_EXPLANATION} characters`,
    )
    .max(MAX_EXPLANATION, `Keep your explanation under ${MAX_EXPLANATION} characters`),
  screenshots: z
    .array(screenshotSchema)
    .min(MIN_SCREENSHOTS, `Attach at least ${MIN_SCREENSHOTS} screenshots`)
    .max(MAX_SCREENSHOTS, `Attach no more than ${MAX_SCREENSHOTS} screenshots`),
});
export type TaskSubmissionValues = z.input<typeof taskSubmissionSchema>;
