# KLS Academy MVP 001 — status against the PRD

Assessed against `KLS_Academy_MVP_001_PRD.pdf` and `KLS_Academy_MVP_001_Implementation_Guide.pdf`.
Last updated: 6 Aug 2026 · branch `feat/mvp-001-ui`

**One-line summary:** the student-facing frontend is finished. The backend has not been
started, and the admin app has not been started. Everything below follows from that.

---

## 1. PRD MVP features

| # | Feature | Frontend | Backend | Overall |
| --- | --- | --- | --- | --- |
| 1 | Public website | ✅ Done | n/a | ✅ **Done** |
| 2 | Student registration & login | ✅ Done | ❌ Not started | 🟡 Half |
| 3 | Internship domain selection | ✅ Done | ❌ Not started | 🟡 Half |
| 4 | Automatic PDF offer letter | 🟡 Preview only | ❌ Not started | 🔴 **Mostly missing** |
| 5 | LinkedIn onboarding task | ✅ Done | ❌ Not started | 🟡 Half |
| 6 | Student dashboard | ✅ Done | ❌ Not started | 🟡 Half |
| 7 | Admin dashboard | ❌ Not started | ❌ Not started | 🔴 **Not started** |
| 8 | Internship task management | ✅ Student side | ❌ Admin CRUD missing | 🟡 Half |
| 9 | Project submission | ✅ Done | ❌ No storage | 🟡 Half |
| 10 | QR certificate generation | 🟡 Preview only | ❌ Not started | 🔴 **Mostly missing** |
| 11 | Certificate verification | ✅ Done | ❌ Endpoint missing | 🟡 Half |
| 12 | Razorpay payment | 🟡 Order/verify wired, checkout stubbed | ❌ Not started | 🔴 **Mostly missing** |

---

## 2. Functional requirements (Implementation Guide)

| FR | Requirement | State | What's left |
| --- | --- | --- | --- |
| FR1 | Student & admin auth (JWT/RBAC) | 🟡 | httpOnly-cookie session layer and proxy are built; FastAPI JWT issuing, refresh and role checks are not |
| FR2 | Registration & profile management | 🟡 | Forms, validation and API calls done; persistence missing |
| FR3 | Internship domain selection | 🟡 | Catalogue and enrol flow done; `POST /enrollments` missing |
| FR4 | Automatic PDF offer letter | 🔴 | Only an HTML preview exists. Needs a PDF service, an offer-letter number sequence, and R2 storage |
| FR5 | LinkedIn submission (Task 1) | 🟡 | Form, URL validation and states done; endpoint and admin verification missing |
| FR6 | Internship task management | 🟡 | Student list/detail done; admin task CRUD missing entirely |
| FR7 | Project submission | 🟡 | Multipart request built (3–8 screenshots, ≤5 MB, PNG/JPG/WebP); R2 upload and persistence missing |
| FR8 | Admin review & approval | 🔴 | Not started. This is what unblocks every downstream stage |
| FR9 | Razorpay ₹50 payment | 🔴 | Order and verify calls wired; browser SDK stubbed, backend and signature check missing |
| FR10 | QR certificate generation | 🔴 | Preview only. Needs generation, QR encoding, certificate numbering, R2 storage |
| FR11 | Public verification portal | 🟡 | Server-rendered page and lookup done; `GET /certificates/verify/{n}` missing |
| FR12 | Admin dashboard & analytics | 🔴 | Not started |
| FR13 | Notifications & activity logs | 🟡 | In-app list and read state done; email templates, delivery and audit logs missing |

---

## 3. Implementation Guide — the 16 steps

| Step | State |
| --- | --- |
| 1. GitHub repo & branching | 🟡 Branch `feat/mvp-001-ui` in use; admin repo not created |
| 2. Setup Next.js, FastAPI, PostgreSQL, Docker | 🟡 Next.js done; FastAPI, Postgres, Docker not |
| 3. Authentication & RBAC | 🟡 Frontend only |
| 4. Landing website | ✅ Done |
| 5. Student dashboard | ✅ Done (frontend) |
| 6. Admin dashboard | ❌ |
| 7. Internship domain management | 🟡 Read side done; admin CRUD not |
| 8. Offer letter PDF generation | ❌ |
| 9. LinkedIn task workflow | 🟡 Student half |
| 10. Task submission module | 🟡 Student half |
| 11. Admin review & approval | ❌ |
| 12. Razorpay integration | 🟡 Partial |
| 13. QR verified certificates | ❌ |
| 14. Certificate verification portal | 🟡 Frontend done |
| 15. Notifications & analytics | 🟡 In-app only |
| 16. Testing, UAT, production deployment | ❌ |

