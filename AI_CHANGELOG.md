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

## 2026-09-29 — Grok Bot (Halaxis Lead)
- Changed: src/lib/apixis-world-provision.ts, src/lib/apixis-world.ts (copied from Renoxis), src/lib/apixis-world-agent.ts (new), src/lib/apixis-login.ts, src/app/auth/callback/route.ts, src/app/dashboard/page.tsx, src/app/api/wallet/balance/route.ts, src/components/ApixisWalletChip.tsx, src/components/site-header.tsx, src/components/SignInWithApixis.tsx, src/app/auth/login/page.tsx, src/lib/ai/system-prompt.ts (Hala: Apixis ID sign-in + 1000 starter Ixis on Apixis.dev), next.config.mjs, .env.example, NOTES/GROK.md, WORKBOARD.md
- Why: One Apixis ID = one Wallet = one world agent. Provision the user's own Apixis world agent on first sign-in (idempotent, stored in auth app_metadata), link to the Apixis world, and make "Log in with Apixis ID" the header sign-in.

