"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, PasswordRules, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useRegister } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";
import {
  COUNTRIES,
  INDIAN_STATES,
  MINIMUM_AGE,
  registerSchema,
  type RegisterValues,
} from "@/lib/validation";

/**
 * The latest date that could belong to someone old enough to register.
 *
 * Fed to the input's `max`, so the native picker will not offer a date that
 * the schema is going to reject a moment later. It is a courtesy, not a
 * control — the schema and the API both still check.
 */
function latestEligibleBirthDate(): string {
  const today = new Date();
  const cutoff = new Date(
    Date.UTC(today.getFullYear() - MINIMUM_AGE, today.getMonth(), today.getDate()),
  );
  return cutoff.toISOString().slice(0, 10);
}

export function RegisterForm() {
  const maxBirthDate = React.useMemo(latestEligibleBirthDate, []);
  const { toast } = useToast();
  const [show, setShow] = React.useState(false);
  const registerMutation = useRegister();

  const form = useZodForm(registerSchema, {
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      // Nearly everyone, so it is preselected rather than made a decision.
      country: "India",
      state: "",
      date_of_birth: "",
      password: "",
      confirm_password: "",
    },
  });

  const passwordValue = form.watch("password") ?? "";
  const selectedCountry = form.watch("country");

  // Switching country invalidates whatever state was chosen for the previous
  // one — "Karnataka" left sitting in the field after picking Canada would be
  // submitted as-is.
  const previousCountry = React.useRef(selectedCountry);
  React.useEffect(() => {
    if (previousCountry.current !== selectedCountry) {
      previousCountry.current = selectedCountry;
      form.setValue("state", "", { shouldValidate: false });
    }
  }, [selectedCountry, form]);

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerMutation.mutateAsync(values);
      toast({
        title: "Account created",
        description: "Sign in with the password you just chose.",
        variant: "success",
      });
    } catch (error) {
      if (!isApiError(error)) return;

      // 422 — FastAPI names the field that failed, so put the message on it.
      if (error.kind === "validation") {
        for (const fieldError of error.fieldErrors) {
          form.setError(fieldError.field as keyof RegisterValues, {
            message: fieldError.message,
          });
        }
        return;
      }

      // 409 — registration raises this for exactly one reason: the email is
      // taken. Landing it on the email input rather than a banner at the top
      // means the person sees it next to the thing they have to change.
      if (error.kind === "conflict") {
        form.setError("email", {
          message:
            error.serverMessage ?? "An account with this email already exists",
        });
      }
    }
  };

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/*
        The banner is for failures with no field to attach to — network, 5xx,
        rate limiting. Validation and conflict both land on an input now, and
        showing them here as well says the same thing twice.
      */}
      {registerMutation.isError &&
        !(
          isApiError(registerMutation.error) &&
          (registerMutation.error.kind === "validation" ||
            registerMutation.error.kind === "conflict")
        ) && (
          <Alert variant="danger">
            {isApiError(registerMutation.error)
              ? registerMutation.error.userMessage
              : "We couldn't create your account. Try again."}
          </Alert>
        )}

      <FormField form={form} name="full_name" label="Full name" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("full_name")}
            autoComplete="name"
            placeholder="Ananya Rao"
          />
        )}
      </FormField>

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

      {/*
        Optional. Nothing in the platform sends an SMS or places a call, so
        requiring a number was collecting data we have no use for. Labelled so
        people know they can skip it rather than guessing.
      */}
      <FormField
        form={form}
        name="phone"
        label="Phone (optional)"
        hint="Indian mobile number, with or without +91."
      >
        {(field) => (
          <Input
            {...field}
            {...form.register("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="98450 12345"
          />
        )}
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField form={form} name="country" label="Country" required>
          {(field) => (
            <Select {...field} {...form.register("country")}>
              {COUNTRIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        {/*
          A picker for India, a text box for everywhere else. A dropdown of
          Indian states shown to someone in Canada is worse than useless, and
          a worldwide list of subdivisions is not a thing worth shipping.
        */}
        <FormField form={form} name="state" label="State" required>
          {(field) =>
            selectedCountry === "India" ? (
              <Select {...field} {...form.register("state")}>
                <option value="">Select your state</option>
                {INDIAN_STATES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                {...field}
                {...form.register("state")}
                autoComplete="address-level1"
                placeholder="State or province"
              />
            )
          }
        </FormField>
      </div>

      {/*
        Asked for because Indian data protection law requires verifiable
        parental consent to hold a under-18's data, and we have no way to
        collect it. The hint says so — a date field with no explanation on a
        signup form reads as data collection for its own sake.
      */}
      <FormField
        form={form}
        name="date_of_birth"
        label="Date of birth"
        required
        hint={`You must be ${MINIMUM_AGE} or over to register.`}
      >
        {(field) => (
          <Input
            {...field}
            {...form.register("date_of_birth")}
            type="date"
            autoComplete="bday"
            max={maxBirthDate}
            className="[&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        )}
      </FormField>

      <div className="flex flex-col gap-2">
        <FormField form={form} name="password" label="Password" required>
          {(field) => (
            <div className="relative">
              <Input
                {...field}
                {...form.register("password")}
                type={show ? "text" : "password"}
                autoComplete="new-password"
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
        <PasswordRules value={passwordValue} />
      </div>

      <FormField form={form} name="confirm_password" label="Confirm password" required>
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

      <div className="flex flex-col gap-2">
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

      <Button type="submit" size="lg" full disabled={registerMutation.isPending}>
        <UserPlus />
        {registerMutation.isPending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
