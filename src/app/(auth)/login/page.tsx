import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { SessionNotice } from "@/components/auth/session-notice";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Card className="p-6 sm:p-8">
      <Suspense fallback={null}>
        <SessionNotice />
      </Suspense>

      <h1 className="text-2xl">Welcome back</h1>
      <p className="mt-2 text-[15px] text-body">
        Sign in to continue your internship.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-[15px] text-body">
        New to KLS Academy?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
