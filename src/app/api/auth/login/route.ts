import { NextResponse, type NextRequest } from "next/server";
import { USE_MOCKS } from "@/lib/api/config";
import { callBackend, setSessionCookies } from "../../_session";
import { mockUser } from "@/data/journey";

/**
 * Exchanges credentials for tokens and stores them as httpOnly cookies.
 * The response body carries the user only — never the token.
 */
export async function POST(request: NextRequest) {
  const credentials = await request.json();

  if (USE_MOCKS) {
    await setSessionCookies({ access_token: "mock-access-token", refresh_token: "mock-refresh-token" });
    return NextResponse.json({
      user: { ...mockUser, email: credentials?.email ?? mockUser.email },
    });
  }

  const response = await callBackend("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  await setSessionCookies(payload);
  return NextResponse.json({ user: payload.user ?? null });
}

