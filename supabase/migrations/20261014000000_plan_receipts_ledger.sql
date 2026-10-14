-- Non-fund Halaxis plan receipts and ledger (stock checker).
-- NOT APPLIED by the commit that added this file. Apply it only when
-- HALAXIS_PLANS_CHECKOUT is turned on.
-- Investment-fund money is not stored here. ENABLE_PAYMENTS stays false for the fund.
-- This is not an Ixis balance. The Wallet remains the only Ixis balance.

create extension if not exists "pgcrypto";

create table if not exists public.plan_receipts (
  id uuid primary key default gen_random_uuid(),
  owner_ref text not null,
  product text not null default 'halaxis' check (product = 'halaxis'),
  tier text not null check (tier in ('stock_checker_activation', 'stock_checker_monthly')),
  channel text not null check (channel in ('card', 'ixis')),
  amount_usd_cents integer not null check (amount_usd_cents > 0),
  amount_ixis integer,
  external_id text not null,
  idempotency_key text not null,
  status text not null check (status in ('pending', 'recorded', 'voided')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists plan_receipts_idempotency_key
  on public.plan_receipts (idempotency_key);

alter table public.plan_receipts enable row level security;

comment on table public.plan_receipts is
  'Receipt for a non-fund Halaxis plan (stock checker). Not an Ixis balance and not a fund subscription.';

create table if not exists public.plan_ledger (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.plan_receipts (id),
  owner_ref text not null,
  product text not null default 'halaxis' check (product = 'halaxis'),
  tier text not null check (tier in ('stock_checker_activation', 'stock_checker_monthly')),
  entry_type text not null check (entry_type in ('plan_purchase')),
  channel text not null check (channel in ('card', 'ixis')),
  amount_usd_cents integer not null check (amount_usd_cents > 0),
  amount_ixis integer,
  created_at timestamptz not null default now()
);

create unique index if not exists plan_ledger_receipt_id_key
  on public.plan_ledger (receipt_id);

alter table public.plan_ledger enable row level security;

comment on table public.plan_ledger is
  'One ledger line per recorded non-fund plan purchase. Not an Ixis balance.';

-- No policies: the service role writes these. Visitors cannot read or write them.
