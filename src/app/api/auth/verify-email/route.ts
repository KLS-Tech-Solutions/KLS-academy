import { NextResponse } from "next/server";

/**
 * Retired.
 *
 * Registration activates the account outright, so the API no longer has a
 * `/auth/verify-email` endpoint to proxy to. This handler remains only so that
 * an older cached client calling it gets a clear answer instead of a 404 it
 * would surface as "something went wrong".
 */
export async function POST() {
  return NextResponse.json(
    {
      detail:
        "Email verification is no longer required — your account is already active. Sign in with the password you chose.",
    },
    { status: 410 },
  );
}
