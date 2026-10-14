# Halaxis.dev

Halal and Sharia-compliant hedge-fund **marketing** and accredited-investor **interest** site for Awad Alaidaroos / Apixis Dev LLC.

This release ships a working **Halaxis v1 Shariah screen** (`/screen`, `POST /api/screen`, `GET /api/holdings`) plus accredited-investor interest (`POST /api/waitlist`). It is **not** an offer of securities, **not** investment advice, **not** a fatwa, and **not** a live fund. Payments and solicitation stay off until counsel and SEC-related gates are cleared. No live trading.

## Stack (Apixis / Contraxis family)

| Layer | Choice |
| --- | --- |
| App | Next.js **14.2.x** App Router, React 18, TypeScript |
| UI | Tailwind CSS **3.4**, shadcn-style components |
| Validation / data | Zod, TanStack Query |
| Auth / DB | Supabase (`@supabase/ssr` + `supabase-js`) — client + SQL stubs only |
| Payments | Stock-checker plans: Stripe card or Wallet Ixis, behind `HALAXIS_PLANS_CHECKOUT=false`. Fund stays behind `ENABLE_PAYMENTS=false` |
| AI | Small `AI_PROVIDER=anthropic\|openai` interface (`src/lib/ai`) |
| Email | Resend (`RESEND_API_KEY`, `EMAIL_FROM`) |
| Host | Vercel (`vercel.json`) |

Layout: `src/`, `supabase/`, `.env.example`, `vercel.json`.

## Local setup

```bash
git clone https://github.com/313aidaroos/Halaxis.dev.git
cd Halaxis.dev
npm install
cp .env.example .env.local
npm run dev
```

`npm run build` succeeds **without** live database, Stripe, or AI credentials.

Optional `.env.local` values (see `.env.example` for the full Contraxis-shaped list):

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_*`
- `AI_PROVIDER`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `AI_MODEL`
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`
- `HALAXIS_PLANS_CHECKOUT` — must be the string `true` to sell the stock checker (card or Ixis)
- `ENABLE_PAYMENTS` — fund money only; keep `false` until counsel clears solicitation

## Shariah screen (the product)

Named standard: **Halaxis v1** — AAOIFI-style business screens + DJIM 33% financial-ratio caps.

- UI: `/screen`
- `POST /api/screen` `{ "ticker": "AAPL" }` — evaluates, then writes `screen_events` when Supabase is configured
- `GET /api/holdings` — illustrative universe from `illustrative_universe` (seeded on first read)

This is an engineering screen, not a fatwa. Conventional banks, insurers, alcohol, gambling, tobacco, weapons-as-core, adult, and cannabis-as-core fail the business screen. Interest-based leverage and shorting are not offered.

## Waitlist persistence

`POST /api/waitlist` (name, email, accreditation attestation, non-offer acknowledgement):

1. Insert into Supabase `accredited_interest` when the service-role key is present.
2. Else email via Resend.
3. Else, in development only, log **non-sensitive** metadata (no full email).

Production without Supabase or Resend returns `503`.

## AI assistant

`POST /api/chat` streams plain text from `src/lib/ai/provider.ts`. The system prompt refuses personalized advice and steers visitors to `/contact`. In-memory rate limit: 8 requests / 10 minutes / IP. Configure `AI_PROVIDER` + the matching API key; omit keys to keep chat disabled (UI still shows a graceful error).

## Plans (stock checker) and the fund

Locked prices live in `NOTES/PRICING.md` and `src/lib/pricing.ts`.

