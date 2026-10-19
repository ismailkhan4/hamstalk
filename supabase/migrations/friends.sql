-- Friends: one-way follows, a weekly XP table of the people you follow, and nudges.
--
-- Anyone can follow a learner whose profile is public, without approval, like the league tables
-- that already show names. A profile made private disappears from every friend list and search,
-- and can't be followed, but existing follows are kept for when it's public again.
--
-- A nudge is a push reminder from a friend. To keep them friendly rather than spammy:
--   - only between learners who follow each other
--   - only while the friend hasn't practised yet today (their local day)
--   - one per friend per day, five per learner per day from everyone together
--   - never to a learner who turned nudges off (profiles.allow_nudges)
-- The app sends the push itself after nudge() records it.
--
-- Learners read their own follows. Everything about other learners goes through the functions
-- below, which return only handles, names and public stats.
--
-- Depends on: leagues.sql, habit_loop.sql, learner_timezone.sql, reminders.sql.

alter table public.profiles add column allow_nudges boolean not null default true;
grant update (allow_nudges) on public.profiles to authenticated;

create table public.follows (
  follower uuid not null references auth.users (id) on delete cascade,
  followee uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee)
);

create index follows_followee on public.follows (followee);

create table public.nudges (
  id bigint generated always as identity primary key,
  sender uuid not null references auth.users (id) on delete cascade,
  recipient uuid not null references auth.users (id) on delete cascade,
  -- The recipient's local day, so "once a day" matches their day.
  local_date date not null,
  sent_at timestamptz not null default now(),
  unique (sender, recipient, local_date)
);

create index nudges_recipient_day on public.nudges (recipient, local_date);

alter table public.follows enable row level security;
alter table public.nudges enable row level security;
revoke all on public.follows, public.nudges from anon, authenticated;
grant select on public.follows to authenticated;

create policy "Learners read who they follow"
  on public.follows for select to authenticated
  using ((select auth.uid()) = follower);

-- ---------------------------------------------------------------------------------------------
-- Helpers. Not callable by learners.

-- A learner's local date now.
create function public.friend_today(p_user uuid)
returns date
language sql
stable
security definer
set search_path = ''
as $$
  select (now() at time zone coalesce(
    (select timezone from public.learner_preferences where user_id = p_user), 'UTC'
  ))::date;
$$;

-- A learner's streak as others should see it: zero once a day has been missed, even before the
-- learner comes back and award_xp() settles it.
create function public.friend_streak(p_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select case when s.last_active_date >= public.friend_today(p_user) - 1
                then s.current_streak else 0 end
      from public.streaks s where s.user_id = p_user
  ), 0);
$$;

create function public.friend_practised_today(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.daily_activity
     where user_id = p_user and local_date = public.friend_today(p_user) and xp > 0
  );
$$;

-- One learner as a friend list entry.
create function public.friend_card(p_user uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'handle', p.handle,
    'displayName', p.display_name,
    'streak', public.friend_streak(p.user_id),
    'me', p.user_id = auth.uid()
  )
  from public.profiles p where p.user_id = p_user;
$$;

