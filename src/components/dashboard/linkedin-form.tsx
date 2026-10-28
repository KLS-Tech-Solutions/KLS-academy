"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useSubmitLinkedIn } from "@/hooks/mutations";
import { isApiError } from "@/lib/api/errors";
import {
  linkedinSubmissionSchema,
  type LinkedInSubmissionValues,
} from "@/lib/validation";

export function LinkedInSubmissionForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { toast } = useToast();
  const submitPost = useSubmitLinkedIn();
  const form = useZodForm<LinkedInSubmissionValues>(linkedinSubmissionSchema, {
    defaultValues: { linkedin_post_url: "" },
  });

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(async ({ linkedin_post_url }) => {
        await submitPost.mutateAsync(linkedin_post_url);
        toast({
          title: "Submitted for verification",
          description: "A reviewer will check your post shortly.",
          variant: "success",
        });
        onSubmitted();
      })}
    >
      <div>
        <h2 className="text-lg font-semibold">Submit your post URL</h2>
        <p className="mt-1.5 text-[15px] text-body">
          Paste the direct link to your LinkedIn post.
        </p>
      </div>

      {submitPost.isError && (
        <Alert variant="danger">
          {isApiError(submitPost.error)
            ? submitPost.error.userMessage
            : "We couldn't submit your post. Try again."}
        </Alert>
      )}

      <FormField
        form={form}
        name="linkedin_post_url"
        label="LinkedIn post URL"
        required
        hint="Must be a public post that includes your offer letter."
      >
        {(field) => (
          <Input
            {...field}
            {...form.register("linkedin_post_url")}
            type="url"
            placeholder="https://www.linkedin.com/posts/..."
          />
        )}
      </FormField>

      <Button type="submit" size="lg" disabled={submitPost.isPending}>
        <Send />
        {submitPost.isPending ? "Submitting…" : "Submit for verification"}
      </Button>
    </form>
  );
}
