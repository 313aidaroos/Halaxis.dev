# Claude notes (Halaxis)

Dated notes from Claude (Claude Code), same purpose as `NOTES/GROK.md`: what Claude checked or changed here, what it found, what is still open and who owns it. The one family status board is `ApixisWallet/docs/FAMILY_STATUS.md`.

## 2026-10-04 (UTC) — Claude: full-portfolio review (read-only; this note and the AI_CHANGELOG line are the only changes)

### Snapshot
- Reviewed `main` @ `50d5a08` (a notes-only `[skip ci]` commit; production ran `5bc508c`, the same code); the owner admin allowlist merged while I read → `main` is `8d65f14`. Vercel `halaxis` production READY.
- Supabase `zjlorazckuclrefcndxi`: no tracked migrations, but 13 tables are live — `accredited_interest` (2 rows), `illustrative_universe` (18), `screen_events` (6), `support_tickets`, and the whole `venture_*` / `agent_*` set (all 0 rows). `CRON_SECRET` set on Vercel 10-02.
- Open PR per the family board: #12 footer.

### Verified this session
- `npm run lint`, `typecheck`, `build`: all pass on Node 22.
- **No `test` script** (only `tests/venture-security.sql`) — the shared CI runs no tests here.
- `ENABLE_PAYMENTS=false` gate works: the Stripe webhook answers 403 while payments are off; checkout stays hidden.
- SDK: wallet, login, redirect, world provision identical to canonical. **`src/lib/apixis-world-agent.ts` is the OLD variant** (comment still says "200 in-world Ixis once"); `apixis-world.ts` one revision behind like every site.
- Advisors: `is_venture_member()` and `venture_action()` executable by authenticated (the ventures RPC, intended); RLS-no-policy INFO ×3; leaked-password WARN.

### Done (live)
Marketing pages (about, strategy, risk, compliance, contact, terms, privacy), Shariah screen (`/screen`, `POST /api/screen`, `GET /api/holdings` — AAOIFI business screens + DJIM 33% caps), accredited-investor interest form, ventures + member agents (dashboard, create/join, agent tick, proposals, votes, non-binding funding intentions), Apixis ID + magic link, Wallet balance, Cixy (educational, refuses personal advice), companies page, CI typecheck.

### Open — needs Awad
- `TAVILY_API_KEY` (agent web research is off without it).
- PR #12 footer.
- Keep `ENABLE_PAYMENTS=false` and no Wallet SKUs until counsel / SEC gates are cleared (as the board says: do not enable trading features).

### Open — Claude can do on your go
- Re-copy the world-agent kit from Apixis.dev (200 → 1,000 comment).
- `landing.html` (27 KB legacy static page) and `codex file.md` → `docs/archive/`.
- Migration files are out of order (`20240907…`, `20260316…`, `20260921…`) and none are tracked by Supabase — record the live schema properly.
- `/api/agents/tick` has no cron in `vercel.json` (unscheduled); confirm that is intended.
- Add a `test` script; `src/app/companies/page.tsx` links Ominix to `nexxis-tau.vercel.app` (retired host).
