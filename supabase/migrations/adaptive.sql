-- The adaptive engine: FSRS memory for review words, a skill rating per concept, exercise
-- difficulty learned from everyone's answers, and practice sessions (smart practice, mistakes,
-- and the Express run of a finished unit).
--
-- Ratings are Elo-style. Each first attempt of an exercise in a day moves the learner's rating for
-- its concept and, a little, the exercise's base_difficulty in the shared pool. The app picks
-- practice exercises the learner should get right about 80% of the time.
--
-- Depends on: exercises_pool.sql, review_items.sql, lesson_progress.sql (mistakes), habit_loop.sql,
-- economy.sql.

-- FSRS card state for each review word. reps is review_count; last review is last_reviewed_at.
-- A null stability means a new card that FSRS hasn't seen yet.
alter table public.review_items
  add column stability double precision check (stability is null or stability > 0),
  add column difficulty double precision check (difficulty is null or difficulty between 1 and 10),
  add column fsrs_state smallint not null default 0 check (fsrs_state between 0 and 3),
  add column lapses integer not null default 0 check (lapses >= 0),
  add column scheduled_days integer not null default 0 check (scheduled_days >= 0),
  add column learning_steps integer not null default 0 check (learning_steps >= 0);

-- Practice earns XP as its own source.
alter table public.xp_events drop constraint xp_events_source_check;
alter table public.xp_events add constraint xp_events_source_check
  check (source in ('lesson', 'lesson_replay', 'review', 'standup', 'boost', 'practice'));
create unique index xp_events_practice_once
  on public.xp_events (user_id, ref)
  where source = 'practice';

-- The learner's ability per concept (concept_tag in the pool), 1000 to start.
create table public.learner_skills (
  user_id uuid not null references auth.users (id) on delete cascade,
  concept_tag text not null check (concept_tag ~ '^[a-z]+:[a-z0-9-]{1,64}$'),
  rating double precision not null default 1000 check (rating between 0 and 3000),
  attempts integer not null default 0 check (attempts >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, concept_tag)
);

-- First attempts per exercise per day: the evidence ratings are built from, and the guard that
-- keeps one learner from moving an exercise's difficulty by repeating it.
create table public.exercise_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  source_key text not null check (char_length(source_key) between 3 and 80),
  attempted_on date not null default current_date,
  score real not null check (score between 0 and 1),
  attempted_at timestamptz not null default now(),
  primary key (user_id, source_key, attempted_on)
);

create index exercise_attempts_recent on public.exercise_attempts (user_id, attempted_at);

-- A practice session the app built: which exercises, in order. The learner's own rows only.
create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('smart', 'mistakes', 'express')),
  unit_id text check (unit_id is null or unit_id ~ '^[a-z0-9-]{2,32}$'),
  exercise_keys text[] not null check (cardinality(exercise_keys) between 1 and 20),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  passed boolean,
  constraint express_has_unit check (kind <> 'express' or unit_id is not null)
);

create index practice_sessions_user on public.practice_sessions (user_id, created_at);

