-- Migration: allow logged-in admins to view the public status page
-- Created: 2026-07-07  (RSVP-5 follow-up)
--
-- WHY:
-- get_registration_by_token() was granted ONLY to anon (see
-- 20260603120000_harden_registrations_rls.sql: `revoke all ... from public;
-- grant execute ... to anon`). When an organizer who is logged in to /admin
-- opens /status/[token] in the same browser, supabase-ssr attaches their auth
-- cookie, so PostgREST executes the RPC as the `authenticated` role ->
-- permission denied -> the page treats it as "not found" -> 404.
-- Registrants (anonymous) were never affected.
--
-- FIX: also grant EXECUTE to authenticated. No PII exposure — authenticated
-- (admin) already has full SELECT on registrations via
-- 20260611000000_rsvp4_admin_access.sql.
--
-- EXECUTION: source of truth + git record. Apply manually in
-- Supabase Dashboard -> SQL Editor -> paste all -> Run. Idempotent.

grant execute on function public.get_registration_by_token(text) to authenticated;

-- Verify (expect: anon AND authenticated both listed)
select grantee, privilege_type
from information_schema.role_routine_grants
where routine_schema = 'public'
  and routine_name = 'get_registration_by_token'
order by grantee;
