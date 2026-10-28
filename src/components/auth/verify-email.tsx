"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResendVerification } from "@/components/auth/password-forms";
import { SpamNote } from "@/components/shared/spam-note";
import { verifyEmail } from "@/services/auth.service";

/** Where a freshly verified student should end up: choosing their domain. */
const AFTER_VERIFY = "/login?next=%2Fdashboard%2Fenroll&verified=1";

type State = "verifying" | "verified" | "failed";

/**
 * This screen does two jobs, decided by whether the URL carries a token.
 *
 * Without one it is the "check your inbox" page shown straight after
 * registering. With one it is the destination of the link in that email — it
 * redeems the token and sends the student on to pick their internship.
 *
 * Those used to be the same static page, so clicking the link in the email
 * landed the student back on "check your inbox" with no way forward.
 */
export function VerifyEmail({ token }: { token: string | null }) {
  const [state, setState] = React.useState<State>("verifying");

  React.useEffect(() => {
    if (!token) return;
    let cancelled = false;

    verifyEmail(token)
      .then(() => !cancelled && setState("verified"))
      .catch(() => !cancelled && setState("failed"));

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return <CheckYourInbox />;
  if (state === "verifying") return <Verifying />;
  if (state === "failed") return <LinkNoLongerValid />;
  return <Verified />;
}

function CheckYourInbox() {
  return (
    <Card className="p-6 text-center sm:p-8">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand">
        <MailCheck className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl">Check your inbox</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-body">
        We&apos;ve sent a verification link to your registered email address. Click it
        to activate your account and choose your internship domain.
      </p>

      <SpamNote className="mt-6" action="verification email" />

      <ResendVerification />

      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-2")}
      >
        Back to login
      </Link>
    </Card>
  );
}

function Verifying() {
  return (
    <Card className="p-6 text-center sm:p-8">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand">
        <Loader2 className="size-6 animate-spin" />
      </span>
      <h1 className="mt-6 text-2xl">Verifying your email</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-body">
        One moment — we&apos;re activating your account.
      </p>
    </Card>
  );
}

function Verified() {
  return (
    <Card className="p-6 text-center sm:p-8">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success-bg text-success">
        <CheckCircle2 className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl">Email verified</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-body">
        Your account is active. Sign in and pick the internship domain you want to
        work in — your offer letter is generated the moment you enrol.
      </p>

      <Link
        href={AFTER_VERIFY}
        className={cn(buttonVariants({ size: "lg", full: true }), "mt-7")}
      >
        Choose your internship
      </Link>
    </Card>
  );
}

function LinkNoLongerValid() {
  return (
    <Card className="p-6 text-center sm:p-8">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-warning-bg text-warning">
        <XCircle className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl">This link is no longer valid</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-body">
        Verification links last 24 hours and work once. If you already verified,
        just sign in. Otherwise send yourself a fresh link below.
      </p>

      <ResendVerification />

      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-2")}
      >
        Back to login
      </Link>
    </Card>
  );
}
