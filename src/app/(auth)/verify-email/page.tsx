import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Sign in" };

/**
 * Kept as a redirect, not deleted.
 *
 * There is no email verification step any more — an account works the moment
 * the signup form is submitted. But verification links were sent to real
 * addresses before that changed, and inboxes are forever: someone will click
 * one next month. A 404 would read as "your account is broken", which is the
 * opposite of true.
 *
 * So anyone arriving here is quietly sent to sign in, where their account is
 * already waiting for them.
 */
export default function VerifyEmailPage() {
  redirect("/login?registered=1");
}
