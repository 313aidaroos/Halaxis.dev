Grok Bot (Developer Bot hub + product leads) notes. Every change Grok Bot makes to this product (code, env, database, deploys) gets a dated entry here so Claude, Hermes and Codex stay on the same page.

## 2026-09-27 (CT) — Developer Bot (hub)
- Wallet registration: added `halaxis` to `wallet_api_clients` in Supabase project `kzneeksminozmhnqaaun`, with `require_sso=false`.
- Callback URLs registered: https://halaxis.vercel.app/auth/apixis/callback.
- Vercel env: replaced `WALLET_API_KEY` with a per-product `apx_live_` key, added `APIXIS_CLIENT_ID=halaxis`, and left legacy `APIXIS_WALLET_API_KEY` present (name-only check); production was redeployed from the same product commit.
- Cleanup status: the attempted deletion of legacy `APIXIS_WALLET_API_KEY` variables was stopped at about 22:45 CT; no deletion was made here.
- Undo: restore `WALLET_API_KEY` to its legacy value and deactivate the `halaxis` client row.

- `/buy` remains broken because Wallet `lib/catalog.ts` has no Halaxis items; this was not fixed.

## 2026-09-27 — Apixis ID + Wallet balance pill (Grok Bot)
- **What:** Merged Claude's PR #5 (Sign in with Apixis + SDK v3 + shared Wallet; update-branch was clean) with Grok commit 9b63993: `src/components/ApixisWalletChip.tsx` rewritten (one shared fetch of `/api/wallet/balance`, refetch on focus / visibilitychange / pageshow, "Sign in with Apixis" when signed out or unlinked), balance route returns `linked`, and a small pill in the mobile header next to the menu button (desktop pill was already in the header). Balance only: Hala stays faceless, no persona/UI changes.
- **Merge SHA:** f3bfb0a. Prod READY; `/api/wallet/balance` → 401 `{signIn:true}`; `/auth/apixis/start` → 302 to Wallet `/sso/authorize?client_id=halaxis`.
- **Undo:** `git revert -m 1 f3bfb0a` (or revert PR #5).
- No Wallet code, env/keys, Stripe, checkout or payment links changed.

## 2026-09-29 ~21:00 CT — One account / one agent / one Wallet (Halaxis Lead, Grok Bot)
- **What:** branch `grok/one-account` (PR, not merged, no prod deploy). Copied Renoxis's `lib/apixis-world-provision.ts` + `lib/apixis-world.ts` verbatim; new `src/lib/apixis-world-agent.ts` mirrors Renoxis `world-agent(-server).ts` with client `halaxis`. On first sign-in (`/auth/apixis/callback`, `/auth/callback`) and on `/dashboard`, a verified user without `app_metadata.apixis_world_agent_at` gets `POST https://www.apixis.dev/api/agent/provision` (Bearer `APIXIS_WORLD_KEY`); on 200 we save `apixis_world_agent_at/_id/_name` in Supabase auth `app_metadata` (no DB migration). Apixis.dev is idempotent per verified email / Apixis ID.
- Header: sign-in is "Log in with Apixis ID" (Wallet SSO, `/auth/apixis/start`); the old "Sign in" → `/auth/login` link was removed and "Get started" hides when signed in. `/api/wallet/balance` returns `worldAgent`, and the pill shows "Your agent is in the Apixis world ↗" → `https://www.apixis.dev/enter?from=halaxis` (mobile: in the menu). `/login` now redirects to `/auth/login`, which shows Apixis callback errors (it used to 404).
- **Env:** `APIXIS_WORLD_KEY` is **missing** on Vercel project `halaxis` (name-only check). Not minted; Developer Bot must issue it. Until then provisioning is skipped quietly.
- **Undo:** close the PR / delete branch `grok/one-account`; after a merge, `git revert` the merge commit. Saved `app_metadata.apixis_world_agent_*` keys are harmless; remove them with `updateUserById` if needed.
- Starter grant: per Awad (8:54 PM CT) new signups get **1000** Ixis (not 200). Apixis.dev grants it during provisioning; Halaxis never grants or stores Ixis. Repo had no "200 Ixis" copy; comments and Hala's system prompt now say 1000.
- Not touched: Wallet code/settings, Stripe skeleton, payment keys, venture agents, Hala.

