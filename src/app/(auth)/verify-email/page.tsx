import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResendVerification } from "@/components/auth/password-forms";

export const metadata: Metadata = { title: "Verify your email" };

export default function VerifyEmailPage() {
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