-- The visible profile behind a handle: public, or the caller's own. Null otherwise.
create function public.friend_profile(p_handle text)
returns public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select * from public.profiles
   where handle = lower(btrim(p_handle))
     and (is_public or user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------------------------
-- For learners.

-- Follows a public profile. Returns false when there's no such profile, it's your own, or you
-- already follow 500 learners.
create function public.follow(p_handle text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_target public.profiles;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_target := public.friend_profile(p_handle);
  if v_target.user_id is null or v_target.user_id = v_user or not v_target.is_public then
    return false;
  end if;
  if (select count(*) from public.follows where follower = v_user) >= 500 then
    return false;
  end if;
  -- Following someone makes you findable by them too.
  perform public.league_profile(v_user);
  insert into public.follows (follower, followee) values (v_user, v_target.user_id)
  on conflict do nothing;
  return true;
end;
$$;

create function public.unfollow(p_handle text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  delete from public.follows
   where follower = auth.uid()
     and followee = (select user_id from public.profiles where handle = lower(btrim(p_handle)));
end;
$$;

-- Who a profile follows and who follows it, public profiles only, up to 60 of each, plus whether
-- the caller follows it and it follows the caller. Null when the profile isn't visible.
-- { following, followers, followingCount, followersCount, iFollow, followsMe }
create function public.profile_friends(p_handle text)
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
  v_profile := public.friend_profile(p_handle);
  if v_profile.user_id is null then
    return null;
  end if;
  return jsonb_build_object(
    'following', coalesce((
      select jsonb_agg(public.friend_card(f.followee) order by f.created_at desc)
        from (select f.followee, f.created_at from public.follows f
                join public.profiles p on p.user_id = f.followee and p.is_public
               where f.follower = v_profile.user_id
               order by f.created_at desc limit 60) f
    ), '[]'::jsonb),
    'followers', coalesce((
      select jsonb_agg(public.friend_card(f.follower) order by f.created_at desc)
        from (select f.follower, f.created_at from public.follows f
                join public.profiles p on p.user_id = f.follower and p.is_public
               where f.followee = v_profile.user_id
               order by f.created_at desc limit 60) f
    ), '[]'::jsonb),
    'followingCount', (
      select count(*) from public.follows f
        join public.profiles p on p.user_id = f.followee and p.is_public
       where f.follower = v_profile.user_id
    ),
    'followersCount', (
      select count(*) from public.follows f
        join public.profiles p on p.user_id = f.follower and p.is_public
       where f.followee = v_profile.user_id
    ),
    'iFollow', exists (
      select 1 from public.follows where follower = auth.uid() and followee = v_profile.user_id
    ),
    'followsMe', exists (
      select 1 from public.follows where follower = v_profile.user_id and followee = auth.uid()
    )
  );
end;
$$;

-- This league week's XP for the caller and everyone they follow (public profiles), most first.
-- canNudge says whether a nudge would be accepted right now.
-- [{ handle, displayName, streak, me, xp, practisedToday, canNudge }]
create function public.friends_week()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_week date := public.league_week(now());
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  perform public.league_profile(v_user);
  return coalesce((
    select jsonb_agg(entry order by (entry ->> 'xp')::integer desc, entry ->> 'displayName')
      from (
        select public.friend_card(p.user_id) || jsonb_build_object(
          'xp', public.league_xp(p.user_id, v_week),
          'practisedToday', public.friend_practised_today(p.user_id),
          'canNudge',
            p.user_id <> v_user
            and p.allow_nudges
            and exists (select 1 from public.follows
                         where follower = p.user_id and followee = v_user)
            and not public.friend_practised_today(p.user_id)
            and not exists (select 1 from public.nudges n
                             where n.sender = v_user and n.recipient = p.user_id
                               and n.local_date = public.friend_today(p.user_id))
            and (select count(*) from public.nudges n
                  where n.recipient = p.user_id
                    and n.local_date = public.friend_today(p.user_id)) < 5
        ) as entry
          from public.profiles p
         where p.user_id = v_user
            or (p.is_public and p.user_id in (
                  select followee from public.follows where follower = v_user))
      ) rows
  ), '[]'::jsonb);
end;
$$;

-- Public profiles whose handle or name starts with the query (two characters at least), up to 10.
-- [{ handle, displayName, streak, me, iFollow }]
create function public.find_learners(p_query text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_query text := lower(btrim(coalesce(p_query, '')));
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_query := ltrim(v_query, '@');
  if char_length(v_query) < 2 or char_length(v_query) > 40 then
    return '[]'::jsonb;
  end if;
  -- LIKE wildcards in the query are matched literally.
  v_query := replace(replace(replace(v_query, '\', '\\'), '%', '\%'), '_', '\_');
  return coalesce((
    select jsonb_agg(public.friend_card(p.user_id) || jsonb_build_object(
             'iFollow', exists (select 1 from public.follows
                                 where follower = auth.uid() and followee = p.user_id))
           order by p.handle)
      from (select * from public.profiles
             where is_public and user_id <> auth.uid()
               and (handle like v_query || '%' or lower(display_name) like v_query || '%')
             order by handle limit 10) p
  ), '[]'::jsonb);
end;
$$;

-- Records a nudge if it's allowed (see the top of this file). Returns 'sent', or why not:
-- 'unknown', 'not-mutual', 'practised', 'already', 'off' or 'limit'.
create function public.nudge(p_handle text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_target public.profiles;
  v_day date;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_target := public.friend_profile(p_handle);
  if v_target.user_id is null or v_target.user_id = v_user or not v_target.is_public then
    return 'unknown';
  end if;
  if not exists (select 1 from public.follows where follower = v_user and followee = v_target.user_id)
     or not exists (select 1 from public.follows where follower = v_target.user_id and followee = v_user) then
    return 'not-mutual';
  end if;
  if not v_target.allow_nudges then
    return 'off';
  end if;
  if public.friend_practised_today(v_target.user_id) then
    return 'practised';
  end if;
  v_day := public.friend_today(v_target.user_id);
  perform pg_advisory_xact_lock(hashtext('nudge:' || v_target.user_id::text));
  if (select count(*) from public.nudges where recipient = v_target.user_id and local_date = v_day) >= 5 then
    return 'limit';
  end if;
  insert into public.nudges (sender, recipient, local_date)
  values (v_user, v_target.user_id, v_day)
  on conflict do nothing;
  return case when found then 'sent' else 'already' end;
end;
$$;

revoke all on function
  public.friend_today(uuid),
  public.friend_streak(uuid),
  public.friend_practised_today(uuid),
  public.friend_card(uuid),
  public.friend_profile(text)
from public, anon, authenticated;

revoke all on function
  public.follow(text),
  public.unfollow(text),
  public.profile_friends(text),
  public.friends_week(),
  public.find_learners(text),
  public.nudge(text)
from public, anon;
grant execute on function
  public.follow(text),
  public.unfollow(text),
  public.profile_friends(text),
  public.friends_week(),
  public.find_learners(text),
  public.nudge(text)
to authenticated;
