import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAiConfigured, isSupabaseAdminConfigured } from "@/lib/flags";
import { actionSchema } from "@/lib/ventures";
import { runAgentJob } from "@/lib/agent-worker";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
async function context() {
  const db = createServerSupabaseClient();
  if (!db) return null;
  const {
    data: { user },
  } = await db.auth.getUser();
  return user ? { db, user } : null;
}
export async function GET(request: Request) {
  const ctx = await context();
  if (!ctx)
    return NextResponse.json(
      { error: "Sign in to use your workspace." },
      { status: 401 },
    );
  const { db, user } = ctx;
  const url = new URL(request.url);
  const v = url.searchParams.get("venture");
  if (v && !/^[0-9a-f-]{36}$/i.test(v))
    return NextResponse.json({ error: "Invalid venture ID." }, { status: 400 });
  const results = await Promise.all([
    db.from("venture_agents").select("*").eq("user_id", user.id).maybeSingle(),
    db.from("venture_agents").select("*").eq("discoverable", true).limit(100),
    v
      ? db.from("ventures").select("*").eq("id", v)
      : db
          .from("ventures")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
    v
      ? db.from("venture_members").select("*").eq("venture_id", v)
      : db.from("venture_members").select("*").eq("user_id", user.id),
    db
      .from("venture_tasks")
      .select("*")
      .eq("venture_id", v ?? "00000000-0000-0000-0000-000000000000")
      .order("created_at", { ascending: false })
      .limit(200),
    db
      .from("venture_proposals")
      .select("*")
      .eq("venture_id", v ?? "00000000-0000-0000-0000-000000000000")
      .order("created_at", { ascending: false })
      .limit(100),
    db
      .from("agent_contributions")
      .select("*")
      .eq("venture_id", v ?? "00000000-0000-0000-0000-000000000000")
      .order("created_at", { ascending: false })
      .limit(30),
    v
      ? db
          .from("agent_jobs")
          .select("id,venture_id,status,error,created_at")
          .eq("venture_id", v)
          .order("created_at", { ascending: false })
          .limit(20)
      : db
          .from("agent_jobs")
          .select("id,venture_id,status,error,created_at")
          .order("created_at", { ascending: false })
          .limit(20),
    db
      .from("venture_activity")
      .select("id,message,created_at")
      .eq("venture_id", v ?? "00000000-0000-0000-0000-000000000000")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);
  if (results.some((r) => r.error)) {
    console.error("[workspace]", results.find((r) => r.error)?.error?.code);
    return NextResponse.json(
      { error: "Workspace data is unavailable. Please try again later." },
      { status: 503 },
    );
  }
  const [
    agent,
    agents,
    ventures,
    members,
    tasks,
    proposals,
    contributions,
    jobs,
    activity,
  ] = results;
  const votes = proposals.data?.length
    ? await db
        .from("venture_votes")
        .select("*")
        .in(
          "proposal_id",
          proposals.data.map((p) => p.id),
        )
    : { data: [], error: null };
  if (votes.error)
    return NextResponse.json(
      { error: "Votes could not be loaded." },
      { status: 503 },
    );
  return NextResponse.json(
    {
      userId: user.id,
      agent: agent.data,
      agents: agents.data,
      ventures: ventures.data,
      members: members.data,
      tasks: tasks.data,
      proposals: proposals.data,
      votes: votes.data,
      contributions: contributions.data,
      jobs: jobs.data,
      activity: activity.data,
      aiReady: isAiConfigured() && isSupabaseAdminConfigured(),
      researchReady: !!process.env.TAVILY_API_KEY,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const ctx = await context();
  if (!ctx)
    return NextResponse.json(
      { error: "Sign in to use your workspace." },
      { status: 401 },
    );
  let json;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = actionSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  const { action, payload } = parsed.data;
  if (action === "resume") {
    const { data: job } = await ctx.db
      .from("agent_jobs")
      .select("id,owner_id")
      .eq("id", payload.job_id)
      .eq("owner_id", ctx.user.id)
      .maybeSingle();
    if (!job)
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    return NextResponse.json(await runAgentJob(job.id, ctx.user.id));
  }
  if (action === "queue" && (!isAiConfigured() || !isSupabaseAdminConfigured()))
    return NextResponse.json(
      {
        error:
          "Agent execution is not configured yet. You can still collaborate, plan tasks, and vote.",
      },
      { status: 503 },
    );
  const { data, error } = await ctx.db.rpc("venture_action", {
    action,
    payload,
  });
  if (error)
    return NextResponse.json(
      {
        error:
          error.code === "P0001"
            ? error.message
            : "Unable to save. Check your inputs and try again.",
      },
      { status: 400 },
    );
  if (action === "queue")
    return NextResponse.json({
      ...data,
      run: await runAgentJob(data.job_id, ctx.user.id),
    });
  return NextResponse.json(data);
}
