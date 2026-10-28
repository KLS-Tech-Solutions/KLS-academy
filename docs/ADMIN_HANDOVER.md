# KLS Academy — Admin app handover brief

**For:** Developer 2 · `admin.klstechsolutions.in`
**From:** the `academy` frontend team
**Date:** 6 Aug 2026

Read `docs/API_CONTRACT.md` and `docs/MVP_STATUS.md` in the `academy` repo alongside this.

---

## 1. Where things stand

| Piece | Owner | State |
| --- | --- | --- |
| Student frontend (`academy`) | Dev 1 | ✅ Complete — 26 pages, validated forms, API layer wired |
| FastAPI backend | Dev 1 | 🔨 Starting now |
| **Admin frontend (`admin`)** | **You** | ⬜ Not started |

You are not blocked on the backend. Build against mock data using the same pattern the
student app uses (section 5), and flip one env var when the API lands.

---

## 2. What you own

**Review queues — the highest-value screens.** Nothing in a student's journey moves
until an admin approves something. Build these first.

1. **LinkedIn submissions queue** — student posts their offer letter, you verify it.
   Approve unlocks all their technical tasks. Reject needs a comment.
2. **Task submissions queue** — GitHub repo, 3–8 screenshots, written explanation.
   Approve or reject with remarks. Every task approved unlocks their ₹50 payment.

**Then:**

3. Admin authentication and RBAC
4. Domain, batch and task CRUD
5. Student directory + individual student detail
6. Payments and certificates list, certificate revocation
7. Analytics overview and activity logs

---

## 3. Non-negotiables

**Copy `src/styles/theme.css` from the `academy` repo verbatim.** It is the contract
between the two apps — every colour, radius, shadow and font token. Do not add hex
values outside it. When it changes, it changes in `academy` first and gets copied over.

**Never write "Pvt. Ltd." anywhere.** The organisation is **KLS Tech Solutions**, MSME
registered. This is a hard rule across the project.

**Same design language as klstechsolutions.in.** Light surfaces, navy ink, brand blue,
pill buttons, soft navy-tinted shadows, faint engineering grid on hero areas. An admin
tool can be denser than the student app, but it must look like the same product family.

**Brand assets** live in `academy/public/brand/`: `kls-mark.png` (monogram — use next to
the word "Admin"), `kls-logo.png` (full lockup — documents only), `msme.png`. The MSME
file is a cleaned-up raster pending official artwork; do not put it on anything printed.

---

## 4. Worth copying rather than rewriting

These are already built, tested and on-theme. Lift them from `academy/src/`:

| Path | What it gives you |
| --- | --- |
| `styles/theme.css` | The design tokens — **required** |
| `components/ui/` | Button, Card, Badge, Input, Select, Field, Dialog, Accordion, Tabs, Alert, Progress, Skeleton, Avatar, Toast |
| `components/ui/form.tsx` | `useZodForm()`, `<FormField>`, character counter — validate on blur, re-validate on change |
| `lib/api/` | HTTP client, `ApiError` taxonomy, 401 refresh-and-replay, the `withMock()` switch |
| `lib/utils.ts` | `cn()`, date and currency formatters |
| `types/index.ts` | **All domain types.** Copy as-is — see section 6 |
| `lib/query-keys.ts` | Query key registry pattern |
| `components/shared/` | Logo, Container, SectionHeader, EmptyState, status badges |

Stack we used, so the two apps stay maintainable by the same people: Next.js 16 App
Router, React 19, TypeScript, Tailwind v4, TanStack Query, react-hook-form + zod,
framer-motion, lucide-react. **Note:** lucide-react v1 dropped brand icons — `Github`
and `Linkedin` do not exist. Use `FolderGit2` and `Share2`.

---

## 5. Working without the backend

The student app runs end to end on mock data. Copy the mechanism:

```ts
// src/lib/api/mock.ts
export async function withMock<T>(mock: () => T, live: () => Promise<T>) {
  if (USE_MOCKS) { await delay(300); return mock(); }
  return live();
}

// every service reads the same either way
export function listPendingSubmissions() {
  return withMock<TaskSubmission[]>(
    () => mockSubmissions,
    () => apiRequest("/admin/task-submissions", { query: { status: "pending" } }),
  );
}
```

`NEXT_PUBLIC_USE_MOCKS=true` until the backend is up, then `false`. No screen changes.

**Auth pattern:** the student app keeps JWTs in **httpOnly cookies**, never
localStorage. The browser calls Next route handlers (`/api/auth/login`) which talk to
FastAPI and set the cookie; all other calls go through `/api/proxy/*` which attaches the
token server-side. Copy this — an admin token is a higher-value target than a student's.

---

## 6. The one thing to understand before writing code

Every student has a **stage** — a single value that decides what is locked in their
dashboard:

