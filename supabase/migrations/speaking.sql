-- Speaking exercises: learners say a line aloud and ElevenLabs Scribe transcribes it.
--
-- Adds 'speak' to the exercise pool's types, and limits on transcription so a bug or abuse can't
-- run up the bill: each learner can check 200 answers a day, and the whole app p_daily_total a day
-- (UTC). Answers are at most 15 seconds, so 200 is about 50 minutes of audio.
--
-- Depends on: exercises_pool.sql.

alter table public.exercises_pool drop constraint exercises_pool_exercise_type_check;
alter table public.exercises_pool add constraint exercises_pool_exercise_type_check
  check (exercise_type in ('discover', 'tip', 'choice', 'match', 'build', 'translate', 'conversation', 'speak'));

-- One row per spoken answer sent for transcription.
create table public.speech_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index speech_usage_day on public.speech_usage (created_at);
create index speech_usage_user_day on public.speech_usage (user_id, created_at);

alter table public.speech_usage enable row level security;
revoke all on public.speech_usage from anon, authenticated;

-- Whether a learner may have one more answer transcribed now, and counts it if so.
create function public.speech_allow(p_daily_total integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if p_daily_total < 1 then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtext('speech_allow'));
  if (select count(*) from public.speech_usage
       where user_id = v_user and created_at >= date_trunc('day', now())) >= 200 then
    return false;
  end if;
  if (select count(*) from public.speech_usage
       where created_at >= date_trunc('day', now())) >= p_daily_total then
    return false;
  end if;
  insert into public.speech_usage (user_id) values (v_user);
  return true;
end;
$$;

revoke all on function public.speech_allow(integer) from public, anon;
grant execute on function public.speech_allow(integer) to authenticated;
