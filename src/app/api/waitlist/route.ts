import { NextResponse } from "next/server";

import { clientKey, rateLimit } from "@/lib/rate-limit";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { persistWaitlist } from "@/lib/waitlist";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "waitlist"), 6, 15 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid form." },
      { status: 400 },
    );
  }

  try {
    const result = await persistWaitlist(parsed.data);
    return NextResponse.json({ ok: true, channel: result.channel });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to record interest.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
