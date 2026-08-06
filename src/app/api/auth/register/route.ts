import { NextResponse, type NextRequest } from "next/server";
import { USE_MOCKS } from "@/lib/api/config";
import { callBackend } from "../../_session";

/**
 * Registration does not create a session — the student verifies their email
 * first, then logs in.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (USE_MOCKS) {
    return NextResponse.json({ email: body?.email, email_verified: false }, { status: 201 });
  }

  const response = await callBackend("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}
