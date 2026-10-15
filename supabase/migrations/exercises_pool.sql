-- Curriculum exercises, imported from the typed lessons in content/lessons by
-- scripts/ingest-curriculum.ts. The TypeScript lessons stay the source of truth: this table is a
-- published copy, written only by that script through a trusted database connection.
-- Requires public.set_updated_at() from onboarding_and_placement.sql.

create table public.exercises_pool (
  id uuid primary key default gen_random_uuid(),
  -- '<lesson_id>:<exercise_position>', the same key mistakes.item_key uses for an exercise.
  source_key text not null unique,
  unit_id text not null check (unit_id ~ '^[a-z0-9-]{2,32}$'),
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{3,64}$'),
  -- Where the lesson sits in its unit, and where the exercise sits in its lesson.
  lesson_position smallint not null check (lesson_position between 0 and 49),
  exercise_position smallint not null check (exercise_position between 0 and 49),
  exercise_type text not null
    check (exercise_type in ('discover', 'tip', 'choice', 'match', 'build', 'translate', 'conversation')),
  -- 'topic:<slug>' from the exercise's own topic, otherwise 'lesson:<lesson_id>'.
  concept_tag text not null check (concept_tag ~ '^[a-z]+:[a-z0-9-]{1,64}$'),
  -- Not authored content: re-imports never overwrite it.
  base_difficulty double precision not null default 1000.0
    check (base_difficulty > 0 and base_difficulty < 'infinity'::double precision),
  -- The complete exercise, as validated by exerciseSchema in features/lessons/schema.ts.
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, exercise_position),
  constraint source_key_matches_position
    check (source_key = lesson_id || ':' || exercise_position),
  constraint content_matches_type check (content ->> 'type' = exercise_type)
);

comment on table public.exercises_pool is
  'Published curriculum exercises imported from content/lessons. Read-only for learners.';

create index exercises_pool_unit_idx
  on public.exercises_pool (unit_id, lesson_position, exercise_position)
  where is_active;
create index exercises_pool_concept_idx
  on public.exercises_pool (concept_tag)
  where is_active;

create trigger exercises_pool_updated_at
  before update on public.exercises_pool
  for each row execute function public.set_updated_at();

alter table public.exercises_pool enable row level security;

revoke all on public.exercises_pool from anon, authenticated;
grant select on public.exercises_pool to authenticated;

create policy "Learners read published exercises"
  on public.exercises_pool for select to authenticated
  using (is_active);
