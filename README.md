# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Curriculum in the database

Exercises from the registered lessons are imported into `public.exercises_pool`. See
[docs/exercise-pool.md](docs/exercise-pool.md) for the schema, the import commands
(`bun run curriculum:check`, `curriculum:ingest`, `curriculum:verify`) and the credentials they
need.

## Analytics and error reporting

Copy `.env.example` to `.env.local`. PostHog (`NEXT_PUBLIC_POSTHOG_KEY`) and Sentry
(`NEXT_PUBLIC_SENTRY_DSN`) are optional: with no key, nothing is sent.

- **Events** are typed in `lib/analytics/events.ts`. Send them with `track()` from
  `lib/analytics/client.ts` in the browser, or `trackServer()` from `lib/analytics/server.ts` for
  anything only the server can vouch for (such as XP awarded). Properties hold ids and counts, never
  what a learner typed.
- **PostHog** is proxied through `/ingest` on our own origin (`next.config.ts`), so the CSP needs no
  extra host and ad blockers don't drop events. Session recording is off.
- **Sentry** collects no cookies, headers, query strings or request bodies
  (`lib/observability/sentry.ts`): Supabase session cookies and learners' answers never leave.

## Database types

`lib/supabase/database.types.ts` is maintained by hand. Update it whenever a migration changes a
table, column or nullability.

## Design language

Klarlingo is meant to feel like a game you want to come back to: bright, rounded and quick to
celebrate. The pieces live in `features/celebrations/`:

- **Hamsti** (`mascot.tsx`): the hamster mascot. In German, _hamstern_ means to stockpile, and
  Hamsti stockpiles the words you learn. An animated SVG with eight moods (`idle`, `happy`, `sad`,
  `thinking`, `cheer`, `dance`, `sleepy`, `onFire`). Screens only use `<Mascot mood="…" />`, so a
  Rive file can replace the drawing later. The name lives in `mascot-name.ts`, because server
  components can't read plain values exported from a client module.
- **Sound and vibration** (`feedback.ts`): `playFeedback("correct" | "incorrect" | "combo" | …)`.
  Sounds are synthesised with the Web Audio API; there are no audio files. Learners switch each
  off in Settings.
- **Combos** (`combo.ts`, `combo-toast.tsx`): answers right first time in a row. The progress bar
  glows from 3, and 3, 5, 7 and every fifth after 10 get a callout.
- **Confetti and count-ups** (`confetti.ts`, `count-up.tsx`).

