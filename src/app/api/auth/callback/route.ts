import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 * Supabase redirects here after user clicks the magic link.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?message=no_code", request.url),
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/auth/error?message=not_configured", request.url),
    );
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchange error:", error);
      return NextResponse.redirect(
        new URL(`/auth/error?message=${encodeURIComponent(error.message)}`, request.url),
      );
    }

    // Success — redirect to dashboard (or home if not ready)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    console.error("[auth/callback] error:", err);
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(message)}`, request.url),
    );
  }
}
