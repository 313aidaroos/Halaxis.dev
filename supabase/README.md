# Supabase

Project name in the Apixis Family org: `halaxis`.

Apply both migrations (SQL editor or Management API):

1. `supabase/migrations/20240907000000_accredited_interest.sql` — accredited-investor interest
2. `supabase/migrations/20260316000000_screen_and_universe.sql` — illustrative universe + screen ledger

RLS stays on. Inserts use the service-role key from `/api/waitlist`, `/api/screen`, and `/api/holdings` only. Anon has no table policies.

Do not commit keys. Do not treat `illustrative_universe` as a live book.