Reduced motion (the device setting or Klarlingo's own) keeps the sound, colour and words but drops
movement and confetti. Tokens are in `app/globals.css`; every text colour there is chosen to meet
WCAG AA contrast (4.5:1) in both themes.

In development, `/dev/lesson?id=a1-u1-l2` runs any lesson without an account (`&screen=complete`,
plus `&perfect=1`, shows the end screen) and `/dev/mascot` shows every mood. Both are off in
production.

## XP, daily goals and streaks

Apply `supabase/migrations/habit_loop.sql` after the other migrations. It adds three tables
(`xp_events`, `daily_activity`, `streaks`) that learners can read but never write, and one function,
`award_xp()`, that does all the writing. The browser holds the learner's token and could call the
API directly, so the database, not the app, decides how much XP anything is worth:

| Activity             | XP                                                                                                | How often               |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------- |
| A lesson, first time | its authored XP (30, or 40 for a review lesson), +10 if every answer was right first time, max 60 | once                    |
| A lesson again       | 10                                                                                                | once per lesson per day |
| A review card        | 2                                                                                                 | once per word per day   |
| A team standup       | 20                                                                                                | once per unit           |

- **Days** are counted in the learner's own time zone (`learner_preferences.timezone`).
- **Daily goal:** the learner picks minutes; the goal is minutes × 3 XP (10 min = 30 XP).
- **Streak:** a day with at least 10 XP extends it. Missed days are settled at the next practice:
  each one uses a streak freeze if there is one, otherwise the streak starts again at 1. Learners
  start with one freeze, hold at most two, and earn one every seven days.
- Lessons must be in `exercises_pool` to earn XP (run `bun run curriculum:ingest`). If XP can't be
  recorded, the lesson still saves and the learner just doesn't see a reward.
- Resetting progress in Settings keeps XP and the streak.

`features/streaks/model.ts` mirrors the streak rules in TypeScript, to show the current state
between visits without writing anything. Keep the two in step. In development, `/dev/habit` shows
every streak state, and `/dev/lesson?screen=complete&streak=7&earned=1&goal=1` shows the
celebration.

## Hamsti's stash: nuts, the Akku, quests and pins

Apply `supabase/migrations/economy.sql` after `habit_loop.sql`. Like the habit loop, learners can
read their rows and never write them. Four functions do all the writing and decide every amount:

- **`earn()`** replaces calling `award_xp()` directly (`features/rewards/award.ts` falls back to
  `award_xp()` until the migration is applied). It awards the XP, then pays hazelnuts for the day's
  goal (5), streak milestones (10–200), finished quests and new pins, and applies a double-XP boost.
- **`use_akku()`**: the Akku has five bars. A lesson takes one for each answer that is still wrong
  after the hint, so a first wrong try only costs the hint. One bar refills every four hours, and
  every five words reviewed in a day charge one back. Reviews and standups never use it. At zero,
  the lesson stops with its place saved, and the learner can recharge, practise, wait or leave.
- **`buy()`**: the shop (Vorrat, at `/shop`) sells a full recharge (300), a streak freeze (150,
  hold at most two) and 15 minutes of double XP (80). New learners start with 100 nuts.
- **`my_economy()`** returns the balance, the Akku, today's plan and the pins.

**Today's plan (Tagesplan)** on Home has three quests, picked from the learner and the date: an XP
target, a lessons quest, and either reviewing words or reaching the daily goal. They pay out the
moment they're done. **Pins** on Hamsti's lanyard (on Progress) have up to five tiers each, for the
streak, lessons, XP, reviewed words, standups and quests, and pay 25 nuts per tier.

`features/economy/model.ts` mirrors the prices, quest wording and pin tiers for display. Keep it in
step with the SQL. In development, `/dev/shop?stash=fresh|busy|low|empty` shows the shop, the plan
and the lanyard, `/dev/home?stash=low` shows Home with them, `/dev/lesson?akku=1` starts a lesson
on its last bar (`akku=0` shows the empty screen), and `/dev/lesson?screen=complete&stash=1` shows
the end of a lesson with nuts, quests and a pin.

## Reminders: push, email and the streak saver

Apply `supabase/migrations/reminders.sql` after `leagues.sql`. Two kinds of reminder, each sent
at most once a day per learner, in their own time zone, and only if they haven't practised yet:

- **Daily:** at the learner's reminder time (Settings, or the prompt after their first lesson),
  for up to two hours after it.
- **Streak saver:** from 21:00 when the streak would end at midnight. If both are due at once,
  only the streak saver goes out.

Wordings live in `features/reminders/templates.ts`. The endpoint picks one with an epsilon-greedy
bandit: 80% of the time the wording with the best rate of practice within two hours of sending,
20% a random one. Every reminder links through `/r/<id>`, which records the open.

**Setting it up**

1. Generate push keys with `bunx web-push generate-vapid-keys`. Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY`,
   `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT`, plus `SUPABASE_SECRET_KEY` (Project settings → API
   keys) and a long random `CRON_SECRET`, in `.env.local` and in Vercel. Redeploy.
2. In Supabase, enable the `pg_cron` and `pg_net` extensions (Database → Extensions).
3. In the SQL editor, store the secret and schedule the job. Use your production URL:

   ```sql
   select vault.create_secret('<CRON_SECRET>', 'klarlingo_cron_secret');

   select cron.schedule(
     'klarlingo-reminders',
     '*/15 * * * *',
     $$
     select net.http_post(
       url := 'https://klarlingo-v1.vercel.app/api/cron/reminders',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'Authorization', 'Bearer ' || (
           select decrypted_secret from vault.decrypted_secrets
            where name = 'klarlingo_cron_secret'
         )
       ),
       body := '{}'::jsonb
     );
     $$
   );
   ```

   Check runs with `select * from cron.job_run_details order by start_time desc limit 5;` and
   replies with `select * from net._http_response order by created desc limit 5;`.

4. **Email** (optional): set `RESEND_API_KEY` and `REMINDER_FROM_EMAIL` on a domain verified in
   Resend. Until both are set, the email switch in Settings stays off.

Push needs HTTPS (or localhost). On iPhone and iPad it works only once Klarlingo is added to the
Home Screen. In development, `/dev/settings` shows the reminder controls.

## The Liga: weekly leagues and profiles

Apply `supabase/migrations/leagues.sql` after `economy.sql`. Leagues look like a football table:
ten divisions from Kreisklasse up to the Bundesliga (the names come from the course config), and a
season every week, Monday 00:00 to Monday 00:00 UTC. XP earned that week are the points.

- **Joining:** a learner joins a table in their division the first time they open Home or
  `/league` with XP that week. Tables hold up to 20 learners and fill the fullest open table first.
- **Pacers:** while a table has fewer than 10 learners, the course's team characters (`pacers` in
  `content/courses/<id>/course.ts`, ids matching `league_table()` in the SQL) fill the empty places
  and earn XP at a steady pace that grows with the division. They are always labelled as team
  characters.
- **Promotion and relegation:** top 3 move up and bottom 3 move down (2 and 2 in tables under 10,
  fewer under 6). The top division has no promotion and the bottom none relegation.
- **No scheduled job:** a finished week is settled for each learner on their next visit, from the
  final standings, which can't change after the whistle. The result shows once on `/league`.
- **Profiles** live at `/u/<handle>` (`/profile` goes to your own). The display name defaults to a
  first name and an initial, and the handle can't be guessed from the email. Learners can rename
  themselves and hide the page; league tables then show the name without a link. Other learners'
  data is only ever read through `my_league()` and `public_profile()`, which return names, handles
  and public stats.

In development, `/dev/league?state=mid|top|bottom|full|new|promoted|relegated|stayed`,
`/dev/profile?me=1` and `/dev/home?league=top` show these screens with sample data.

## The learning path

The path is drawn as a U-Bahn line map (`features/path/`). Each level is a line (A1 is U1, A2 is U2,
and so on), each lesson is a station, a unit review is an interchange, the team standup is the last
stop of every unit, and the level checkpoint is the terminus (Endstation). The track is solid behind
the learner and faded ahead. Hamsti marks the current station ("Du bist hier"), and units with no
lessons built yet are drawn as a Baustelle.

- `transit.ts` turns progress into the line. It is pure, so the map and Home use the same answer.
- `components/transit-line.tsx` draws the full map at `/path?level=a1`. Each unit is an anchor, so
  links go to `/path?level=a1#a1-u2`.
