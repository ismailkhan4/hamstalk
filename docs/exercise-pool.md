# Exercise pool

`public.exercises_pool` holds a published copy of every exercise in the registered lessons, and
**the lesson runner reads its exercises from it**. Any lesson the pool can't serve runs from
`content/lessons` instead, so a missing import never blocks a learner.

```
content/lessons/*.ts ─▶ validate (features/lessons/pool) ─▶ SQL transaction ─▶ exercises_pool ─▶ loader ─▶ lesson runner
```

## Source of truth

During the migration the typed lessons in `content/lessons/`, listed in
`content/lessons/registry.ts`, are the only place exercises are written. The table is derived from
them and is never edited by hand. Lessons on the curriculum map (`content/curriculum.ts`) that
aren't in the registry are planned, not built, and are never imported.

## Schema

| Column              | Type               | Holds                                                                                    |
| ------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `id`                | `uuid`             | Primary key, generated                                                                   |
| `source_key`        | `text`, unique     | `<lesson_id>:<exercise_position>`, the same key `mistakes.item_key` uses for an exercise |
| `unit_id`           | `text`             | The unit on the curriculum map, e.g. `a1-u1`                                             |
| `lesson_id`         | `text`             | The lesson id, e.g. `a1-u1-l1`                                                           |
| `lesson_position`   | `smallint`         | The lesson's place in its unit (0 is the first lesson)                                   |
| `exercise_position` | `smallint`         | The exercise's place in its lesson                                                       |
| `exercise_type`     | `text`             | `discover`, `tip`, `choice`, `match`, `build`, `translate` or `conversation`             |
| `concept_tag`       | `text`             | `topic:<slug>` from the exercise's `topic`, otherwise `lesson:<lesson_id>`               |
| `base_difficulty`   | `double precision` | Default `1000.0`. Not authored, so re-imports never change it                            |
| `content`           | `jsonb`            | The complete exercise exactly as `exerciseSchema` validates it                           |
| `is_active`         | `boolean`          | Published. Learners only see published rows                                              |
| `created_at`        | `timestamptz`      |                                                                                          |
| `updated_at`        | `timestamptz`      | Set by `public.set_updated_at()` on every real change                                    |

**Constraints:** `source_key` must equal `lesson_id || ':' || exercise_position`; `(lesson_id,
exercise_position)` is unique; `content` must be an object whose `type` equals `exercise_type`;
`base_difficulty` must be positive and finite; ids and tags follow the same patterns as the other
tables. There are no foreign keys: lessons and units live in code, not in tables.

**Indexes:** the unique `(lesson_id, exercise_position)` index serves lesson lookups in order;
partial indexes on published rows serve `(unit_id, lesson_position, exercise_position)` and
`concept_tag`.

**Concept tags.** Most graded exercises have an authored `topic` ("Greetings", "du or Sie"),
which becomes `topic:greetings`, `topic:du-or-sie`. Discover and tip exercises, and any exercise
without a topic, get `lesson:<lesson_id>`: it records where the exercise came from and claims
nothing more about what it teaches.

**Positions are identity.** Keys are positional, like the mistakes notebook's item keys, so the
two stay aligned. Inserting an exercise in the middle of a lesson moves the later exercises to new
keys: their rows are updated in place, exactly as the notebook's keys already shift.

## Access rules

- Row-level security is on. Signed-in learners (`authenticated`) may `select` published rows
  (`is_active`) and nothing else. Signed-out visitors (`anon`) have no privileges.
- Nobody writes through the API. The import runs as the project's `postgres` role, through `psql`
  or the SQL editor, which owns the table. The app still has no service-role key.

## Applying the migration

The migrations in `supabase/migrations/` have no timestamp prefix, so `supabase db push` does not
pick them up. Apply them in this order, which is the order they depend on each other (not name
order); on an existing project only the last one is new:

1. `onboarding_and_placement.sql`
2. `lesson_progress.sql`
3. `review_items.sql`
4. `standup_completions.sql`
5. `account_controls.sql`
6. `exercises_pool.sql`
7. `learner_timezone.sql` (adds `learner_preferences.timezone`; unrelated to the pool)

The migration only creates the new table, its indexes, trigger and policy. It does not touch any
existing table. Apply it either way:

- **SQL editor:** paste `supabase/migrations/exercises_pool.sql` and run it.
- **psql:** `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -1 -f supabase/migrations/exercises_pool.sql`

Then refresh `lib/supabase/database.types.ts` if you generate it from the project
(`supabase gen types typescript --project-id <ref>`); the committed file already includes the table.

