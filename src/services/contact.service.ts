import { apiRequest, withMock } from "@/lib/api";
import type { ContactValues } from "@/lib/validation";

/** POST /contact — public, no session required. */
export function sendContactMessage(values: ContactValues) {
  return withMock<{ ok: true }>(
    () => ({ ok: true }),
    () => apiRequest("/contact", { method: "POST", body: values }),
    700,
  );
}
