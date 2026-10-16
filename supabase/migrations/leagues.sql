-- Weekly leagues (the Liga) and public profiles.
--
-- Every week runs Monday 00:00 to Monday 00:00 UTC. A learner joins a table in their division the
-- first time they open Home or the league with XP earned that week. Tables hold up to 20 learners;
-- while there are fewer than 10, the course's team characters fill the empty places as pacers.
-- The app always labels them as team characters, never as real people.
--
-- There is no scheduled job: a week is settled for each learner the next time they visit, from
-- the final standings, which can't change once the week is over. Weekly XP is read from
-- xp_events, so nothing here writes XP.
--
-- Learners read their own rows. Everything that shows other learners (the table, a profile) goes
-- through a function that returns only a display name, a handle and public stats.
--
-- Depends on: habit_loop.sql, economy.sql.

create index xp_events_user_created on public.xp_events (user_id, created_at);

-- How a learner appears to others. The display name defaults to a first name and an initial.
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9-]{3,40}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40),
  -- Whether others can open the profile page. League tables always show the display name.
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Public name and handle. Created by the league functions; learners may edit display_name and is_public.';

-- The division a learner plays in, 1 (lowest) to 10, and the last result they've seen.
create table public.league_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  division smallint not null default 1 check (division between 1 and 10),
  result_seen_week date,
  updated_at timestamptz not null default now()
);

create table public.league_cohorts (
  id bigint generated always as identity primary key,
  week date not null,
  division smallint not null check (division between 1 and 10),
  created_at timestamptz not null default now()
);

create index league_cohorts_week on public.league_cohorts (week, division);

create table public.league_members (
  week date not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id bigint not null references public.league_cohorts (id) on delete cascade,
  division smallint not null check (division between 1 and 10),
  joined_at timestamptz not null default now(),
  -- Filled in when the week is settled.
  final_rank smallint,
  final_xp integer,
  result text check (result in ('promoted', 'stayed', 'relegated')),
  settled_at timestamptz,
  primary key (week, user_id)
);

create index league_members_cohort on public.league_members (cohort_id);

alter table public.profiles enable row level security;
alter table public.league_state enable row level security;
alter table public.league_cohorts enable row level security;
alter table public.league_members enable row level security;

revoke all on public.profiles, public.league_state, public.league_cohorts, public.league_members
  from anon, authenticated;
grant select on public.profiles, public.league_state, public.league_members to authenticated;
grant update (display_name, is_public) on public.profiles to authenticated;

create policy "Learners read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners edit their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners read their own division"
  on public.league_state for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own league weeks"
  on public.league_members for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------------------------
-- Helpers. Not callable by learners.

-- The Monday (UTC) a moment's league week starts on.
create function public.league_week(p_at timestamptz)
returns date
language sql
immutable
set search_path = ''
as $$
  select date_trunc('week', p_at at time zone 'UTC')::date;
$$;

create function public.league_week_start(p_week date)
returns timestamptz
language sql
immutable
set search_path = ''
as $$
  select p_week::timestamp at time zone 'UTC';
$$;

-- A learner's XP within one league week.
create function public.league_xp(p_user uuid, p_week date)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(amount), 0)::integer from public.xp_events
   where user_id = p_user
     and created_at >= public.league_week_start(p_week)
     and created_at < public.league_week_start(p_week) + interval '7 days';
$$;

-- Creates the learner's profile the first time: "Sam H." from the account name, and a handle
-- that can't be guessed from the email.
create function public.league_profile(p_user uuid)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles;
  v_meta jsonb;
  v_email text;
  v_words text[];
  v_name text;
  v_base text;
begin
  select * into v_profile from public.profiles where user_id = p_user;
  if found then
    return v_profile;
  end if;

  select raw_user_meta_data, email into v_meta, v_email from auth.users where id = p_user;
  v_words := regexp_split_to_array(btrim(coalesce(v_meta ->> 'full_name', '')), '\s+');
  if coalesce(v_words[1], '') = '' then
    v_words := array[initcap(split_part(split_part(coalesce(v_email, ''), '@', 1), '.', 1))];
  end if;
  v_name := left(coalesce(nullif(v_words[1], ''), 'Learner'), 30);
  if cardinality(v_words) > 1 and v_words[cardinality(v_words)] <> '' then
    v_name := v_name || ' ' || upper(left(v_words[cardinality(v_words)], 1)) || '.';
  end if;

  v_base := left(lower(regexp_replace(
    translate(v_words[1], 'äöüßÄÖÜáàéèíóúñç', 'aousaouaaeeiouunc'), '[^a-zA-Z0-9]', '', 'g'
  )), 20);
  if char_length(v_base) < 2 then
    v_base := 'learner';
  end if;

  insert into public.profiles (user_id, handle, display_name)
  values (p_user, v_base || '-' || left(md5(p_user::text), 6), v_name)
  on conflict (handle) do nothing;
  if not found then
    insert into public.profiles (user_id, handle, display_name)
    values (p_user, v_base || '-' || left(md5(p_user::text || 'x'), 10), v_name);
  end if;

  select * into v_profile from public.profiles where user_id = p_user;
  return v_profile;
