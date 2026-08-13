"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, PasswordRules, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { SpamNote } from "@/components/shared/spam-note";
import { isApiError } from "@/lib/api/errors";
import {
  requestPasswordReset,
  resendVerification,
  resetPassword,
} from "@/services/auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/lib/validation";

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false);
  const form = useZodForm(forgotPasswordSchema, { defaultValues: { email: "" } });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    // Always shows the same confirmation — the endpoint deliberately does not
    // reveal whether an address is registered.
    await requestPasswordReset(email).catch(() => null);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-field bg-accent-50 p-5 text-center">
          <CheckCircle2 className="mx-auto size-6 text-accent" />
          <p className="mt-3 text-[15px] leading-relaxed text-ink">
            If that email is registered, a reset link is on its way. The link expires in
            30 minutes.
          </p>
        </div>
        <SpamNote action="reset email" />
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
  const params = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);

  // The token arrives in the link from the reset email.
  const token = params.get("token") ?? "";

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: { password: "", confirm_password: "" },
  });

  const passwordValue = form.watch("password") ?? "";

  const onSubmit = async (values: ResetPasswordValues) => {
    setError(null);
    try {
      await resetPassword({ token, password: values.password });
      toast({
        title: "Password updated",
        description: "Sign in with your new password.",
        variant: "success",
      });
      router.push("/login");
    } catch (err) {
      setError(
        isApiError(err)
          ? err.userMessage
          : "That reset link is no longer valid. Request a new one.",
      );
    }
  };

  if (!token) {
    return (
      <Alert variant="warning" className="mt-6">
        This link is missing its reset token. Open the link from your email again, or{" "}
        <a href="/forgot-password" className="font-medium underline">
          request a new one
        </a>
        .
      </Alert>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {error && <Alert variant="danger">{error}</Alert>}

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

/**
 * Resending needs the address, because the student is not signed in yet — the
 * account exists but is unverified, so there is no session to read it from.
 */
export function ResendVerification() {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string | null>(null);

  const form = useZodForm<ForgotPasswordValues>(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  if (sentTo) {
    return (
      <div className="mt-8 rounded-field bg-accent-50 p-4 text-center">
        <p className="text-[15px] leading-relaxed text-ink">
          If <span className="font-medium">{sentTo}</span> needs verifying, a new link is
          on its way. It expires in 24 hours.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => setSentTo(null)}
        >
          Send to a different address
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mt-8 flex flex-col gap-3"
      noValidate
      onSubmit={form.handleSubmit(async ({ email }) => {
        setPending(true);
        try {
          await resendVerification(email);
          setSentTo(email);
        } catch {
          // Deliberately indistinguishable from success — this endpoint must
          // not reveal whether an address is registered.
          setSentTo(email);
        } finally {
          setPending(false);
        }
      })}
    >
      <FormField form={form} name="email" label="Your email" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("email")}
            type="email"
            placeholder="you@example.com"
          />
        )}
      </FormField>

      <Button type="submit" variant="secondary" full disabled={pending}>
        <Send />
        {pending ? "Sending…" : "Resend verification email"}
      </Button>
    </form>
  );
}
