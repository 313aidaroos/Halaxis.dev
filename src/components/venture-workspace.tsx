"use client";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type FormEvent,
} from "react";
import { ArrowRight, Bot, Users, Compass, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { matchScore, type Workspace, type Agent } from "@/lib/ventures";

const money = (value: number | string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
type Action = (
  action: string,
  payload: Record<string, unknown>,
) => Promise<boolean>;
function Field({
  label,
  name,
  value = "",
  area = false,
  type = "text",
  minLength,
  required = true,
}: {
  label: string;
  name: string;
  value?: string | number;
  area?: boolean;
  type?: string;
  minLength?: number;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span>{label}</span>
      {area ? (
        <Textarea
          name={name}
          defaultValue={value}
          required={required}
          minLength={minLength}
          maxLength={4000}
          rows={4}
        />
      ) : (
        <Input
          name={name}
          type={type}
          defaultValue={value}
          required={required}
          minLength={minLength}
          maxLength={type === "number" ? undefined : 200}
          min={type === "number" ? 0 : undefined}
          max={type === "number" ? 1_000_000_000 : undefined}
          step={type === "number" ? "0.01" : undefined}
        />
      )}
    </label>
  );
}
function Form({
  children,
  submit,
  label,
  busy,
}: {
  children: ReactNode;
  submit: (
    values: Record<string, string>,
    form: HTMLFormElement,
  ) => Promise<void>;
  label: string;
  busy: boolean;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        await submit(
          Object.fromEntries(new FormData(form)) as Record<string, string>,
          form,
        );
      }}
    >
      {children}
      <Button variant="gold" type="submit" disabled={busy}>
        {busy ? "Working…" : label}
      </Button>
    </form>
  );
}
function AgentForm({
  agent,
  act,
  busy,
}: {
  agent: Agent | null;
  act: Action;
  busy: boolean;
}) {
  return (
    <Form
      busy={busy}
      label={agent ? "Save agent settings" : "Create my agent"}
      submit={async (values) => {
        await act("save_agent", {
          ...values,
          discoverable: values.discoverable === "on",
          autopilot: values.autopilot === "on",
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="name"
          label="Agent name"
          value={agent?.name}
          minLength={2}
        />
        <Field
          name="location"
          label="Your location or region"
          value={agent?.location}
          required={false}
        />
      </div>
      <Field
        name="mission"
        label="What do you want to bring to life?"
        value={agent?.mission}
        area
        minLength={10}
      />
      <Field
        name="skills"
        label="Skills and resources you can contribute"
        value={agent?.skills}
        area
        required={false}
      />
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="discoverable"
          defaultChecked={agent?.discoverable}
          className="mt-1"
        />
        <span>
          Make my agent’s name, mission, skills and region visible to signed-in
          members for matching.
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="autopilot"
          defaultChecked={agent?.autopilot}
          className="mt-1"
        />
        <span>
          Allow scheduled planning in ventures I join. My agent may read shared
          contributions and add draft briefs and tasks. It cannot vote, spend,
          purchase, or contact outsiders.
        </span>
      </label>
      <p className="text-xs text-muted-foreground">
        Your mission and skills are sent to the configured AI provider when you
        run your agent. Shared contributions are visible to venture members.
        Participation and funding intentions always stay under your control.
      </p>
    </Form>
  );
}

export function VentureWorkspace({ ventureId }: { ventureId?: string }) {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const load = useCallback(async () => {
    const r = await fetch(
      `/api/workspace${ventureId ? `?venture=${encodeURIComponent(ventureId)}` : ""}`,
      { cache: "no-store" },
    );
    const body = await r.json();
    if (!r.ok) throw new Error(body.error ?? "Unable to load workspace.");
    setData(body);
  }, [ventureId]);
  useEffect(() => {
    let active = true;
    fetch(
      `/api/workspace${ventureId ? `?venture=${encodeURIComponent(ventureId)}` : ""}`,
      { cache: "no-store" },
    )
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error);
        if (active) setData(body);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [ventureId]);
  const pending = data?.jobs.some(
    (j) => j.status === "queued" || j.status === "running",
  );
  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => {
      void load().catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [pending, load]);
  const act: Action = async (action, payload) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Unable to save.");
      setNotice(
        body.run?.error ??
          body.error ??
          (action === "queue" || action === "resume"
            ? (body.run?.processed ?? body.processed)
              ? "Agent work saved. Read the brief and review its tasks below."
              : "Agent work is queued or already being processed. Check its status below."
            : "Saved."),
      );
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const selected = data?.ventures.find((v) => v.id === ventureId);
  const joined = !!data?.members.some(
    (m) => m.venture_id === ventureId && m.user_id === data.userId,
  );
  const memberName = (id: string) =>
    id === data?.userId
      ? (data.agent?.name ?? "Your agent")
      : (data?.agents.find((a) => a.user_id === id)?.name ?? "Member agent");
  const heading = ventureId
    ? (selected?.title ?? "Venture workspace")
    : data?.agent
      ? `${data.agent.name}, ready to build.`
      : "Every great venture starts with you.";
  return (
    <>
      <PageHero
        eyebrow={ventureId ? "BUILD TOGETHER" : "YOUR PERSONAL AGENT"}
        title={heading}
        description={
          ventureId
            ? (selected?.description ??
              "Shared research, thoughtful decisions, and a clear path forward.")
            : "Give your agent a purpose. Find people with a shared ambition. Turn the next step into a real plan."
        }
      />
      <div className="container space-y-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard" className="text-link mt-0">
            <Compass size={17} /> My agent & ventures
          </Link>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => {
                setError("");
                void load().catch((e) => setError(e.message));
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </Button>
            <form method="POST" action="/api/auth/signout">
              <Button variant="outline">Sign out</Button>
            </form>
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm"
          >
            {error}
          </div>
        )}
        {notice && (
          <div
            role="status"
            className="rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm"
          >
            {notice}
          </div>
        )}
        {!data ? (
          <p role="status">
            {error ? "Use Refresh to try again." : "Loading your workspace…"}
          </p>
        ) : (
          <>
            {!data.agent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-3 text-2xl">
                    <Bot className="text-gold" />
                    Meet your agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentForm agent={null} act={act} busy={busy} />
                </CardContent>
              </Card>
            ) : (
              <>
                {!ventureId && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Bot className="text-gold" />
                          {data.agent.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-5">
                          {data.agent.mission}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gold">
                          <span>
                            {data.agent.discoverable
                              ? "Discoverable to members"
                              : "Private agent profile"}
                          </span>
                          <span>·</span>
                          <span>
                            {data.agent.autopilot
                              ? "Scheduled planning enabled"
                              : "Runs only when requested"}
                          </span>
                        </div>
                        <details className="mt-5">
                          <summary className="cursor-pointer text-sm text-gold">
                            Edit agent & permissions
                          </summary>
                          <div className="mt-5">
                            <AgentForm
                              agent={data.agent}
                              act={act}
                              busy={busy}
                            />
                          </div>
                        </details>
                      </CardContent>
                    </Card>
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                      <div className="space-y-5">
                        <div>
                          <p className="eyebrow">FIND YOUR PEOPLE</p>
                          <h2 className="font-serif text-3xl mt-2">
                            Ventures with a shared purpose
                          </h2>
                        </div>
                        <Input
                          aria-label="Search ventures"
                          placeholder="Search a venture, place, or idea"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={onlyMine}
                            onChange={(e) => setOnlyMine(e.target.checked)}
                          />
                          Show ventures I joined
                        </label>
                        {data.ventures.length === 0 && (
                          <p className="text-muted-foreground">
                            No ventures yet. Start the first one and invite
                            others to join.
                          </p>
                        )}
                        {data.ventures
                          .filter(
                            (v) =>
                              (v.title + v.description + v.location)
                                .toLowerCase()
                                .includes(filter.toLowerCase()) &&
                              (!onlyMine ||
                                data.members.some(
                                  (m) =>
                                    m.venture_id === v.id &&
                                    m.user_id === data.userId,
                                )),
                          )
                          .sort(
                            (a, b) =>
                              matchScore(data.agent!, b) -
                              matchScore(data.agent!, a),
                          )
                          .map((v) => (
                            <Link
                              key={v.id}
                              href={`/ventures/${v.id}`}
                              className="resource-card block"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="text-2xl">{v.title}</h3>
                                <ArrowRight className="text-gold shrink-0" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                                {v.description}
                              </p>
                              <p className="text-xs text-gold mt-4">
                                {v.location || "Location open"} · Planning
                                target {money(v.target_amount)}
                              </p>
                              {matchScore(data.agent!, v) > 0 && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Suggested from words shared with your agent’s
                                  mission, skills, or region.
                                </p>
                              )}
                            </Link>
                          ))}
                      </div>
                      <Card className="h-fit">
                        <CardHeader>
                          <CardTitle className="text-2xl">
                            Start a venture
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form
                            busy={busy}
                            label="Create venture"
                            submit={async (values, form) => {
                              if (await act("create_venture", values))
                                form.reset();
                            }}
                          >
                            <Field
                              name="title"
                              label="What are you building?"
                              minLength={3}
                            />
                            <Field
                              name="description"
                              label="The goal and what success looks like"
                              area
                              minLength={20}
                            />
                            <Field
                              name="location"
                              label="Preferred location"
                              required={false}
                            />
                            <Field
                              name="target_amount"
                              label="Initial planning budget (USD)"
                              type="number"
                              value={0}
                            />
                            <p className="text-xs text-muted-foreground">
                              Venture descriptions are discoverable to signed-in
                              members. Budgets are planning estimates. Creating
                              a venture does not create a legal entity or
                              collect money.
                            </p>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                    <section>
                      <p className="eyebrow">THE COMMUNITY</p>
                      <h2 className="text-3xl mt-2 mb-5">
                        Discover other agents
                      </h2>
                      <div className="grid gap-4 md:grid-cols-3">
                        {data.agents
                          .filter((a) => a.user_id !== data.userId)
                          .map((a) => (
                            <Card key={a.user_id}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Bot size={18} />
                                  {a.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {a.mission}
                                </p>
                                <p className="text-xs text-gold mt-3">
                                  {a.skills || "Open to collaboration"}
                                </p>
                                <p className="text-xs mt-2">{a.location}</p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                      {data.agents.filter((a) => a.user_id !== data.userId)
                        .length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Other agents will appear here when their owners enable
                          discovery. Share your venture’s link to bring people
                          together.
                        </p>
                      )}
                    </section>
                  </>
                )}
                {ventureId && !selected && (
                  <p>
                    Venture not found.{" "}
                    <Link href="/dashboard" className="text-gold">
                      Return to your dashboard.
                    </Link>
                  </p>
                )}
                {selected && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        {
                          label: "Planning target",
                          value: money(selected.target_amount),
                        },
                        {
                          label: "Location",
                          value: selected.location || "To be researched",
                        },
                        {
                          label: "Your participation",
                          value: joined ? "Member + agent" : "Discovering",
                        },
                      ].map((s) => (
                        <Card key={s.label}>
                          <CardContent className="pt-6">
                            <p className="text-xs text-muted-foreground mb-2">
                              {s.label}
                            </p>
                            <p className="text-xl">{s.value}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {!joined ? (
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <h2 className="text-2xl">
                            Bring your agent to this venture.
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Joining lets you read shared work, contribute tasks,
                            and participate in future votes. It does not commit
                            funds. If you enabled scheduled planning, your agent
                            can begin drafting contributions.
                          </p>
                          <Button
                            variant="gold"
                            disabled={busy}
                            onClick={() =>
                              void act("join", { venture_id: ventureId })
                            }
                          >
                            <Users size={16} />
                            Join venture
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <Card>
                          <CardContent className="pt-6 flex flex-wrap justify-between gap-5">
                            <div>
                              <h2 className="text-2xl">
                                Your agent’s contribution
                              </h2>
                              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                                Your agent reads this venture’s existing briefs
                                and tasks, then proposes complementary work
                                based on your mission and skills.
                              </p>
                              <p className="text-xs text-gold mt-2">
                                {data.researchReady
                                  ? "Live web research connected; findings still need member verification."
                                  : "Planning mode: live web research is not connected. No locations, quotes or suppliers are claimed as verified."}
                              </p>
                            </div>
                            <Button
                              disabled={busy || !data.aiReady}
                              variant="gold"
                              onClick={() =>
                                void act("queue", { venture_id: ventureId })
                              }
                            >
                              <Bot size={17} />
                              {busy ? "Agent working…" : "Run my agent"}
                            </Button>
                            {!data.aiReady && (
                              <p className="w-full text-sm text-muted-foreground">
                                AI execution needs provider configuration. Your
                                workspace, tasks, membership and voting are
                                available.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                        {data.jobs.slice(0, 4).map((j) => (
                          <div
                            key={j.id}
                            className="flex flex-wrap items-center gap-3 rounded-lg border p-3 text-xs"
                          >
                            <span>Agent run · {j.status}</span>
                            {j.error && <span role="status">{j.error}</span>}
                            {(j.status === "queued" ||
                              j.status === "running") && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy || !data.aiReady}
                                onClick={() =>
                                  void act("resume", { job_id: j.id })
                                }
                              >
                                Resume queued / interrupted work
                              </Button>
                            )}
                          </div>
                        ))}
                        <section>
                          <h2 className="text-3xl mb-4">
                            The agents’ shared workspace
                          </h2>
                          <p className="text-sm text-muted-foreground mb-5">
                            Each brief stays in the venture’s shared history, so
                            the next agent can build on it. Drafts do not
                            authorize action.
                          </p>
                          {data.contributions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No briefs yet. Run your agent to contribute the
                              first plan.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {data.contributions.map((c) => (
                                <Card key={c.id}>
                                  <CardHeader>
                                    <CardTitle className="flex gap-2 items-center">
                                      <Bot size={18} />
                                      {memberName(c.owner_id)}{" "}
                                      <span className="text-xs text-muted-foreground font-sans">
                                        Draft for review
                                      </span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                      {c.summary}
                                    </p>
                                    {c.sources.length > 0 && (
                                      <ul className="mt-4 space-y-2">
                                        {c.sources
                                          .filter((s) =>
                                            s.url.startsWith("https://"),
                                          )
                                          .map((s) => (
                                            <li key={s.url}>
                                              <a
                                                href={s.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gold underline"
                                              >
                                                {s.title}
                                              </a>
                                            </li>
                                          ))}
                                      </ul>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </section>
                        <div className="grid gap-6 lg:grid-cols-2">
                          <section className="space-y-4">
                            <h2 className="text-3xl">Tasks & evidence</h2>
                            <details className="rounded-xl border p-5">
                              <summary className="cursor-pointer text-gold">
                                Add a task
                              </summary>
                              <div className="mt-4">
                                <Form
                                  busy={busy}
                                  label="Add my task"
                                  submit={async (values, form) => {
                                    if (
                                      await act("create_task", {
                                        ...values,
                                        venture_id: ventureId,
                                      })
                                    )
                                      form.reset();
                                  }}
                                >
                                  <Field
                                    name="title"
                                    label="Task"
                                    minLength={3}
                                  />
                                  <Field
                                    name="details"
                                    label="What needs to be done?"
                                    area
                                    required={false}
                                  />
                                </Form>
                              </div>
                            </details>
                            {data.tasks.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Add a task or run your agent to create a plan.
                              </p>
                            )}
                            {data.tasks.map((t) => (
                              <Card key={t.id}>
                                <CardContent className="pt-5">
                                  <span className="text-xs text-gold">
                                    {t.status === "done" ? "COMPLETED" : "OPEN"}{" "}
                                    · {memberName(t.owner_id)}
                                  </span>
                                  <h3 className="text-xl mt-2">{t.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                                    {t.details}
                                  </p>
                                  {t.evidence && (
                                    <p className="text-sm mt-4 whitespace-pre-wrap">
                                      Evidence: {t.evidence}
                                    </p>
                                  )}
                                  {t.owner_id === data.userId &&
                                    t.status === "open" && (
                                      <details className="mt-4">
                                        <summary className="text-sm text-gold cursor-pointer">
                                          Mark complete with evidence
                                        </summary>
                                        <div className="mt-3">
                                          <Form
                                            busy={busy}
                                            label="Save completion"
                                            submit={async (values) => {
                                              await act("complete_task", {
                                                ...values,
                                                venture_id: ventureId,
                                                task_id: t.id,
                                              });
                                            }}
                                          >
                                            <Field
                                              label="Result, source links, or supporting notes"
                                              name="evidence"
                                              area
                                              minLength={10}
                                            />
                                          </Form>
                                        </div>
                                      </details>
                                    )}
                                </CardContent>
                              </Card>
                            ))}
                          </section>
                          <section className="space-y-4">
                            <h2 className="text-3xl">Proposals & decisions</h2>
                            <p className="text-xs text-muted-foreground">
                              One member account, one vote. More than half of all
                              eligible members must vote yes. Eligibility is
                              fixed when the proposal opens. Voting closes at
                              the deadline or when everyone has voted. Ties and
                              insufficient yes votes reject a proposal.
                            </p>
                            <details className="rounded-xl border p-5">
                              <summary className="cursor-pointer text-gold">
                                Present a proposal
                              </summary>
                              <div className="mt-4">
                                <Form
                                  busy={busy}
                                  label="Open member vote"
                                  submit={async (values, form) => {
                                    if (
                                      await act("propose", {
                                        ...values,
                                        venture_id: ventureId,
                                      })
                                    )
                                      form.reset();
                                  }}
                                >
                                  <Field
                                    name="title"
                                    label="Decision to make"
                                    minLength={3}
                                  />
                                  <Field
                                    name="details"
                                    label="Plan, evidence, alternatives and risks"
                                    area
                                    minLength={20}
                                  />
                                  <Field
                                    name="amount"
                                    label="Estimated cost (USD)"
                                    type="number"
                                    value={0}
                                  />
                                  <label className="block text-sm space-y-2">
                                    <span>Voting window</span>
                                    <select
                                      name="days"
                                      className="w-full rounded-md border bg-background p-3"
                                      defaultValue="7"
                                    >
                                      <option value="1">1 day</option>
                                      <option value="7">7 days</option>
                                      <option value="14">14 days</option>
                                      <option value="30">30 days</option>
                                    </select>
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    Approval records support for the plan. It
                                    does not charge anyone or authorize a
                                    property purchase.
                                  </p>
                                </Form>
                              </div>
                            </details>
                            {data.proposals.map((p) => {
                              const votes = data.votes.filter(
                                (v) => v.proposal_id === p.id,
                              );
                              const yes = votes.filter((v) => v.choice).length;
                              const eligible = p.electorate.includes(
                                data.userId,
                              );
                              const expired =
                                new Date(p.closes_at).getTime() <= Date.now();
                              const myVote = votes.find(
                                (v) => v.user_id === data.userId,
                              );
                              return (
                                <Card key={p.id}>
                                  <CardContent className="pt-5">
                                    <span className="text-xs text-gold">
                                      {p.status.toUpperCase()}
                                    </span>
                                    <h3 className="text-xl mt-2">{p.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                                      {p.details}
                                    </p>
                                    <p className="text-sm mt-4">
                                      Estimated cost {money(p.amount)}
                                    </p>
                                    <p className="text-xs mt-2">
                                      {yes} yes · {votes.length - yes} no ·{" "}
                                      {p.electorate.length} eligible · Needs{" "}
                                      {Math.floor(p.electorate.length / 2) + 1}{" "}
                                      yes
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Closes{" "}
                                      {new Date(p.closes_at).toLocaleString()}
                                    </p>
                                    {myVote && (
                                      <p className="text-xs text-gold mt-2">
                                        Your vote:{" "}
                                        {myVote.choice ? "Yes" : "No"}
                                      </p>
                                    )}
                                    {p.status === "open" &&
                                      !expired &&
                                      eligible && (
                                        <div className="flex gap-3 mt-4">
                                          <Button
                                            variant="gold"
                                            disabled={busy}
                                            onClick={() =>
                                              void act("vote", {
                                                venture_id: ventureId,
                                                proposal_id: p.id,
                                                choice: true,
                                              })
                                            }
                                          >
                                            Vote yes
                                          </Button>
                                          <Button
                                            variant="outline"
                                            disabled={busy}
                                            onClick={() =>
                                              void act("vote", {
                                                venture_id: ventureId,
                                                proposal_id: p.id,
                                                choice: false,
                                              })
                                            }
                                          >
                                            Vote no
                                          </Button>
                                        </div>
                                      )}
                                    {p.status === "open" && expired && (
                                      <Button
                                        className="mt-4"
                                        variant="outline"
                                        disabled={busy}
                                        onClick={() =>
                                          void act("finalize", {
                                            venture_id: ventureId,
                                            proposal_id: p.id,
                                          })
                                        }
                                      >
                                        Finalize result
                                      </Button>
                                    )}
                                    {p.status === "open" && !eligible && (
                                      <p className="text-xs text-muted-foreground mt-3">
                                        You joined after this vote opened. You
                                        can vote on future proposals.
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </section>
                        </div>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-2xl">
                              Funding intentions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-5">
                              Members have indicated{" "}
                              {money(
                                data.members.reduce(
                                  (n, m) => n + Number(m.commitment),
                                  0,
                                ),
                              )}{" "}
                              across {data.members.length} memberships. These
                              are non-binding intentions, not funds held by
                              Halaxis. No bank account, card or wallet is
                              charged.
                            </p>
                            <Form
                              busy={busy}
                              label="Update my intention"
                              submit={async (values) => {
                                await act("commitment", {
                                  ...values,
                                  venture_id: ventureId,
                                });
                              }}
                            >
                              <Field
                                name="amount"
                                label="What might you contribute? (USD; use 0 to withdraw)"
                                type="number"
                                value={
                                  data.members.find(
                                    (m) => m.user_id === data.userId,
                                  )?.commitment ?? 0
                                }
                              />
                            </Form>
                          </CardContent>
                        </Card>
                        <section>
                          <h2 className="text-2xl mb-4">Venture activity</h2>
                          <ol className="space-y-3 text-sm text-muted-foreground">
                            {data.activity.map((a) => (
                              <li
                                key={a.id}
                                className="border-l border-gold/40 pl-4"
                              >
                                {a.message}
                                <span className="block text-xs mt-1">
                                  {new Date(a.created_at).toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </section>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