```
not_enrolled → enrolled → offer_letter_generated → linkedin_submitted
→ linkedin_approved → tasks_in_progress → all_tasks_approved
→ payment_pending → paid → certificate_issued
```

**Your approve/reject actions are what move students through it.** Approving a LinkedIn
post moves them to `linkedin_approved`. Approving the final task moves them to
`all_tasks_approved`, which unlocks payment, which unlocks the certificate.

The backend owns this value and computes it — neither frontend infers it. But it means
your review screens are the engine of the whole product, and an approval that silently
fails leaves a student stuck with no way forward. Handle mutation errors loudly.

`GET /admin/students/{id}` returns the **same `StudentJourney` shape** the student
dashboard consumes, so `types/index.ts` copies straight across and your student-detail
screen can mirror the student's own view.

---

## 7. Draft admin API surface

Dev 1 is building these. **Review this list now and raise anything missing** — it is far
cheaper to change before the endpoints exist.

### Auth
```
POST   /auth/login                        role must be admin
GET    /auth/me
POST   /auth/refresh
POST   /auth/logout
```

### Review queues
```
GET    /admin/linkedin-submissions?status=pending|approved|rejected
PATCH  /admin/linkedin-submissions/{id}     { status, admin_comment }

GET    /admin/task-submissions?status=&batch_id=&task_id=&student_id=
GET    /admin/task-submissions/{id}         includes screenshots[] + student
POST   /admin/task-submissions/{id}/review  { status: approved|rejected, remarks }
```

### Catalogue management
```
GET    /admin/internship-domains
POST   /admin/internship-domains
PATCH  /admin/internship-domains/{id}
DELETE /admin/internship-domains/{id}

GET    /admin/internship-batches
POST   /admin/internship-batches
PATCH  /admin/internship-batches/{id}

GET    /admin/tasks?batch_id=
POST   /admin/tasks
PATCH  /admin/tasks/{id}
DELETE /admin/tasks/{id}
```

### Students, money, credentials
```
GET    /admin/students?search=&batch_id=&stage=
GET    /admin/students/{id}                 → StudentJourney
GET    /admin/payments?status=
GET    /admin/certificates
POST   /admin/certificates/{id}/revoke      { reason }
```

### Ops
```
GET    /admin/analytics/overview            counts by stage, approvals, revenue
GET    /admin/activity-logs?user_id=&module=
```

### Error shapes
Identical to the student contract — see `docs/API_CONTRACT.md` §Error shapes. 401 triggers
one refresh and replay; 422 maps onto form fields via `loc[-1]`; only 5xx and network
errors retry.

---

## 8. Suggested order

1. Scaffold + copy `theme.css` and `components/ui/` → prove the look matches
2. Admin shell: sidebar, topbar, auth screens, route guard
3. Types + mock data + services with `withMock()`
4. **Task submissions queue** — list, detail with screenshot viewer, approve/reject
5. **LinkedIn queue** — simpler, same pattern
6. Domain / batch / task CRUD
7. Student directory and detail
8. Payments, certificates, analytics, activity logs

Items 4 and 5 are the ones that unblock real students. Everything after is management
convenience.

---

## 9. Coordination

- **Design tokens flow one way:** `academy` → `admin`. Propose changes to Dev 1 first.
- **Types flow one way:** `academy/src/types/index.ts` is the source. If the schema
  changes, it changes there and gets copied.
- **API changes:** raise with Dev 1 before building around an assumption. The contract
  doc is the single source of truth for both apps.
- **Blocked?** Say so early — `withMock()` means a missing endpoint should never stop
  you building the screen.

## 10. Decisions locked (6 Aug 2026)

**Two admin roles.** `admin` and `super_admin`.

| Capability | admin | super_admin |
| --- | :---: | :---: |
| Review LinkedIn submissions | ✅ | ✅ |
| Review task submissions | ✅ | ✅ |
| View students, payments, certificates | ✅ | ✅ |
| Create / edit domains, batches, tasks | ❌ | ✅ |
| Revoke certificates | ❌ | ✅ |
| Manage admin accounts | ❌ | ✅ |
| View activity logs | ❌ | ✅ |

The JWT carries the role; the backend enforces it. Your UI should hide what the role
cannot do **and** handle a 403 gracefully — never assume the frontend check is the only one.

**Tasks per domain are variable.** Each domain defines its own set. Task CRUD must
support add, remove and reorder, and `order_number` has to stay contiguous within a
batch — the student app renders tasks in that order and locks each behind the previous
one's approval. Reordering after students have started is the risky case; consider
warning before allowing it.

**One shared FastAPI backend and one database** serve both apps. Student routes are
`/me/*`, admin routes are `/admin/*`, same JWT issuer.

## 11. Still open

- Official MSME artwork from the Udyam portal
- Offer letter and certificate designs
- Razorpay account and keys
