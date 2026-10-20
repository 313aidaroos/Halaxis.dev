# Apixis Orbit — Halaxis.dev integration handoff

**Status: NOT CONNECTED**. This PR is a safe scoped implementation brief and capability manifest, with no production API or user behavior changed.

## What exists today
`README.md` says this is an accredited-investor interest and Sharia-screen marketing site with screening endpoint, not a live fund or trading service. Investor payments and live trades are disabled pending legal work.

## Proposed scope
- Capability: `halaxis.screen.summary.read` (`read`, planned).
Retrieve a clearly qualified screening result and methodology summary; do not present it as a fatwa, investment recommendation or executed securities transaction.

## Concrete work to implement next
1. Bind any private holdings data to the authorized user; public screen has a separate policy.
2. Include screening methodology/version and data source dates; label uncertainty.
3. No fund subscription, security solicitation, paid trade or order execution.
4. Preserve legal and Sharia advisory review gates.
5. Test confidential holdings, unverified symbols and missing data.

## Universal Orbit gates
1. The Orbit host uses the **existing Apixis identity** and wallet; this repo does not create another credit ledger, agent registry, checkout or auth provider.
2. Any future adapter needs a dedicated signed service credential, expiry + replay prevention, binding from Apixis ID subject to the **local account or tenant**, and per-resource authorization. The Orbit hub must not impersonate users by supplying emails.
3. Data must be genuine and have a source timestamp and `demo` flag; errors and absent integrations fail closed. User-facing text must distinguish draft, submitted, paid, and verified states.
4. Only read/draft initially. No autonomous outbound messaging, spending, contracts, orders, investments, publishing or settlement.
5. Require unit/integration tests for wrong owner, missing creds, no-data response, retried requests and source freshness.
6. Never activate an Orbit capability in Core until product-specific code, tests and owner production configuration are verified.

**This PR provides integration preparation only, not runtime wiring.** See https://github.com/313aidaroos/Apixis.dev/pull/86 for the draft Orbit Core.
