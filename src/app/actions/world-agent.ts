"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { welcomeSeenMetadata } from "@/lib/apixis-world-agent";
import { ensureHalaxisWorldAgent } from "@/lib/world-agent-server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getWorldAgentStatus() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { status: "invite" as const, showWelcome: false, agentName: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "invite" as const, showWelcome: false, agentName: null };

  // Ensure agent provisioned (idempotent, no-op if already done)
  const view = await ensureHalaxisWorldAgent(user);
  return view;
}

export async function dismissWelcomeCard() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return { ok: false };

  const jar = await cookies();
  const adminClient = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => jar.set(name, value, options)),
    },
  });

  const nextMeta = welcomeSeenMetadata(user.app_metadata, "dismiss");
  await adminClient.auth.admin.updateUserById(user.id, { app_metadata: nextMeta });
  return { ok: true };
}
