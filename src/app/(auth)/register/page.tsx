import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create your account" };

export default function RegisterPage() {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl">Create your account</h1>
      <p className="mt-2 text-[15px] text-body">
        Free to join. Pick your internship domain right after signing up.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-[15px] text-body">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
