import { createClient } from "@supabase/supabase-js";

import { isSupabaseAdminConfigured } from "@/lib/flags";

/** Service-role client for trusted server routes only. Never import from client components. */
export function createAdminSupabaseClient() {
  if (!isSupabaseAdminConfigured()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        // Queue claims and private state must never be cached or request-deduplicated.
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(20000) }),
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
