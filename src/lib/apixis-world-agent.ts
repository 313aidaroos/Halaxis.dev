/**
 * The person's OWN Apixis world agent, created once per Apixis ID (Halaxis Lead / Grok Bot, 2026-09-29).
 * SERVER ONLY (service-role key + APIXIS_WORLD_KEY). Mirrors Renoxis.dev lib/renoxis/world-agent.ts +
 * world-agent-server.ts, with client "halaxis".
 *
 * On sign-in (Apixis ID callback, email-link callback) and on /dashboard, if the Supabase auth user has
 * no app_metadata.apixis_world_agent_at yet, ask Apixis.dev POST /api/agent/provision to create or reuse
 * their agent (default customizable Apixis body, 1000 starter Ixis once, granted by Apixis.dev; never granted or stored here), then record
 * apixis_world_agent_at / _id / _name on the user so later loads skip the call. Apixis.dev is idempotent
 * per verified email / Apixis ID, so a retry never creates a second agent or a second grant.
 *
 * Never throws. If APIXIS_WORLD_KEY is missing or Apixis.dev is down, nothing is saved and the next
 * sign-in retries; the site keeps working. Hala (Halaxis's AI) stays faceless; the agent is the user's.
 */
import type { User } from "@supabase/supabase-js";
import { provisionApixisWorldAgent } from "@/lib/apixis-world-provision";
import { enterApixisUrl } from "@/lib/apixis-world";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const HALAXIS_WORLD_CLIENT = "halaxis";
export const HALAXIS_WORLD_ENTER_URL = enterApixisUrl(HALAXIS_WORLD_CLIENT); // https://www.apixis.dev/enter?from=halaxis

type WorldAgentUser = Pick<User, "id" | "email" | "email_confirmed_at" | "app_metadata" | "user_metadata">;

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

/** True once Apixis.dev confirmed this person's world agent. */
export function hasWorldAgent(user: Pick<User, "app_metadata"> | null | undefined): boolean {
  return Boolean(str(user?.app_metadata?.apixis_world_agent_at));
}

/** Email proven: confirmed in Supabase, or the account came from Apixis ID (Wallet-verified). */
function hasVerifiedEmail(user: WorldAgentUser): boolean {
  return Boolean(user.email && (user.email_confirmed_at || str(user.app_metadata?.apixis_sub)));
}

export async function ensureHalaxisWorldAgent(user: WorldAgentUser | null | undefined): Promise<boolean> {
  if (!user) return false;
  if (hasWorldAgent(user)) return true;
  if (!hasVerifiedEmail(user)) return false;
  try {
    const m = (user.app_metadata ?? {}) as Record<string, unknown>;
    const result = await provisionApixisWorldAgent({
      client: HALAXIS_WORLD_CLIENT,
      email: String(user.email),
      emailVerified: true,
      apixisSub: str(m.apixis_sub),
      displayName: str(user.user_metadata?.full_name) ?? str(user.user_metadata?.name),
      timeoutMs: 6000,
    });
    if (!result.ok) {
      // apixis_world_key_missing = APIXIS_WORLD_KEY not set on this Vercel project: skip quietly.
      if (result.error !== "apixis_world_key_missing") console.error("Apixis world agent provision failed:", result.error, result.status ?? "");
      return false;
    }
    const admin = createAdminSupabaseClient();
    if (!admin) return false;
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...m,
        apixis_world_agent_at: new Date().toISOString(),
        apixis_world_agent_id: result.agent?.id ?? null,
        apixis_world_agent_name: result.agent?.name ?? null,
      },
    });
    if (error) {
      console.error("Apixis world agent save failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Apixis world agent provision error:", (err as Error)?.message ?? "");
    return false;
  }
}
