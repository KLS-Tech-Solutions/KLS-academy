import { z } from "zod";
import { email, fullName, optionalField, phone } from "./common";

export const CONTACT_TOPICS = [
  "internship",
  "submission",
  "certificate",
  "partnership",
  "other",
] as const;

export const contactSchema = z.object({
  name: fullName,
  email,
  phone: optionalField(phone),
  topic: z.enum(CONTACT_TOPICS, { error: "Choose a topic" }),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters")
    .max(2000, "Keep your message under 2000 characters"),
});
export type ContactValues = z.input<typeof contactSchema>;
