-- Migration: add anon SELECT policy for events table
-- Created: 2026-06-01
--
-- NOTE: This repo does not yet use Supabase CLI; the supabase/migrations/ folder
-- serves as IaC documentation only. Apply this migration manually:
--   Supabase Dashboard → SQL Editor → paste the statement below → Run
--
-- Context: app/register/page.tsx submits a registration via supabase-js with
-- the anon publishable key. The flow first runs:
--   supabase.from("events").select("id")
--     .order("created_at", { ascending: false }).limit(1).single()
-- to grab the latest event_id. After Block C migration 20260520000854 added
-- an anon SELECT policy on registrations + a (event_id, email) UNIQUE
-- constraint, the symmetrical gap on the events table remained: anon could
-- not SELECT events, so the fetch failed with 401, register/page.tsx hit the
-- eventErr branch, and the user saw the generic "Something went wrong" banner.
--
-- This migration closes that gap with the same pattern bb0c0b3 applied to
-- registrations. For the demo, events only holds non-sensitive public fields
-- (id / name / created_at), so USING (true) is acceptable. Production would
-- tighten to e.g. "active = true AND now() between start_at and end_at".

-- ============================================================================
-- Anon SELECT policy on events
-- ============================================================================
CREATE POLICY "anon_select_events"
  ON public.events
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- Verify (run after the statement above)
-- ============================================================================
-- Expect 1 row, polname = 'anon_select_events':
--   SELECT polname, polcmd, polroles::regrole[]
--     FROM pg_policy
--    WHERE polrelid = 'public.events'::regclass
--      AND polname = 'anon_select_events';
