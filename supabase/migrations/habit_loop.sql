-- The habit loop: XP, daily goals and streaks.
--
-- Learners can read their own rows but never write them: every write goes through award_xp(),
-- which checks that the activity is real, decides the XP itself and counts days in the learner's
-- own time zone. The browser holds the learner's token and talks to the API directly, so a table
-- that accepted inserts would accept any amount of XP.
--
-- Depends on: onboarding_and_placement.sql (learner_preferences), lesson_progress.sql,
-- review_items.sql, standup_completions.sql, exercises_pool.sql, learner_timezone.sql.

-- One row per XP award. Unique indexes make each award happen once: a lesson's first completion
-- and a standup once ever; a replay or a reviewed word once per day.
create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null check (source in ('lesson', 'lesson_replay', 'review', 'standup')),
  ref text not null check (char_length(ref) between 1 and 120),
  local_date date not null,
  amount smallint not null check (amount between 1 and 100),
  created_at timestamptz not null default now()
);

create unique index xp_events_once
  on public.xp_events (user_id, source, ref)
  where source in ('lesson', 'standup');
create unique index xp_events_daily
  on public.xp_events (user_id, source, ref, local_date)
  where source in ('lesson_replay', 'review');
create index xp_events_user_date on public.xp_events (user_id, local_date);

comment on table public.xp_events is
  'XP ledger. Written only by award_xp(); learners read their own rows.';

-- XP per learner per local day, and the goal that applied that day.
create table public.daily_activity (
  user_id uuid not null references auth.users (id) on delete cascade,
  local_date date not null,
  xp integer not null default 0 check (xp >= 0),
  goal_xp smallint not null check (goal_xp > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, local_date)
);

comment on table public.daily_activity is
  'XP per local day. A day with at least 10 XP extends the streak. Written only by award_xp().';

-- The streak as of the learner's last active day. Missed days are settled the next time the
-- learner earns XP: a freeze covers each missed day if there are enough, otherwise it starts over.
create table public.streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  freezes smallint not null default 1 check (freezes between 0 and 2),
  -- Days a freeze covered, newest last, for the calendar. Capped at 60 entries.
  frozen_dates date[] not null default '{}',
  updated_at timestamptz not null default now()
);

comment on table public.streaks is
  'Streak state. Written only by award_xp(). Learners start with one freeze, hold at most two, and earn one every seven days.';

alter table public.xp_events enable row level security;
alter table public.daily_activity enable row level security;
alter table public.streaks enable row level security;

revoke all on public.xp_events, public.daily_activity, public.streaks from anon, authenticated;
grant select on public.xp_events, public.daily_activity, public.streaks to authenticated;

create policy "Learners read their own XP"
  on public.xp_events for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own days"
  on public.daily_activity for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own streak"
  on public.streaks for select to authenticated
  using ((select auth.uid()) = user_id);

