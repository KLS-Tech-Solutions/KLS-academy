import { z } from "zod";
import {
  fullName,
  githubProfileUrl,
  linkedinProfileUrl,
  optionalField,
  phone,
} from "./common";

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduate",
  "Postgraduate",
] as const;

export const profileSchema = z.object({
  full_name: fullName,
  phone,
  college_name: z
    .string()
    .trim()
    .min(3, "Enter your college name")
    .max(150, "Keep this under 150 characters"),
  degree: z.string().trim().min(2, "Enter your degree").max(60, "Keep this short"),
  branch: z.string().trim().min(2, "Enter your branch").max(80, "Keep this short"),
  year: z.enum(YEAR_OPTIONS, { error: "Select your year of study" }),
  linkedin_url: optionalField(linkedinProfileUrl),
  github_url: optionalField(githubProfileUrl),
});
export type ProfileValues = z.input<typeof profileSchema>;