**Roughly: 4 of 16 complete, 8 partial, 4 not started.** The partials are almost all
"frontend done, backend missing".

---

## 4. What exists today

26 pages · 6 API route handlers · 37 components · 6 services · 7 validation schemas.

- Full public site, five auth screens, eleven dashboard screens
- Every form validated with zod, rules matched to the DB constraints
- Real HTTP client with httpOnly-cookie sessions, 401 refresh-and-replay, one error taxonomy
- TanStack Query for caching and invalidation
- KLS theme tokens, official logo, MSME mark on both documents
- Runs end to end on mock data; `NEXT_PUBLIC_USE_MOCKS=false` points it at FastAPI

---

## 5. Remaining phases

### Phase 4 — FastAPI backend  ← **the critical path**

Nothing else can be finished before this. `docs/API_CONTRACT.md` already specifies every
endpoint, request shape and error shape the frontend expects.

1. Project setup: FastAPI, SQLAlchemy, Alembic, Docker, Postgres
2. Schema migrations from `KLS_Academy_MVP_Database_Schema_v2` (18 tables)
3. Auth: register, login, refresh, logout, `/auth/me`, email verification, password reset, RBAC
4. Catalogue: domains and batches
5. `GET /me/journey` — the aggregate the whole dashboard reads from. **The backend owns
   the `stage` value; the UI never infers it.**
6. Enrolment, LinkedIn submission, tasks, task submissions (multipart → R2)
7. Certificate verification endpoint (public)

**Milestone:** set `NEXT_PUBLIC_USE_MOCKS=false` and the existing UI works unchanged.

### Phase 5 — Admin application

New repo on `admin.klstechsolutions.in`. Copy `src/styles/theme.css` verbatim so both
surfaces stay identical.

- Admin auth and RBAC
- Review queues: LinkedIn submissions, task submissions
- Approve / reject with remarks — the workflow that unblocks students
- Domain, batch and task CRUD
- Student directory, analytics, activity logs

### Phase 6 — Document generation

- Offer letter PDF: template, numbering sequence, R2 storage, download endpoint
- Certificate PDF: template, unique number, QR encoding the verification URL, R2 storage
- Replace `public/brand/msme.png` with the official Udyam artwork first

### Phase 7 — Payments, live

- Razorpay account and API keys
- Load `checkout.js` and replace the stubbed handler in `src/app/dashboard/payment/page.tsx`
- Server-side signature verification, webhook for reconciliation
- Legal pages reviewed and published — Razorpay activation depends on them

### Phase 8 — Notifications

- Email service and the eight templates in the schema doc
- Trigger on: welcome, offer letter, LinkedIn approved/rejected, task assigned,
  submission approved/rejected, payment, certificate issued
- Activity logs

### Phase 9 — Testing, UAT, deployment

- Backend tests, frontend E2E of the full journey
- UAT against the PRD's demo scenarios
- Deploy: Vercel (frontend), VPS (backend), Postgres, R2
- Flip `NEXT_PUBLIC_LAUNCH_MODE` to `live`

---

## 6. Blockers and decisions needed

| # | Item | Blocks |
| --- | --- | --- |
| 1 | Official MSME artwork from the Udyam portal | Issuing any document |
| 2 | Razorpay account and keys | Phase 7 |
| 3 | Legal copy reviewed (terms, privacy, refund) | Razorpay activation |
| 4 | Confirm the six internship domains and durations | Backend seed data |
| 5 | Number of technical tasks per domain — fixed or variable? | Task schema |
| 6 | Offer letter and certificate designs | Phase 6 |
| 7 | Who builds the backend, and when do they start? | Everything |
| 8 | VPS provisioned for FastAPI | Deployment |

---

## 7. Recommended sequence

Phase 4 (backend) is the only thing worth starting now — every partial item above is
waiting on it, and the API contract is already written so it can be built against a
fixed target. Phase 5 (admin) can run in parallel with a second person, since it shares
the same backend and the theme file is already portable.
