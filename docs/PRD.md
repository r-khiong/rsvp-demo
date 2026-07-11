# RSVP — Product Requirements Document (Phase 1 MVP)

> **Author:** Renata Jiang (r.khiong)
> **Created:** 2026-04-16 · **Last updated:** 2026-07-10
> **Status:** Active
> **Version:** 0.4 (supersedes v0.3 / v0.2 / v0.1)

> **What changed in v0.4 (see full changelog §9):** RSVP-4 and RSVP-5 marked **Done** and
> realigned to as-built (batch-only pivot of 2026-06-09 documented; `registrations.name`
> column; no pagination in MVP); RSVP-6 **moved to Phase 2** (PjM decision 2026-07-07);
> two new stories added — **RSVP-7 Story Landing** and **RSVP-8 Read-only Admin Demo**
> (reviewer-facing visibility layer); product docs moved into the repo (`docs/`);
> security model extended for the demo user.

---

## 1. Overview

### Problem Statement

Event organizers managing 50+ attendees still default to Google Forms plus manual email follow-up for registration and approval. This workflow creates several pain points:

- No centralized view of registration status (pending / approved / rejected)
- Manual email communication for approval results is time-consuming and error-prone
- No standardized check-in method — organizers resort to printed lists or manual name-checks
- Attendees have no self-serve way to check their application status

### Product Summary

RSVP is a lightweight event registration and guest-management tool. Organizers collect applications, review and approve/reject attendees in batch, and verify attendees on-site — replacing the fragmented Google Form + email + spreadsheet workflow with a single streamlined system.

### Portfolio Layer (added in v0.4)

This repo also serves as a PM portfolio artifact. Its primary reviewer persona (hiring managers / interviewers) could not previously see the product's core value — the admin workflow and the decision trail — from the public URL. RSVP-7/8 add a **visibility layer** for that persona without changing the product itself.

---

## 2. Goals & Non-Goals

### Goals (Phase 1 MVP)

| # | Goal | Success Criteria | Status |
|---|------|-----------------|--------|
| G1 | Attendees can submit a registration form | Submission completes without errors; duplicate email is blocked | ✅ Shipped |
| G2 | Organizers can review and approve/reject in batch | Organizer can process 50+ registrations in under 5 minutes | ✅ Shipped |
| G3 | Approved attendees receive a unique QR code | QR renders on the status page immediately after approval | ✅ Shipped |
| G4 | Organizers can verify and check in attendees on-site | Organizer can mark an approved attendee as checked-in from the admin view | ↪ Moved to Phase 2 (2026-07-07); QR verification-ready state shipped via RSVP-5 |
| G5 *(v0.4)* | Reviewers can grasp the product and its decision trail from one URL | A non-technical reader states the product's purpose + two key decisions within 3 minutes; admin workflow visible without requesting credentials | 🔜 RSVP-7/8 |

### Non-Goals (Phase 1)

| Item | Rationale |
|------|-----------|
| Business card file upload | Dropped from MVP (v0.3) — no storage/RLS overhead; reconsider in Phase 2 if a real need surfaces |
| Camera-based QR scanner | On-site verification deferred with RSVP-6 to Phase 2; QR already encodes the token status URL, so the scanner reuses it without backend changes |
| Email / SMS notifications | Depends on third-party integration; deferred to Phase 2 (Gmail SMTP assessed as preferred over Resend before deferral) |
| Automated filtering rules | MVP uses manual review; rule-based filtering needs a TA-definition UI; Phase 2 |
| Free-text search in dashboard | Status filter is sufficient for MVP; keyword search deferred to Phase 2 |
| Pagination in dashboard | *(realigned in v0.4)* Not built in MVP — dataset is small; select-all scopes to the rendered page. Pagination (50/page) moves to Phase 2 with search |
| Interactive demo sandbox *(v0.4)* | Read-only demo + workflow GIF delivers ~80% of reviewer value at ~1/3 cost with zero data-pollution risk; sandbox with data reset is Phase 2, gated on interview feedback |
| Calendar integration | Nice-to-have, not critical to the registration-to-check-in flow |
| Multi-event UI | Schema is multi-event ready; a single event is seeded; multi-event UI deferred |
| Attendee account system | Attendees access status via a unique token URL — no login |
| Story-page analytics / SEO | Out of scope per project-level exclusions (CLAUDE.md §8.9) |

---

## 3. User Personas

### Organizer
| Attribute | Description |
|-----------|-------------|
| Who | Event host (marketing team, community manager, event-agency PM) |
| Goal | Manage the guest list: review applications, control entry, verify attendance on-site |
| Current Solution | Google Form → spreadsheet → manual email → printed list for check-in |
| Pain Points | No batch approval; no real-time status; manual, error-prone check-in |

