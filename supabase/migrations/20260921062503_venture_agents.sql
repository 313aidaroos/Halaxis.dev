create table public.venture_agents (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check(length(name) between 2 and 80),
 mission text not null check(length(mission) between 10 and 2000),
 skills text not null default '' check(length(skills)<=1000),
 location text not null default '' check(length(location)<=150),
 discoverable boolean not null default false,
 autopilot boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.ventures (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 title text not null check(length(title) between 3 and 120),
 description text not null check(length(description) between 20 and 5000),
 location text not null default '' check(length(location)<=150),
 target_amount numeric(16,2) not null default 0 check(target_amount>=0 and target_amount<=1000000000),
 currency text not null default 'USD' check(currency='USD'),
 created_at timestamptz not null default now()
);
create table public.venture_members (
 venture_id uuid not null references public.ventures(id) on delete cascade,
 user_id uuid not null references public.venture_agents(user_id) on delete cascade,
 commitment numeric(16,2) not null default 0 check(commitment>=0 and commitment<=1000000000),
 joined_at timestamptz not null default now(),
 primary key(venture_id,user_id)
);
create index venture_members_user on public.venture_members(user_id);
create table public.venture_tasks (
 id uuid primary key default gen_random_uuid(), venture_id uuid not null references public.ventures(id) on delete cascade,
 owner_id uuid not null references public.venture_agents(user_id),
 title text not null check(length(title) between 3 and 200),
 details text not null default '' check(length(details)<=4000),
 status text not null default 'open' check(status in ('open','done')),
 evidence text not null default '' check(length(evidence)<=4000),
 created_at timestamptz not null default now()
);
create index venture_tasks_venture on public.venture_tasks(venture_id);
create table public.venture_proposals (
 id uuid primary key default gen_random_uuid(), venture_id uuid not null references public.ventures(id) on delete cascade,
 author_id uuid not null references public.venture_agents(user_id),
 title text not null check(length(title) between 3 and 200),
 details text not null check(length(details) between 20 and 6000),
 amount numeric(16,2) not null default 0 check(amount>=0 and amount<=1000000000),
 electorate uuid[] not null,
 closes_at timestamptz not null,
 status text not null default 'open' check(status in ('open','approved','rejected')),
 created_at timestamptz not null default now()
);
create index venture_proposals_venture on public.venture_proposals(venture_id);
create table public.venture_votes (
 proposal_id uuid not null references public.venture_proposals(id) on delete cascade,
 user_id uuid not null references auth.users(id), choice boolean not null,
 created_at timestamptz not null default now(), primary key(proposal_id,user_id)
);
create table public.agent_jobs (
 id uuid primary key default gen_random_uuid(), venture_id uuid not null references public.ventures(id) on delete cascade,
 owner_id uuid not null references public.venture_agents(user_id),
 status text not null default 'queued' check(status in ('queued','running','completed','failed')),
 attempts integer not null default 0, lease_token uuid, started_at timestamptz,
 created_at timestamptz not null default now(), finished_at timestamptz, error text
);
create unique index agent_jobs_active on public.agent_jobs(venture_id,owner_id) where status in ('queued','running');
create index agent_jobs_owner on public.agent_jobs(owner_id,created_at desc);
create table public.agent_contributions (
 id uuid primary key default gen_random_uuid(), job_id uuid not null unique references public.agent_jobs(id),
 venture_id uuid not null references public.ventures(id) on delete cascade,
 owner_id uuid not null references public.venture_agents(user_id),
 summary text not null, tasks jsonb not null, sources jsonb not null default '[]',
 created_at timestamptz not null default now()
);
create index agent_contributions_venture on public.agent_contributions(venture_id,created_at desc);
create table public.venture_activity (
 id bigint generated always as identity primary key,
 venture_id uuid not null references public.ventures(id) on delete cascade,
 actor_id uuid references auth.users(id), message text not null, created_at timestamptz not null default now()
);
create index venture_activity_venture on public.venture_activity(venture_id,created_at desc);

create function public.is_venture_member(v uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.venture_members where venture_id=v and user_id=(select auth.uid()));
$$;
revoke all on function public.is_venture_member(uuid) from public,anon;
grant execute on function public.is_venture_member(uuid) to authenticated;

alter table public.venture_agents enable row level security;
alter table public.ventures enable row level security;
alter table public.venture_members enable row level security;
alter table public.venture_tasks enable row level security;
alter table public.venture_proposals enable row level security;
alter table public.venture_votes enable row level security;
alter table public.agent_jobs enable row level security;
alter table public.agent_contributions enable row level security;
alter table public.venture_activity enable row level security;
create policy agent_read on public.venture_agents for select to authenticated using(user_id=(select auth.uid()) or discoverable);
create policy venture_read on public.ventures for select to authenticated using(true);
create policy member_read on public.venture_members for select to authenticated using(public.is_venture_member(venture_id));
create policy task_read on public.venture_tasks for select to authenticated using(public.is_venture_member(venture_id));
create policy proposal_read on public.venture_proposals for select to authenticated using(public.is_venture_member(venture_id));
create policy vote_read on public.venture_votes for select to authenticated using(exists(select 1 from public.venture_proposals p where p.id=proposal_id and public.is_venture_member(p.venture_id)));
create policy job_read on public.agent_jobs for select to authenticated using(owner_id=(select auth.uid()));
create policy contribution_read on public.agent_contributions for select to authenticated using(public.is_venture_member(venture_id));
create policy activity_read on public.venture_activity for select to authenticated using(public.is_venture_member(venture_id));
revoke all on public.venture_agents,public.ventures,public.venture_members,public.venture_tasks,public.venture_proposals,public.venture_votes,public.agent_jobs,public.agent_contributions,public.venture_activity from anon,authenticated;
grant select on public.venture_agents,public.ventures,public.venture_members,public.venture_tasks,public.venture_proposals,public.venture_votes,public.agent_jobs,public.agent_contributions,public.venture_activity to authenticated;
grant all on public.venture_agents,public.ventures,public.venture_members,public.venture_tasks,public.venture_proposals,public.venture_votes,public.agent_jobs,public.agent_contributions,public.venture_activity to service_role;
grant usage,select on sequence public.venture_activity_id_seq to service_role;

-- All user writes are authenticated, authorized and atomic through this RPC.
create function public.venture_action(action text, payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); v uuid; p public.venture_proposals; n integer; yes_count integer; total integer; job uuid; msg text;
begin
 if u is null then raise exception 'Sign in required'; end if;
 -- Serialize writes per user to enforce quotas and prevent duplicate signup/join jobs.
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 if action='save_agent' then
  insert into public.venture_agents(user_id,name,mission,skills,location,discoverable,autopilot)
  values(u,trim(payload->>'name'),trim(payload->>'mission'),trim(coalesce(payload->>'skills','')),trim(coalesce(payload->>'location','')),coalesce((payload->>'discoverable')::boolean,false),coalesce((payload->>'autopilot')::boolean,false))
  on conflict(user_id) do update set name=excluded.name,mission=excluded.mission,skills=excluded.skills,location=excluded.location,discoverable=excluded.discoverable,autopilot=excluded.autopilot;
  return jsonb_build_object('ok',true);
 end if;
 if not exists(select 1 from public.venture_agents where user_id=u) then raise exception 'Create your agent first'; end if;
 if action='create_venture' then
  if (select count(*) from public.ventures where owner_id=u)>=20 then raise exception 'Maximum 20 ventures per member'; end if;
  insert into public.ventures(owner_id,title,description,location,target_amount) values(u,trim(payload->>'title'),trim(payload->>'description'),trim(coalesce(payload->>'location','')),coalesce((payload->>'target_amount')::numeric,0)) returning id into v;
  insert into public.venture_members(venture_id,user_id) values(v,u);
  insert into public.venture_activity(venture_id,actor_id,message) values(v,u,'Venture created. Decisions require a strict majority of eligible members.');
  return jsonb_build_object('id',v);
 end if;
 v:=(payload->>'venture_id')::uuid;
 if not exists(select 1 from public.ventures where id=v) then raise exception 'Venture not found'; end if;
 if action='join' then
  insert into public.venture_members(venture_id,user_id) values(v,u) on conflict do nothing;
  get diagnostics n=row_count;
  if n>0 then insert into public.venture_activity(venture_id,actor_id,message) values(v,u,'A member and their agent joined the venture.'); end if;
  return jsonb_build_object('id',v);
 end if;
 if not public.is_venture_member(v) then raise exception 'Join this venture first'; end if;
 if action='commitment' then
  update public.venture_members set commitment=(payload->>'amount')::numeric where venture_id=v and user_id=u;
  msg:='A member updated their non-binding funding intention. No money moved.';
 elsif action='create_task' then
  insert into public.venture_tasks(venture_id,owner_id,title,details) values(v,u,trim(payload->>'title'),trim(coalesce(payload->>'details','')));
  msg:='A member added a task.';
 elsif action='complete_task' then
  update public.venture_tasks set status='done', evidence=trim(payload->>'evidence') where id=(payload->>'task_id')::uuid and venture_id=v and owner_id=u and length(trim(payload->>'evidence')) between 10 and 4000;
  get diagnostics n=row_count; if n<>1 then raise exception 'Only the task owner can complete it, with evidence'; end if;
  msg:='A task was marked complete with supporting notes.';
 elsif action='propose' then
  -- Joining and proposal snapshot are linearized by the snapshot of this statement.
  if coalesce((payload->>'days')::integer,7) not between 1 and 30 then raise exception 'Voting window must be 1–30 days'; end if;
  insert into public.venture_proposals(venture_id,author_id,title,details,amount,electorate,closes_at)
  values(v,u,trim(payload->>'title'),trim(payload->>'details'),coalesce((payload->>'amount')::numeric,0),array(select user_id from public.venture_members where venture_id=v),now()+make_interval(days=>coalesce((payload->>'days')::integer,7)));
  msg:='A proposal opened for member voting. Approval does not authorize money movement.';
 elsif action in ('vote','finalize') then
  select * into p from public.venture_proposals where id=(payload->>'proposal_id')::uuid and venture_id=v for update;
  if not found then raise exception 'Proposal not found'; end if;
  if p.status<>'open' then raise exception 'Voting is closed'; end if;
  if action='vote' then
   if now()>=p.closes_at then raise exception 'Voting deadline has passed; finalize the result'; end if;
   if not u=any(p.electorate) then raise exception 'Only members present when voting opened can vote'; end if;
   insert into public.venture_votes(proposal_id,user_id,choice) values(p.id,u,(payload->>'choice')::boolean) on conflict(proposal_id,user_id) do update set choice=excluded.choice;
  end if;
  select count(*),count(*) filter(where choice) into total,yes_count from public.venture_votes where proposal_id=p.id;
  if now()>=p.closes_at or total=cardinality(p.electorate) then
   update public.venture_proposals set status=case when yes_count>cardinality(p.electorate)/2 then 'approved' else 'rejected' end where id=p.id;
  elsif action='finalize' then raise exception 'Voting stays open until the deadline or every eligible member has voted'; end if;
  msg:='A proposal vote or result was recorded.';
 elsif action='queue' then
  if (select count(*) from public.agent_jobs where owner_id=u and created_at>now()-interval '1 day')>=10 then raise exception 'Daily limit: 10 agent runs per person'; end if;
  insert into public.agent_jobs(venture_id,owner_id) values(v,u) on conflict(venture_id,owner_id) where status in ('queued','running') do nothing returning id into job;
  if job is null then select id into job from public.agent_jobs where venture_id=v and owner_id=u and status in ('queued','running'); end if;
  return jsonb_build_object('job_id',job);
 else raise exception 'Unknown action'; end if;
 insert into public.venture_activity(venture_id,actor_id,message) values(v,u,msg);
 return jsonb_build_object('ok',true);
end;
$$;
revoke all on function public.venture_action(text,jsonb) from public,anon;
grant execute on function public.venture_action(text,jsonb) to authenticated;

-- Worker functions are inaccessible to ordinary clients. Leases prevent duplicate output.
create function public.claim_agent_job(job uuid default null, for_owner uuid default null) returns setof public.agent_jobs language plpgsql security definer set search_path='' as $$
declare chosen uuid;
begin
 select id into chosen from public.agent_jobs where (job is null or id=job) and (for_owner is null or owner_id=for_owner)
 and (status='queued' or (status='running' and started_at<now()-interval '5 minutes')) and attempts<3 order by created_at for update skip locked limit 1;
 if chosen is not null then return query update public.agent_jobs set status='running',attempts=attempts+1,started_at=now(),lease_token=gen_random_uuid(),error=null where id=chosen returning *; end if;
end;
$$;
create function public.finish_agent_job(job uuid, token uuid, output jsonb, failure text default null) returns boolean language plpgsql security definer set search_path='' as $$
declare j public.agent_jobs; t jsonb;
begin
 select * into j from public.agent_jobs where id=job and status='running' and lease_token=token for update;
 if not found then return false; end if;
 if failure is not null then update public.agent_jobs set status='failed',error=left(failure,500),finished_at=now() where id=job;return true;end if;
 insert into public.agent_contributions(job_id,venture_id,owner_id,summary,tasks,sources) values(job,j.venture_id,j.owner_id,output->>'summary',output->'tasks',coalesce(output->'sources','[]'::jsonb));
 for t in select * from jsonb_array_elements(output->'tasks') loop
  insert into public.venture_tasks(venture_id,owner_id,title,details) values(j.venture_id,j.owner_id,t->>'title',t->>'details');
 end loop;
 update public.agent_jobs set status='completed',finished_at=now() where id=job;
 insert into public.venture_activity(venture_id,actor_id,message) values(j.venture_id,j.owner_id,'An agent contributed a research brief and next-step tasks for member review.');
 return true;
end;
$$;
create or replace function public.schedule_agent_work() returns void language plpgsql security definer set search_path='' as $$
declare proposal uuid;
begin
 with candidates as (
  select m.venture_id,m.user_id,m.joined_at,
  row_number() over(partition by m.user_id order by m.joined_at) as rank,
  (select count(*) from public.agent_jobs j where j.owner_id=m.user_id and j.created_at>now()-interval '1 day') as recent_runs
  from public.venture_members m join public.venture_agents a on a.user_id=m.user_id
  where a.autopilot and not exists(select 1 from public.agent_jobs j where j.owner_id=m.user_id and j.venture_id=m.venture_id and (j.created_at>now()-interval '1 day' or j.status in ('queued','running')))
 )
 insert into public.agent_jobs(venture_id,owner_id)
 select venture_id,user_id from candidates where rank+recent_runs<=10 order by joined_at limit 20
 on conflict(venture_id,owner_id) where status in ('queued','running') do nothing;
 update public.agent_jobs set status='failed',error='Worker interrupted repeatedly. Start a new run.',finished_at=now() where status='running' and started_at<now()-interval '5 minutes' and attempts>=3;
 for proposal in select id from public.venture_proposals where status='open' and closes_at<=now() for update skip locked loop
  update public.venture_proposals p set status=case when (select count(*) from public.venture_votes v where v.proposal_id=p.id and choice)>cardinality(p.electorate)/2 then 'approved' else 'rejected' end where id=proposal;
  insert into public.venture_activity(venture_id,message) select venture_id,'The voting deadline passed and the proposal result was finalized.' from public.venture_proposals where id=proposal;
 end loop;
end;
$$;
revoke all on function public.claim_agent_job(uuid,uuid),public.finish_agent_job(uuid,uuid,jsonb,text),public.schedule_agent_work() from public,anon,authenticated;
grant execute on function public.claim_agent_job(uuid,uuid),public.finish_agent_job(uuid,uuid,jsonb,text),public.schedule_agent_work() to service_role;
