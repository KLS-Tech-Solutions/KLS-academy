import { NextResponse, type NextRequest } from "next/server";

import { callBackend } from "../../_session";

/**
 * Registration does not create a session — the student verifies their email
 * first, then signs in.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await callBackend("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (response === null) {
    return NextResponse.json(
      { detail: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}
