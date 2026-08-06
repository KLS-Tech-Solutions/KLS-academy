# KLS Academy — Frontend

Front end for [academy.klstechsolutions.in](https://academy.klstechsolutions.in) — the
verified virtual internship platform by KLS Tech Solutions.

**Status: Phases 1–3 complete.** Full UI, validated forms, and a real API layer with
httpOnly-cookie sessions. Runs end to end on mock data until `NEXT_PUBLIC_USE_MOCKS`
is set to `false` — no code change needed to point it at FastAPI.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | oxlint |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query ·
react-hook-form + zod · Framer Motion · lucide-react

## Project structure

```
src/
├── app/
│   ├── (public)/        Landing, internships, about, verify, contact, legal
│   ├── (auth)/          Login, register, verify email, password reset
│   ├── dashboard/       Student dashboard — the full internship journey
│   └── coming-soon/     Holding page shown when the launch flag is set
├── components/
│   ├── ui/              Primitives: button, card, input, badge, dialog, accordion
│   ├── layout/          Public navbar/footer, dashboard shell
│   ├── marketing/       Domain card, certificate preview, public forms
│   ├── dashboard/       Stat cards, journey timeline, screenshot uploader
│   └── shared/          Logo, container, section headers, empty/locked states
├── data/                Mock JSON-shaped data
├── services/            API calls, mock-switchable via NEXT_PUBLIC_USE_MOCKS
├── types/               Types mirrored from the PostgreSQL schema
├── app/api/             Auth route handlers + FastAPI proxy (server only)
├── hooks/               Journey provider, session, queries, mutations
├── lib/api/             HTTP client, error taxonomy, mock switch
├── lib/validation/      Zod schemas — the single source of truth for rules
└── styles/theme.css     KLS design tokens
```

## The journey state machine

Everything in the dashboard renders from one value in `src/types/index.ts`:

```
not_enrolled → enrolled → offer_letter_generated → linkedin_submitted
→ linkedin_approved → tasks_in_progress → all_tasks_approved
→ payment_pending → paid → certificate_issued
```

`hasReached(stage, target)` decides what is unlocked. In development a **stage
switcher** appears in the dashboard top bar — use it to preview any of the ten states
without a backend. It hides itself in production builds.

## Launch flag

`src/proxy.ts` rewrites every route to the holding page while the site is not live:

```bash
NEXT_PUBLIC_LAUNCH_MODE=coming_soon   # public sees the holding page
NEXT_PUBLIC_LAUNCH_MODE=live          # full site
```

Set `coming_soon` on the production Vercel environment and `live` on previews so the
team can review while the public still sees the announcement.

## Design system

`src/styles/theme.css` holds every colour, radius, shadow and font token, derived from
klstechsolutions.in. **This file is the contract with the admin app** — copy it verbatim
into `admin` so both surfaces stay in the same family. Nothing should hardcode a hex
value outside it.

## Validation (Phase 2 — done)

Every form runs on `react-hook-form` + `zod`. Schemas live in `src/lib/validation/` and
are the single source of truth — the screenshot uploader, character counters and
password hints all read their limits from there rather than repeating numbers.

`useZodForm()` in `src/components/ui/form.tsx` fixes the behaviour once for the whole
app: **validate on blur, then re-validate on every keystroke once a field has errored.**
`<FormField>` wires a field to its label, hint, error slot and `aria-describedby`.

| Field | Rule |
| --- | --- |
| Full name | 2–100 chars, letters/spaces/hyphens/apostrophes (Unicode-aware) |
| Email | Valid address, max 255, trimmed and lowercased before submit |
| Phone | Indian mobile — optional `+91`, must start 6–9, 10 digits; spaces stripped |
| Password | Min 8, at least one letter and one number; confirm must match |
| GitHub (submission) | Must be a repository URL, not a profile or another host |
| LinkedIn (Task 1) | Must be a post or feed-update URL, not a profile |
| Live demo | Optional, but must be `https://` when present |
| Explanation | 120–5000 characters, with a live counter |
| Screenshots | 3–8 files, PNG/JPG/WebP only, max 5 MB each |
| Certificate number | `KLS-ACAD-YYYY-NNNNN`, uppercased before lookup |

Schemas were exercised against 35 valid/invalid cases — including rejecting a GitHub
profile URL where a repo is required, a LinkedIn profile where a post is required, a
6 MB screenshot, a PDF disguised as a screenshot, and a landline-prefixed phone number.

Success feedback goes through the toast provider in `src/components/ui/toast.tsx`.

## API layer (Phase 3 — done)

Every service calls the real API. It runs against mock data until you flip one env var.
See `docs/API_CONTRACT.md` for the endpoint shapes the backend must return.

```bash
NEXT_PUBLIC_USE_MOCKS=true    # resolve from src/data, no backend needed
NEXT_PUBLIC_USE_MOCKS=false   # call FastAPI through the proxy
API_BASE_URL=http://localhost:8000/api/v1
COOKIE_SECURE=true            # required in any deployed environment
```

**Auth never touches JavaScript-readable storage.** The browser posts to
`/api/auth/login`; a Next route handler exchanges it with FastAPI and stores both tokens
in httpOnly cookies. Every later request goes to `/api/proxy/*`, which attaches the token
server-side. An XSS payload on the page cannot read the JWT.

**On a 401** the client refreshes once and replays the original request — concurrent 401s
share a single refresh call rather than stampeding. If the refresh fails, the session is
cleared and the student lands on `/login`.

**Server state** is TanStack Query. Keys live in `src/lib/query-keys.ts`; mutations
invalidate `queryKeys.journey.all`, the aggregate the whole dashboard reads from. Retries
are deliberate — 5xx and network errors retry twice, while 401, 403, 404, 409 and 422
never retry because they will not fix themselves.

**Errors** normalise into one `ApiError` with a `kind` (`network`, `unauthorized`,
`validation`, …) and a `userMessage`. Screens branch on `kind`, never on status codes.
FastAPI 422 responses map back onto the individual form fields that produced them.

`GET /me/journey` is the endpoint that matters most — one aggregate carrying stage,
enrolment, tasks, submissions, payment and certificate. `JourneyProvider` owns its
loading and error states, which is why no Phase 1 screen needed rewriting when real
fetching replaced the mock context.

### Architecture

```
browser ──► /api/auth/*    (route handlers)  ──► FastAPI   sets httpOnly cookies
        └─► /api/proxy/*   (pass-through)    ──► FastAPI   attaches Bearer token
```

## Known placeholders

- MSME mark is recovered from a watermarked source — replace `public/brand/msme.png`
  with the official Udyam artwork before any document is issued.
- Brand logos are raster; drop in SVGs and change two `src` strings in `Logo.tsx`.
- Offer letter and certificate are styled HTML previews; downloads are inert.
- Razorpay browser checkout is stubbed between `/payments/order` and `/payments/verify`.
- Password reset and email verification resolve locally — they need the token from the
  email link.
- Legal pages are placeholder copy pending review.
