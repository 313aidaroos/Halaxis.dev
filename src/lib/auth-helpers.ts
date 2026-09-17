import { createServerSupabaseClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["awad@apixis.dev"];

export async function isAdmin(): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return false;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return false;

    return ADMIN_EMAILS.includes(user.email);
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
