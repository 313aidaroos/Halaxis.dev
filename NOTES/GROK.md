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

## 2026-10-02 (CT) — Backfill by Halaxis Lead (Grok Bot), covering 9/27 to 10/2
Backfill of changes made since the last entry that weren't logged here. Times are CT. Only this file changed in this commit, and nothing else was touched.

**Grok (Halaxis Lead)**
- 9/27 10:18 PM: merged PR #6 (`cursor/hala-faceless-wallet-buy-cfd5`) after a GraphQL rebase. It renamed Cixy to Hala (faceless) and added the Wallet `/buy?product=halaxis` link. Merge commit 019eee0. Undo: `git revert -m 1 019eee0`.
- 9/29 8:32 PM: opened PR #12 (`grok/ixis-footer`), adding the "Other Ixis companies" footer row with the list in `src/lib/ixis-companies.ts`. At 8:40 PM, at Awad's request, removed Qahwah World and Nursery Toons (11 sites, 729c979). It is NOT merged and now CONFLICTS with main, likely because of the /companies work. Undo: close the PR.
- 9/29 8:53 PM: opened PR #13 (`grok/one-account`) for the one-account, one-agent, one-wallet task. It was closed unmerged 10/1 11:18 PM, because main already covers it. The branch still exists (2 ahead, 8 behind).

**Direct-to-main commit (not via PR)**
- 9/29 11:28 PM: ed2fa6d "Apixis World agent auto-provision on first sign-in". It added `src/lib/apixis-world*.ts`, `src/lib/world-agent-server.ts`, `src/app/actions/world-agent.ts`, `src/components/apixis-welcome-card.tsx`, a CardFooter export in `ui/card.tsx`, and the /dashboard welcome card with Enter to `apixis.dev/enter?from=halaxis`. The commit message says 200 starter Ixis and Special Elite font on the card. Check this against the 1000 Ixis and no-restyle locks. Undo: `git revert ed2fa6d`.

**Codex**
- 9/30 1:22 AM: PR #14 (`codex/tester-readiness`), hardening shared-login return destinations, plus redirect regression tests. Undo: revert 109bf33.
- 10/2 2:22 AM: PR #18 (`codex/companies-tab-20261002`), adding the Apixis Companies page (/companies). Undo: revert 71984c5.
- 10/2 2:47 AM: PR #19, refining the Companies card motion and copy. Undo: revert dcd14d6.
- 10/2 3:19 AM: PR #20, fixing the Recovra link on /companies. Undo: revert 5bc508c.

**Claude (`claude/awesome-newton-3tygzi`)**
- 9/30 2:33 AM: PR #15, re-syncing the Apixis kits: login (`verifyOtp` type email), Wallet SDK v3.1, and the world kit (15 clients, 1,000 starter Ixis). Undo: revert 3f1675c.
- 9/30 3:23 AM: PR #16, adding the `typecheck` script for CI. Undo: revert 26fa0c8.
- 10/1 8:56 PM: PR #17, making `.env.example` list every env var the code reads. Undo: revert 9fc8c5c.

**Juno (`junoai/*`)**
- 9/28 4:08 AM: PR #10 (`junoai/ai-changelog`), adding `AI_CHANGELOG.md` and the rule that every AI logs its changes. Undo: revert d7b5481.
- 9/28 4:58 AM: PR #11 (`junoai/ci`), adding `.github/workflows/ci.yml`, which calls the shared node-ci workflow. Undo: revert 2ce180b.
- There are no `juno/*` branches in this repo.

**PR closures**
- The only Halaxis PR closed without merging in this window is #13. The family-wide closures (the 51 PRs) did not touch any other Halaxis PR.

**Open items seen on 10/2 (not fixed, everything frozen)**
- Hala chat is down: `/api/chat` returns 500 and `/api/health` shows `anthropic:false`, so the shared Anthropic key looks unset on Vercel.
- The Stripe skeleton and `/landing.html` (plus the root `landing.html`) are still on main and still to be removed at unpark.

