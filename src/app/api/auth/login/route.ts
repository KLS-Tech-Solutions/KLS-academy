import { NextResponse, type NextRequest } from "next/server";

import { callBackend, isStudentRole, setSessionCookies } from "../../_session";

/**
 * Exchanges credentials for tokens and stores them as httpOnly cookies.
 *
 * Administrators share this backend, so the role is checked here and the
 * session is refused before any cookie is written — an admin signing in on the
 * student portal would otherwise land on a dashboard that makes no sense for
 * them. The admin console applies the mirror-image rule.
 */
export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const response = await callBackend("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).catch(() => null);

  if (response === null) {
    return NextResponse.json(
      { detail: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  if (!isStudentRole(payload?.user?.role)) {
    return NextResponse.json(
      { detail: "Administrator accounts sign in on the admin console" },
      { status: 403 },
    );
  }

  await setSessionCookies(payload);
  return NextResponse.json({ user: payload.user });
}
