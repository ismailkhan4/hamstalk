-- Hamsti's stash: hazelnuts, the Akku, the daily plan and lanyard pins.
--
-- Like the habit loop, learners read their own rows and never write them. Every change goes
-- through a function here that decides the amounts itself:
--   earn()        replaces calling award_xp() directly: awards XP, then pays out nuts for the daily
--                 goal, streak milestones, finished quests and new pins, and applies a double-XP
--                 boost.
--   use_akku()    takes Akku bars for answers missed in a lesson.
--   buy()         spends nuts in the shop (Vorrat).
--   my_economy()  reads the stash, Akku, today's plan and pins for the app.
--
-- Depends on: habit_loop.sql.

-- A boost doubles XP with a second event per award, so the ledger still says where XP came from.
alter table public.xp_events drop constraint xp_events_source_check;
alter table public.xp_events add constraint xp_events_source_check
  check (source in ('lesson', 'lesson_replay', 'review', 'standup', 'boost'));
create unique index xp_events_boost_once
  on public.xp_events (user_id, ref)
  where source = 'boost';

-- The stash and the Akku. Akku bars refill one every four hours, counted from akku_at; the
-- functions settle the refill before they read or change it.
create table public.wallets (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nuts integer not null default 0 check (nuts >= 0),
  akku smallint not null default 5 check (akku between 0 and 5),
  akku_at timestamptz not null default now(),
  boost_until timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.wallets is
  'Hazelnut balance, Akku bars and the double-XP boost. Written only by the economy functions.';

-- One row per nut payment or purchase. Unique per source and ref (except purchases), so a quest,
-- a goal day, a milestone or a pin pays once.
create table public.nut_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null check (source in ('welcome', 'goal', 'milestone', 'quest', 'pin', 'shop')),
  ref text not null check (char_length(ref) between 1 and 120),
  amount integer not null check (amount between -1000 and 1000 and amount <> 0),
  created_at timestamptz not null default now()
);

create unique index nut_events_once
  on public.nut_events (user_id, source, ref)
  where source <> 'shop';
create index nut_events_user on public.nut_events (user_id, created_at);

comment on table public.nut_events is 'Hazelnut ledger. Written only by the economy functions.';

-- Pins on Hamsti's lanyard: one row per pin and tier reached.
create table public.user_pins (
  user_id uuid not null references auth.users (id) on delete cascade,
  pin text not null check (pin in ('streak', 'xp', 'stations', 'standups', 'cheeks', 'planner')),
  tier smallint not null check (tier between 1 and 5),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, pin, tier)
);

comment on table public.user_pins is 'Lanyard pins. Written only by earn().';

alter table public.wallets enable row level security;
alter table public.nut_events enable row level security;
alter table public.user_pins enable row level security;

revoke all on public.wallets, public.nut_events, public.user_pins from anon, authenticated;
grant select on public.wallets, public.nut_events, public.user_pins to authenticated;

create policy "Learners read their own wallet"
  on public.wallets for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own nuts"
  on public.nut_events for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own pins"
  on public.user_pins for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------------------------
-- Helpers. Not callable by learners.

-- The learner's local date, as award_xp() counts it.
create function public.economy_today(p_user uuid)
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

-- The learner's wallet, locked, with the Akku refill settled. Creates it, with 100 welcome nuts,
-- the first time.
create function public.economy_wallet(p_user uuid)
returns public.wallets
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wallet public.wallets;
  v_bars integer;
  c_refill constant interval := interval '4 hours';
begin
  insert into public.wallets (user_id) values (p_user) on conflict do nothing;
  if found then
    insert into public.nut_events (user_id, source, ref, amount)
    values (p_user, 'welcome', 'welcome', 100)
    on conflict do nothing;
    update public.wallets set nuts = 100 where user_id = p_user;
  end if;

  select * into v_wallet from public.wallets where user_id = p_user for update;
  if v_wallet.akku < 5 then
    v_bars := floor(extract(epoch from now() - v_wallet.akku_at) / extract(epoch from c_refill));
    if v_bars > 0 then
      v_wallet.akku := least(5, v_wallet.akku + v_bars);
      v_wallet.akku_at := v_wallet.akku_at + v_bars * c_refill;
      update public.wallets
         set akku = v_wallet.akku, akku_at = v_wallet.akku_at, updated_at = now()
       where user_id = p_user;
    end if;
  end if;
  return v_wallet;
end;
$$;

