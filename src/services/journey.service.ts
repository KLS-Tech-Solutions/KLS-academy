import { apiRequest, withMock } from "@/lib/api";
import { buildJourney, DEFAULT_STAGE } from "@/data/journey";
import type {
  AppNotification,
  Certificate,
  JourneyStage,
  Payment,
  StudentJourney,
  StudentProfile,
  Task,
  TaskSubmission,
} from "@/types";
import type { ProfileValues } from "@/lib/validation";

/**
 * GET /me/journey
 *
 * One aggregate the dashboard renders from, so a page load is a single
 * round trip rather than eight. `previewStage` only applies in mock mode —
 * it backs the development stage switcher.
 */
export function getMyJourney(previewStage: JourneyStage = DEFAULT_STAGE) {
  return withMock<StudentJourney>(
    () => buildJourney(previewStage),
    () => apiRequest("/me/journey"),
  );
}

/** POST /enrollments */
export function enrollInDomain(domainId: string, batchId: string) {
  return withMock<{ enrollment_id: string }>(
    () => ({ enrollment_id: "enr-mock-001" }),
    () => apiRequest("/enrollments", { method: "POST", body: { domain_id: domainId, batch_id: batchId } }),
    600,
  );
}

/** POST /linkedin-submissions */
export function submitLinkedInPost(postUrl: string) {
  return withMock<{ id: string; status: "pending" }>(
    () => ({ id: "lnk-mock-001", status: "pending" }),
    () => apiRequest("/linkedin-submissions", { method: "POST", body: { linkedin_post_url: postUrl } }),
    600,
  );
}

/** GET /me/tasks */
export function listTasks() {
  return withMock<Task[]>(
    () => buildJourney(DEFAULT_STAGE).tasks,
    () => apiRequest("/me/tasks"),
  );
}

export interface TaskSubmissionInput {
  task_id: string;
  title: string;
  github_url: string;
  live_demo_url?: string;
  description: string;
  screenshots: File[];
}

/**
 * POST /task-submissions — multipart, because the screenshots go straight
 * through to Cloudflare R2 on the backend.
 */
export function submitTask(input: TaskSubmissionInput) {
  return withMock<Pick<TaskSubmission, "id" | "status">>(
    () => ({ id: "sub-mock-001", status: "under_review" }),
    () => {
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

      return apiRequest("/task-submissions", { method: "POST", formData: form });
    },
    900,
  );
}

/** POST /payments/order — returns the Razorpay order to open checkout with. */
export function createPaymentOrder() {
  return withMock<{ order_id: string; amount: number; currency: string; key_id: string }>(
    () => ({ order_id: "order_mock_KLS001", amount: 5000, currency: "INR", key_id: "rzp_test_mock" }),
    () => apiRequest("/payments/order", { method: "POST" }),
    600,
  );
}

/** POST /payments/verify — backend checks the Razorpay signature. */
export function confirmPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return withMock<Payment>(
    () => ({
      id: "pay-mock-001",
      student_id: "usr-student-001",
      transaction_id: payload.razorpay_payment_id,
      amount: 50,
      payment_status: "success",
      paid_at: new Date().toISOString(),
    }),
    () => apiRequest("/payments/verify", { method: "POST", body: payload }),
    1200,
  );
}

/** PATCH /me/profile */
export function updateProfile(values: ProfileValues) {
  return withMock<StudentProfile>(
    () => buildJourney(DEFAULT_STAGE).profile,
    () => apiRequest("/me/profile", { method: "PATCH", body: values }),
    600,
  );
}

/** GET /me/notifications */
export function listNotifications() {
  return withMock<AppNotification[]>(
    () => buildJourney(DEFAULT_STAGE).notifications,
    () => apiRequest("/me/notifications"),
  );
}

/** PATCH /me/notifications/read */
export function markNotificationsRead(ids: string[]) {
  return withMock<{ ok: true }>(
    () => ({ ok: true }),
    () => apiRequest("/me/notifications/read", { method: "PATCH", body: { ids } }),
    200,
  );
}

/** GET /me/certificate */
export function getMyCertificate() {
  return withMock<Certificate | null>(
    () => buildJourney("certificate_issued").certificate,
    () => apiRequest("/me/certificate"),
  );
}
