-- Migration: RSVP-8 demo admin read-only — restrictive RLS carve-out
-- Created: 2026-07-11
--
-- WHY:
-- RSVP-8 gives reviewers one-click access to /admin/registrations via a
-- dedicated demo user (rsvp.demo@gmail.com). The demo session must be
-- read-only, and the enforcement boundary is the DATABASE, not the UI:
-- the disabled batch buttons are presentation only.
--
-- The existing rsvp4 policy "authenticated_update_registrations" is
-- PERMISSIVE with using(true) — it grants UPDATE to every authenticated
-- user, including the demo user. We do NOT touch that policy or its GRANT
-- (real admin behavior must stay unchanged). Instead we add a RESTRICTIVE
-- policy: restrictive policies are ANDed with permissive ones, so a row is
-- updatable only if (permissive passes) AND (requester is not the demo
-- user). PjM decision 2026-07-10: restrictive carve-out over rebuilding
-- the permissive policy.
--
-- The demo user is identified by the email claim in the JWT. The email is
-- not a secret (it is displayed in the admin header during a demo
-- session); the password is the only credential and lives exclusively in
-- server-side env (DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD).
--
-- Note on observed behavior: with this policy, a demo UPDATE does not
-- error — RLS filters the target rows out, so the statement reports
-- "0 rows updated" and data is unchanged. Verify by row count, not by
-- expecting an exception.
--
-- DELETE: `authenticated` has no DELETE grant and no DELETE policy, so
-- deletes already fail for every admin. A restrictive DELETE policy is
-- added anyway as defense in depth, so a future permissive DELETE policy
-- cannot silently re-enable demo writes.
--
-- EXECUTION: source of truth + git record. Apply manually in
-- Supabase Dashboard -> SQL Editor -> paste all -> Run. Idempotent; safe to re-run.

-- ============================================================================
-- 1. Restrictive carve-out: demo user cannot UPDATE
-- ============================================================================
drop policy if exists "demo_admin_readonly_update" on public.registrations;
create policy "demo_admin_readonly_update"
  on public.registrations
  as restrictive
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') is distinct from 'rsvp.demo@gmail.com')
  with check ((auth.jwt() ->> 'email') is distinct from 'rsvp.demo@gmail.com');

-- ============================================================================
-- 2. Restrictive carve-out: demo user cannot DELETE (defense in depth)
-- ============================================================================
drop policy if exists "demo_admin_readonly_delete" on public.registrations;
create policy "demo_admin_readonly_delete"
  on public.registrations
  as restrictive
  for delete
  to authenticated
  using ((auth.jwt() ->> 'email') is distinct from 'rsvp.demo@gmail.com');

-- ============================================================================
-- 3. Verify (read-only)
--    A. policies — expect the two demo_admin_readonly_* rows with
--       permissive = 'RESTRICTIVE', alongside the rsvp4 authenticated_* rows
-- ============================================================================
select tablename, policyname, permissive, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'registrations'
order by cmd, policyname;
