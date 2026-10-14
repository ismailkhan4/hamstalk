create table public.standup_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  unit_id text not null check (unit_id ~ '^[a-z0-9-]{2,32}$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

alter table public.standup_completions enable row level security;

revoke all on public.standup_completions from anon, authenticated;
grant select, insert, update on public.standup_completions to authenticated;

create policy "Learners read their own standups"
  on public.standup_completions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners record their own standups"
  on public.standup_completions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own standups"
  on public.standup_completions for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
