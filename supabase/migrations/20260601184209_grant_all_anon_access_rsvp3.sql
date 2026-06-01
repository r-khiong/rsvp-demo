-- Migration: complete anon access for RSVP-3 E2E (all-in-one, idempotent)
-- Created: 2026-06-01
--
-- After applying 04db744 + e06cdcd we discovered the same GRANT-missing
-- pattern on registrations: anon could not INSERT (401 on /v1/registrations
-- POST). 5/20's assumption "anon 可 insert" had never been E2E-tested.
--
-- This migration is the comprehensive fix covering every DB-side permission
-- RSVP-3 needs end-to-end. Fully idempotent; safe to re-run.
--
-- Operations RSVP-3 exercises:
--   1. events  : SELECT (latest event_id during form submit)
--   2. registrations : INSERT (write new registration on submit)
--   3. registrations + events : SELECT (status page join via *, events(*))
--
-- Apply: Supabase Dashboard → SQL Editor → paste all → Run

-- ============================================================================
-- 1. Table-level GRANTs (the actual fix for the 401s)
-- ============================================================================
GRANT SELECT          ON public.events        TO anon;
GRANT SELECT, INSERT  ON public.registrations TO anon;

-- ============================================================================
-- 2. Row-level policies (idempotent recreate to known-good state)
-- ============================================================================

-- events: anon can read all rows
DROP POLICY IF EXISTS "anon_select_events" ON public.events;
CREATE POLICY "anon_select_events"
  ON public.events
  FOR SELECT
  TO anon
  USING (true);

-- registrations: anon can read all rows (status page lookup by token in app code)
DROP POLICY IF EXISTS "anon_select_registrations" ON public.registrations;
CREATE POLICY "anon_select_registrations"
  ON public.registrations
  FOR SELECT
  TO anon
  USING (true);

-- registrations: anon can insert new rows (form submit)
DROP POLICY IF EXISTS "anon_insert_registrations" ON public.registrations;
CREATE POLICY "anon_insert_registrations"
  ON public.registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================================
-- 3. Verify GRANT state (should show 3 rows: events SELECT, registrations
--    SELECT + INSERT, all grantee=anon)
-- ============================================================================
SELECT
  table_schema || '.' || table_name AS table_full_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'anon'
  AND table_name IN ('events', 'registrations')
ORDER BY table_name, privilege_type;

-- ============================================================================
-- 4. Verify policy state (should show all anon policies on both tables)
-- ============================================================================
SELECT
  schemaname || '.' || tablename AS table_full_name,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('events', 'registrations')
  AND 'anon' = ANY(roles)
ORDER BY tablename, cmd, policyname;
