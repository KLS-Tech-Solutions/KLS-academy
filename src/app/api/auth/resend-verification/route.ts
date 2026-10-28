import { NextResponse, type NextRequest } from "next/server";

import { callBackend } from "../../_session";

/** Always succeeds — never reveals whether an address is registered. */
export async function POST(request: NextRequest) {
  const body = await request.json();

  await callBackend("/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
