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
import { Button } from "@/components/ui/button";
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

- **Quietschi** (`mascot.tsx`): the rubber-duck mascot, an animated SVG with eight moods (`idle`,
  `happy`, `sad`, `thinking`, `cheer`, `dance`, `sleepy`, `onFire`). Screens only use
  `<Mascot mood="…" />`, so a Rive file can replace the drawing later.
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
