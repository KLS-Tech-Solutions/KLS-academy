/**
 * Runtime configuration. `USE_MOCKS` is the switch that lets the whole app run
 * with no backend — every service checks it before making a request.
 */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

/**
 * Browser requests go to the Next proxy, never to FastAPI directly. The proxy
 * attaches the JWT from an httpOnly cookie, so no token is reachable from JS.
 */
export const CLIENT_API_PREFIX = "/api/proxy";

/** Server-only. Used by route handlers to reach FastAPI. */
export const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

export const AUTH_COOKIE = "kls_access";
export const REFRESH_COOKIE = "kls_refresh";
export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
