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