end;
$$;

-- A team character's XP at a moment in the week: a steady daily pace that grows with the division,
-- with rest days, different for every table and character. Rounded to 5 like real lessons.
create function public.league_pacer_xp(
  p_cohort bigint, p_pacer text, p_division integer, p_week date, p_at timestamptz
)
returns integer
language sql
immutable
set search_path = ''
as $$
  with elapsed as (
    select least(7.0, greatest(0.0,
      extract(epoch from p_at - public.league_week_start(p_week)) / 86400.0
    )) as days
  ),
  daily as (
    select d,
      case when abs(hashtext(p_cohort || p_pacer || d)) % 10 < 2 then 0
           else round((15 + p_division * 8)
                      * (0.5 + (abs(hashtext(p_pacer || d || p_cohort)) % 100) / 100.0) / 5) * 5
      end as xp
      from generate_series(0, 6) d
  )
  select coalesce(sum(
    case when d + 1 <= e.days then xp
         when d < e.days then floor(xp * (e.days - d) / 5) * 5
         else 0 end
  ), 0)::integer
  from daily, elapsed e;
$$;

-- Promotion and relegation places for a table of n in a division.
create function public.league_zones(p_size integer, p_division integer, out promote integer,
                                    out relegate integer)
language sql
immutable
set search_path = ''
as $$
  select
    case when p_division >= 10 then 0
         when p_size >= 10 then 3 when p_size >= 6 then 2 else 1 end,
    case when p_division <= 1 then 0
         when p_size >= 10 then 3 when p_size >= 6 then 2 when p_size >= 4 then 1 else 0 end;
$$;

-- A table's standings at a moment: real learners plus team pacers up to 10 places.
create function public.league_table(p_cohort bigint, p_at timestamptz)
returns table (rank integer, kind text, ref text, name text, xp integer, user_id uuid)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_week date;
  v_division integer;
  v_real integer;
begin
  select week, division into v_week, v_division from public.league_cohorts where id = p_cohort;
  select count(*) into v_real from public.league_members where cohort_id = p_cohort;
  return query
    with learners as (
      select 'learner'::text as kind,
             case when p.is_public then p.handle end as ref,
             coalesce(p.display_name, 'Learner') as name,
             -- Once settled, the table keeps what was final.
             coalesce(m.final_xp, public.league_xp(m.user_id, v_week)) as xp,
             m.user_id
        from public.league_members m
        left join public.profiles p on p.user_id = m.user_id
       where m.cohort_id = p_cohort
    ),
    pacers as (
      select 'pacer'::text, c.id, null::text,
             public.league_pacer_xp(p_cohort, c.id, v_division, v_week, p_at), null::uuid
        from unnest(array['lf', 'jk', 'ao', 'aw', 'mb', 'bk', 'cm']) as c(id)
       order by abs(hashtext(p_cohort || c.id))
       limit greatest(0, 10 - v_real)
    ),
    everyone as (
      select * from learners
      union all
      select * from pacers
    )
    select (row_number() over (
              order by e.xp desc, e.kind = 'pacer', e.name
            ))::integer,
           e.kind, e.ref, e.name, e.xp, e.user_id
      from everyone e;
end;
$$;

