/**
 * Server-side Apixis World agent provision for Halaxis (never import from client).
 * Grok kit copied 2026-09-30.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { WorldAgentUser } from "./apixis-world-agent";
import { ensureWorldAgent } from "./apixis-world-agent";
import { provisionApixisWorldAgent } from "./apixis-world-provision";

export async function ensureHalaxisWorldAgent(user: WorldAgentUser) {
  return ensureWorldAgent(user, {
    client: "halaxis",
    async provision(input) {
      return provisionApixisWorldAgent({
        ...input,
        emailVerified: true, // Only called after email confirmed
      });
    },
    async saveAppMetadata(userId, appMetadata) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase env missing for app_metadata save");
        return;
      }
      const jar = await cookies();
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => jar.getAll(),
          setAll: (list) => list.forEach(({ name, value, options }) => jar.set(name, value, options)),
        },
      });
      await supabase.auth.admin.updateUserById(userId, { app_metadata: appMetadata });
    },
  });
}
