import * as Sentry from "@sentry/nextjs"

import { initAnalytics } from "@/lib/analytics/client"
import {
  SENTRY_TRACES_SAMPLE_RATE,
  sentryDataCollection,
} from "@/lib/observability/sentry"

// Sentry stays off until its key is set.
try {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN)
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      dataCollection: sentryDataCollection,
    })
} catch {}

initAnalytics()

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
