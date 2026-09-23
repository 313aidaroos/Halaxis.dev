import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = createServerSupabaseClient();
    if (!supabase) return NextResponse.redirect(new URL("/", url.origin));
    
    await supabase.auth.exchangeCodeForSession(code);
    
    // Check if user has password set — if not, redirect to set-password
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: session } = await supabase.auth.getSession();
      // First-time magic-link user → offer password setup
      if (session && !user.user_metadata.password_set) {
        return NextResponse.redirect(new URL(`/set-password?next=${encodeURIComponent(next)}`, url.origin));
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
