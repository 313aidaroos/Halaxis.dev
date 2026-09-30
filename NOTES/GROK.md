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

## 2026-09-29 (CT) — Halaxis Lead (Grok Bot)
- **What:** Added an "Other Ixis companies" row to the site footer (Awad-approved task, via Developer Bot hub). The links live in `src/lib/ixis-companies.ts`, and the markup is in `src/components/site-footer.tsx` between the footer grid and the footer bottom. `src/app/globals.css` has a small `.footer-ixis` block that reuses the existing footer heading and link styles. Links open in a new tab. Halaxis is excluded, and so are Nexxis/Omnixis, Launchixis, PersonalContentBot, AwadBot, and COMMAND.
- **Where:** PR branch `grok/ixis-footer`, preview only. Not merged or deployed.
- **Undo:** close the PR, or revert its commit(s).
