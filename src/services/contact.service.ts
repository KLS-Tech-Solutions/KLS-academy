import { apiRequest } from "@/lib/api/client";
import type { ContactValues } from "@/lib/validation";

/** POST /contact — public. */
export function sendContactMessage(values: ContactValues) {
  return apiRequest<{ ok: true }>("/contact", { method: "POST", body: values });
}
