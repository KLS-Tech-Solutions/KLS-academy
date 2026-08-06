"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/components/ui/form";
import {
  verifyCertificateSchema,
  type VerifyCertificateValues,
} from "@/lib/validation";

export function VerifyForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const form = useZodForm<VerifyCertificateValues>(verifyCertificateSchema, {
    defaultValues: { certificate_number: defaultValue },
  });

  const error = form.formState.errors.certificate_number?.message;

  return (
    <form
      className="mx-auto w-full max-w-xl"
      noValidate
      onSubmit={form.handleSubmit(({ certificate_number }) => {
        router.push(`/verify/${encodeURIComponent(certificate_number.trim().toUpperCase())}`);
      })}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            {...form.register("certificate_number")}
            id="certificate_number"
            invalid={Boolean(error)}
            aria-label="Certificate number"
            aria-describedby={error ? "certificate_number-error" : undefined}
            placeholder="KLS-ACAD-2026-00184"
            className="h-12 pl-11 font-mono uppercase"
          />
        </div>
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Checking…" : "Verify"}
        </Button>
      </div>

      {error && (
        <p
          id="certificate_number-error"
          role="alert"
          className="mt-2 text-left text-[13px] text-danger"
        >
          {error}
        </p>
      )}
    </form>
  );
}
