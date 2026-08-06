"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
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
  const [show, setShow] = React.useState(false);
  const loginMutation = useLogin();

  const form = useZodForm(loginSchema, {
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginValues) => {
    await loginMutation.mutateAsync(values);
    toast({ title: "Signed in", description: "Welcome back to KLS Academy.", variant: "success" });
  };

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
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

      <Button type="submit" size="lg" full disabled={loginMutation.isPending}>
        <LogIn />
        {loginMutation.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