### Attendee
| Attribute | Description |
|-----------|-------------|
| Who | Professional or community member who wants to attend |
| Goal | Apply, know whether approved, get proof of entry |
| Current Solution | Fill Google Form → wait for email → may miss it / not know the timeline |
| Pain Points | No visibility into status; no standardized entry confirmation |

### Reviewer *(added in v0.4)*
| Attribute | Description |
|-----------|-------------|
| Who | Hiring manager / interviewer reviewing this repo as a portfolio piece |
| Goal | Judge the author's PM judgment (scope, trade-offs, delivery) in minutes |
| Current Solution | Opens the live URL → sees only a registration form; admin flow and decision docs invisible |
| Pain Points | No credentials for the admin side; decisions buried in commit history and external docs |

---

## 4. User Stories & Acceptance Criteria

> Jira keys in parentheses map each story to the live board. AC blocks here are the
> source of truth; the paste-ready Jira versions are in §10.

### RSVP-3 — Registration Form (Attendee)

> **As an** Attendee, **I want to** fill out a registration form, **so that** I can apply to attend the event.

**Acceptance Criteria**
- Form contains: Full Name (required), Email (required), Phone (required), Company / Organization (optional)
- Submission blocked if required fields are empty; inline validation messages shown
- Duplicate email check: if the email already exists for the event, show "This email has already been registered"
- On success, redirect to the Status Page with a persistent unique token URL (`/status/{token}`)
- Status URL shown with the prompt: "Bookmark this page to check your application status"

**Status:** ✅ Done — built, RLS hardened (token-scoped RPC), deployed live.

---

### RSVP-4 — Review & Batch Approval (Organizer)

> **As an** Organizer, **I want to** review all registrations and approve or reject applicants in batch, **so that** I can efficiently manage event attendance.

**Acceptance Criteria** *(realigned to as-built in v0.4; see decision note below)*
- Organizer accesses `/admin/*` via Supabase Auth (single admin account for MVP; SSO / multi-role → Phase 2)
- Dashboard table columns: Select (checkbox) | Name | Email | Phone | Company | Status | Remark (read-only) — plus a per-row link to the attendee's status page for approved rows (shipped with RSVP-5)
- **Batch-only action model:** multi-select via checkboxes → "Approve Selected" / "Reject Selected" in the toolbar. No per-row Approve/Reject buttons; selecting a single row is the single-row operation (same path)
- "Select All" selects the currently rendered page (table is single-page in MVP — pagination deferred to Phase 2)
- Confirmation dialog before any batch action — e.g., "Approve 12 selected applicants?" — with sonner toast on completion
- Status filter: Pending / Approved / Rejected / All (default All)
- Default sort: submission time, newest first
- Idempotent batch: only rows whose status actually changes are updated; same-status rows are a no-op (no error). Approve/Reject are reversible
- Status changes auto-saved on confirm; no separate "Save" button
- `status_updated_at` is written only on a real status transition (explicit app-level write in the Server Action; no DB trigger)

> **Decision note (2026-06-09 pivot):** v0.3 specified per-row Approve/Reject buttons *plus*
> batch actions. Locked to **batch-only** before implementation: it mirrors how organizers
> actually work (review a batch, decide a batch), keeps one write path, and simplifies the
> state machine. Recorded in `docs/decision-log.md`.

**Out of scope (this story):** full auth (SSO, roles) → Phase 2 · free-text search → Phase 2 · CSV export → Phase 2 · concurrent-edit conflict resolution → Phase 2 · inline Remark editing → Phase 2

**Status:** ✅ Done — batch-only dashboard live behind Supabase Auth; RLS policies + table GRANT applied (migration `20260611000000_rsvp4_admin_access.sql`).

---

### RSVP-5 — Application Status Page + QR Code (Attendee)

> **As an** Attendee, **I want to** check my application status and receive a QR code after approval, **so that** I know whether I'm in and can check in on-site.

**Acceptance Criteria**
- Each attendee has a unique, persistent URL: `/status/{token}` (token = nanoid)
- The page displays one of three attendee-facing states:

| State | Visual | Content |
|-------|--------|---------|
| Pending | Neutral (blue/gray) | "Application Received" · "Your application is under review" · name + submission time |
| Approved | Positive (green) | "You're In!" · QR code shown prominently · "Screenshot or bookmark this page for check-in" |
| Rejected | Muted (gray) | "Application Update" · "Unfortunately, your application was not approved this time" |