- `components/line-strip.tsx` is Home's piece of the map: the current unit, left to right.
- `/path/guide/<unitId>` is the unit guide: goals, words, the grammar, every lesson's rule table, and
  the standup line.
- Line colours are the `--line-a1` to `--line-b2` tokens in `app/globals.css`.

In development, `/dev/path?stage=unit2` (`new`, `unit2` or `done`, plus `&level=a2`), `/dev/home`
and `/dev/path/guide/a1-u1` show these screens with sample progress.

## Courses

Klarlingo teaches German first, and is built so other languages can follow.

- **A course** lives in `content/courses/<id>/`: its config (`course.ts`), curriculum, lessons and
  team stories. `content/courses/index.ts` lists courses and sets `ACTIVE_COURSE`, the one the app
  teaches (German, `de`, for now).
- **The config** holds everything the shared screens say in the target language: right-answer
  titles, combo and streak cheers, "lesson done" titles, the home greeting, the `lang` tag, the
  speech locale and the story world. Screens read them from `ACTIVE_COURSE` and mark target-language
  text with `TARGET_LANG` (`TargetText` does this for you). The interface itself stays in English.
- **Content fields are course-neutral:** `target` is the language being learned and `native` is the
  learner's language (English). Database columns keep their original names (`de`, `en`,
  `example_de`); the data loaders translate at that boundary.
- **Ids are globally unique.** Every new course prefixes its lesson and unit ids with its code
  (`it-a1-u1-l1`); German keeps its original ids (`a1-u1-l1`). `courseOf(id)` tells them apart, so
  no table needs a course column.
- Not built yet, on purpose: choosing a course, a course switcher, and translating the interface.
  They come with the second course.
