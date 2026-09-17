import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout
 * Sign out the current user.
 */
export async function POST() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[auth/signout] error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Signed out." }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    console.error("[auth/signout] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
