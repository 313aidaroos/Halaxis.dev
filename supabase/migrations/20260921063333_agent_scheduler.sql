create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
do $$begin
 if not exists(select 1 from vault.secrets where name='halaxis_agent_worker_auth') then
  perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'halaxis_agent_worker_auth','Scoped authentication for the Halaxis agent scheduler. Never expose to clients.');
 end if;
end;$$;
create or replace function public.verify_agent_worker_token(supplied text) returns boolean language sql stable security definer set search_path='' as $$
 select length(supplied)=64 and exists(select 1 from vault.decrypted_secrets where name='halaxis_agent_worker_auth' and decrypted_secret=supplied);
$$;
revoke all on function public.verify_agent_worker_token(text) from public,anon,authenticated;
grant execute on function public.verify_agent_worker_token(text) to service_role;
-- Enabled after a successful production worker run on September 21, 2026.
select cron.schedule('halaxis-agent-work','*/5 * * * *',$job$
 select net.http_get(
  url:='https://halaxis.vercel.app/api/agents/tick',
  headers:=jsonb_build_object('Authorization','Bearer '||
   (select decrypted_secret from vault.decrypted_secrets where name='halaxis_agent_worker_auth')),
  timeout_milliseconds:=60000);
$job$);
