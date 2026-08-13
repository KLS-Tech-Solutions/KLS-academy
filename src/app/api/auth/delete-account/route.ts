import { NextResponse, type NextRequest } from "next/server";

import { callBackend, clearSessionCookies } from "../../_session";

/**
 * Closes the account, then clears the session cookies.
 *
 * A dedicated route rather than the generic proxy because the cookies have to
 * go too — leaving a session cookie pointing at a closed account would mean
 * every subsequent request 401s with no obvious cause.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await callBackend("/me/account", {
    method: "DELETE",
    authenticated: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (response === null) {
    return NextResponse.json({ detail: "Server unreachable" }, { status: 502 });
  }

  if (!response.ok) {
    // The password was wrong, or the session had already expired. Cookies stay
    // put so the student can correct it without signing in again.
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  }

  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}
