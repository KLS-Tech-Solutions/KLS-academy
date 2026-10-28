"use client";

import { Controller } from "react-hook-form";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { CharacterCounter, FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useSubmitTask } from "@/hooks/mutations";
import { isApiError } from "@/lib/api/errors";
import { ScreenshotUploader } from "@/components/dashboard/screenshot-uploader";
import {
  MAX_EXPLANATION,
  MIN_EXPLANATION,
  MIN_SCREENSHOTS,
  taskSubmissionSchema,
  type TaskSubmissionValues,
} from "@/lib/validation";

export function TaskSubmissionForm({
  taskId,
  isResubmission,
  onSubmitted,
}: {
  taskId: string;
  isResubmission: boolean;
  onSubmitted: () => void;
}) {
  const { toast } = useToast();
  const submitTask = useSubmitTask();

  const form = useZodForm<TaskSubmissionValues>(taskSubmissionSchema, {
    defaultValues: {
      title: "",
      github_url: "",
      live_demo_url: "",
      description: "",
      screenshots: [],
    },
  });

  const description = form.watch("description") ?? "";
  const screenshotError = form.formState.errors.screenshots?.message;

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await submitTask.mutateAsync({
          task_id: taskId,
          title: values.title,
          github_url: values.github_url,
          live_demo_url: values.live_demo_url || undefined,
          description: values.description,
          screenshots: values.screenshots.map((shot) => shot.file),
        });
        toast({
          title: "Submission received",
          description: "Your work is queued for review.",
          variant: "success",
        });
        onSubmitted();
      })}
    >
      <div>
        <h2 className="text-lg font-semibold">
          {isResubmission ? "Resubmit your work" : "Submit your work"}
        </h2>
        <p className="mt-1.5 text-[15px] text-body">
          Every field is checked during review. Incomplete submissions are sent back.
        </p>
      </div>

      <FormField form={form} name="title" label="Project title" required>
        {(field) => (
          <Input
            {...field}
            {...form.register("title")}
            placeholder="Task management API with JWT auth"
          />
        )}
      </FormField>

      <FormField
        form={form}
        name="github_url"
        label="GitHub repository"
        required
        hint="Must be a public repository with a README."
      >
        {(field) => (
          <Input
            {...field}
            {...form.register("github_url")}
            type="url"
            placeholder="https://github.com/username/repository"
          />
        )}
      </FormField>

      <FormField
        form={form}
        name="live_demo_url"
        label="Live demo URL"
        hint="Optional, but recommended."
      >
        {(field) => (
          <Input
            {...field}
            {...form.register("live_demo_url")}
            type="url"
            placeholder="https://your-project.vercel.app"
          />
        )}
      </FormField>

      <div className="flex flex-col gap-2">
        <FormField
          form={form}
          name="description"
          label="Detailed explanation"
          required
          hint="Describe what you built, how it works and the decisions you made."
        >
          {(field) => (
            <Textarea
              {...field}
              {...form.register("description")}
              rows={7}
              placeholder="I built…"
            />
          )}
        </FormField>
        <CharacterCounter
          value={description}
          min={MIN_EXPLANATION}
          max={MAX_EXPLANATION}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">
          Screenshots (minimum {MIN_SCREENSHOTS})
          <span className="ml-0.5 text-danger">*</span>
        </p>
        <Controller
          control={form.control}
          name="screenshots"
          render={({ field }) => (
            <ScreenshotUploader
              value={field.value ?? []}
              onChange={(next) => {
                field.onChange(next);
                form.trigger("screenshots");
              }}
            />
          )}
        />
        {screenshotError && (
          <p role="alert" className="text-[13px] text-danger">
            {screenshotError}
          </p>
        )}
      </div>

      {submitTask.isError && (
        <Alert variant="danger">
          {isApiError(submitTask.error)
            ? submitTask.error.userMessage
            : "We couldn't submit your work. Try again."}
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={submitTask.isPending}>
        <Send />
        {submitTask.isPending ? "Uploading…" : "Submit for review"}
      </Button>
    </form>
  );
}
