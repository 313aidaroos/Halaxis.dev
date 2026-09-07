-- Halaxis waitlist / accredited-investor interest
-- Apply in the Supabase SQL editor or via CLI after you create a project.
-- Do not invent live credentials in this repository.

create extension if not exists "pgcrypto";

create table if not exists public.accredited_interest (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organization text,
  message text,
  accredited_attestation boolean not null default false,
  understand_not_offer boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists accredited_interest_email_key
  on public.accredited_interest (lower(email));

alter table public.accredited_interest enable row level security;

-- No anon/authenticated policies: inserts go through the service-role API route.
-- Optional later: add a locked-down insert policy if you move off the admin client.

comment on table public.accredited_interest is
  'Accredited-investor interest only. Not a subscription ledger.';