-- Pays nuts once per source and ref. Returns whether it paid.
create function public.economy_pay(p_user uuid, p_source text, p_ref text, p_amount integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.nut_events (user_id, source, ref, amount)
  values (p_user, p_source, p_ref, p_amount)
  on conflict do nothing;
  if not found then
    return false;
  end if;
  update public.wallets set nuts = nuts + p_amount, updated_at = now() where user_id = p_user;
  return true;
end;
$$;

-- Today's plan: three quests picked from the learner and the date, so everyone gets a different
-- mix that stays the same all day. ids are read by the app for their wording:
--   xp-<n>       earn n XP           lessons-<n>   finish n lessons (replays count)
--   new-lesson   finish a new lesson reviews-<n>   review n words
--   goal         reach the daily goal
create function public.economy_quests(p_user uuid, p_date date)
returns table (id text, target integer, progress integer, reward integer, done boolean)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_seed text := p_user::text || p_date::text;
  v_xp integer;
  v_goal integer;
  v_lessons integer;
  v_new integer;
  v_reviews integer;
  v_has_words boolean;
  v_pick integer;
begin
  select coalesce(sum(amount), 0) into v_xp
    from public.xp_events where user_id = p_user and local_date = p_date;
  select coalesce(goal_xp, 30) into v_goal
    from public.daily_activity where user_id = p_user and local_date = p_date;
  if v_goal is null then
    select coalesce(daily_minutes, 10) * 3 into v_goal
      from public.learner_preferences where user_id = p_user;
  end if;
  v_goal := coalesce(v_goal, 30);
  select count(*) filter (where source in ('lesson', 'lesson_replay')),
         count(*) filter (where source = 'lesson'),
         count(*) filter (where source = 'review')
    into v_lessons, v_new, v_reviews
    from public.xp_events where user_id = p_user and local_date = p_date;
  v_has_words := (select count(*) from public.review_items where user_id = p_user) >= 5;

  -- 1. An XP target.
  v_pick := abs(hashtext(v_seed || ':xp')) % 3;
  id := 'xp-' || (array[20, 30, 50])[v_pick + 1];
  target := (array[20, 30, 50])[v_pick + 1];
  progress := least(v_xp, target);
  reward := (array[10, 15, 20])[v_pick + 1];
  return next;

  -- 2. Lessons.
  v_pick := abs(hashtext(v_seed || ':lessons')) % 3;
  if v_pick = 0 then
    id := 'lessons-1'; target := 1; progress := least(v_lessons, 1); reward := 10;
  elsif v_pick = 1 then
    id := 'lessons-2'; target := 2; progress := least(v_lessons, 2); reward := 15;
  else
    id := 'new-lesson'; target := 1; progress := least(v_new, 1); reward := 15;
  end if;
  return next;

  -- 3. Review words, once there are words to review; otherwise the daily goal.
  if v_has_words and abs(hashtext(v_seed || ':third')) % 2 = 0 then
    id := 'reviews-5'; target := 5; progress := least(v_reviews, 5); reward := 10;
  else
    id := 'goal'; target := 1; progress := case when v_xp >= v_goal then 1 else 0 end;
    reward := 15;
  end if;
  return next;
end;
$$;

-- Marks quests done from the payments made for them.
create function public.economy_plan(p_user uuid, p_date date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'target', q.target, 'progress', q.progress, 'reward', q.reward,
    'done', exists (
      select 1 from public.nut_events e
       where e.user_id = p_user and e.source = 'quest' and e.ref = p_date::text || ':' || q.id
    )
  )), '[]'::jsonb)
  from public.economy_quests(p_user, p_date) q;
$$;

-- Pin tiers: the measure and the threshold for each tier.
create function public.economy_pin_tiers()
returns table (pin text, tier integer, threshold integer)
language sql
immutable
set search_path = ''
as $$
  values
    ('streak', 1, 3), ('streak', 2, 7), ('streak', 3, 30), ('streak', 4, 100), ('streak', 5, 365),
    ('xp', 1, 100), ('xp', 2, 500), ('xp', 3, 1000), ('xp', 4, 2500), ('xp', 5, 5000),
    ('stations', 1, 1), ('stations', 2, 5), ('stations', 3, 15), ('stations', 4, 30),
    ('stations', 5, 60),
    ('standups', 1, 1), ('standups', 2, 3), ('standups', 3, 8),
    ('cheeks', 1, 10), ('cheeks', 2, 50), ('cheeks', 3, 200), ('cheeks', 4, 500),
    ('planner', 1, 1), ('planner', 2, 10), ('planner', 3, 30), ('planner', 4, 100)
$$;

-- ---------------------------------------------------------------------------------------------
-- Learner-facing functions.

