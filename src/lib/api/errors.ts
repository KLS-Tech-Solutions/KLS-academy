/* ==========================================================================
   One error taxonomy for the whole app. Screens branch on `kind`, never on
   raw status codes, so backend changes don't ripple into components.
   ========================================================================== */

export type ApiErrorKind =
  | "network"        // request never reached the server
  | "unauthorized"   // 401 — session missing or expired
  | "forbidden"      // 403 — signed in, not allowed
  | "not_found"      // 404
  | "validation"     // 422 — field-level errors from FastAPI
  | "conflict"       // 409 — e.g. already enrolled
  | "rate_limited"   // 429
  | "server"         // 5xx
  | "unknown";

/** FastAPI returns 422 as { detail: [{ loc, msg, type }] }. */
export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly fieldErrors: FieldError[];
  readonly detail: unknown;

  /**
   * The sentence the API sent, when it sent one.
   *
   * Separate from `message` because not every API message is fit to show a
   * person — `deps.py` returns "Token is invalid" for an expired session, and
   * that belongs in a log, not on screen. Call sites that know the context use
   * this; everything else falls back to `userMessage`.
   */
  readonly serverMessage: string | null;

  constructor(init: {
    message: string;
    kind: ApiErrorKind;
    status: number;
    fieldErrors?: FieldError[];
    detail?: unknown;
    serverMessage?: string | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.kind = init.kind;
    this.status = init.status;
    this.fieldErrors = init.fieldErrors ?? [];
    this.detail = init.detail;
    this.serverMessage = init.serverMessage ?? null;
  }

  /**
   * Copy safe to show a student — never leaks stack traces or SQL.
   *
   * Where the API sends a message written for a person, that message wins.
   * The generic strings below are a fallback, and treating them as the only
   * option is what made a wrong password report "Your session has expired",
   * and a suspended account report "You don't have access to this" — both of
   * which send someone to the wrong remedy.
   *
   * 401 is the exception: it is overwhelmingly produced by a session that ran
   * out on an ordinary page load, where "Token is invalid" is worse than the
   * generic line. Sign-in screens, which know a 401 means bad credentials,
   * read `serverMessage` directly.
   */
  get userMessage() {
    switch (this.kind) {
      case "network":
        return "We couldn't reach the server. Check your connection and try again.";
      case "unauthorized":
        return "Your session has expired. Sign in again to continue.";
      case "forbidden":
        return this.serverMessage ?? "You don't have access to this.";
      case "not_found":
        return this.serverMessage ?? "We couldn't find what you were looking for.";
      case "validation":
        return this.fieldErrors[0]?.message ?? "Some details need fixing.";
      case "conflict":
        return this.serverMessage ?? this.message;
      case "rate_limited":
        return this.serverMessage ?? "Too many attempts. Wait a moment and try again.";
      case "server":
        // Never the server's own words here: a 500 body can carry a traceback
        // or an SQL fragment, which tells an attacker more than it tells a
        // student.
        return "Something went wrong on our side. Please try again shortly.";
      default:
        return this.serverMessage ?? "Something unexpected happened. Please try again.";
    }
  }
}

export function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

/** Normalises FastAPI's several error shapes into ours. */
export function parseErrorBody(status: number, body: unknown): ApiError {
  const kind = kindFromStatus(status);

  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;

    // 422 — array of validation issues
    if (Array.isArray(detail)) {
      const fieldErrors: FieldError[] = detail.map((issue) => {
        const loc = Array.isArray(issue?.loc) ? issue.loc : [];
        return {
          field: String(loc[loc.length - 1] ?? "form"),
          message: String(issue?.msg ?? "Invalid value"),
        };
      });
      return new ApiError({
        message: fieldErrors[0]?.message ?? "Validation failed",
        kind: "validation",
        status,
        fieldErrors,
        detail,
      });
    }

    if (typeof detail === "string") {
      return new ApiError({
        message: detail,
        kind,
        status,
        detail,
        serverMessage: detail,
      });
    }
  }

  return new ApiError({ message: `Request failed with status ${status}`, kind, status, detail: body });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
