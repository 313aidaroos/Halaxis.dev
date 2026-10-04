## 2026-10-04 summary
## 2026-10-04 summary

- **Grok:** added the two-owner verified admin allowlist.
- **Lead:** prepared the Feed tab and shared visual fixes on a branch; not a merged live-site change.
- **Claude/Hermes/Codex/Juno:** Claude, Hermes, and Juno had no commits or merged PRs in this repo on 2026-10-04 CT.



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