- Status reflects the organizer's latest review (on load / refresh)
- QR code is rendered client-side from the attendee's token — no static image
- Mobile-responsive (primary access is mobile)

> Note: `checked_in` is an internal status reserved for Phase 2 check-in; the attendee-facing page treats checked-in as the Approved view.

**Status:** ✅ Done — accepted 2026-07-07. Includes admin-side status links; status RPC granted to both `anon` and `authenticated` (migration `20260707000000_grant_status_rpc_to_authenticated.sql` — see decision log: per-role grant lesson).

---

### RSVP-6 — On-Site Manual Check-in (Organizer)

> **As an** Organizer, **I want to** mark approved attendees as checked-in on-site, **so that** I can verify attendance quickly.

**Status:** ↪ **Moved to Phase 2** (PjM decision 2026-07-07). Rationale: the demo's goal is one core flow shipped end-to-end at 100%; check-in is not required for the reviewer-facing E2E story (register → review → status/QR). The QR already encodes the token status URL, so the future check-in flow (manual or scanner) plugs in without backend changes. AC preserved in §8 backlog for Phase 2 pickup.

---

### RSVP-7 — Story Landing (Reviewer) *(added in v0.4)*

> **As a** Reviewer (hiring manager / interviewer), **I want** a single URL that explains the problem, the key decisions, and the full artifact chain in under 3 minutes, **so that** I can judge the author's PM judgment without asking for anything.

**Acceptance Criteria** *(updated 2026-07-11 to the approved Figma V3 design)*
- Root `/` replaces the redirect with a one-page narrative per Figma `Story landing / v3`: hero (tagline + single CTA `Enter RSVP` → `/register`) → About (heading + 3 pain-point pills + Why/How two-column) → integrated **flow × decision showcase** → artifact chips + division-of-labor tags → footer with `Back to top`
- Showcase: product screenshots as base images with callout annotations pairing each flow step with its decision — 4 pairs (Register × scope cut · Status link × token RPC · Batch review × batch-only pivot · QR status × honest sprint close), advanced by scroll; entry buttons `Open live demo` (→ `/register`) and `Enter admin demo (read-only)` (→ RSVP-8 action) below; on-site check-in = **Phase 2** strip
- Motion: CSS fade/slide-in triggered by IntersectionObserver **only** — documented §8.6 exception; no sticky scroll-jacking
- Logo unified to "RSVP" on the story page **and** in the product UI (register / admin headers)
- Language: Chinese body copy, English UI terms (per OQ-9)
- Complies with remaining aesthetic invariants (CLAUDE.md §8.6); mobile 375px / desktop 1280px verified (storyboard pairs stack vertically on mobile)
- Existing routes (`/register`, `/status/[token]`, `/admin/*`) unaffected
- 3-minute test: a non-technical reader can state the product's purpose + two key decisions

**Status:** 📋 To Do — copy and layout locked via Figma V3 (2026-07-11); awaiting screenshot assets.

---

### RSVP-8 — Read-only Admin Demo (Reviewer) *(added in v0.4)*

> **As a** Reviewer, **I want** one-click read-only access to the admin dashboard with seeded data, **so that** I can see the review workflow without requesting credentials.

**Acceptance Criteria**
- "Enter Admin Demo" on the story page signs in a dedicated demo user via a Server Action (credentials live only in server-side env) and lands on `/admin/registrations`
- Demo user sees the seeded dataset (7 rows across pending / approved / rejected) and all filters
- Writes are denied **at the RLS layer** for the demo user (restrictive carve-out from the blanket `authenticated` UPDATE policy) — verified by a direct SQL/API write attempt, not only via UI
- Demo session shows a banner: `Demo mode (read-only) — batch actions disabled. Seeded demo data.`; the batch action bar is disabled, not hidden
- Real admin account behavior is unchanged
- Demo credentials never enter the client bundle or the repo

**Out of scope (this story):** interactive writes + data reset (Phase 2 sandbox) · separate demo dataset (reuses `supabase/seed.sql`)

**Status:** 📋 To Do.

---

## 5. Technical Notes

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (CSS-first, no `tailwind.config.ts`), shadcn/ui
- **Backend / DB:** Supabase (Postgres + Auth + RLS)
- **QR:** `qrcode.react` (client-side generation)
- **Hosting:** Netlify (git-linked continuous deploy)

