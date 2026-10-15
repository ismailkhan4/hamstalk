import type { init } from "@sentry/nextjs"

type DataCollection = NonNullable<Parameters<typeof init>[0]["dataCollection"]>

/**
 * Sentry v11 collects cookies, headers, query strings and request bodies by default. Here those
 * would be Supabase session cookies and the German learners type into server actions, so collect
 * none of it: an error report carries the stack trace, the route and the release, nothing else.
 */
export const sentryDataCollection: DataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
}

export const SENTRY_TRACES_SAMPLE_RATE = 0.1