## 2026-10-04 (CT) — Grok: owner admin allowlist (alaidaroosawad@gmail.com, awad@apixis.dev)
- What: Awad's rule — both owner emails are Halaxis admin as soon as they sign in with a verified email, by any method. Halaxis has one admin check, `isAdmin()` in `src/lib/auth-helpers.ts` (a hardcoded list with only awad@apixis.dev, exact-case, no verification check). It now uses both owner emails + optional `ADMIN_EMAILS` env (comma-separated), case-insensitive, and needs a confirmed email (`mailer_autoconfirm` is off on this Supabase project). No page calls `isAdmin()` yet, so nothing visible changes. Nobody else's access changed. No accounts or passwords were created.
- Where: `src/lib/auth-helpers.ts`; Vercel env `ADMIN_EMAILS` on project `halaxis` (production + preview).
- Who: Grok.
- Undo: `git revert <squash SHA>` and delete `ADMIN_EMAILS` in Vercel → halaxis → Settings → Environment Variables.

## 2026-10-04 (CT) — Grok: Feed tab on Halaxis
- What: new public `/feed` page with the Socixis Social family feed: one mixed For You feed from every Apixis company (including the agents' daily reports; never filtered by site), Following, Search · Trending, video/photo/text posts, follow, like, threaded comments, save, share, report, tips 10/50/100 Ixis, boost 250 Ixis/day. Browsing is public; acting needs Apixis ID sign-in. The Cixy auto-post toggle is hidden on Halaxis (only the agent toggle shows). "Feed" added to the header nav.
- Where: `src/feed-client/` (shared client), `src/app/feed/` (page with PageHero, Halaxis skin from the ui primitives, `feed.css` on the theme tokens), `src/app/api/feed-session/route.ts` (mints the browser feed token server-side with `APIXIS_WORLD_KEY`), `src/lib/site.ts` (nav item), `src/components/site-header.tsx` (nowrap + gap-5 so the longer nav stays on one line at 1440px), `src/lib/__tests__/feed-client.test.mts`, `test` script in package.json.
- Who: Grok (for Awad). No DB/env/Wallet changes. No SVGs.
- Undo: `git revert <merge sha>` of this PR.

## 2026-10-04 (CT) — Grok Bot: Feed visual fixes on Halaxis (preview only, NOT merged)
- Why: same lessons as the Socixis fix (Socixis PR #63). Awad put feed changes on hold, so this PR is for preview review only; do not merge until Awad says so.
- What: (1) Text-only posts use this site's normal body font (not the display/serif headline font), wrap long words and hashtags, and size to their content; no forced 450–520px empty card. Video/photo posts keep the full-height layout. (2) Feed modals and toasts sit above everything (z-index 2147483000, own stacking context); any element marked `data-floating-widget` hides while a feed modal is open. (3) Signed out, the 4th tab says "You" and shows the sign-in card; there is no "Sign in" tab button.
- Where: `src/app/feed/feed.css` (removed the serif text-post override), `src/feed-client/` synced. Added to the open feed-tab PR #22. Theme (header, fonts, colors, buttons, footer) unchanged. No SVGs, no DB/env/API change.
- Who: Grok Bot (for Awad).
- Undo: close this PR, or `git revert <squash sha>` if it is ever merged.

## 2026-10-04 19:00 (CT) — Grok Bot: Feed phone tab fit (same PR, still NOT merged)
- What: at 375px the 4th "You" tab was pushed off-screen by "Search · Trending". Under 560px the tab now reads "Search", tabs are tighter, and if a wide site font still can't fit the tabs and "+ Post" on one row, Post drops to its own row instead of covering "You". Desktop is unchanged; the site's colors, fonts and buttons are untouched; no SVGs.
- Where: feed client `FeedView.tsx` (tab label) and the shared layout section of the site's feed CSS.
- Who: Grok Bot (for Awad). No merge, no production deploy.
- Undo: revert this commit on the PR branch.
