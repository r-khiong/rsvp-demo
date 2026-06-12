-- Seed: demo registrations for the admin dashboard (RSVP-4)
-- Created: 2026-06-11
--
-- Replaces leftover test data with a realistic set across all three statuses so
-- the admin list and screenshots look intentional on the public portfolio.
-- Attendee-facing flow is unaffected (new registrations keep inserting normally).
--
-- EXECUTION: run in Supabase Dashboard SQL Editor AFTER
-- 20260611000000_rsvp4_admin_access.sql (needs the status_updated_at / remark
-- columns). Transactional — any error rolls the whole thing back, so a clean
-- list is never left half-seeded.

begin;

-- Clear existing registrations (all current rows are test data) for a clean,
-- deterministic demo list. Attaches the seed to the same event the public
-- /register flow uses (newest event).
delete from public.registrations;

insert into public.registrations
  (event_id, name, email, phone, company, token, status, remark, created_at, status_updated_at)
values
  ((select id from public.events order by created_at desc limit 1),
   'Aiden Lin',    'aiden.lin@example.com',    '0912345678', 'Cathay United Bank',
   'demo_q7Kp2xR9aLmZ3vN8sB1tD', 'pending',  null,
   now() - interval '90 minutes', null),

  ((select id from public.events order by created_at desc limit 1),
   'Mei-Ling Chen','mei.chen@example.com',     '0922333444', 'TSMC',
   'demo_W3rT6yU8iO1pA5sD9fG2hJ', 'pending',  null,
   now() - interval '4 hours', null),

  ((select id from public.events order by created_at desc limit 1),
   'Jason Wu',     'jason.wu@example.com',     '0933221100', null,
   'demo_Z9xC2vB5nM7qW1eR4tY6uI', 'pending',  null,
   now() - interval '7 hours', null),

  ((select id from public.events order by created_at desc limit 1),
   'Sophia Huang', 'sophia.huang@example.com', '0911222333', 'Appier',
   'demo_K2jH8gF4dS6aP9oL3kM5nB', 'approved', 'Speaker — front-row seating',
   now() - interval '2 days', now() - interval '1 day'),

  ((select id from public.events order by created_at desc limit 1),
   'Daniel Kao',   'daniel.kao@example.com',   '0955667788', 'Gogoro',
   'demo_X7cV1bN4mZ8qL2wE5rT9yU', 'approved', null,
   now() - interval '2 days', now() - interval '22 hours'),

  ((select id from public.events order by created_at desc limit 1),
   'Claire Tsai',  'claire.tsai@example.com',  '0944556677', null,
   'demo_P3oI6uY9tR2eW5qA8sD1fG', 'rejected', 'Duplicate registration',
   now() - interval '3 days', now() - interval '2 days'),

  ((select id from public.events order by created_at desc limit 1),
   'Kevin Yang',   'kevin.yang@example.com',   '0966778899', 'LINE Taiwan',
   'demo_H5gJ8kL2mN6bV9cX3zQ1wE', 'rejected', null,
   now() - interval '3 days', now() - interval '2 days');

commit;

-- Verify (read-only): expect 7 rows — 3 pending / 2 approved / 2 rejected
select status, count(*) from public.registrations group by status order by status;
