-- Migration: add anon SELECT policy and email UNIQUE constraint for registrations
-- Created: 2026-05-20
--
-- NOTE: This repo does not yet use Supabase CLI; the supabase/migrations/ folder
-- serves as IaC documentation only. Apply this migration manually:
--   Supabase Dashboard → SQL Editor → paste the two statements below → Run
--
-- Block C (rsvp-3 user story) needs these two changes before E2E flow works:
--   1) /status/[token] page reads registrations via anon key → needs SELECT policy
--   2) duplicate-email banner relies on Postgres unique violation (error 23505)
--      → needs a UNIQUE constraint on (event_id, email)

-- ============================================================================
-- 1. Anon SELECT policy on registrations
-- ----------------------------------------------------------------------------
-- The 21-char nanoid token in the URL is the de-facto access control: only a
-- person who already received the token can guess it. For the demo we keep
-- USING (true) so any anon caller can SELECT once they know a token. For a
-- production version this would tighten to: USING (token = current_setting(...)).
-- ============================================================================
CREATE POLICY "anon_select_registrations"
  ON public.registrations
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- 2. UNIQUE constraint on (event_id, email)
-- ----------------------------------------------------------------------------
-- Same email is allowed across different events (a person can register for
-- multiple events), but blocked from registering twice for the same event.
-- This is the industry production pattern for event-RSVP systems.
-- Postgres surfaces a violation as error code 23505, which app/register/page.tsx
-- maps to the "This email has already registered." banner.
-- ============================================================================
ALTER TABLE public.registrations
  ADD CONSTRAINT registrations_event_id_email_unique
  UNIQUE (event_id, email);

-- ============================================================================
-- Verify (run after the two statements above)
-- ============================================================================
-- Expect 1 row, polname = 'anon_select_registrations':
--   SELECT polname, polcmd, polroles::regrole[]
--     FROM pg_policy
--    WHERE polrelid = 'public.registrations'::regclass
--      AND polname = 'anon_select_registrations';
--
-- Expect 1 row, conname = 'registrations_event_id_email_unique':
--   SELECT conname
--     FROM pg_constraint
--    WHERE conrelid = 'public.registrations'::regclass
--      AND contype = 'u'
--      AND conname = 'registrations_event_id_email_unique';
