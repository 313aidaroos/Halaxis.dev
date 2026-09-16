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
| Payments | `stripe` Checkout + webhook skeleton; `ENABLE_PAYMENTS=false` by default |
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
- `ENABLE_PAYMENTS` — must be the string `true` to expose Checkout

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

## Stripe (gated)

- Routes: `POST /api/stripe/checkout`, `POST /api/stripe/webhook`
- Pages: `/checkout/success`, `/checkout/cancel`
- UI on `/contact` stays hidden/disabled unless `ENABLE_PAYMENTS=true`
- Never pass `payment_method_types` (dynamic payment methods)
- Price IDs come from `STRIPE_PRICE_ONBOARDING`, then `STRIPE_PRICE_ALLOCATION` or `STRIPE_PRICE_SUBSCRIPTION`
- Apixis.dev **test mode** already has a Halaxis placeholder (do not treat as live): product `prod_VDKg3OJ4Mhbsjy` (Halaxis Investor Onboarding, $0/mo) and price `price_1UCu18BM0XItOdByzHvFHAMk` (`STRIPE_PRICE_ONBOARDING` in `.env.example`). `ENABLE_PAYMENTS` stays `false`.

### Stripe Dashboard steps (manual)

1. Use the existing Apixis.dev Stripe **test** account (restricted key preferred over a full secret key). The onboarding placeholder product/price above is already created in test mode.
2. Create additional products/prices only when counsel says a charge is lawful. Copy any extra `price_...` id into `STRIPE_PRICE_ALLOCATION` if needed.
3. Add `https://<your-domain>/api/stripe/webhook` as a webhook endpoint. Events: `checkout.session.completed` (and optionally async/expired). Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
4. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
5. Leave `ENABLE_PAYMENTS` unset or `false` until SEC/counsel clearance. Then set `ENABLE_PAYMENTS=true` and redeploy.

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
| Stripe keys + `STRIPE_PRICE_*` | No | Only with `ENABLE_PAYMENTS=true` |
| `ENABLE_PAYMENTS` | Keep `false` | `true` only after counsel |

## Remaining manual steps

- [x] Supabase project `halaxis` created; waitlist + screen tables applied
- [x] Vercel env: Supabase trio, `NEXT_PUBLIC_APP_URL`, `ENABLE_PAYMENTS=false`
- [ ] Stripe **test** onboarding placeholder already exists on Apixis.dev (`prod_VDKg3OJ4Mhbsjy` / `price_1UCu18BM0XItOdByzHvFHAMk`); create additional products/prices **only if** solicitation is cleared
- [ ] Attach Stripe webhook
- [ ] Configure `halaxis.dev` DNS
- [ ] Counsel review of all `[Counsel-review placeholder]` copy, Privacy, Terms, and Risk
- [ ] Confirm entity, adviser, and offering status before changing any “not accepting investments” language
- [ ] Flip `ENABLE_PAYMENTS` only after the above

## Legal

Copy on this site is a **counsel-review draft**. Do not treat it as a PPM, Form ADV brochure, or fatwa. Do not add performance numbers or “SEC approved” claims.
