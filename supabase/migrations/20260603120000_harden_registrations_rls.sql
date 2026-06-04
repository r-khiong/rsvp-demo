-- Migration: harden registrations RLS — close the anon full-table read hole
-- Created: 2026-06-03  (RSVP-3 hardening, Block 1)
--
-- WHY:
-- The /status/[token] page only needs ONE row (the registrant's own, looked up
-- by their nanoid token). But the current policy `anon_select_registrations`
-- (USING true) lets ANYONE holding the public publishable key run
-- `select * from registrations` and dump every name / email / phone. The
-- publishable key ships in the browser bundle by design, so this is a real PII
-- exposure for a public deploy.
--
-- FIX:
--   1. Add a SECURITY DEFINER RPC `get_registration_by_token(p_token)` that
--      returns ONLY the single matching row (joined with its event name).
--      As SECURITY DEFINER it runs as the function owner and bypasses RLS, so
--      anon never needs table-level SELECT.
--   2. DROP the anon SELECT policy AND REVOKE SELECT on registrations from anon.
--      register's INSERT does not need SELECT (no .select() chained; duplicate
--      email is detected via the 23505 unique-violation error code), so this is
--      safe.
--
-- KEPT UNCHANGED: anon INSERT on registrations (register), anon SELECT on events
-- (non-PII; used to resolve the current event id).
--
-- FORWARD-COMPAT (RSVP-4): the future `authenticated` SELECT-all / UPDATE
-- policies are a separate role path and do not conflict with anything below.
--
-- LESSON FROM THE ANON SAGA (migrations 20260601181432 / 20260601182318):
-- a row-level POLICY and the table-level GRANT are two separate gates. Here we
-- intentionally remove BOTH the anon SELECT policy and the anon SELECT grant.
--
-- EXECUTION: This file is the SOURCE OF TRUTH + git record only. It is NOT run
-- via a CLI migration flow. Apply manually in:
--   Supabase Dashboard -> SQL Editor -> paste all of section 1-3 -> Run
-- (DROP / REVOKE require table-owner privileges.)
-- Idempotent; safe to re-run.

-- ============================================================================
-- 1. RPC: single-row lookup by token (SECURITY DEFINER bypasses RLS)
-- ============================================================================
create or replace function public.get_registration_by_token(p_token text)
-- NOTE: registrations.id / event_id are bigint (identity), NOT uuid.
-- supabase-js maps bigint -> string in TS, so lib/supabase/types.ts (`id: string`)
-- stays correct and no app code changes for this.
returns table (
  id          bigint,
  event_id    bigint,
  name        text,
  email       text,
  phone       text,
  company     text,
  token       text,
  status      text,
  created_at  timestamptz,
  event_name  text
)
language sql
security definer
stable
set search_path = public
as $$
  select
    r.id::bigint,
    r.event_id::bigint,
    r.name::text,
    r.email::text,
    r.phone::text,
    r.company::text,
    r.token::text,
    r.status::text,
    r.created_at::timestamptz,
    e.name::text as event_name
  from public.registrations r
  left join public.events e on e.id = r.event_id
  where r.token = p_token;
$$;

-- Only anon (public registrant) may call it; nobody else by default.
revoke all on function public.get_registration_by_token(text) from public;
grant execute on function public.get_registration_by_token(text) to anon;

-- ============================================================================
-- 2. Close the hole: remove anon read access to the registrations table
-- ============================================================================
drop policy if exists "anon_select_registrations" on public.registrations;
revoke select on public.registrations from anon;
-- (anon INSERT on registrations is intentionally KEPT — do not revoke it.)

-- ============================================================================
-- 3. Verify (expect: NO anon SELECT on registrations; anon INSERT still there;
--    EXECUTE granted on the function)
-- ============================================================================

-- 3a. registrations policies still present (expect only the INSERT policy,
--     no SELECT policy for anon)
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'registrations'
order by cmd, policyname;

-- 3b. anon table privileges on registrations (expect INSERT only, NO SELECT)
select privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'registrations'
  and grantee = 'anon'
order by privilege_type;

-- 3c. function execute grant (expect anon present)
select grantee, privilege_type
from information_schema.role_routine_grants
where routine_schema = 'public'
  and routine_name = 'get_registration_by_token'
order by grantee;

-- ============================================================================
-- 4. NEGATIVE TEST — run SEPARATELY in a fresh SQL Editor query, then RESET
--    (this proves the hole is closed; report the ACTUAL output)
-- ============================================================================
-- set role anon;
-- select * from registrations;          -- expect: permission denied for table registrations
-- reset role;