- Stock checker: 3 free checks (assumed) — TBD, then $50 one-time activation and $50/month. Card or Ixis (100 Ixis = $1).
- Card: `POST /api/plans/checkout` opens Stripe Checkout on the shared Apixis Dev LLC account. Metadata is `product=halaxis` and `tier`. Price IDs are `STRIPE_PRICE_HALAXIS_STOCK_CHECKER_ACTIVATION` and `STRIPE_PRICE_HALAXIS_STOCK_CHECKER_MONTHLY` (blank until Developer Bot sets them). Webhook: `POST /api/stripe/webhook`.
- Ixis: the same route redeems Wallet product keys `halaxis.stock_checker.activation` and `halaxis.stock_checker.monthly`. Short of Ixis, the buyer is sent to Wallet `/buy?product=halaxis`.
- Every charged purchase writes one row in `plan_receipts` and one row in `plan_ledger` (migration `supabase/migrations/20261014000000_plan_receipts_ledger.sql`, not applied from this repo).
- `HALAXIS_PLANS_CHECKOUT` defaults off. The buttons stay disabled until it is the string `true`.
- Fund: no price, waitlist only. `ENABLE_PAYMENTS` stays `false`. Fund money is not a plan tier.
- Banks and advisors: contact sales.
- Never pass `payment_method_types`. Never log Stripe keys, webhook payloads, or signatures.
- Return pages: `/plans/checkout/success`, `/plans/checkout/cancel`.

### Stripe Dashboard steps (manual, Developer Bot)

1. On the shared Apixis Dev LLC Stripe account, create the $50 one-time price and the $50/month price. Paste the price IDs into the two `STRIPE_PRICE_HALAXIS_STOCK_CHECKER_*` env vars. Leave them blank until then.
2. Add `https://<your-domain>/api/stripe/webhook`. Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
3. Apply the plan receipt migration before turning checkout on.
4. Add the two Wallet SKUs in ApixisWallet `lib/catalog.ts` before Ixis redemption can succeed.
5. Leave `HALAXIS_PLANS_CHECKOUT` unset or `false` until those pieces are in place. Leave `ENABLE_PAYMENTS` false until counsel clears the fund.

## Vercel deploy

1. Import `313aidaroos/Halaxis.dev` in Vercel (framework: Next.js).
2. Set Production / Preview env vars from `.env.example`. Do not enable payments in Production until counsel signs off.
3. Deploy. Confirm `https://<project>.vercel.app` serves the marketing site.
4. Point `halaxis.dev` DNS to Vercel (A/ALIAS/CNAME per the Vercel domain panel). Add the same hostname to `NEXT_PUBLIC_APP_URL`.

### Required secrets (Vercel)

| Name | Required to ship marketing | Required later |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Recommended | Yes for Stripe redirects |
| Supabase trio | Optional (falls back to Resend / dev log) | Yes for durable waitlist |
| `RESEND_API_KEY`, `EMAIL_FROM` | Optional | Recommended if no DB |
| AI keys | Optional | For `/api/chat` |
| Stripe keys + stock-checker price IDs | No | Only with `HALAXIS_PLANS_CHECKOUT=true` |
| `HALAXIS_PLANS_CHECKOUT` | Keep `false` | `true` only after price IDs, webhook, and the receipt migration |
| `ENABLE_PAYMENTS` | Keep `false` | Fund only, after counsel |

## Remaining manual steps

- [x] Supabase project `halaxis` created; waitlist + screen tables applied
- [x] Vercel env: Supabase trio, `NEXT_PUBLIC_APP_URL`, `ENABLE_PAYMENTS=false`
- [ ] Create the two stock-checker Stripe prices and set the blank `STRIPE_PRICE_HALAXIS_STOCK_CHECKER_*` env vars
- [ ] Attach the Stripe webhook and apply `20261014000000_plan_receipts_ledger.sql` before `HALAXIS_PLANS_CHECKOUT=true`
- [ ] Leave `ENABLE_PAYMENTS` false (fund)
- [ ] Configure `halaxis.dev` DNS
- [ ] Counsel review of all `[Counsel-review placeholder]` copy, Privacy, Terms, and Risk
- [ ] Confirm entity, adviser, and offering status before changing any “not accepting investments” language
- [ ] Flip `ENABLE_PAYMENTS` only after the above

## Legal

Copy on this site is a **counsel-review draft**. Do not treat it as a PPM, Form ADV brochure, or fatwa. Do not add performance numbers or “SEC approved” claims.
