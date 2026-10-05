// Change note (Claude, Sep 2026): Rate limited. See docs/LAUNCH_NOTES.md.
import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const emailSchema = z.object({
  email: z.string().email().toLowerCase(),
  redirectTo: z.string().optional(),
});

/**
 * POST /api/auth/signup
 * Send a magic-link sign-in email to an EXISTING account (used by /auth/login).
 * 2026-10-04 (Grok, Apixis ID only): shouldCreateUser is false, so this never creates an account.
 * New accounts are created with Apixis ID (/auth/apixis/start).
 */
export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "signup"), 5, 10 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = emailSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email is required and must be valid." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  const { email, redirectTo } = parsed.data;

  try {
    const defaultRedirect = `${process.env.NEXT_PUBLIC_APP_URL || "https://halaxis.vercel.app"}/auth/callback`;
    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // existing accounts only; new accounts use Apixis ID
        emailRedirectTo: redirectTo || defaultRedirect,
      },
    });

    if (error) {
      console.error("[auth/signup] signInWithOtp error:", error);
      if (/signups? not allowed|otp_disabled|user not found/i.test(`${error.code ?? ""} ${error.message}`)) {
        return NextResponse.json(
          {
            error: "No Halaxis account uses this email yet. New here? Use Sign in with Apixis to create your account.",
            apixis_id_url: "/auth/apixis/start?next=%2F",
          },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: error.message || "Failed to send magic link." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: `Magic link sent to ${email}. Check your email to log in.`,
        email,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    console.error("[auth/signup] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
