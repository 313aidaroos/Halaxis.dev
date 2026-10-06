# AI Change Log

## Rules for AI models, bots, and agents

If you are an AI (Claude, ChatGPT, Grok, Gemini, Copilot, Cursor, JunoAI, or any other model, bot, or agent) and you add, modify, or delete anything in this repository, you **must** append a dated entry to this file describing what you changed and why — one entry per work session, no exceptions. This log is how the repository owner tracks what every AI did. Human commits do not need entries.

Entry format:

## YYYY-MM-DD — <your name/model>
- Changed: <files or area>
- Why: <reason>

---

## 2026-09-28 — JunoAI
- Changed: created this file
- Why: owner's standing rule — every AI that touches this repo must log its changes here

## 2026-09-28 — JunoAI
- Changed: Added .github/workflows/ci.yml — thin caller of the shared reusable workflow 313aidaroos/github-actions/.github/workflows/node-ci.yml@main (checkout → Node 20 → npm ci → lint/typecheck/test/build).
- Why: Standardize CI across repos via the shared reusable workflow.


## 2026-09-30 — Codex — Tester readiness: shared-login redirects

- Copied the canonical ApixisWallet local-redirect validator and used it at login start and callback. Preserved this app’s existing Supabase adapter and routes.
- Added regression cases for external URLs, backslashes, encoded separators/control characters and normal return destinations. No design changes.

## 2026-09-30 — Claude (branch claude/awesome-newton-3tygzi)
- Changed: `src/lib/apixis-login.ts` re-copied from `ApixisWallet/sdk/apixis-login-next.ts` — `verifyOtp({ type: "email" })` (D16: new addresses get a `signup` token that `magiclink` rejects). `src/lib/apixis-wallet.ts` → SDK v3.1 (adds `marketplaceOrder`/`marketplaceSettle`). `src/lib/apixis-world*.ts` re-synced with Apixis.dev (15 clients incl. ominix, wattixis; 1,000 starter Ixis, D11).
- Why: family backend pass per Awad's 2026-09-30 decisions (ApixisWallet/AGENTS.md §0c D11–D16; live board: ApixisWallet/docs/FAMILY_STATUS.md). One SDK, one login kit, one world kit — copied from canonical, never patched by hand.

## 2026-10-01 (early) — Claude
- Changed: `typecheck` script added (0 errors); CI already present.
- Why: overnight second pass.

## 2026-10-02 — Claude (Claude Code)
- Changed: `.env.example` now lists every env var the code reads (missing names appended with a one-line note each).
- Why: so the owner can add keys in Vercel from one complete list. No code changed.

## 2026-10-04 — Grok
- Changed: Feed tab (src/app/feed/, src/feed-client/, src/app/api/feed-session, nav item, header nowrap, src/lib/__tests__/feed-client.test.mts, package.json test script)
- Why: Awad asked for the Socixis Social family feed as a Feed tab on every Apixis site.
## 2026-10-04 — Claude (Claude Code, full-portfolio review)
- Changed: `NOTES/CLAUDE.md` — this repo's slice of the 24-repo review (what is live, what is open, who owns each item, drift found). No code, env, database or deploy changes.
- Why: Awad asked for every repo to be read twice with a done / to-do / owner status, and for the notes in each repo to be updated. Notes only; Awad approved the merge on 2026-10-04.

## 2026-10-05 — Halaxis Lead (Hermes Agent)
- Changed: src/components/payment-panel.tsx (line 36: "coming soon" → honest "membership opens after Awad sets tier amounts"), src/lib/apixis-world-agent.ts re-copied from Apixis.dev (1,000 Ixis comment, aidaroosholding client), NOTES/SYNC_2026-10-05.md (pass-2 comprehensive read report).
- Why: family rule violation ("coming soon" behind a price breaks honesty); world-agent kit drift (200 comment outdated per D11); pass-2 read per Awad 2026-10-05 directive. @hermes feedback: Halaxis 40% ready, two Awad decisions needed (tier amounts, TAVILY_API_KEY).

## 2026-10-06 — Claude (family lead): AI Receptionist notes (D18)
- Changed: AI Receptionist section in the family notes (see `docs/AI_RECEPTIONIST.md` in ApixisWallet); notes only, no code.
- Why: Awad approved an AI Receptionist add-on at $100/month for every customer-facing family site and asked every bot and agent to follow one plan.
