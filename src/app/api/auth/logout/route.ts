import { NextResponse } from "next/server";

import { callBackend, clearSessionCookies } from "../../_session";

export async function POST() {
  // Best effort — cookies are cleared locally regardless of the API result.
  await callBackend("/auth/logout", { method: "POST", authenticated: true }).catch(
    () => null,
  );
  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}