-- Units whose Express run the learner has passed: their stretch of the line turns gold.
create table public.unit_express (
  user_id uuid not null references auth.users (id) on delete cascade,
  unit_id text not null check (unit_id ~ '^[a-z0-9-]{2,32}$'),
  passed_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

alter table public.learner_skills enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.unit_express enable row level security;

revoke all on public.learner_skills, public.exercise_attempts, public.practice_sessions,
  public.unit_express from anon, authenticated;
grant select on public.learner_skills, public.exercise_attempts, public.unit_express
  to authenticated;
grant select, insert on public.practice_sessions to authenticated;

create policy "Learners read their own skills"
  on public.learner_skills for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own attempts"
  on public.exercise_attempts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own practice"
  on public.practice_sessions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners start their own practice"
  on public.practice_sessions for insert to authenticated
  with check ((select auth.uid()) = user_id and completed_at is null and passed is null);
create policy "Learners read their own express runs"
  on public.unit_express for select to authenticated
  using ((select auth.uid()) = user_id);

-- Records answers: [{ key: '<lesson>:<position>', score: 0 | 0.5 | 1 }]. Only the first attempt of
-- an exercise each day counts. Updates the concept rating (faster while there's little evidence)
-- and nudges the exercise's difficulty, which is shared by everyone.
create function public.record_attempts(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
  v_key text;
  v_score real;
  v_tag text;
  v_difficulty double precision;
  v_rating double precision;
  v_attempts integer;
  v_expected double precision;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 60 then
    raise exception 'Invalid attempts' using errcode = '22023';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_key := v_item ->> 'key';
    v_score := least(1, greatest(0, coalesce((v_item ->> 'score')::real, 0)));
    select concept_tag, base_difficulty into v_tag, v_difficulty
      from public.exercises_pool where source_key = v_key and is_active;
    continue when not found;

    insert into public.exercise_attempts (user_id, source_key, score)
    values (v_user, v_key, v_score)
    on conflict do nothing;
    continue when not found;

    select rating, attempts into v_rating, v_attempts
      from public.learner_skills where user_id = v_user and concept_tag = v_tag;
    v_rating := coalesce(v_rating, 1000);
    v_attempts := coalesce(v_attempts, 0);
    v_expected := 1 / (1 + power(10, (v_difficulty - v_rating) / 400));

    insert into public.learner_skills (user_id, concept_tag, rating, attempts)
    values (
      v_user, v_tag,
      least(3000, greatest(0, v_rating
        + (case when v_attempts < 10 then 48 else 24 end) * (v_score - v_expected))),
      v_attempts + 1
    )
    on conflict (user_id, concept_tag) do update
      set rating = excluded.rating, attempts = excluded.attempts, updated_at = now();

    update public.exercises_pool
       set base_difficulty = least(1800, greatest(400,
             base_difficulty - 4 * (v_score - v_expected)))
     where source_key = v_key;
  end loop;
end;
$$;

-- Finishes a practice session with its outcomes ('first_try' | 'second_try' | 'shown', in order).
-- Records the attempts, marks mistakes answered right first time as learned, settles an Express
-- run (8 of 10 right first time passes) and awards XP. Returns { passed, rewards }.
create function public.finish_practice(p_id uuid, p_outcomes text[])
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_session public.practice_sessions;
  v_items jsonb;
  v_right integer;
  v_passed boolean;
  v_rewards jsonb;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  select * into v_session from public.practice_sessions
   where id = p_id and user_id = v_user for update;
  if not found or v_session.completed_at is not null then
    raise exception 'Unknown practice session' using errcode = '22023';
  end if;
  if cardinality(p_outcomes) <> cardinality(v_session.exercise_keys)
     or exists (select 1 from unnest(p_outcomes) o
                 where o not in ('first_try', 'second_try', 'shown')) then
    raise exception 'Invalid outcomes' using errcode = '22023';
  end if;

  select jsonb_agg(jsonb_build_object(
           'key', k.key,
           'score', case o.outcome when 'first_try' then 1 when 'second_try' then 0.5 else 0 end
         )),
         count(*) filter (where o.outcome = 'first_try')
    into v_items, v_right
    from unnest(v_session.exercise_keys) with ordinality as k(key, n)
    join unnest(p_outcomes) with ordinality as o(outcome, n) using (n);
  perform public.record_attempts(v_items);

  -- A mistake answered right first time in practice counts as learned.
  update public.mistakes m
     set learned_at = now()
    from unnest(v_session.exercise_keys) with ordinality as k(key, n)
    join unnest(p_outcomes) with ordinality as o(outcome, n) using (n)
   where m.user_id = v_user and m.learned_at is null and o.outcome = 'first_try'
     and (m.item_key = k.key or m.item_key like k.key || ':%');

  v_passed := case when v_session.kind = 'express'
                   then v_right >= ceil(0.8 * cardinality(v_session.exercise_keys))
              end;
  update public.practice_sessions
     set completed_at = now(), passed = v_passed
   where id = p_id;
  if v_passed then
    insert into public.unit_express (user_id, unit_id)
    values (v_user, v_session.unit_id)
    on conflict do nothing;
  end if;

  begin
    v_rewards := public.earn('practice', p_id::text);
  exception when others then
    v_rewards := null;
  end;
  return jsonb_build_object('passed', v_passed, 'rewards', v_rewards);
end;
$$;

revoke all on function public.record_attempts(jsonb) from public, anon;
revoke all on function public.finish_practice(uuid, text[]) from public, anon;
grant execute on function public.record_attempts(jsonb) to authenticated;
grant execute on function public.finish_practice(uuid, text[]) to authenticated;

-- award_xp() from habit_loop.sql, with practice sessions added as a source.
create or replace function public.award_xp(p_source text, p_ref text, p_amount integer default null)
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
  v_kind text;
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
  elsif p_source = 'practice' then
    -- A finished practice session (adaptive.sql). At most five earn XP a day.
    select kind into v_kind from public.practice_sessions
     where id::text = p_ref and user_id = v_user and completed_at is not null;
    if not found then
      raise exception 'Practice not completed' using errcode = '22023';
    end if;
    v_amount := case when v_kind = 'express' then 30 else 15 end;
    if (select count(*) from public.xp_events
         where user_id = v_user and source = 'practice' and local_date = v_today) >= 5 then
      v_amount := 0;
    end if;
  else
    raise exception 'Unknown source' using errcode = '22023';
  end if;

  if v_amount > 0 then
    insert into public.xp_events (user_id, source, ref, local_date, amount)
    values (v_user, v_source, p_ref, v_today, v_amount)
    on conflict do nothing;
    get diagnostics v_inserted = row_count;
  else
    v_inserted := 0;
  end if;
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
