-- AI features: Explain my answer and roleplay with the team.
--
-- Every model call is counted per learner per day, so one account can't run up the bill. A
-- finished roleplay is recorded as a practice session (kind 'roleplay'), which reuses
-- finish_practice() for its XP and the shared limit of five XP-earning sessions a day.
--
-- Depends on: adaptive.sql.

create table public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('explain', 'roleplay')),
  created_at timestamptz not null default now()
);

create index ai_usage_user_day on public.ai_usage (user_id, kind, created_at);

alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;
grant select on public.ai_usage to authenticated;
create policy "Learners read their own AI usage"
  on public.ai_usage for select to authenticated
  using ((select auth.uid()) = user_id);

-- Counts one model call if the learner is under today's limit (UTC days). Returns whether it may
-- go ahead. Limits: 40 explanations and 80 roleplay turns a day.
create function public.ai_allow(p_kind text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_limit integer := case p_kind when 'explain' then 40 when 'roleplay' then 80 end;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if v_limit is null then
    raise exception 'Unknown AI feature' using errcode = '22023';
  end if;
  -- One learner's calls are counted one at a time.
  perform pg_advisory_xact_lock(hashtext(v_user::text || p_kind));
  if (select count(*) from public.ai_usage
       where user_id = v_user and kind = p_kind
         and created_at >= date_trunc('day', now())) >= v_limit then
    return false;
  end if;
  insert into public.ai_usage (user_id, kind) values (v_user, p_kind);
  return true;
end;
$$;

revoke all on function public.ai_allow(text) from public, anon;
grant execute on function public.ai_allow(text) to authenticated;

-- Roleplay sessions are practice sessions with one key: 'roleplay:<scenario>'.
alter table public.practice_sessions drop constraint practice_sessions_kind_check;
alter table public.practice_sessions add constraint practice_sessions_kind_check
  check (kind in ('smart', 'mistakes', 'express', 'roleplay'));
