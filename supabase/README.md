# Supabase (stubs only)

This folder mirrors the Apixis-family layout. **Do not create a Supabase project from the agent or this repo.**

When you are ready:

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Run `supabase/migrations/20240907000000_accredited_interest.sql` in the SQL editor (or `supabase db push` after linking).
3. Copy Project URL, anon key, and service role key into Vercel / `.env.local` using the names in `.env.example`.
4. Keep RLS enabled. Waitlist inserts use the service-role key from `/api/waitlist` only.
