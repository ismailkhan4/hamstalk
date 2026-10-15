create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Stable per source: 'word:<lesson>:<word>' for lesson vocabulary, 'phrase:<phrase_key>' for saved phrases.
  item_key text not null check (char_length(item_key) between 1 and 120),
  source text not null check (source in ('lesson', 'saved')),
  lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{3,64}$'),
  article text check (article in ('der', 'die', 'das')),
  word text not null check (char_length(word) between 1 and 200),
  en text not null check (char_length(en) between 1 and 200),
  example_de text check (char_length(example_de) <= 300),
  example_en text check (char_length(example_en) <= 300),
  -- Memory strength shown as one to three bars.
  strength smallint not null default 1 check (strength between 1 and 3),
  due_at timestamptz not null,
  last_reviewed_at timestamptz,
  review_count integer not null default 0 check (review_count >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, item_key)
);

create index review_items_due_idx on public.review_items (user_id, due_at);

alter table public.review_items enable row level security;

revoke all on public.review_items from anon, authenticated;
grant select, insert, update, delete on public.review_items to authenticated;

create policy "Learners read their own review items"
  on public.review_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners add their own review items"
  on public.review_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners update their own review items"
  on public.review_items for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners remove their own review items"
  on public.review_items for delete to authenticated using ((select auth.uid()) = user_id);
