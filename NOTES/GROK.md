Grok Bot (Developer Bot hub + product leads) notes. Every change Grok Bot makes to this product (code, env, database, deploys) gets a dated entry here so Claude, Hermes and Codex stay on the same page.

## 2026-10-04 summary

- **Grok:** added the two-owner verified admin allowlist.
- **Lead:** prepared the Feed tab and shared visual fixes on a branch; not a merged live-site change.
- **Claude:** merged PR #23 (`c7f2242`) around 6:30 PM CT, adding the full-portfolio review to `NOTES/CLAUDE.md` and `AI_CHANGELOG.md` (notes/docs only).
- **Hermes:** no 2026-10-04 commit or merged PR identified in this repository.
- **Juno:** no 2026-10-04 commit or merged PR identified in this repository.

## Catch-up correction — 2026-10-04 (CT)

Claude activity was present; the earlier “no Claude activity” line was incorrect. Each item below has an undo pointer.

- **Claude, 2026-10-04 6:31 PM CT — PR #23, merge `c7f22424fc0fdb3bbf86ab28d6161cf511f046dd`:** notes: Claude full-portfolio review 2026-10-04 (NOTES/CLAUDE.md, AI_CHANGELOG); added `NOTES/CLAUDE.md` and `AI_CHANGELOG.md` (notes/docs only). Undo: `git revert c7f22424fc0fdb3bbf86ab28d6161cf511f046dd`.
- **2026-10-04 6:45 PM CT — 313aidaroos:** `notes: log Claude #23 + 10/4 verification (Grok) [skip ci]` landed as `14cbbd94d7f2ebe636ac5d4bcd3f19c69f8f54c6`. Where: commit `14cbbd94d7f2ebe636ac5d4bcd3f19c69f8f54c6`. Undo: `git revert 14cbbd94d7f2ebe636ac5d4bcd3f19c69f8f54c6`.

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
## 2026-10-04 catch-up provenance (CT)

The entries below record the day's observed commits and merged PRs. Existing detailed entries above remain the change descriptions; this section supplies exact provenance and undo pointers.

### Commits
- `8d65f14` (2026-10-04T17:47:33-05:00, 313aidaroos; alaidaroosawad@gmail.com) — Owner admin allowlist: both owner emails, ADMIN_EMAILS, case-insensitive, verified only (#21). Undo: undo via the merged PR below: git revert 8d65f14.
- `ac213b7` (2026-10-04T18:00:33-05:00, 313aidaroos; 313aidaroos@users.noreply.github.com) — Feed tab: Socixis Social family feed at /feed (shared feed-client, Halaxis skin). Undo: no main change; close/delete the branch (or revert the branch commit before reuse).
- `cbc9996` (2026-10-04T18:09:17-05:00, 313aidaroos; 313aidaroos@users.noreply.github.com) — Feed: apply Socixis visual fixes (text posts size to content, modals on top, 'You' tab). Undo: no main change; close/delete the branch (or revert the branch commit before reuse).

### Merged PRs
- PR #21, merge `8d65f14`, `grok/owner-admin-allowlist` → `main`, merged 2026-10-04 CT by 313aidaroos: Owner admin allowlist for alaidaroosawad@gmail.com and awad@apixis.dev. Undo: `git revert 8d65f14`.

## 2026-10-04 (CT) — Halaxis Lead (Grok): Claude's 10/4 work, logged and verified
- **What Claude changed:** PR #23 (`claude/great-fermi-6brq7a`), merged 10/4 6:31 PM CT as c7f2242. It is notes only: a new `NOTES/CLAUDE.md` (read-only portfolio review) and a new line in `AI_CHANGELOG.md`. Claude made no code, env, DB or deploy changes here. Undo: `git revert c7f2242`.
- **Verified live at 6:45 PM CT:** the pages, /companies and /screen return 200. /dashboard redirects to sign-in. Apixis ID start returns 302 to Wallet SSO. The Wallet balance returns 401 when signed out. `/api/health` shows anthropic:true, and Hala chat answers again (it was down on 10/2). Every /companies link returns 200. The repo has no SVG files, and Cixy appears nowhere in the code. The religious greeting appears only on Halaxis, which is allowed.
- **Open, not changed by me:**
  - `src/lib/apixis-world-agent.ts` is an old kit copy. Only its comment still says "200 in-world Ixis", and the actual grant happens on Apixis.dev. Re-copy it from canonical rather than editing by hand.
  - /companies still links Launchixis and Ominix (`nexxis-tau.vercel.app`), which the footer brief excludes. Codex owns that page.
  - Claude's notes name Supabase project `zjlorazckuclrefcndxi`, which differs from the earlier slot `nglaoalnxumyohiwbpcv`. The hub should confirm which one is canonical.
  - There is no `test` script. `/api/agents/tick` has no cron. The `landing.html` copies and the Stripe skeleton (gated) are still there.
  - Open PRs: #12 (footer, conflicting) and #22 (feed tab). /feed is not live yet.
- **Who:** Halaxis Lead (Grok). This commit changes only this file.

## 2026-10-04 (CT) — Grok (Developer Bot hub): Cixy persona v2 sync + Ominix link
- What: Ominix link on /companies now https://ominix-app.vercel.app (URL string only; no SVG/design change). No Cixy kit copy in this repo; Hala's own religious/halal rules untouched.
- Files: src/app/companies/page.tsx 
- Why: Awad's lock — no religious content in Cixy on any product except Halaxis; she declines only genuinely harmful, deceptive or illegal content, never on religious grounds (9/30). Kit = ApixisWallet `sdk/apixis-cixy.*` v2 (3a22244, PR #50) with two hub edits pending canonical: the religion-derived "clean recommendations" rule (gambling) is replaced by "decline only harmful, deceptive or illegal, never on religious grounds", and the character line reads "draws on Arab culture". Ominix links point to https://ominix-app.vercel.app (checked 200 on 2026-10-04 ~6:55 PM CT).
- Who: Grok (Developer Bot hub), branch `grok/cixy-v2-20261004`, one squash-merged PR.
- Undo: `git revert <squash sha of this PR>` (sha recorded in the PR), then redeploy prod.

## 2026-10-04 19:13 (CT) — Grok Bot: Feed PR #22 approved for production by Awad
- Why: Awad said "make it live" at 7:13 PM CT on Oct 4, 2026, approving the squash-merge of this PR and the production deploy that follows from main.
- What: squash-merge of PR #22 (feed files + Feed nav entry only); Vercel's Git integration deploys main to production.
- Who: Grok Bot (for Awad).
- Undo: `git revert <squash sha of PR #22>` on main and push (the squash sha is on the PR page and in /workspace/feed/STATUS.md), or in Vercel promote the previous production deployment (instant rollback) and then revert.

## 2026-10-04 evening provenance, 6:57 to 9:25 PM (CT)

Recorded by Grok (Developer Bot, notes and status sync at 9:25 PM CT). Every change below already has a detailed entry in this file or in the matching lead note; this section adds the exact commit, PR number, and undo pointer. All commits were pushed under the shared `313aidaroos` GitHub account; the detailed entries say which bot or lead made each one. Text only, no code or settings changed.

- 7:06 PM, PR #24, `611e636`: Cixy persona v2 sync (no religious content outside Halaxis) + Ominix link to ominix-app.vercel.app. Undo: `git revert 611e636` on `main`, then redeploy production.
- 7:17 PM, PR #22, `de616d4`: Feed tab: Socixis Social family feed. Undo: `git revert de616d4` on `main`, then redeploy production.
