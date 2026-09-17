import { NextResponse } from "next/server";
import { z } from "zod";

import { sendSupportIntake } from "@/lib/email";
import { isResendConfigured } from "@/lib/flags";

const supportSchema = z.object({
  email: z.string().email(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

/**
 * POST /api/support
 * Support intake form. Sends to halaxis@apixis.dev (forwarded to awad@apixis.dev).
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = supportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email, subject, and message are required." },
      { status: 400 },
    );
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured." },
      { status: 503 },
    );
  }

  try {
    await sendSupportIntake(parsed.data);
    return NextResponse.json(
      {
        message: "Support request received. We'll get back to you soon.",
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    console.error("[api/support] error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
