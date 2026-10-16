-- Reminders: web push subscriptions, a log of what was sent, and the query that says who is due.
--
-- A scheduled job (pg_cron, see the README) calls the app's /api/cron/reminders endpoint every 15
-- minutes. The endpoint uses the secret key to call reminders_due() and to write the log; learners
-- can only manage their own push subscriptions and read their own log.
--
--   daily         at the learner's reminder time, if they haven't practised today
--   streak_saver  from 21:00 local time, if today is the last day to keep the streak
--
-- Each kind goes out at most once per learner per local day, enforced by a unique index.
--
-- Depends on: onboarding_and_placement.sql, learner_timezone.sql, review_items.sql,
-- habit_loop.sql.

alter table public.learner_preferences
  add column streak_saver boolean not null default true,
  add column email_reminders boolean not null default false;

comment on column public.learner_preferences.streak_saver is
  'Send an evening reminder when the streak would end at midnight.';
comment on column public.learner_preferences.email_reminders is
  'Also send reminders by email (only when email sending is set up).';

-- One row per browser or device that allowed notifications.
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://' and char_length(endpoint) < 1000),
  p256dh text not null check (char_length(p256dh) < 200),
  auth text not null check (char_length(auth) < 100),
  user_agent text check (char_length(user_agent) < 300),
  created_at timestamptz not null default now(),
  last_sent_at timestamptz
);

create index push_subscriptions_user on public.push_subscriptions (user_id);

-- Every reminder sent (or skipped), for once-a-day limits and for learning which wording works.
create table public.notification_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('daily', 'streak_saver')),
  channel text not null check (channel in ('push', 'email', 'skipped')),
  template text not null check (char_length(template) between 1 and 40),
  local_date date not null,
  sent_at timestamptz not null default now(),
  opened_at timestamptz
);

create unique index notification_log_once
  on public.notification_log (user_id, kind, local_date, channel);
create index notification_log_template on public.notification_log (kind, template, sent_at);

alter table public.push_subscriptions enable row level security;
alter table public.notification_log enable row level security;

revoke all on public.push_subscriptions, public.notification_log from anon, authenticated;
grant select, insert, delete on public.push_subscriptions to authenticated;
grant select on public.notification_log to authenticated;
grant update (streak_saver, email_reminders) on public.learner_preferences to authenticated;

create policy "Learners read their own devices"
  on public.push_subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners add their own devices"
  on public.push_subscriptions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Learners remove their own devices"
  on public.push_subscriptions for delete to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners read their own reminders"
  on public.notification_log for select to authenticated
  using ((select auth.uid()) = user_id);

-- Who should get a reminder right now. For the scheduled endpoint only (service role).
create function public.reminders_due(p_now timestamptz default now())
returns table (
  user_id uuid,
  kind text,
  local_date date,
  email text,
  full_name text,
  streak integer,
  freezes integer,
  xp_today integer,
  goal_xp integer,
  due_words integer,
  email_reminders boolean,
  subscriptions jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  with learners as (
    select lp.user_id,
           (p_now at time zone coalesce(lp.timezone, 'UTC'))::date as local_date,
           (p_now at time zone coalesce(lp.timezone, 'UTC'))::time as local_time,
           lp.reminder_enabled, lp.reminder_time, lp.streak_saver, lp.email_reminders,
           coalesce(lp.daily_minutes, 10) * 3 as goal_xp
      from public.learner_preferences lp
     where lp.onboarded_at is not null
       and (lp.reminder_enabled or lp.streak_saver)
  ),
  facts as (
    select l.*,
           coalesce(a.xp, 0) as xp_today,
           coalesce(s.current_streak, 0) as streak,
           coalesce(s.freezes, 0) as freezes,
           -- Alive but not yet extended today: practising today keeps it, missing today ends it.
           s.last_active_date is not null
             and s.current_streak > 0
             and s.last_active_date < l.local_date
             and l.local_date - s.last_active_date - 1 <= s.freezes as at_risk,
           (select coalesce(jsonb_agg(jsonb_build_object(
                     'id', p.id, 'endpoint', p.endpoint, 'p256dh', p.p256dh, 'auth', p.auth)),
                   '[]'::jsonb)
              from public.push_subscriptions p where p.user_id = l.user_id) as subscriptions
      from learners l
      left join public.daily_activity a
        on a.user_id = l.user_id and a.local_date = l.local_date
      left join public.streaks s on s.user_id = l.user_id
  ),
  due as (
    select f.*, 'daily'::text as kind
      from facts f
     where f.reminder_enabled and f.reminder_time is not null
       and f.local_time >= f.reminder_time
       and f.local_time < f.reminder_time + interval '2 hours'
       and f.xp_today < 10
    union all
    select f.*, 'streak_saver'::text
      from facts f
     where f.streak_saver and f.at_risk and f.xp_today < 10
       and f.local_time >= time '21:00' and f.local_time < time '23:45'
  )
  select d.user_id, d.kind, d.local_date, u.email,
         coalesce(u.raw_user_meta_data ->> 'full_name', ''),
         d.streak, d.freezes, d.xp_today, d.goal_xp,
         (select count(*)::integer from public.review_items r
           where r.user_id = d.user_id and r.due_at <= p_now),
         d.email_reminders, d.subscriptions
    from due d
    join auth.users u on u.id = d.user_id
   where not exists (
           select 1 from public.notification_log n
            where n.user_id = d.user_id and n.kind = d.kind and n.local_date = d.local_date
         )
     and (jsonb_array_length(d.subscriptions) > 0 or d.email_reminders);
$$;

-- How each wording has done over the last 30 days: sends, and sends followed by practice within
-- two hours. The endpoint uses it to pick wordings that work (an epsilon-greedy bandit).
create function public.reminder_template_stats(p_kind text)
returns table (template text, sends integer, wins integer)
language sql
stable
security definer
set search_path = ''
as $$
  select n.template, count(*)::integer,
         count(*) filter (where exists (
           select 1 from public.xp_events x
            where x.user_id = n.user_id
              and x.created_at between n.sent_at and n.sent_at + interval '2 hours'
         ))::integer
    from public.notification_log n
   where n.kind = p_kind and n.channel <> 'skipped'
     and n.sent_at > now() - interval '30 days'
   group by n.template;
$$;

-- A learner opened a reminder (from the link in it).
create function public.reminder_opened(p_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.notification_log
     set opened_at = coalesce(opened_at, now())
   where id = p_id and user_id = auth.uid();
$$;

revoke all on function public.reminders_due(timestamptz) from public, anon, authenticated;
revoke all on function public.reminder_template_stats(text) from public, anon, authenticated;
grant execute on function public.reminders_due(timestamptz) to service_role;
grant execute on function public.reminder_template_stats(text) to service_role;
grant select, insert, delete on public.push_subscriptions, public.notification_log to service_role;
grant update (last_sent_at) on public.push_subscriptions to service_role;

revoke all on function public.reminder_opened(uuid) from public, anon;
grant execute on function public.reminder_opened(uuid) to authenticated;
