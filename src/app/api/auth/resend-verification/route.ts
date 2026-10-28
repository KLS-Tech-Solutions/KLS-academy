import { NextResponse } from "next/server";

/**
 * Retired alongside email verification.
 *
 * Accounts are active from the moment the signup form is submitted, so there
 * is nothing to resend and the API no longer exposes this endpoint. Answering
 * 410 with a sentence beats proxying to a route that now 404s, which the error
 * mapper would surface as "we couldn't find what you were looking for".
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
