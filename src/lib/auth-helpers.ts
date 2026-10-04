import { createServerSupabaseClient } from "@/lib/supabase/server";

// Owner admin allowlist (Awad's rule, 2026-10-04 Grok): both owner emails are admin as soon as they
// sign in with a verified email, by any method. ADMIN_EMAILS (comma-separated, Vercel env) adds to
// this fallback list. Case-insensitive.
export const OWNER_ADMIN_EMAILS = ["alaidaroosawad@gmail.com", "awad@apixis.dev"] as const;

export function adminEmails(env: string | undefined = process.env.ADMIN_EMAILS): Set<string> {
  const list = new Set<string>(OWNER_ADMIN_EMAILS);
  for (const raw of String(env ?? "").split(",")) {
    const email = raw.trim().toLowerCase();
    if (email.includes("@")) list.add(email);
  }
  return list;
}

/** Only a verified email counts. */
export function isAdminUser(
  user: { email?: string | null; email_confirmed_at?: string | null } | null | undefined,
): boolean {
  if (!user?.email || !user.email_confirmed_at) return false;
  return adminEmails().has(user.email.trim().toLowerCase());
}

export async function isAdmin(): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return false;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return isAdminUser(user);
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
