import type {
  AppNotification,
  Certificate,
  Enrollment,
  JourneyStage,
  LinkedInSubmission,
  OfferLetter,
  Payment,
  StudentJourney,
  StudentProfile,
  Task,
  TaskSubmission,
  User,
} from "@/types";
import { hasReached } from "@/types";
import { batches, domains } from "./domains";

const STUDENT_ID = "usr-student-001";

export const mockUser: User = {
  id: STUDENT_ID,
  full_name: "Ananya Rao",
  email: "ananya.rao@example.com",
  phone: "+91 98450 12345",
  role: "student",
  status: "active",
  email_verified: true,
  created_at: "2026-08-01T09:12:00Z",
};

export const mockProfile: StudentProfile = {
  id: "prof-001",
  user_id: STUDENT_ID,
  college_name: "RV College of Engineering",
  degree: "B.E.",
  branch: "Computer Science",
  year: "3rd Year",
  linkedin_url: "https://linkedin.com/in/ananyarao",
  github_url: "https://github.com/ananyarao",
};

const domain = domains[0];
const batch = batches[0];

const enrollment: Enrollment = {
  id: "enr-001",
  student_id: STUDENT_ID,
  batch_id: batch.id,
  status: "active",
  enrolled_at: "2026-08-02T10:00:00Z",
  completed_at: null,
};

const offerLetter: OfferLetter = {
  id: "off-001",
  student_id: STUDENT_ID,
  batch_id: batch.id,
  offer_letter_number: "KLS/ACAD/2026/00184",
  pdf_url: "#",
  generated_at: "2026-08-02T10:02:00Z",
  linkedin_verified: false,
};

export const mockTasks: Task[] = [
  {
    id: "task-000",
    batch_id: batch.id,
    title: "Share your offer letter on LinkedIn",
    description:
      "Download your offer letter, post it on LinkedIn tagging KLS Tech Solutions, then submit the post URL below. Technical tasks unlock once an administrator verifies your post.",
    order_number: 0,
    deadline: "2026-09-04T00:00:00Z",
    estimated_hours: 1,
    requirements: [
      "Public LinkedIn post containing your offer letter",
      "Tag @KLS Tech Solutions in the post",
      "Submit the direct post URL",
    ],
  },
  {
    id: "task-001",
    batch_id: batch.id,
    title: "Task 1 — REST API foundation",
    description:
      "Build a FastAPI service with user registration, JWT login and a protected resource endpoint. Model your data in PostgreSQL with SQLAlchemy and include migrations.",
    order_number: 1,
    deadline: "2026-09-10T00:00:00Z",
    estimated_hours: 10,
    requirements: [
      "Public GitHub repository with a clear README",
      "Working authentication with JWT",
      "At least three database tables with relationships",
      "Minimum three screenshots showing the API in use",
    ],
  },
  {
    id: "task-002",
    batch_id: batch.id,
    title: "Task 2 — React front end",
    description:
      "Build a responsive React interface that consumes the API from Task 1. Handle loading, empty and error states properly.",
    order_number: 2,
    deadline: "2026-09-17T00:00:00Z",
    estimated_hours: 12,
    requirements: [
      "Component-based architecture",
      "Full responsive behaviour from 360px upwards",
      "Loading, empty and error states for every data view",
      "Minimum three screenshots across breakpoints",
    ],
  },
  {
    id: "task-003",
    batch_id: batch.id,
    title: "Task 3 — Integration and deployment",
    description:
      "Connect both halves, add end-to-end validation and deploy the application. Submit the live URL alongside your repository.",
    order_number: 3,
    deadline: "2026-09-24T00:00:00Z",
    estimated_hours: 14,
    requirements: [
      "Front end and backend deployed and talking to each other",
      "Environment variables handled securely",
      "Live demo URL included in the submission",
      "Minimum three screenshots of the deployed application",
    ],
  },
];

const notifications: AppNotification[] = [
  {
    id: "ntf-001",
    user_id: STUDENT_ID,
    title: "Welcome to KLS Academy",
    message: "Your account is ready. Choose an internship domain to begin.",
    type: "welcome",
    is_read: true,
    created_at: "2026-08-01T09:12:00Z",
  },
  {
    id: "ntf-002",
    user_id: STUDENT_ID,
    title: "Offer letter generated",
    message: `Offer letter ${offerLetter.offer_letter_number} is ready to download.`,
    type: "offer_letter",
    is_read: false,
    created_at: "2026-08-02T10:02:00Z",
  },
  {
    id: "ntf-003",
    user_id: STUDENT_ID,
    title: "LinkedIn task approved",
    message: "Your LinkedIn post was verified. Technical tasks are now unlocked.",
    type: "linkedin",
    is_read: false,
    created_at: "2026-08-03T11:30:00Z",
  },
];

