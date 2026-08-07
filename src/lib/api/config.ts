/**
 * Runtime configuration.
 *
 * There is no mock mode. Every screen reads from the FastAPI backend through
 * the proxy below — if the API is down, the app shows an error rather than
 * quietly serving invented data.
 */

/**
 * Browser requests go to the Next proxy, never to FastAPI directly. The proxy
 * attaches the JWT from an httpOnly cookie, so no token is reachable from JS.
 */
export const CLIENT_API_PREFIX = "/api/proxy";

/** Server-only. Used by route handlers and server components. */
export const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

export const AUTH_COOKIE = "kls_access";
export const REFRESH_COOKIE = "kls_refresh";
export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

/** Shown in the footer, contact page, error states and support copy. */
export const SUPPORT_EMAIL = "klstechsolutions2025@gmail.com";
