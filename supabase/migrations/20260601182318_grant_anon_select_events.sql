-- Migration: ensure events is fully readable by anon (idempotent supersede)
-- Created: 2026-06-01
--
-- Discovery (after applying 20260601181432_add_anon_select_policy_events.sql
-- which threw 42710 "policy ... already exists"): the row-level policy
-- "anon_select_events" was already present, yet anon SELECT still 401'd.
-- That fingerprint points at a missing TABLE-LEVEL GRANT, not the policy.
--
-- Supabase auto-grants SELECT/INSERT/UPDATE/DELETE to anon + authenticated
-- only when a table is created via Dashboard's Table Editor. Tables created
-- via raw `CREATE TABLE` SQL (likely the case for events) skip those grants,
-- and RLS policies alone can't override that — policies are row filters,
-- GRANTs gate whether the role can touch the table at all.
--
-- This migration is fully idempotent: safe to re-run, no destructive side
-- effects on existing data or other policies.
--
-- Apply: Supabase Dashboard → SQL Editor → paste all 3 blocks → Run

-- ============================================================================
-- 1. Table-level grant — the actual fix for the 401
-- ============================================================================
GRANT SELECT ON public.events TO anon;

-- ============================================================================
-- 2. Replace policy idempotently so we KNOW the row-level rule is correct
--    (Existing policy may have been created on 5/20 with unknown USING clause)
-- ============================================================================
DROP POLICY IF EXISTS "anon_select_events" ON public.events;

CREATE POLICY "anon_select_events"
  ON public.events
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- 3. Verify final state (run together; output should show 1 policy row)
-- ============================================================================
SELECT polname, polcmd, polroles::regrole[], pg_get_expr(polqual, polrelid) AS using_clause
  FROM pg_policy
 WHERE polrelid = 'public.events'::regclass;
