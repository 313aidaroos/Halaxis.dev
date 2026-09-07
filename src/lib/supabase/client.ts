import { createBrowserClient } from "@supabase/ssr";

import { isSupabaseConfigured } from "@/lib/flags";

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) return null;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
