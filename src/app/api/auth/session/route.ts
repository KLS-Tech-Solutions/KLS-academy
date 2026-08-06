import { NextResponse } from "next/server";
import { USE_MOCKS } from "@/lib/api/config";
import { callBackend, getAccessToken } from "../../_session";
import { mockUser } from "@/data/journey";

/** Who am I? Drives route protection and the avatar in the dashboard chrome. */
export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  if (USE_MOCKS) {
    return NextResponse.json({ user: mockUser });
  }

  const response = await callBackend("/auth/me", { authenticated: true });
  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}
