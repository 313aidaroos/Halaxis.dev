import { z } from "zod";
export const agentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  mission: z.string().trim().min(10).max(2000),
  skills: z.string().trim().max(1000).default(""),
  location: z.string().trim().max(150).default(""),
  discoverable: z.boolean().default(false),
  autopilot: z.boolean().default(false),
});
const id = z.string().uuid();
const amount = z.coerce.number().finite().min(0).max(1_000_000_000);
const title = z.string().trim().min(3).max(200);
export const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("save_agent"), payload: agentSchema }),
  z.object({
    action: z.literal("create_venture"),
    payload: z.object({
      title: title.max(120),
      description: z.string().trim().min(20).max(5000),
      location: z.string().trim().max(150).default(""),
      target_amount: amount.default(0),
    }),
  }),
  z.object({
    action: z.literal("join"),
    payload: z.object({ venture_id: id }),
  }),
  z.object({
    action: z.literal("commitment"),
    payload: z.object({ venture_id: id, amount }),
  }),
  z.object({
    action: z.literal("create_task"),
    payload: z.object({
      venture_id: id,
      title,
      details: z.string().trim().max(4000).default(""),
    }),
  }),
  z.object({
    action: z.literal("complete_task"),
    payload: z.object({
      venture_id: id,
      task_id: id,
      evidence: z.string().trim().min(10).max(4000),
    }),
  }),
  z.object({
    action: z.literal("propose"),
    payload: z.object({
      venture_id: id,
      title,
      details: z.string().trim().min(20).max(6000),
      amount: amount.default(0),
      days: z.coerce.number().int().min(1).max(30).default(7),
    }),
  }),
  z.object({
    action: z.literal("vote"),
    payload: z.object({ venture_id: id, proposal_id: id, choice: z.boolean() }),
  }),
  z.object({
    action: z.literal("finalize"),
    payload: z.object({ venture_id: id, proposal_id: id }),
  }),
  z.object({
    action: z.literal("queue"),
    payload: z.object({ venture_id: id }),
  }),
  z.object({ action: z.literal("resume"), payload: z.object({ job_id: id }) }),
]);
export const briefSchema = z.object({
  summary: z.string().min(20).max(6000),
  tasks: z
    .array(
      z.object({
        title: z.string().min(3).max(200),
        details: z.string().min(10).max(4000),
      }),
    )
    .min(1)
    .max(3),
});
export type Agent = z.infer<typeof agentSchema> & { user_id: string };
export type Venture = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  target_amount: number;
  created_at: string;
};
export type Member = {
  user_id: string;
  venture_id: string;
  commitment: number;
};
export type Task = {
  id: string;
  venture_id: string;
  owner_id: string;
  title: string;
  details: string;
  status: string;
  evidence: string;
};
export type Proposal = {
  id: string;
  venture_id: string;
  title: string;
  details: string;
  amount: number;
  electorate: string[];
  closes_at: string;
  status: string;
};
export type Vote = { proposal_id: string; user_id: string; choice: boolean };
export type Contribution = {
  id: string;
  owner_id: string;
  summary: string;
  tasks: { title: string; details: string }[];
  sources: { title: string; url: string }[];
  created_at: string;
};
export type Job = {
  id: string;
  venture_id: string;
  status: string;
  error: string | null;
  created_at: string;
};
export type Workspace = {
  userId: string;
  agent: Agent | null;
  agents: Agent[];
  ventures: Venture[];
  members: Member[];
  tasks: Task[];
  proposals: Proposal[];
  votes: Vote[];
  contributions: Contribution[];
  jobs: Job[];
  activity: { id: number; message: string; created_at: string }[];
  aiReady: boolean;
  researchReady: boolean;
};
/** Explainable discovery score; no agents join or commit users automatically. */
export function matchScore(agent: Agent, venture: Venture) {
  const terms = Array.from(
    new Set(
      (agent.mission + " " + agent.skills + " " + agent.location)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 3),
    ),
  );
  const text = (
    venture.title +
    " " +
    venture.description +
    " " +
    venture.location
  ).toLowerCase();
  return terms.filter((t) => text.includes(t)).length;
}
