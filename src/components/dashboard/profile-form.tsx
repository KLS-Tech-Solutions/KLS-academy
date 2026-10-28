"use client";

import * as React from "react";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useUpdateProfile } from "@/hooks/mutations";
import { isApiError } from "@/lib/api/errors";
import { profileSchema, YEAR_OPTIONS, type ProfileValues } from "@/lib/validation";
import type { StudentProfile, User } from "@/types";

export function ProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: StudentProfile;
}) {
  const { toast } = useToast();
  const [saved, setSaved] = React.useState(false);
  const updateProfile = useUpdateProfile();

  const form = useZodForm<ProfileValues>(profileSchema, {
    defaultValues: {
      full_name: user.full_name,
      phone: user.phone,
      college_name: profile.college_name,
      degree: profile.degree,
      branch: profile.branch,
      year: profile.year as ProfileValues["year"],
      linkedin_url: profile.linkedin_url ?? "",
      github_url: profile.github_url ?? "",
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await updateProfile.mutateAsync(values);
        toast({ title: "Profile updated", variant: "success" });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      })}
    >
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Account details</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField form={form} name="full_name" label="Full name" required>
            {(field) => <Input {...field} {...form.register("full_name")} />}
          </FormField>

          <Field
            label="Email"
            htmlFor="email"
            hint="Contact support to change your email."
          >
            <Input id="email" type="email" defaultValue={user.email} disabled />
          </Field>

          <FormField form={form} name="phone" label="Phone" required>
            {(field) => <Input {...field} {...form.register("phone")} type="tel" />}
          </FormField>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Education</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField form={form} name="college_name" label="College name" required>
            {(field) => <Input {...field} {...form.register("college_name")} />}
          </FormField>

          <FormField form={form} name="degree" label="Degree" required>
            {(field) => (
              <Input {...field} {...form.register("degree")} placeholder="B.E." />
            )}
          </FormField>

          <FormField form={form} name="branch" label="Branch" required>
            {(field) => (
              <Input
                {...field}
                {...form.register("branch")}
                placeholder="Computer Science"
              />
            )}
          </FormField>

          <FormField form={form} name="year" label="Year of study" required>
            {(field) => (
              <Select {...field} {...form.register("year")}>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Professional links</h2>
        <p className="mt-1.5 text-[15px] text-body">
          Used to verify your LinkedIn task and review your submissions.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField
            form={form}
            name="linkedin_url"
            label="LinkedIn profile"
            hint="Optional"
          >
            {(field) => (
              <Input
                {...field}
                {...form.register("linkedin_url")}
                placeholder="https://linkedin.com/in/username"
              />
            )}
          </FormField>

          <FormField
            form={form}
            name="github_url"
            label="GitHub profile"
            hint="Optional"
          >
            {(field) => (
              <Input
                {...field}
                {...form.register("github_url")}
                placeholder="https://github.com/username"
              />
            )}
          </FormField>
        </div>
      </Card>

      {updateProfile.isError && (
        <Alert variant="danger">
          {isApiError(updateProfile.error)
            ? updateProfile.error.userMessage
            : "We couldn't save your profile. Try again."}
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={updateProfile.isPending}>
          {saved ? <Check /> : <Save />}
          {updateProfile.isPending
            ? "Saving…"
            : saved
              ? "Saved"
              : "Save changes"}
        </Button>
        {saved && (
          <span className="text-[15px] text-accent">Your profile has been updated.</span>
        )}
      </div>
    </form>
  );
}