-- Awards XP through award_xp(), then settles everything the stash pays for. Returns award_xp()'s
-- result plus:
-- { boosted, nuts: { earned, balance }, quests: [{ id, reward }], pins: [{ pin, tier }],
--   akku, akkuCharged }
create function public.earn(p_source text, p_ref text, p_amount integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_result jsonb;
  v_wallet public.wallets;
  v_today date;
  v_awarded integer;
  v_boosted integer := 0;
  v_xp_today integer;
  v_goal integer;
  v_earned integer := 0;
  v_milestone integer;
  v_quests jsonb := '[]'::jsonb;
  v_pins jsonb := '[]'::jsonb;
  v_charged boolean := false;
  v_reviews integer;
  r record;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;

  v_result := public.award_xp(p_source, p_ref, p_amount);
  v_wallet := public.economy_wallet(v_user);
  v_today := public.economy_today(v_user);
  v_awarded := (v_result ->> 'awarded')::integer;
  v_xp_today := (v_result ->> 'xpToday')::integer;
  v_goal := (v_result ->> 'goalXp')::integer;

  -- Double XP: the same amount again, as its own event.
  if v_awarded > 0 and v_wallet.boost_until > now() then
    insert into public.xp_events (user_id, source, ref, local_date, amount)
    values (
      v_user, 'boost', (v_result ->> 'source') || ':' || p_ref || ':' || v_today, v_today,
      v_awarded
    )
    on conflict do nothing;
    if found then
      v_boosted := v_awarded;
      update public.daily_activity
         set xp = xp + v_boosted, updated_at = now()
       where user_id = v_user and local_date = v_today
      returning xp into v_xp_today;
      v_result := v_result || jsonb_build_object(
        'xpToday', v_xp_today,
        'goalReached', v_xp_today - v_awarded - v_boosted < v_goal and v_xp_today >= v_goal
      );
    end if;
  end if;

  if v_xp_today >= v_goal and public.economy_pay(v_user, 'goal', v_today::text, 5) then
    v_earned := v_earned + 5;
  end if;

  v_milestone := (v_result -> 'streak' ->> 'milestone')::integer;
  if v_milestone is not null and public.economy_pay(
    v_user, 'milestone', v_milestone || ':' || v_today,
    case
      when v_milestone = 3 then 10
      when v_milestone = 7 then 30
      when v_milestone < 30 then 40
      when v_milestone < 100 then 100
      else 200
    end
  ) then
    v_earned := v_earned + (
      select amount from public.nut_events
       where user_id = v_user and source = 'milestone' and ref = v_milestone || ':' || v_today
    );
  end if;

  for r in select * from public.economy_quests(v_user, v_today) loop
    if r.progress >= r.target
       and public.economy_pay(v_user, 'quest', v_today || ':' || r.id, r.reward) then
      v_earned := v_earned + r.reward;
      v_quests := v_quests || jsonb_build_object('id', r.id, 'reward', r.reward);
    end if;
  end loop;

  for r in
    with measures (pin, value) as (
      select 'streak', coalesce((select longest_streak from public.streaks where user_id = v_user), 0)
      union all
      select 'xp', coalesce((select sum(amount) from public.xp_events where user_id = v_user), 0)
      union all
      select 'stations', (select count(*) from public.xp_events where user_id = v_user and source = 'lesson')
      union all
      select 'standups', (select count(*) from public.xp_events where user_id = v_user and source = 'standup')
      union all
      select 'cheeks', (select count(*) from public.xp_events where user_id = v_user and source = 'review')
      union all
      select 'planner', (select count(*) from public.nut_events where user_id = v_user and source = 'quest')
    )
    insert into public.user_pins (user_id, pin, tier)
    select v_user, t.pin, t.tier
      from public.economy_pin_tiers() t join measures m on m.pin = t.pin
     where m.value >= t.threshold
    on conflict do nothing
    returning pin, tier
  loop
    v_pins := v_pins || jsonb_build_object('pin', r.pin, 'tier', r.tier);
    if public.economy_pay(v_user, 'pin', r.pin || ':' || r.tier, 25 * r.tier) then
      v_earned := v_earned + 25 * r.tier;
    end if;
  end loop;

  -- Practice recharges the Akku: one bar for every five words reviewed in a day.
  if p_source = 'review' and v_awarded > 0 then
    select count(*) into v_reviews from public.xp_events
     where user_id = v_user and source = 'review' and local_date = v_today;
    if v_reviews % 5 = 0 and v_wallet.akku < 5 then
      v_charged := true;
      v_wallet.akku := v_wallet.akku + 1;
      update public.wallets set akku = v_wallet.akku, updated_at = now() where user_id = v_user;
    end if;
  end if;

  return v_result || jsonb_build_object(
    'boosted', v_boosted,
    'nuts', jsonb_build_object(
      'earned', v_earned,
      'balance', (select nuts from public.wallets where user_id = v_user)
    ),
    'quests', v_quests,
    'pins', v_pins,
    'akku', v_wallet.akku,
    'akkuCharged', v_charged
  );
end;
$$;

-- Takes one Akku bar per answer missed after its second try. Returns { akku, nextBarAt }.
create function public.use_akku(p_ref text, p_count integer default 1)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_wallet public.wallets;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  if p_ref is null or char_length(p_ref) not between 1 and 120
     or p_count is null or p_count not between 1 and 10 then
    raise exception 'Invalid request' using errcode = '22023';
  end if;

  v_wallet := public.economy_wallet(v_user);
  -- The refill clock starts when the Akku drops below full.
  if v_wallet.akku = 5 then
    v_wallet.akku_at := now();
  end if;
  v_wallet.akku := greatest(0, v_wallet.akku - p_count);
  update public.wallets
     set akku = v_wallet.akku, akku_at = v_wallet.akku_at, updated_at = now()
   where user_id = v_user;

  return jsonb_build_object(
    'akku', v_wallet.akku,
    'nextBarAt', case when v_wallet.akku < 5 then v_wallet.akku_at + interval '4 hours' end
  );
end;
$$;

-- Buys one item from the shop. Returns { ok, reason?, nuts }. Reasons: 'nuts' (not enough),
-- 'full' (nothing to add), 'active' (a boost is running), 'unknown'.
create function public.buy(p_item text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_wallet public.wallets;
  v_price integer;
  v_freezes integer;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_price := case p_item when 'freeze' then 150 when 'recharge' then 300 when 'boost' then 80 end;
  if v_price is null then
    return jsonb_build_object('ok', false, 'reason', 'unknown');
  end if;

  v_wallet := public.economy_wallet(v_user);
  if v_wallet.nuts < v_price then
    return jsonb_build_object('ok', false, 'reason', 'nuts', 'nuts', v_wallet.nuts);
  end if;

  if p_item = 'freeze' then
    insert into public.streaks (user_id) values (v_user) on conflict do nothing;
    select freezes into v_freezes from public.streaks where user_id = v_user for update;
    if v_freezes >= 2 then
      return jsonb_build_object('ok', false, 'reason', 'full', 'nuts', v_wallet.nuts);
    end if;
    update public.streaks set freezes = freezes + 1, updated_at = now() where user_id = v_user;
  elsif p_item = 'recharge' then
    if v_wallet.akku >= 5 then
      return jsonb_build_object('ok', false, 'reason', 'full', 'nuts', v_wallet.nuts);
    end if;
    update public.wallets set akku = 5, akku_at = now() where user_id = v_user;
  else
    if v_wallet.boost_until > now() then
      return jsonb_build_object('ok', false, 'reason', 'active', 'nuts', v_wallet.nuts);
    end if;
    update public.wallets set boost_until = now() + interval '15 minutes' where user_id = v_user;
  end if;

  insert into public.nut_events (user_id, source, ref, amount)
  values (v_user, 'shop', p_item, -v_price);
  update public.wallets set nuts = nuts - v_price, updated_at = now() where user_id = v_user;
  return jsonb_build_object('ok', true, 'nuts', v_wallet.nuts - v_price);
end;
$$;

-- Everything the app shows about the stash:
-- { nuts, akku, nextBarAt, boostUntil, freezes, quests: [{ id, target, progress, reward, done }],
--   pins: [{ pin, tier, unlockedAt }] }
create function public.my_economy()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_wallet public.wallets;
begin
  if v_user is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  v_wallet := public.economy_wallet(v_user);
  return jsonb_build_object(
    'nuts', v_wallet.nuts,
    'akku', v_wallet.akku,
    'nextBarAt', case when v_wallet.akku < 5 then v_wallet.akku_at + interval '4 hours' end,
    'boostUntil', case when v_wallet.boost_until > now() then v_wallet.boost_until end,
    'freezes', coalesce((select freezes from public.streaks where user_id = v_user), 1),
    'quests', public.economy_plan(v_user, public.economy_today(v_user)),
    'pins', coalesce((
      select jsonb_agg(jsonb_build_object('pin', pin, 'tier', tier, 'unlockedAt', unlocked_at)
                       order by unlocked_at)
        from public.user_pins where user_id = v_user
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function
  public.economy_today(uuid),
  public.economy_wallet(uuid),
  public.economy_pay(uuid, text, text, integer),
  public.economy_quests(uuid, date),
  public.economy_plan(uuid, date),
  public.economy_pin_tiers()
from public, anon, authenticated;

revoke all on function
  public.earn(text, text, integer),
  public.use_akku(text, integer),
  public.buy(text),
  public.my_economy()
from public, anon;
grant execute on function
  public.earn(text, text, integer),
  public.use_akku(text, integer),
  public.buy(text),
  public.my_economy()
to authenticated;
