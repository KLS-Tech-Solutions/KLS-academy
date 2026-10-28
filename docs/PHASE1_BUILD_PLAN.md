# KLS Academy — MVP 001 · Phase 1 Build Plan (Frontend UI)

**Repo:** `academy` → `academy.klstechsolutions.in`
**Scope of this phase:** UI only. No backend, no real APIs, no auth, no payments, no certificate generation.
**Decisions locked:** Next.js (App Router) · two separate repos (academy / admin) · Phase 1 = public site + full student dashboard.

---

## 0. Ground rules for this phase

| Do | Don't |
| --- | --- |
| Build every screen with typed mock data | Call any API |
| Route state through one enrollment state machine | Implement JWT / sessions |
| Keep a service layer with real-looking function signatures | Write business logic in components |
| Match klstechsolutions.in theme exactly | Invent a second design language |
| Ship loading / empty / error / locked states | Leave dead-end screens |

Uploads use local `URL.createObjectURL` previews. Razorpay is a static checkout mock. Offer letter and certificate are styled HTML previews with a disabled Download button.

---

## 1. Migration & repo setup

**Step 0 — Freeze current deploy (30 min)**
- Branch from `dev` → `feat/mvp-001-ui`. `dev` stays deployable so the live coming-soon page never breaks.
- Coming-soon page is preserved as a component and gated by `NEXT_PUBLIC_LAUNCH_MODE=coming_soon`. Set to `preview` on the Vercel preview deployment so the team can review the real site while the public still sees coming-soon.

**Step 1 — Next.js scaffold (1–2 h)**
- `create-next-app` — TypeScript, App Router, Tailwind v4, ESLint, `@/*` alias, `src/` dir.
- Port `package.json` scripts, `.gitignore`, README. Remove Vite config, `main.tsx`, `index.html`.
- `next.config.ts`: image domains placeholder for Cloudflare R2, strict mode on.
- Vercel project settings updated to Next.js preset; confirm the existing domain still resolves on a preview deploy before merging.

**Deliverable:** app boots at `/` showing the existing coming-soon page, deployed to a Vercel preview URL.

---

## 2. Design system — the piece everything else depends on

**Step 2 — Theme tokens + shadcn/ui (2 h)**

Extract the klstechsolutions.in language into `src/styles/theme.css` as Tailwind v4 `@theme` tokens. This single file is the contract — it gets copied verbatim into the admin repo so both apps stay in the same family.

Tokens to define:
- **Colour** — ink navy (headings), brand blue (accent/`Engineered` blue), deep navy (gradient start), brand-50/100 tints, accent green (badge pill), body grey, muted grey, hairline border, canvas.
- **Type** — one display/sans family, weights 400–800, tight negative tracking on headings, 1.6 body leading.
- **Radius** — card (~20px), pill (999px) for nav and buttons.
- **Shadow** — soft / card / lift / nav, all low-opacity navy rather than black.
- **Utilities** — faint engineering grid background + radial fade mask, brand gradient fill, brand gradient text.

Then `shadcn/ui init` and pull only what we need: `button, input, textarea, label, select, card, badge, dialog, dropdown-menu, tabs, accordion, avatar, progress, separator, sonner, skeleton, table, alert, form, tooltip, sheet`. Every generated component is re-skinned to the tokens above — default shadcn greys are not our theme.

**Blocked on you:** the KLS logo as SVG/PNG, and exact brand hex values if a style guide exists. Until then I derive them from the site screenshot and we correct in one pass.

---

## 3. Foundations

**Step 3 — Layout shells (2 h)**
- `(public)` layout: floating pill navbar (Home · Internships · About · Verify · Contact + gradient "Login / Register" CTA), mobile sheet nav, footer with sitemap + contact + legal links.
- `(dashboard)` layout: collapsible left sidebar (Dashboard, Offer Letter, Tasks, Payment, Certificate, Profile, Notifications), topbar with breadcrumb + notification bell + avatar menu, mobile drawer.
- `(auth)` layout: centred card on the grid background.
- Shared: page transition wrapper, `SectionHeader`, `PageHero`, `Container`, `Reveal` (scroll-in animation), `StatusBadge`, `EmptyState`, `LockedState`, `Loading` skeletons, `not-found.tsx`, `error.tsx`.

**Step 4 — Types, mock data, service layer (2 h)**

`src/types/` mirrors the v2 schema one-to-one — `User`, `StudentProfile`, `InternshipDomain`, `InternshipBatch`, `Enrollment`, `OfferLetter`, `LinkedInSubmission`, `Task`, `TaskSubmission`, `TaskScreenshot`, `AdminReview`, `Payment`, `Certificate`, `Notification`.

The backbone of the whole UI is one union type driving every screen's render:

```
not_enrolled → enrolled → offer_letter_generated → linkedin_submitted
→ linkedin_approved → tasks_in_progress → all_tasks_approved
→ payment_pending → paid → certificate_issued
```

Plus per-submission status: `draft | submitted | under_review | approved | rejected`.

`src/services/` exposes the functions the real API will implement — `getMyEnrollment()`, `enrollInDomain()`, `getOfferLetter()`, `submitLinkedInPost()`, `getTasks()`, `submitTask()`, `createPaymentOrder()`, `getCertificate()`. In Phase 1 each returns mock data after an artificial delay. In Phase 3 only the bodies change; no screen is touched.