/* --------------------------------------------------------------------------
   Journey builder — returns the complete student state for any stage. The
   dev stage switcher uses this to preview every screen without a backend.
   -------------------------------------------------------------------------- */

function buildSubmissions(stage: JourneyStage): TaskSubmission[] {
  const technical = mockTasks.filter((t) => t.order_number > 0);

  if (!hasReached(stage, "tasks_in_progress")) return [];

  const allApproved = hasReached(stage, "all_tasks_approved");

  return technical.map((task, i) => {
    const approved = allApproved || i === 0;
    const rejected = !allApproved && i === 1;

    const status: TaskSubmission["status"] = approved
      ? "approved"
      : rejected
        ? "rejected"
        : i === 2
          ? "not_started"
          : "under_review";

    return {
      id: `sub-${task.id}`,
      task_id: task.id,
      student_id: STUDENT_ID,
      title: `${task.title.split("—")[1]?.trim() ?? task.title} implementation`,
      github_url: "https://github.com/ananyarao/kls-internship-task",
      live_demo_url: i === 2 ? "https://kls-task-demo.vercel.app" : null,
      description:
        "Implemented the required functionality with a documented architecture, tested each endpoint and captured the working screens.",
      status,
      submitted_at: status === "not_started" ? null : "2026-09-08T14:20:00Z",
      attempt: rejected ? 2 : 1,
      screenshots: status === "not_started"
        ? []
        : [1, 2, 3].map((n) => ({
            id: `shot-${task.id}-${n}`,
            submission_id: `sub-${task.id}`,
            image_url: "",
            display_order: n,
          })),
      review:
        status === "approved"
          ? {
              id: `rev-${task.id}`,
              submission_id: `sub-${task.id}`,
              reviewed_by: "KLS Reviewer",
              remarks: "Clean implementation and clear documentation. Approved.",
              status: "approved",
              reviewed_at: "2026-09-09T09:00:00Z",
            }
          : status === "rejected"
            ? {
                id: `rev-${task.id}`,
                submission_id: `sub-${task.id}`,
                reviewed_by: "KLS Reviewer",
                remarks:
                  "The repository is private and only two screenshots were attached. Make the repo public and add a third screenshot showing the responsive layout, then resubmit.",
                status: "rejected",
                reviewed_at: "2026-09-09T09:05:00Z",
              }
            : null,
    };
  });
}

export function buildJourney(stage: JourneyStage): StudentJourney {
  const enrolled = hasReached(stage, "enrolled");
  const hasOffer = hasReached(stage, "offer_letter_generated");
  const linkedinSubmitted = hasReached(stage, "linkedin_submitted");
  const linkedinApproved = hasReached(stage, "linkedin_approved");
  const paid = hasReached(stage, "paid");
  const certified = hasReached(stage, "certificate_issued");

  const linkedinSubmission: LinkedInSubmission | null = linkedinSubmitted
    ? {
        id: "lnk-001",
        student_id: STUDENT_ID,
        offer_letter_id: offerLetter.id,
        linkedin_post_url:
          "https://www.linkedin.com/posts/ananyarao_kls-academy-internship-activity-000",
        status: linkedinApproved ? "approved" : "pending",
        admin_comment: linkedinApproved ? "Verified. Technical tasks unlocked." : null,
        submitted_at: "2026-08-03T08:15:00Z",
      }
    : null;

  const payment: Payment | null = hasReached(stage, "payment_pending")
    ? {
        id: "pay-001",
        student_id: STUDENT_ID,
        transaction_id: paid ? "pay_RxKLS9021ACAD" : "",
        amount: 50,
        payment_status: paid ? "success" : "created",
        paid_at: paid ? "2026-09-26T16:41:00Z" : null,
      }
    : null;

  const certificate: Certificate | null = certified
    ? {
        id: "cert-001",
        student_id: STUDENT_ID,
        certificate_number: "KLS-ACAD-2026-00184",
        certificate_url: "#",
        qr_code_url: "#",
        issued_at: "2026-09-26T16:45:00Z",
        student_name: mockUser.full_name,
        domain_title: domain.title,
        duration: domain.duration,
        batch_name: batch.batch_name,
      }
    : null;

  return {
    stage,
    user: mockUser,
    profile: mockProfile,
    domain: enrolled ? domain : null,
    batch: enrolled ? batch : null,
    enrollment: enrolled ? enrollment : null,
    offerLetter: hasOffer ? { ...offerLetter, linkedin_verified: linkedinApproved } : null,
    linkedinSubmission,
    tasks: enrolled ? mockTasks : [],
    submissions: buildSubmissions(stage),
    payment,
    certificate,
    notifications,
  };
}

/** Stage used when the app first loads. */
export const DEFAULT_STAGE: JourneyStage = "tasks_in_progress";
