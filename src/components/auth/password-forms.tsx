"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, PasswordRules, useZodForm } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/lib/validation";

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false);
  const form = useZodForm(forgotPasswordSchema, { defaultValues: { email: "" } });

  const onSubmit = async (_values: ForgotPasswordValues) => {
    // Phase 3: POST /auth/forgot-password
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 rounded-field bg-accent-50 p-5 text-center">
        <CheckCircle2 className="mx-auto size-6 text-accent" />
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          If that email is registered, a reset link is on its way. The link expires in
          30 minutes.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
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

      <Button type="submit" size="lg" full disabled={form.formState.isSubmitting}>
        <Send />
        {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useZodForm(resetPasswordSchema, {
    defaultValues: { password: "", confirm_password: "" },
  });

  const passwordValue = form.watch("password") ?? "";

  const onSubmit = async (_values: ResetPasswordValues) => {
    // Phase 3: POST /auth/reset-password with the token from the URL.
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast({
      title: "Password updated",
      description: "Sign in with your new password.",
      variant: "success",
    });
    router.push("/login");
  };

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <FormField form={form} name="password" label="New password" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </FormField>
        <PasswordRules value={passwordValue} />
      </div>

      <FormField form={form} name="confirm_password" label="Confirm new password" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("confirm_password")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
        )}
      </FormField>

      <Button type="submit" size="lg" full disabled={form.formState.isSubmitting}>
        <KeyRound />
        {form.formState.isSubmitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export function ResendVerification() {
  const { toast } = useToast();
  const [sent, setSent] = React.useState(false);

  return (
    <div className="mt-8">
      <Button
        variant="secondary"
        full
        disabled={sent}
        onClick={() => {
          setSent(true);
          toast({
            title: "Verification email sent",
            description: "It can take a minute to arrive.",
            variant: "info",
          });
        }}
      >
        {sent ? "Verification email sent" : "Resend verification email"}
      </Button>
    </div>
  );
}
