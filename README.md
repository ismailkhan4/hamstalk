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
