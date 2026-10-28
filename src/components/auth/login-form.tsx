"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useLogin } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";
import { loginSchema, type LoginValues } from "@/lib/validation";

export function LoginForm() {
  const { toast } = useToast();
  const params = useSearchParams();
  const [show, setShow] = React.useState(false);

  // Both set by the verification email flow: `verified` shows the banner,
  // `next` sends the student on to pick a domain instead of the dashboard.
  const justVerified = params.get("verified") === "1";
  const loginMutation = useLogin(params.get("next"));

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
      remember: false,
      // Deliberately not pre-ticked. A box that arrives already checked is not
      // an agreement, and under the DPDP Act consent has to be an affirmative
      // action by the person giving it.
      accept_terms: false as unknown as true,
    },
  });

  const onSubmit = async ({ accept_terms: _accepted, ...values }: LoginValues) => {
    // `accept_terms` is a client-side gate. It is not sent to the API, which
    // authenticates on the credentials alone — a checkbox in a browser is not
    // something a server can verify, and pretending otherwise would put a
    // meaningless field in the request.
    await loginMutation.mutateAsync(values);
    toast({ title: "Signed in", description: "Welcome back to KLS Academy.", variant: "success" });
  };

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {justVerified && !loginMutation.isError && (
        <Alert variant="success">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            Email verified. Sign in to choose your internship.
          </span>
        </Alert>
      )}

      {loginMutation.isError && (
        <Alert variant="danger">
          {isApiError(loginMutation.error)
            ? loginMutation.error.userMessage
            : "We couldn't sign you in. Try again."}
        </Alert>
      )}

      <FormField form={form} name="email" label="Email" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        )}
      </FormField>

      <FormField form={form} name="password" label="Password" required>
        {(field) => (
          <div className="relative">
            <Input
              {...field}
              {...form.register("password")}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        )}
      </FormField>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            {...form.register("remember")}
            className="size-4 rounded border-line accent-[var(--color-brand)]"
          />
          Keep me signed in
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-brand hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/*
        Terms are re-confirmed on every sign-in, not only at registration.
        Someone who agreed a year ago has not seen the version in force today,
        and the links are right here so reading them is one click rather than a
        hunt through the footer.
      */}
      <div className="flex flex-col gap-2 border-t border-line pt-5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            {...form.register("accept_terms")}
            className="mt-1 size-4 shrink-0 rounded border-line accent-[var(--color-brand)]"
          />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="font-medium text-brand hover:underline">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="font-medium text-brand hover:underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {form.formState.errors.accept_terms && (
          <p role="alert" className="text-[13px] text-danger">
            {form.formState.errors.accept_terms.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" full disabled={loginMutation.isPending}>
        <LogIn />
        {loginMutation.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
