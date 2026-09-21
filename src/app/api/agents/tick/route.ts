import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isAiConfigured } from "@/lib/flags";
import { runAgentJob } from "@/lib/agent-worker";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  const db = createAdminSupabaseClient();
  if (!db)
    return NextResponse.json(
      { error: "Worker database is not configured." },
      { status: 503 },
    );
  const supplied = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  let authorized = false;
  if (secret) {
    const expected = `Bearer ${secret}`;
    authorized =
      Buffer.byteLength(supplied) === Buffer.byteLength(expected) &&
      timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  }
  if (!authorized && /^Bearer [a-f0-9]{64}$/.test(supplied)) {
    const { data, error } = await db.rpc("verify_agent_worker_token", {
      supplied: supplied.slice(7),
    });
    authorized = !error && data === true;
  }
  if (!authorized)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAiConfigured())
    return NextResponse.json(
      { error: "AI provider is not configured." },
      { status: 503 },
    );
  const { error } = await db.rpc("schedule_agent_work");
  if (error)
    return NextResponse.json({ error: "Scheduling failed." }, { status: 503 });
  const results = await Promise.all([
    runAgentJob(),
    runAgentJob(),
    runAgentJob(),
  ]);
  return NextResponse.json({ results });
}
