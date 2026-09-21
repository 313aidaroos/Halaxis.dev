# Codex file — Halaxis agents and ventures

## What I built

Date: September 21, 2026. Target: https://halaxis.vercel.app.

The existing gold-and-wine design, logo, architectural imagery, stylesheet, header components, and footer components are preserved. A Ventures navigation destination and the existing Explore the platform button open the member dashboard. New screens reuse the existing cards, buttons, typography, colors, and page hero.

### Member journey

1. Sign in or create an account using the existing email magic-link flow.
2. The dashboard guides new members through creating their personal agent: name, mission, skills/resources, region, discovery permission, and scheduled-planning permission.
3. Discover ventures ranked by shared terms with the agent’s mission, skills and region; search or filter to joined ventures. Discover other agents that have opted into profile visibility.
4. Create a venture with a goal, region and planning budget, or join an existing venture with your agent. Share its URL to invite other people. Creating a venture does not incorporate a company.
5. Run the agent to contribute a planning brief and 1–3 tasks. It receives its owner’s profile, the venture, recent shared agent contributions, and recent task history. It is instructed to build on others’ work and avoid duplication.
6. Track tasks, record completion evidence, present proposals, vote, and see a chronological activity history.
7. Record or withdraw a non-binding funding intention. No card, bank account, wallet, or Ixis balance is charged.

### Agent execution

- Reuses the configured Anthropic/OpenAI provider. Extends its completion interface with a per-call token budget; existing chat defaults are preserved.
- Planning drafts and proposed tasks are persisted, rather than existing only in browser memory.
- Optional `TAVILY_API_KEY` enables a web search before drafting. Source links come from actual search results, not invented model URLs. Without it, the UI and agent explicitly identify the output as planning only.
- Agents collaborate asynchronously through shared venture briefs and tasks. This release does not implement unrestricted agent chat, automatic enrollment, unsolicited messages, verified supplier quotes, or purchasing.
- Scheduled planning is opt-in. The protected worker runs through the active `halaxis-agent-work` Supabase cron job every five minutes, using Supabase Vault authentication. Only members who opt in receive scheduled planning. Credentials are never client-side or in Git.
- The worker claims up to three jobs per invocation. Work has a five-minute lease, a unique active-job constraint, retry limits, and transactional/idempotent output persistence.
- Runs are capped at 10 per person in a rolling 24-hour window. Scheduled planning revisits a joined venture at most once per day. This is a bounded pilot, not a load-tested 1,000-agent procurement system.

### Decisions and money

- Every proposal snapshots its eligible member IDs when created. Later joins do not change that electorate.
- Each eligible member account has one changeable vote while voting remains open.
- A strict majority of all eligible members must vote yes. Ties and insufficient participation reject the proposal.
- Voting closes at its 1–30 day deadline or when all eligible members have voted. Results cannot be altered by further votes.
- Any member can finalize an expired proposal; the scheduler also finalizes expired votes.
- Approval records support for a plan. It does not grant the agent power to charge members, sign contracts, acquire property, or spend pooled money.
- Identity verification against duplicate accounts, actual fundraising, custody/escrow, entity formation, ownership allocation, refunds, payouts, contracts and supplier purchases remain future integrations requiring explicit authorization and appropriate operational arrangements.

## Data and authorization

New tables: `venture_agents`, `ventures`, `venture_members`, `venture_tasks`, `venture_proposals`, `venture_votes`, `agent_jobs`, `agent_contributions`, and `venture_activity`.

All have row-level security. Signed-in users can discover venture summaries and opted-in profiles. Tasks, proposals, votes, contributions, membership details, and activity are scoped to venture members. Agent jobs are scoped to their owner. Direct client writes are revoked; authenticated mutations go through `venture_action`, which derives the user from `auth.uid()` and checks ownership/membership. Worker functions are executable only by `service_role`.

The two authenticated SECURITY DEFINER functions are intentional: a membership predicate for RLS, and a transaction boundary for validated actions. Both pin an empty search path, qualify application objects, and were checked with cross-user denial tests. The database advisor reports these intentional functions plus pre-existing findings for legacy tables/password protection; no new anonymous write policies were introduced.

Migrations are stored under `supabase/migrations/20260921062503_venture_agents.sql` and `20260921063333_agent_scheduler.sql`. SQL was applied to the connected `halaxis` project using the Supabase connector. This project previously had no CLI migration history table; reconcile/baseline migrations before a future `supabase db push` rather than blindly replaying table creation against the live database.

## Routes

- `/dashboard`: member agent setup and venture discovery (replaces the prior admin-only placeholder).
- `/ventures`: dashboard shortcut.
- `/ventures/[id]`: shared venture workspace.
- `/api/workspace`: authenticated reads and validated member actions.
- `/api/agents/tick`: protected background worker; no public execution authority.

## Configuration

Existing Supabase and AI credentials are reused. No credentials are committed. `TAVILY_API_KEY` is optional for live research. The worker accepts an optional `CRON_SECRET`; otherwise it verifies its scoped Supabase Vault token through a service-only RPC. Existing signup redirects still require the production callback URL to be allowed in Supabase Auth.

Browser screen/audio access is not required. Automated desktop-browser checks were not used for this feature work.

## Verification

- Production build, TypeScript and ESLint checks passed.
- `tests/venture-security.sql` passed in a rolled-back transaction: nonmember read/write denial, task ownership, fixed electorate, late-join voting denial, unique votes, ties, vote finality, funding intentions, direct-write denial, worker access denial, active-job deduplication, lease validation and idempotent contribution persistence.
- No test users or ventures from that SQL test were retained.
- Vercel deployed the implementation successfully to the existing production site. HTTP checks: homepage and login return 200; signed-out dashboard/ventures redirect to login; workspace and worker APIs reject unauthenticated calls with 401.
- A scoped Vault token successfully authenticated a real worker request. Parallel claims were checked; a request-cache issue was fixed so a single queued job is claimed once.
- After the owner restored provider credits, the production worker returned HTTP 200 and completed a live integration job on its first attempt. Database verification confirmed exactly one saved planning brief and three tasks, with no job error. The brief correctly disclosed that live research was unavailable. The protected endpoint and output persistence are verified; this was not a browser signup test.
- Enabled and verified the active `halaxis-agent-work` schedule (`*/5 * * * *`). This checks for work every five minutes, not a new AI run for every member every five minutes. Opt-in, daily venture frequency, three-job worker batches, and per-owner limits still apply. AI API usage is billed to the configured provider account.
- The temporary live integration user, venture and jobs were removed; cleanup verified zero remaining fixture users/ventures.
- Existing account email delivery and the full signed-in browser journey were not tested. The 1,000-member scenario has not been load-tested.

## Remaining setup

1. Configure `TAVILY_API_KEY` to enable sourced research; otherwise agents produce planning drafts only.
2. Verify signup email delivery and the production callback allowlist with an actual member account.
3. Add separately approved payment, identity and procurement integrations before real funds or purchases are possible.

The current release supplies the agent/venture workspace and decision records. It does not yet fulfill autonomous end-to-end construction or acquisition.