### Data Model (as-built, v0.4)
```
events
  id                bigint  PK (identity)
  name              text
  created_at        timestamptz

registrations
  id                bigint  PK (identity)
  event_id          bigint  FK → events.id
  name              text          -- v0.3 doc said full_name; as-built column is `name`
  email             text
  phone             text
  company           text  NULL    -- optional
  status            text          -- pending | approved | rejected (checked_in reserved for Phase 2)
  token             text  UNIQUE  -- nanoid
  remark            text  NULL    -- organizer-side note (read-only in UI; inline edit → Phase 2)
  created_at        timestamptz
  status_updated_at timestamptz NULL  -- written only on real status transitions (app-level)

  UNIQUE (event_id, email)
```
Status transitions (live): `pending → approved | rejected` (reversible).
Phase 2 adds: `approved → checked_in` + `checked_in_at` column.

### Security Model
- **Public pages** (`/register`, `/status/{token}`) use the **anon** client under RLS:
  insert-only on `registrations`; reads are token-scoped via a `SECURITY DEFINER` RPC with fixed `search_path`. Direct anon `SELECT` on `registrations` is revoked.
- **Admin pages** (`/admin/*`) are gated by a Server Component check of the **Supabase session server-side**; RLS (authenticated-role SELECT/UPDATE policies **plus table-level GRANT** — both are required) is the enforcement layer at the DB boundary.
- Authorization is kept **out of `proxy.ts`** per Next.js 16 guidance (proxy handles the login redirect UX only; RLS is the enforcement boundary).
- **Grants are per-role:** the status RPC is granted to both `anon` and `authenticated` (2026-07-07 lesson: a logged-in admin opening a status page runs as `authenticated`, not `anon`).
- **Demo user (RSVP-8):** the demo account is an `authenticated` user whose UPDATE/DELETE are denied by a restrictive RLS carve-out; read-only is enforced at the DB boundary, with the UI disabled state as presentation only.

---

## 6. Milestones

| Milestone | Scope | Sprint / Actual |
|-----------|-------|-----------------|
| M0 — Discovery / Setup | PRD, user flow, Jira backlog, environment, first push | Sprint 0 (4/22–5/8) ✅ |
| M1 — Build (paused mid-flight) | RSVP-3, RSVP-4 started | Sprint v2 (5/13–5/22), closed honestly at 0/4 shipped ✅ |
| M2 — Recovery | RSVP-3 ✅ (6/3, RLS hardened) · RSVP-4 ✅ (6/11+) · RSVP-5 ✅ (accepted 7/7) · RSVP-6 ↪ Phase 2 (7/7) | Sprint v3 (6/2–6/16) + spillover, closed 7/7 |
| M3 — Ship | Netlify production deploy, repo public, README | ✅ Live (`r-khiong-rsvp-demo.netlify.app`) |
| M4 — Visibility *(v0.4)* | RSVP-7 story landing + RSVP-8 read-only demo + docs-in-repo + README sync | July 2026, then **freeze** (changes only on interview feedback) |

> Sprint v2 was paused by a pre-scheduled trip (5/23–5/31). Rather than retroactively
> extending its dates (a ScrumBut anti-pattern that distorts velocity), it was closed
> with honest reporting; unfinished tickets carried into Sprint v3, labelled Recovery.

---

## 7. Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Custom (organizer-defined) form fields? | Deferred to Phase 3 |
| OQ-2 | Organizer authentication method? | ✅ Resolved — Supabase Auth (single admin MVP) |
| OQ-3 | Dedicated QR scan page vs visual check? | Scanner → Phase 2 (with RSVP-6) |
| OQ-4 | Multi-language (EN / ZH)? | Product UI English-only; story landing Chinese (OQ-9); i18n → Phase 3 |
| OQ-5 | Single vs multi-event? | ✅ Resolved — multi-event schema, single event seeded, multi-event UI deferred |
| OQ-6 | Keyword search in dashboard? | Deferred to Phase 2 (status filter only for MVP) |
| OQ-7 | CSV export? | Phase 2 |
| OQ-8 | Inline Remark editing in dashboard? | Phase 2 (MVP shows Remark read-only) |
| OQ-9 *(v0.4)* | Story landing language? | ✅ Resolved 2026-07-10 — Chinese body (reviewer audience is Taiwan hiring managers), English UI terms; product UI stays English |
| OQ-10 *(v0.4)* | Where do product docs live? | ✅ Resolved 2026-07-10 — in-repo `docs/` (git history = version trail); Notion keeps private job-search materials only |
| OQ-11 *(v0.4)* | Read-only demo vs interactive sandbox? | ✅ Resolved 2026-07-10 — read-only + GIF for Phase 1; sandbox with reset gated on interview feedback |

---

## 8. Phase 2+ Backlog

