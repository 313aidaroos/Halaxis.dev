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
 * Send a magic-link signup email.
 * Not creating accounts; just sending passwordless links.
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
        shouldCreateUser: true,
        emailRedirectTo: redirectTo || defaultRedirect,
      },
    });

    if (error) {
      console.error("[auth/signup] signInWithOtp error:", error);
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
