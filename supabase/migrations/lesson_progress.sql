create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{3,64}$'),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  -- Index of the exercise to resume at.
  step smallint not null default 0 check (step between 0 and 49),
  -- One outcome per exercise so far: 'first_try', 'second_try' or 'shown'.
  results text[] not null default '{}'
    check (results <@ array['first_try', 'second_try', 'shown'] and cardinality(results) <= 50),
  xp smallint not null default 0 check (xp between 0 and 500),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint completed_has_timestamp check ((status = 'completed') = (completed_at is not null))
);

create table public.saved_phrases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  phrase_key text not null check (char_length(phrase_key) between 1 and 80),
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{3,64}$'),
  de text not null check (char_length(de) between 1 and 200),
  en text not null check (char_length(en) between 1 and 200),
  created_at timestamptz not null default now(),
  unique (user_id, phrase_key)
);

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{3,64}$'),
  -- Stable id of the exercise (and conversation turn), so a repeated miss updates one row.
  item_key text not null check (char_length(item_key) between 1 and 80),
  topic text check (char_length(topic) <= 80),
  prompt text not null check (char_length(prompt) between 1 and 400),
  learner_answer text not null check (char_length(learner_answer) <= 400),
  correct_answer text not null check (char_length(correct_answer) between 1 and 400),
  reason text not null check (char_length(reason) <= 600),
  miss_count smallint not null default 1 check (miss_count >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  learned_at timestamptz,
  unique (user_id, item_key)
);

create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();
create trigger mistakes_updated_at
  before update on public.mistakes
  for each row execute function public.set_updated_at();

alter table public.lesson_progress enable row level security;
alter table public.saved_phrases enable row level security;
alter table public.mistakes enable row level security;

revoke all on public.lesson_progress, public.saved_phrases, public.mistakes from anon, authenticated;
grant select, insert, update, delete on public.lesson_progress, public.saved_phrases, public.mistakes to authenticated;

create policy "Learners read their own lesson progress"
  on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners create their own lesson progress"
  on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own lesson progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners delete their own lesson progress"
  on public.lesson_progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners read their own saved phrases"
  on public.saved_phrases for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners save their own phrases"
  on public.saved_phrases for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own saved phrases"
  on public.saved_phrases for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners remove their own saved phrases"
  on public.saved_phrases for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners read their own mistakes"
  on public.mistakes for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners record their own mistakes"
  on public.mistakes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own mistakes"
  on public.mistakes for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners delete their own mistakes"
  on public.mistakes for delete to authenticated using ((select auth.uid()) = user_id);