- On-site check-in (RSVP-6 scope: manual check-in + `checked_in`/`checked_in_at` + visually distinct rows; then camera QR scanner — both reuse the token status URL)
- Interactive demo sandbox (demo user writes + data reset + rate limit)
- Email / SMS notification on status change (Gmail SMTP assessed > Resend)
- Free-text / keyword search + pagination (50/page) in admin dashboard
- Automated TA filtering rules
- Inline Remark editing
- CSV export
- Calendar (.ics) integration
- Multi-event organizer UI
- Custom registration form fields
- Analytics (registration / approval rates; story-page funnel)

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2026-04-16 | Initial draft. 5-field form incl. Business Card upload; 4 status states; QR scan as stretch goal |
| v0.2 | 2026-05-07 | Supabase Auth added to MVP; scan page brought into MVP; Jira board + AC built |
| v0.3 | 2026-06-06 | Dashboard columns realigned to built schema; Business Card upload removed; organizer auth resolved to Supabase Auth; on-site check-in confirmed manual (scanner → Phase 1.5); status filter kept, free-text search → Phase 2; multi-event clarified (schema-ready, single-event UI); idempotent / reversible batch rule and `select-all = current page` documented |
| **v0.4** | **2026-07-10** | RSVP-4/5 marked **Done**, AC realigned to as-built: **batch-only pivot (2026-06-09)** documented — per-row buttons removed; `registrations.name` (not `full_name`); **no pagination in MVP** (moved to Phase 2). RSVP-6 **moved to Phase 2** (2026-07-07). Added **Reviewer persona**, **G5**, **RSVP-7 Story Landing**, **RSVP-8 Read-only Admin Demo**. Security model: per-role grant lesson (7/7) + demo-user restrictive carve-out. Docs moved into repo (`docs/`); OQ-9/10/11 resolved. M4 Visibility milestone + post-M4 freeze |

---

## 10. Appendix — Paste-ready Jira AC

> Copy the block under each key into the Jira ticket's Acceptance Criteria field.
> RSVP-3/5 blocks unchanged from v0.3 (shipped as specced). RSVP-4 updated to as-built. RSVP-6 parked in Phase 2 backlog.

**RSVP-4 — Review & Batch Approval (as-built)**
```
* Admin access via Supabase Auth (single admin for MVP; SSO/roles → Phase 2)
* Dashboard columns: Select | Name | Email | Phone | Company | Status | Remark (read-only)
* Batch-only actions: multi-select + "Approve/Reject Selected" with confirmation dialog + toast
  (no per-row Approve/Reject; single row selected = single-row operation, same path)
* Select All = currently rendered page (single-page table in MVP; pagination → Phase 2)
* Status filter: Pending / Approved / Rejected / All (default All)
* Default sort: submission time, newest first
* Idempotent: only rows that actually change status are updated; same-status = no-op
* Approve/Reject reversible; status_updated_at written only on real transition (app-level, in Server Action)
* Status changes auto-saved on confirm; no manual Save button

Out of Scope:
* Full authentication (SSO, roles) → Phase 2
* Free-text search / pagination → Phase 2
* Inline Remark editing → Phase 2
* Export to CSV → Phase 2
* Concurrent editing conflict resolution → Phase 2
```

**RSVP-7 — Story Landing (V3)**
```
* Root / replaces redirect with one-page narrative per Figma "Story landing / v3":
  hero (tagline + single CTA "Enter RSVP" → /register) → About (3 pain pills + Why/How 2-col)
  → flow × decision showcase → artifact chips + division tags → footer with Back to top
* Showcase: screenshot base + callout annotations, 4 flow×decision pairs, scroll-advanced;
  Open live demo (→ /register) + Enter admin demo (read-only) buttons; check-in = Phase 2 strip
* Motion: CSS fade/slide-in via IntersectionObserver only (documented §8.6 exception)
* Logo unified to "RSVP" (story page + product UI headers)
* Chinese body, English UI terms
* Remaining aesthetic invariants respected; mobile 375px (pairs stack) / desktop 1280px verified
* Existing routes unaffected
* 3-minute test passed by a non-technical reader (purpose + two decisions)
```

**RSVP-8 — Read-only Admin Demo**
```
* Story-page CTA signs in dedicated demo user via Server Action (creds in server env only)
* Lands on /admin/registrations with seeded data (7 rows, three statuses) + filters
* Demo user writes denied at RLS layer (restrictive carve-out on authenticated UPDATE);
  verified by direct SQL/API write attempt, not only UI
* Banner: "Demo mode (read-only) — batch actions disabled. Seeded demo data."
* Batch action bar disabled (not hidden); real admin behavior unchanged
* Demo credentials never in client bundle or repo

Out of Scope:
* Interactive writes + data reset (Phase 2 sandbox)
* Separate demo dataset (reuses supabase/seed.sql)
```
