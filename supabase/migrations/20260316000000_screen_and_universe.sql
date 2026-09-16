-- Halaxis product tables: Shariah screen events + illustrative universe.
-- Not a live book. Not a subscription ledger.

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

comment on table public.accredited_interest is
  'Accredited-investor interest only. Not a subscription ledger.';

create table if not exists public.illustrative_universe (
  ticker text primary key,
  name text not null,
  sector text not null,
  industry text not null,
  business_status text not null,
  financial_status text not null,
  verdict text not null,
  fail_reasons text[] not null default '{}',
  debt_to_market_cap numeric,
  cash_plus_interest_to_market_cap numeric,
  receivables_to_market_cap numeric,
  notes text,
  snapshot_label text not null default 'illustrative, not live prices',
  updated_at timestamptz not null default now()
);

alter table public.illustrative_universe enable row level security;

comment on table public.illustrative_universe is
  'Illustrative Halaxis v1 watchlist. Not holdings, not a live book, not a fatwa.';

create table if not exists public.screen_events (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  standard text not null,
  verdict text not null,
  business_pass boolean not null,
  financial_pass boolean,
  fail_reasons jsonb not null default '[]'::jsonb,
  ratios jsonb,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists screen_events_ticker_created_idx
  on public.screen_events (ticker, created_at desc);

alter table public.screen_events enable row level security;

comment on table public.screen_events is
  'Each screening request persisted for audit. Educational, not investment advice.';