-- Awards XP for one activity and settles the streak. Returns what changed, for celebrations:
-- { awarded, source, xpToday, goalXp, goalReached,
--   streak: { before, after, extended, milestone, freezesUsed, freezeEarned, freezes } }
--
-- p_amount is only read for a lesson's first completion, where the lesson's XP lives in the app's
-- content; it is clamped, and the lesson must exist. Every other amount is fixed here.
create function public.award_xp(p_source text, p_ref text, p_amount integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_zone text;
  v_minutes smallint;
  v_today date;
  v_goal integer;
  v_source text := p_source;
  v_amount integer;
  v_inserted integer;
  v_xp_today integer;
  v_xp_before integer;
  v_streak public.streaks;
  v_before integer;
  v_after integer;
  v_extended boolean := false;
  v_gap integer;
  v_used integer := 0;
  v_earned boolean := false;
  v_milestone integer;
  -- XP in a day that counts as "practised today".
  c_streak_xp constant integer := 10;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if p_ref is null or char_length(p_ref) not between 1 and 120 then
    raise exception 'Invalid reference' using errcode = '22023';
  end if;

  select timezone, daily_minutes into v_zone, v_minutes
    from public.learner_preferences where user_id = v_user;
  v_today := (now() at time zone coalesce(v_zone, 'UTC'))::date;
  -- The daily goal is chosen in minutes; a lesson earns about 3 XP a minute.
  v_goal := coalesce(v_minutes, 10) * 3;

  if p_source in ('lesson', 'lesson_replay') then
    if not exists (
      select 1 from public.exercises_pool where lesson_id = p_ref and is_active
    ) then
      raise exception 'Unknown lesson' using errcode = '22023';
    end if;
    if p_source = 'lesson' and not exists (
      select 1 from public.xp_events
       where user_id = v_user and source = 'lesson' and ref = p_ref
    ) then
      v_amount := least(greatest(coalesce(p_amount, 0), 1), 60);
    else
      -- Finished before (or reset and finished again): practice XP, once a day.
      v_source := 'lesson_replay';
      v_amount := 10;
    end if;
  elsif p_source = 'review' then
    if not exists (
      select 1 from public.review_items where user_id = v_user and item_key = p_ref
    ) then
      raise exception 'Unknown review item' using errcode = '22023';
    end if;
    v_amount := 2;
  elsif p_source = 'standup' then
    if not exists (
      select 1 from public.standup_completions where user_id = v_user and unit_id = p_ref
    ) then
      raise exception 'Standup not completed' using errcode = '22023';
    end if;
    v_amount := 20;
  else
    raise exception 'Unknown source' using errcode = '22023';
  end if;

  insert into public.xp_events (user_id, source, ref, local_date, amount)
  values (v_user, v_source, p_ref, v_today, v_amount)
  on conflict do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    v_amount := 0;
  end if;

  insert into public.daily_activity (user_id, local_date, xp, goal_xp)
  values (v_user, v_today, v_amount, v_goal)
  on conflict (user_id, local_date) do update
    set xp = public.daily_activity.xp + excluded.xp,
        goal_xp = excluded.goal_xp,
        updated_at = now()
  returning xp into v_xp_today;
  v_xp_before := v_xp_today - v_amount;

  insert into public.streaks (user_id) values (v_user) on conflict do nothing;
  select * into v_streak from public.streaks where user_id = v_user for update;
  v_before := v_streak.current_streak;
  v_after := v_streak.current_streak;

  if v_xp_today >= c_streak_xp
     and (v_streak.last_active_date is null or v_streak.last_active_date < v_today) then
    v_extended := true;
    if v_streak.last_active_date is null or v_streak.last_active_date = v_today - 1 then
      v_after := v_streak.current_streak + 1;
    else
      v_gap := v_today - v_streak.last_active_date - 1;
      if v_gap <= v_streak.freezes then
        v_used := v_gap;
        v_streak.freezes := v_streak.freezes - v_gap;
        v_streak.frozen_dates := (
          v_streak.frozen_dates || array(
            select d::date
              from generate_series(v_streak.last_active_date + 1, v_today - 1, interval '1 day') d
          )
        )[greatest(1, cardinality(v_streak.frozen_dates) + v_gap - 59):];
        v_after := v_streak.current_streak + 1;
      else
        -- Too many missed days: the old streak ended, today starts a new one.
        v_before := 0;
        v_after := 1;
      end if;
    end if;

    if v_after in (3, 7, 14, 30, 50, 100, 150, 200, 365)
       or (v_after > 365 and v_after % 100 = 0) then
      v_milestone := v_after;
    end if;
    if v_after % 7 = 0 and v_streak.freezes < 2 then
      v_streak.freezes := v_streak.freezes + 1;
      v_earned := true;
    end if;

    update public.streaks
       set current_streak = v_after,
           longest_streak = greatest(longest_streak, v_after),
           last_active_date = v_today,
           freezes = v_streak.freezes,
           frozen_dates = v_streak.frozen_dates,
           updated_at = now()
     where user_id = v_user;
  end if;

  return jsonb_build_object(
    'awarded', v_amount,
    'source', v_source,
    'xpToday', v_xp_today,
    'goalXp', v_goal,
    'goalReached', v_xp_before < v_goal and v_xp_today >= v_goal,
    'streak', jsonb_build_object(
      'before', v_before,
      'after', v_after,
      'extended', v_extended,
      'milestone', v_milestone,
      'freezesUsed', v_used,
      'freezeEarned', v_earned,
      'freezes', v_streak.freezes
    )
  );
end;
$$;

revoke all on function public.award_xp(text, text, integer) from public, anon;
grant execute on function public.award_xp(text, text, integer) to authenticated;