## Credentials

`curriculum:ingest` and `curriculum:verify` need `SUPABASE_DB_URL`: the **Session pooler** or
direct connection string from the project's **Connect** dialog, with the database password. This is
a superuser credential.

- Never add it to `.env` or `.env.local`: Next.js loads those into the app's server.
- Never commit it, and never prefix it with `NEXT_PUBLIC_`.
- Type it into the current shell only, so it isn't saved in your history:

  ```bash
  read -rs SUPABASE_DB_URL && export SUPABASE_DB_URL
  ```

- Or keep it in a separate, git-ignored file (`.env*` is ignored) and pass it explicitly:
  `bun --env-file=.env.ingest scripts/ingest-curriculum.ts ingest`.

The script passes the URL to `psql` through `PG*` environment variables, never as an argument, and
never prints it. The generated SQL contains curriculum only. `psql` must be installed.

## Importing

```bash
bun run curriculum:check              # validate every lesson; no database needed
bun run curriculum:sql --out /tmp/pool.sql # one SQL transaction, for the SQL editor
bun run curriculum:ingest             # apply it with psql (needs SUPABASE_DB_URL)
bun run curriculum:verify             # compare the database with the source (needs SUPABASE_DB_URL)
```

Every command prints lessons discovered, exercises validated, exercise types, planned lessons
skipped and errors. Any invalid exercise is listed with its lesson and index, and nothing is
written. `ingest` then prints rows inserted, updated, unchanged and unpublished.

The import is one transaction. It:

- inserts new exercises and publishes them
- updates changed exercises in place and publishes them again
- leaves unchanged rows untouched, so `updated_at` only moves when content changes
- unpublishes (never deletes) published rows of an imported lesson that the source no longer has.
  "Not imported yet" is a missing row; "removed from the source" is an unpublished one
- leaves rows of lessons outside the import alone and reports how many there are
- never changes `base_difficulty` or any learner table

Re-importing the same curriculum reports every row as unchanged. Run `ingest` again after editing
a lesson. If you use the SQL editor instead, paste the output of `curriculum:sql` and read the
counts from the result row.

## Verifying parity

`bun run curriculum:verify` reads every row back and checks, for each registered exercise, that a
published row exists, passes the schema and equals the source exactly (all columns and the whole
`content`). It also lists published rows the source no longer has. It exits with an error on any
difference.

After applying the migration to a real project, run `curriculum:ingest` twice (the second run must
report only unchanged rows), then `curriculum:verify`, then sign in as a learner and confirm a
`select` on `exercises_pool` returns only published rows and an `insert` fails.

## Loader

`features/lessons/pool/data.ts` (server only) reads through the learner's own Supabase session:

- `loadLessonExercises(supabase, lessonId)`: a lesson's published exercises in authored order
- `loadUnitExercises(supabase, unitId)`: a unit's lessons in path order, with their exercises
- `loadPoolLesson(supabase, lesson)`: the typed lesson with its exercises from the database

Each returns `{ ok: true, data }` or `{ ok: false, reason, message }`, where `reason` is
`not-set-up` (no table), `database` (query failed), `not-found` (nothing published) or
`invalid-content` (rows fail the schema, or a lesson has gaps). Every row is validated against
`exerciseSchema` before it is returned.

## How the app reads it

`features/lessons/source.ts` `loadRunnableLesson()` is the one place lessons are loaded for
learning. The lesson page and every lesson server action (save progress, complete, record a
mistake, save a phrase) call it, so the exercises a learner sees are always the ones their answers
are checked against.

- Lesson metadata (title, XP, vocabulary, mission) still comes from the typed lesson; only the
  exercises come from the pool.
- If the pool can't serve a lesson, the typed lesson runs instead. `not-found` (not imported yet)
  falls back silently; `not-set-up`, `database` and `invalid-content` fall back and send a warning to
  Sentry, tagged with the lesson and the reason.
- The `lesson_completed` analytics event records which source actually served the lesson.
- Other screens (mistakes, phrasebook, search, activity) still read titles and text from
  `content/lessons`. They move when the session generator does.

## Rolling back

Set `LESSON_SOURCE=registry` and redeploy: the app then reads only `content/lessons` and never
queries the table. It needs no database change. To withdraw content without deploying,
unpublish it (`update public.exercises_pool set is_active = false where lesson_id = '…'`); to remove
the table entirely, `drop table public.exercises_pool;` touches no learner data.
