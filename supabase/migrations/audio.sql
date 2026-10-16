-- Recorded speech: a public storage bucket for ElevenLabs recordings, and limits on recording new
-- lines on demand. Files are written only by the server (secret key) and the generation script;
-- anyone can play them.
--
-- Depends on: nothing in this repo, but the app's /api/tts route uses it with reminders.sql's
-- SUPABASE_SECRET_KEY setup.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tts', 'tts', true, 1048576, array['audio/mpeg'])
on conflict (id) do nothing;

-- One row per line recorded on demand, for the limits.
create table public.tts_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  chars integer not null check (chars between 1 and 1000),
  created_at timestamptz not null default now()
);

create index tts_usage_day on public.tts_usage (created_at);
create index tts_usage_user_day on public.tts_usage (user_id, created_at);

alter table public.tts_usage enable row level security;
revoke all on public.tts_usage from anon, authenticated;

-- Whether a learner may record one more line now: at most 200 new lines each a day, and the whole
-- app within p_daily_chars characters a day (UTC), so a bug or abuse can't run up the bill.
create function public.tts_allow(p_chars integer, p_daily_chars integer)
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
  if p_chars not between 1 and 1000 or p_daily_chars < 1 then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtext('tts_allow'));
  if (select count(*) from public.tts_usage
       where user_id = v_user and created_at >= date_trunc('day', now())) >= 200 then
    return false;
  end if;
  if (select coalesce(sum(chars), 0) from public.tts_usage
       where created_at >= date_trunc('day', now())) + p_chars > p_daily_chars then
    return false;
  end if;
  insert into public.tts_usage (user_id, chars) values (v_user, p_chars);
  return true;
end;
$$;

revoke all on function public.tts_allow(integer, integer) from public, anon;
grant execute on function public.tts_allow(integer, integer) to authenticated;
