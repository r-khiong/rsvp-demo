# RSVP Demo

A lightweight event registration management system — replacing the "manage RSVPs in a spreadsheet + email" workflow with a real product flow: attendees register and track their status by token; organizers review and manage the list.

**Live demo:** https://r-khiong-rsvp-demo.netlify.app

> Portfolio project demonstrating a full SDLC walkthrough (PRD → user flow → sprint backlog → implementation → deploy) and a PM-led, AI-assisted development workflow. Not a production SaaS.

---

## Problem

Small event organizers often track RSVPs by hand in spreadsheets and email threads: no single source of truth, no self-service status lookup for attendees, and error-prone manual approval. This demo provides:

- **Attendees** — fill in a form, get a private status link, check their approval status.
- **Organizers** — review the registration list and approve/reject in batches *(in progress)*.

## Features

| Flow | Status |
|------|--------|
| Register (`/register`) → submit → private status page (`/status/[token]`) | ✅ Live |
| Token-scoped status lookup (no public access to the full list) | ✅ Live |
| Admin login + registrations table + batch approve/reject | 🔜 Roadmap |
| QR status + manual check-in | 🔜 Roadmap |

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 (Server Components by default) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| UI | shadcn/ui (radix-nova) + lucide-react |
| Forms | react-hook-form + zod |
| Auth + DB | Supabase (Postgres, Row Level Security) |
| Hosting | Netlify (git-linked continuous deploy) |
| Package manager | pnpm |

## Local Setup

```bash
pnpm install

# Create .env.local with your Supabase project keys:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

pnpm dev      # http://localhost:3000  (redirects to /register)
pnpm build    # production build
```

Database schema and RLS policies live in [`supabase/migrations/`](supabase/migrations/) and are applied via the Supabase Dashboard SQL Editor.

## Architecture & Decisions Log

- **Token-scoped reads via RPC.** The status page never reads the `registrations` table directly. A `SECURITY DEFINER` function `get_registration_by_token(token)` returns only the single matching row; anonymous `SELECT` on the table is revoked. This closes a PII-exposure hole (the public anon key could otherwise dump the whole list) while keeping the attendee flow working. See [`supabase/migrations/20260603120000_harden_registrations_rls.sql`](supabase/migrations/20260603120000_harden_registrations_rls.sql).
- **Role separation by design.** Anonymous users may only `INSERT` (register) and call the token RPC. Admin (authenticated) full-table access is added separately, so the public and admin paths never overlap.
- **Server Components by default.** Client components (`'use client'`) are used only where interaction requires it (e.g. the registration form).
- **Continuous deployment.** `main` auto-deploys to production on Netlify; feature branches get isolated deploy previews.

## Roadmap

- **RSVP-4** — admin auth + registrations table + status filter + batch approve/reject.
- **RSVP-5** — full status states + QR code + token mechanism.
- **RSVP-6** — manual check-in + search.
- **Polish** — landing page, responsive pass, README finalization.
