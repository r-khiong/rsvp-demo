-- Migration: RSVP-4 admin access — authenticated read/update + audit & remark columns
-- Created: 2026-06-11
--
-- WHY:
-- The admin dashboard (/admin/*) reads ALL registrations and updates their
-- status. After login, supabase-ssr attaches the user JWT so PostgREST runs the
-- request as the `authenticated` role. Introspection (2026-06-11) confirmed
-- `authenticated` currently has NO SELECT/UPDATE on registrations.
--
-- LESSON FROM THIS REPO (anon saga, migrations 20260601*): a row-level POLICY is
-- NOT enough — the table-level GRANT must also exist or the request 401s before
-- RLS is evaluated. Both are included below.
--
-- Public/anon paths are untouched (anon INSERT on registrations, anon SELECT on
-- events, token RPC) — admin uses a separate role, no conflict.
--
-- EXECUTION: source of truth + git record. Apply manually in
-- Supabase Dashboard -> SQL Editor -> paste all -> Run. Idempotent; safe to re-run.

-- ============================================================================
-- 1. Columns (idempotent) — status_updated_at (audit) + remark (organizer note)
-- ============================================================================
alter table public.registrations
  add column if not exists status_updated_at timestamptz;
alter table public.registrations
  add column if not exists remark text;

-- ============================================================================
-- 2. authenticated row-level policies (idempotent recreate)
-- ============================================================================
drop policy if exists "authenticated_select_registrations" on public.registrations;
create policy "authenticated_select_registrations"
  on public.registrations
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated_update_registrations" on public.registrations;
create policy "authenticated_update_registrations"
  on public.registrations
  for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- 3. Table-level GRANT (the actual fix for 401)
-- ============================================================================
grant select, update on public.registrations to authenticated;

-- ============================================================================
-- 4. Verify (read-only)
--    A. columns — expect status_updated_at + remark present; name column present
--    B. policies — expect the two authenticated_* policies
--    C. grants  — expect authenticated SELECT + UPDATE
-- ============================================================================
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'registrations'
order by ordinal_position;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'registrations'
order by cmd, policyname;

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'registrations'
  and grantee = 'authenticated'
order by privilege_type;
