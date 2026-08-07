import { apiRequest } from "@/lib/api/client";
import type {
  AppNotification,
  Payment,
  StudentJourney,
  StudentProfile,
  TaskSubmission,
} from "@/types";
import type { ProfileValues } from "@/lib/validation";

/**
 * GET /me/journey
 *
 * The aggregate the dashboard renders from — stage, enrolment, tasks,
 * submissions, payment, certificate and notifications in one round trip.
 * The backend owns `stage`; nothing here infers it.
 */
export function getMyJourney() {
  return apiRequest<StudentJourney>("/me/journey");
}

/** POST /enrollments */
export function enrollInDomain(domainId: string, batchId: string) {
  return apiRequest<{ enrollment_id: string }>("/enrollments", {
    method: "POST",
    body: { domain_id: domainId, batch_id: batchId },
  });
}

/** POST /linkedin-submissions */
export function submitLinkedInPost(postUrl: string) {
  return apiRequest<{ id: string; status: "pending" }>("/linkedin-submissions", {
    method: "POST",
    body: { linkedin_post_url: postUrl },
  });
}

export interface TaskSubmissionInput {
  task_id: string;
  title: string;
  github_url: string;
  live_demo_url?: string;
  description: string;
  screenshots: File[];
}

/** POST /task-submissions — multipart; screenshots go through to storage. */
export function submitTask(input: TaskSubmissionInput) {
  const form = new FormData();
  form.append("task_id", input.task_id);
  form.append("title", input.title);
  form.append("github_url", input.github_url);
  form.append("description", input.description);
  if (input.live_demo_url) form.append("live_demo_url", input.live_demo_url);
  input.screenshots.forEach((file, index) => {
    form.append("screenshots", file);
    form.append("display_order", String(index + 1));
  });

  return apiRequest<Pick<TaskSubmission, "id" | "status">>("/task-submissions", {
    method: "POST",
    formData: form,
  });
}

/** POST /payments/order */
export function createPaymentOrder() {
  return apiRequest<{
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
  }>("/payments/order", { method: "POST" });
}

/** POST /payments/verify — the backend checks the Razorpay signature. */
export function confirmPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return apiRequest<Payment>("/payments/verify", { method: "POST", body: payload });
}

/** PATCH /me/profile */
export function updateProfile(values: ProfileValues) {
  return apiRequest<StudentProfile>("/me/profile", { method: "PATCH", body: values });
}

/** GET /me/notifications */
export function listNotifications() {
  return apiRequest<AppNotification[]>("/me/notifications");
}

/** PATCH /me/notifications/read */
export function markNotificationsRead(ids: string[]) {
  return apiRequest<void>("/me/notifications/read", {
    method: "PATCH",
    body: { ids },
  });
}
