import { NextResponse } from "next/server";
import { USE_MOCKS } from "@/lib/api/config";
import {
  callBackend,
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "../../_session";

/** Called automatically by the API client when a request returns 401. */
export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json({ detail: "No refresh token" }, { status: 401 });
  }

  if (USE_MOCKS) {
    await setSessionCookies({ access_token: "mock-access-token", refresh_token: refreshToken });
    return NextResponse.json({ ok: true });
  }

  const response = await callBackend("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    await clearSessionCookies();
    return NextResponse.json({ detail: "Session expired" }, { status: 401 });
  }

  await setSessionCookies(await response.json());
  return NextResponse.json({ ok: true });
}