A dev-only state switcher (visible in non-production builds) lets us jump the mock student between all ten states to review every screen without a backend.

---

## 4. Screens

**Step 5 — Public pages (4–5 h)**

| Route | Contents |
| --- | --- |
| `/` | Hero, what a verified internship is, the 8-step journey, domains preview, why KLS Academy, certificate teaser, testimonials, FAQ, CTA |
| `/internships` | Domain grid — title, duration, difficulty, description, Enrol CTA |
| `/internships/[slug]` | Domain detail — outcomes, task outline, duration, batch dates, what you submit, certificate, FAQ |
| `/about` | Mission, vision, learning philosophy, KLS Tech Solutions link |
| `/verify` | Certificate ID input + QR-scan explainer |
| `/verify/[certificateId]` | Verification result card — valid / not found states, student name, domain, issue date, certificate number |
| `/contact` | Form UI + office details |
| `/legal/terms`, `/legal/privacy`, `/legal/refund` | Required before Razorpay activation — flagging early so it isn't a launch blocker |

**Step 6 — Auth screens (2 h)**
`/register` (name, email, phone, password + confirm), `/login`, `/verify-email`, `/forgot-password`, `/reset-password`. Layout and error slots built now; real validation lands in Phase 2.

**Step 7 — Student dashboard (6–8 h)** — the bulk of the work

| Route | Contents |
| --- | --- |
| `/dashboard` | Stat cards (active internship, tasks done, certificates, progress %), a "your next action" card driven by the state machine, progress timeline, recent notifications |
| `/dashboard/enroll` | Domain + batch selection, confirmation dialog. Hidden once enrolled |
| `/dashboard/offer-letter` | Offer letter preview with number, download button, "post this on LinkedIn" instruction |
| `/dashboard/linkedin` | Task 1 — LinkedIn post URL submission, pending/approved/rejected states with admin comment |
| `/dashboard/tasks` | Task list with lock overlay until LinkedIn is approved; per-task status chips and deadlines |
| `/dashboard/tasks/[id]` | Task brief + submission form: title, detailed explanation, GitHub URL, optional live demo, **minimum 3 screenshots** with drag-drop, reorder, preview, remove |
| `/dashboard/tasks/[id]` (reviewed) | Read-only submission + admin remarks + resubmit path when rejected |
| `/dashboard/payment` | Locked until all tasks approved. ₹50 summary, mock Razorpay modal, success and failure states |
| `/dashboard/certificate` | Locked until paid. Certificate preview with QR block, download button, share-to-LinkedIn CTA, verification URL |
| `/dashboard/profile` | College, degree, branch, year, LinkedIn, GitHub, avatar |
| `/dashboard/notifications` | List with read/unread, filter by type |

**Step 8 — Polish (2 h)**
Responsive pass at 360 / 768 / 1024 / 1440. Loading skeletons on every data screen. Empty and locked states everywhere. Framer Motion: fade-up on scroll, card lift on hover, route transitions — subtle only. Keyboard focus rings, alt text, ARIA on the dashboard nav. `prefers-reduced-motion` respected.

**Step 9 — Verify & ship (1 h)**
`next build` clean, no TypeScript errors, Lighthouse ≥ 90 on the public pages, preview deploy for your review.

---

## 5. What comes after (not today)

**Phase 2 — Validation.** `react-hook-form` + `zod`, one schema file per form, rules matched to the DB constraints: email/phone format, password strength, GitHub URL must be a public repo pattern, LinkedIn post URL pattern, minimum 3 screenshots with size/type caps, explanation minimum length. Inline errors, submit-disabled states, toast on success.

**Phase 3 — API integration.** Typed fetch client with JWT interceptor and refresh, TanStack Query for caching, `NEXT_PUBLIC_API_URL` env, error boundary + retry, optimistic updates on submissions, then swap each service body from mock to real. Screens stay untouched — that's the point of the service layer.

**Phase 4 — Admin repo.** Same tokens file, same component conventions, review/approval queues, analytics.

---

## 6. Sequencing

Steps 0–4 are prerequisites for everything and must land first. Steps 5, 6 and 7 are independent of each other once the shells exist.

Rough total for Phase 1: **20–26 focused hours**. If time is tighter than that, the fastest cut is `/internships/[slug]`, `/about` and the notifications page — none of them block the student journey.

---

## 7. Open items from your side

1. KLS logo files (SVG preferred) and brand hex codes.
2. Final internship domain list with duration and difficulty — the six from the poster, or a different set?
3. Certificate and offer letter designs, if they already exist.
4. Number of technical tasks per domain (fixed, or varies by domain?).
5. Razorpay account status — needed for Phase 3, and the legal pages are a prerequisite.
6. Confirm whether the admin repo gets scaffolded in parallel or after academy Phase 1 ships.

---

## Addendum — branding decisions (Aug 2026)

- **Entity naming:** the organisation is referred to as **KLS Tech Solutions**, MSME
  registered. "Pvt. Ltd." must not appear anywhere in this project.
- **MSME mark:** every issued document carries the Ministry of MSME mark — bottom-right
  on the offer letter, bottom-centre on the certificate. Component:
  `src/components/shared/msme-badge.tsx`.
- **Outstanding:** `public/brand/msme.png` is a cleaned-up raster recovered from a
  watermarked source. Replace it with the official artwork from the Udyam / MSME portal
  before any document is printed or issued.
