import { ApiError, parseErrorBody } from "@/lib/api/errors";
import type { User } from "@/types";
import type { LoginValues, RegisterValues } from "@/lib/validation";

/**
 * What actually goes to the API when signing in.
 *
 * `accept_terms` is on the form schema but not here. It is a gate in the
 * browser — the server authenticates on the credentials alone, and a checkbox
 * a client claims to have ticked is not something a server can verify. Typing
 * it out of the request keeps a meaningless field from being sent and later
 * read as though it meant something.
 *
 * Declared here rather than in the hook so the hook can import it, and not the
 * other way round.
 */
export type LoginCredentials = Omit<LoginValues, "accept_terms">;

/**
 * Auth calls hit the Next route handlers rather than the proxy, because those
 * handlers are what set and clear the httpOnly session cookies — and what
 * refuse an administrator account before any cookie is written.
 */
async function authRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/auth/${path}`, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError({ message: "Network request failed", kind: "network", status: 0 });
  }

  const payload = await response.json().catch(() => undefined);
  if (!response.ok) throw parseErrorBody(response.status, payload);
  return payload as T;
}

export function login(values: LoginCredentials) {
  return authRequest<{ user: User }>("login", {
    email: values.email,
    password: values.password,
  });
}

/**
 * Fields are listed explicitly rather than spread, so that `confirm_password`
 * and `accept_terms` — which exist only in the browser — never reach the API.
 *
 * The cost of doing it this way is that a new field is silently dropped unless
 * it is added here too. That already happened once: `date_of_birth` became
 * required on the server while this function still sent four fields, so every
 * registration failed with a 422 naming a field the form was collecting
 * perfectly well. If you add to `registerSchema`, add to this list.
 */
export function register(values: RegisterValues) {
  return authRequest<{ email: string }>("register", {
    full_name: values.full_name,
    email: values.email,
    // Optional — omitted entirely rather than sent as an empty string, so the
    // API stores NULL.
    phone: values.phone || undefined,
    state: values.state,
    country: values.country,
    date_of_birth: values.date_of_birth,
    password: values.password,
  });
}

export function logout() {
  return authRequest<{ ok: true }>("logout", {});
}

export function requestPasswordReset(email: string) {
  return authRequest<{ ok: true }>("forgot-password", { email });
}

export function resetPassword(values: { token: string; password: string }) {
  return authRequest<{ ok: true }>("reset-password", values);
}

export function verifyEmail(token: string) {
  return authRequest<{ ok: true }>("verify-email", { token });
}

/**
 * Always resolves, whatever the server says — the endpoint deliberately does
 * not reveal whether an address is registered or already verified.
 */
export function resendVerification(email: string) {
  return authRequest<{ ok: true }>("resend-verification", { email });
}

/** Returns null rather than throwing when nobody is signed in. */
export async function getSession(): Promise<User | null> {
  try {
    const { user } = await authRequest<{ user: User }>("session");
    return user;
  } catch (error) {
    if (error instanceof ApiError && ["unauthorized", "forbidden"].includes(error.kind)) {
      return null;
    }
    throw error;
  }
}

/**
 * Closes the account. The current password is required because this cannot be
 * undone and an unattended session should not be enough to trigger it.
 */
export function deleteAccount(password: string) {
  return authRequest<{ ok: true }>("delete-account", { password });
}