-- Settles every finished week the learner hasn't settled yet, moving their division.
create function public.league_settle(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  m record;
  v_size integer;
  v_rank integer;
  v_xp integer;
  v_zones record;
  v_result text;
  v_end timestamptz;
begin
  for m in
    select * from public.league_members
     where user_id = p_user and settled_at is null
       and week < public.league_week(now())
     order by week
  loop
    v_end := public.league_week_start(m.week) + interval '7 days';
    select count(*), max(t.rank) filter (where t.user_id = p_user),
           max(t.xp) filter (where t.user_id = p_user)
      into v_size, v_rank, v_xp
      from public.league_table(m.cohort_id, v_end) t;
    select * into v_zones from public.league_zones(v_size, m.division);
    v_result := case
      when v_xp > 0 and v_rank <= v_zones.promote then 'promoted'
      when v_rank > v_size - v_zones.relegate then 'relegated'
      else 'stayed'
    end;
    update public.league_members
       set final_rank = v_rank, final_xp = v_xp, result = v_result, settled_at = now()
     where week = m.week and user_id = p_user;
    update public.league_state
       set division = least(10, greatest(1, m.division
             + case v_result when 'promoted' then 1 when 'relegated' then -1 else 0 end)),
           updated_at = now()
     where user_id = p_user;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- Learner-facing functions.

-- The learner's league: settles past weeks, joins this week's table once there's XP, and returns
-- { week, endsAt, division, xp, joined, promote, relegate,
--   table: [{ rank, kind, ref, name, xp, me }],
--   result: { week, division, rank, result } | null }   (the last settled week not yet seen)
create function public.my_league()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_week date := public.league_week(now());
  v_state public.league_state;
  v_xp integer;
  v_cohort bigint;
  v_size integer;
  v_zones record;
  v_table jsonb := '[]'::jsonb;
  v_result jsonb;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  perform public.league_profile(v_user);
  insert into public.league_state (user_id) values (v_user) on conflict do nothing;
  perform public.league_settle(v_user);
  select * into v_state from public.league_state where user_id = v_user for update;

  v_xp := public.league_xp(v_user, v_week);
  select cohort_id into v_cohort from public.league_members
   where week = v_week and user_id = v_user;

  if v_cohort is null and v_xp > 0 then
    -- The fullest open table in the division, so learners meet each other before new tables start.
    select c.id into v_cohort
      from public.league_cohorts c
     where c.week = v_week and c.division = v_state.division
       and (select count(*) from public.league_members m where m.cohort_id = c.id) < 20
     order by (select count(*) from public.league_members m where m.cohort_id = c.id) desc, c.id
     limit 1
     for update skip locked;
    if v_cohort is null then
      insert into public.league_cohorts (week, division)
      values (v_week, v_state.division)
      returning id into v_cohort;
    end if;
    insert into public.league_members (week, user_id, cohort_id, division)
    values (v_week, v_user, v_cohort, v_state.division);
  end if;

  if v_cohort is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
             'rank', t.rank, 'kind', t.kind, 'ref', t.ref, 'name', t.name, 'xp', t.xp,
             'me', t.user_id is not distinct from v_user and t.kind = 'learner'
           ) order by t.rank), '[]'::jsonb), count(*)
      into v_table, v_size
      from public.league_table(v_cohort, now()) t;
  end if;
  select * into v_zones from public.league_zones(coalesce(v_size, 10), v_state.division);

  select jsonb_build_object('week', m.week, 'division', m.division, 'rank', m.final_rank,
                            'result', m.result)
    into v_result
    from public.league_members m
   where m.user_id = v_user and m.settled_at is not null
     and (v_state.result_seen_week is null or m.week > v_state.result_seen_week)
   order by m.week desc
   limit 1;

  return jsonb_build_object(
    'week', v_week,
    'endsAt', public.league_week_start(v_week) + interval '7 days',
    'division', v_state.division,
    'xp', v_xp,
    'joined', v_cohort is not null,
    'promote', v_zones.promote,
    'relegate', v_zones.relegate,
    'table', v_table,
    'result', v_result
  );
end;
$$;

-- The learner has seen the result of a week.
create function public.league_result_seen(p_week date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  update public.league_state
     set result_seen_week = greatest(coalesce(result_seen_week, p_week), p_week),
         updated_at = now()
   where user_id = auth.uid();
end;
$$;

-- A profile page: public stats only. Null when the handle is unknown, or private and not yours.
-- { handle, displayName, joinedAt, me, division, streak, longestStreak, xp, lessons, pins }
create function public.public_profile(p_handle text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  select * into v_profile from public.profiles where handle = lower(p_handle);
  if not found or (not v_profile.is_public and v_profile.user_id <> auth.uid()) then
    return null;
  end if;
  return jsonb_build_object(
    'handle', v_profile.handle,
    'displayName', v_profile.display_name,
    'joinedAt', v_profile.created_at,
    'me', v_profile.user_id = auth.uid(),
    'isPublic', v_profile.is_public,
    'division', coalesce(
      (select division from public.league_state where user_id = v_profile.user_id), 1
    ),
    'streak', coalesce(
      (select current_streak from public.streaks where user_id = v_profile.user_id), 0
    ),
    'longestStreak', coalesce(
      (select longest_streak from public.streaks where user_id = v_profile.user_id), 0
    ),
    'xp', coalesce(
      (select sum(amount) from public.xp_events where user_id = v_profile.user_id), 0
    ),
    'lessons', (
      select count(*) from public.xp_events
       where user_id = v_profile.user_id and source = 'lesson'
    ),
    'pins', coalesce((
      select jsonb_agg(jsonb_build_object('pin', pin, 'tier', tier, 'unlockedAt', unlocked_at)
                       order by unlocked_at)
        from public.user_pins where user_id = v_profile.user_id
    ), '[]'::jsonb)
  );
end;
$$;

-- The learner's own profile row, created if needed, for Settings and the profile link.
create function public.my_profile()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_profile := public.league_profile(auth.uid());
  return jsonb_build_object(
    'handle', v_profile.handle,
    'displayName', v_profile.display_name,
    'isPublic', v_profile.is_public
  );
end;
$$;

revoke all on function
  public.league_xp(uuid, date),
  public.league_profile(uuid),
  public.league_table(bigint, timestamptz),
  public.league_settle(uuid)
from public, anon, authenticated;

revoke all on function
  public.my_league(),
  public.league_result_seen(date),
  public.public_profile(text),
  public.my_profile()
from public, anon;
grant execute on function
  public.my_league(),
  public.league_result_seen(date),
  public.public_profile(text),
  public.my_profile()
to authenticated;
