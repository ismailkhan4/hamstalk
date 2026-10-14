create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.learner_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  goal text check (goal in ('work', 'interviews', 'colleagues', 'everyday', 'general', 'other')),
  start_level text check (start_level in ('beginner', 'a1', 'a2', 'b1', 'b2')),
  contexts text[] not null default '{}'
    check (contexts <@ array['standups', 'meetings', 'technical', 'interviews', 'messaging', 'everyday', 'listening', 'speaking']),
  daily_minutes smallint check (daily_minutes in (10, 15, 20, 30)),
  reminder_enabled boolean not null default false,
  reminder_time time,
  onboarding_step text not null default 'welcome'
    check (onboarding_step in ('welcome', 'goal', 'level', 'context', 'daily', 'plan')),
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint onboarded_requires_answers check (
    onboarded_at is null
    or (goal is not null and start_level is not null and cardinality(contexts) > 0 and daily_minutes is not null)
  )
);

comment on table public.learner_preferences is
  'Onboarding answers. Reminder fields record a preference only; no reminders are sent.';

create table public.placement_attempts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- One entry per question: -1 not answered, 0-2 an option, 3 "I don''t know yet".
  answers smallint[] not null default '{-1,-1,-1,-1,-1,-1,-1,-1}'
    check (cardinality(answers) = 8 and answers <@ array[-1, 0, 1, 2, 3]::smallint[]),
  current_question smallint not null default 0 check (current_question between 0 and 7),
  suggested_level text check (suggested_level in ('beginner', 'a1', 'a2', 'b1')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint completed_has_suggestion check (completed_at is null or suggested_level is not null)
);

comment on table public.placement_attempts is
  'The latest informal placement check. A suggestion only, never a CEFR level.';

create trigger learner_preferences_updated_at
  before update on public.learner_preferences
  for each row execute function public.set_updated_at();

create trigger placement_attempts_updated_at
  before update on public.placement_attempts
  for each row execute function public.set_updated_at();

alter table public.learner_preferences enable row level security;
alter table public.placement_attempts enable row level security;

revoke all on public.learner_preferences, public.placement_attempts from anon, authenticated;
grant select, insert, update, delete on public.learner_preferences, public.placement_attempts to authenticated;

create policy "Learners read their own preferences"
  on public.learner_preferences for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners create their own preferences"
  on public.learner_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Learners update their own preferences"
  on public.learner_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Learners delete their own preferences"
  on public.learner_preferences for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Learners read their own placement check"
  on public.placement_attempts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Learners create their own placement check"
  on public.placement_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Learners update their own placement check"
  on public.placement_attempts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Learners delete their own placement check"
  on public.placement_attempts for delete to authenticated
  using ((select auth.uid()) = user_id);
