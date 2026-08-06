"use client";

import * as React from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { CharacterCounter, FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { useSendContactMessage } from "@/hooks/mutations";
import { isApiError } from "@/lib/api/errors";
import { contactSchema, type ContactValues } from "@/lib/validation";

const topics = [
  { value: "internship", label: "Internship enquiry" },
  { value: "submission", label: "Existing submission" },
  { value: "certificate", label: "Certificate or payment" },
  { value: "partnership", label: "College or hiring partnership" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const { toast } = useToast();
  const [sent, setSent] = React.useState(false);
  const sendMessage = useSendContactMessage();

  const form = useZodForm<ContactValues>(contactSchema, {
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "internship",
      message: "",
    },
  });

  const message = form.watch("message") ?? "";

  const onSubmit = async (values: ContactValues) => {
    await sendMessage.mutateAsync(values);
    toast({
      title: "Message sent",
      description: "We'll reply by email within 1–2 working days.",
      variant: "success",
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-50 text-accent">
          <CheckCircle2 className="size-6" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Message received</h2>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">
          Thanks for reaching out. The team will reply to your email within one to two
          working days.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            form.reset();
            setSent(false);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
        <h2 className="text-xl font-semibold">Send us a message</h2>
        <p className="mt-1.5 text-[15px] text-body">
          Fill in the form and we&apos;ll get back to you by email.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField form={form} name="name" label="Full name" required>
          {(field) => (
            <Input {...field} {...form.register("name")} placeholder="Ananya Rao" />
          )}
        </FormField>

        <FormField form={form} name="email" label="Email" required>
          {(field) => (
            <Input
              {...field}
              {...form.register("email")}
              type="email"
              placeholder="you@example.com"
            />
          )}
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField form={form} name="phone" label="Phone" hint="Optional">
          {(field) => (
            <Input
              {...field}
              {...form.register("phone")}
              type="tel"
              placeholder="98450 12345"
            />
          )}
        </FormField>

        <FormField form={form} name="topic" label="Topic" required>
          {(field) => (
            <Select {...field} {...form.register("topic")}>
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </div>

      <div className="flex flex-col gap-2">
        <FormField
          form={form}
          name="message"
          label="Message"
          required
          hint="The more specific, the faster we can help."
        >
          {(field) => (
            <Textarea
              {...field}
              {...form.register("message")}
              placeholder="I'd like to know more about…"
            />
          )}
        </FormField>
        <CharacterCounter value={message} min={20} max={2000} />
      </div>

      {sendMessage.isError && (
        <Alert variant="danger">
          {isApiError(sendMessage.error)
            ? sendMessage.error.userMessage
            : "We couldn't send your message. Try again."}
        </Alert>
      )}

      <Button type="submit" size="lg" full disabled={sendMessage.isPending}>
        <Send />
        {sendMessage.isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
