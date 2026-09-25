# Halaxis: launch notes

_Updated 2026-09-25. One notes file per repo: what was changed, file by file, and everything you need to connect. The full family report: https://claude.ai/artifact/QERxA6PMsFK1vdR51Ex2NQ_

## Status

Ready after keys.

## Connect (in order)

1. Supabase and AI: see `.env.example`.
2. `CRON_SECRET`: random; protects the agent tick.
3. Optional `TAVILY_API_KEY` for research.

Every key this repo reads is listed in `.env.example` (required, optional, and legacy names to leave unset).

## Apixis Wallet

Has the Wallet client but sells nothing yet, so no Wallet key is needed.

## Database

None pending.

## What changed, file by file

| File | Change |
|---|---|
| `.env.example` | Added 5 key(s) the code reads that were missing: `CRON_SECRET`, `WALLET_API_KEY`, `APIXIS_WALLET_API_URL`, `TAVILY_API_KEY`, `APIXIS_WALLET_API_KEY`. |
| `docs/LAUNCH_NOTES.md` | This file. |
| `src/app/api/auth/signup/route.ts` | Rate limited. |
| `src/app/api/support/route.ts` | Rate limited. |
| `src/app/auth/login/page.tsx` | Suspense wrapper (production build was failing) and safe `?next=`. No visual change. |
| `src/app/set-password/page.tsx` | Suspense wrapper (build fix). No visual change. |

_Changes are backend and plumbing only. Pages, design and UI are not changed except where noted as a build or lint fix with no visual change._
