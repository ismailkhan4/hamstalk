import * as Sentry from "@sentry/nextjs"

import {
  SENTRY_TRACES_SAMPLE_RATE,
  sentryDataCollection,
} from "@/lib/observability/sentry"

/** Server and edge error reporting. Off until NEXT_PUBLIC_SENTRY_DSN is set. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializePostHogLogExporter } = await import(
      "@/lib/observability/posthog-logs"
    )
    initializePostHogLogExporter()
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    dataCollection: sentryDataCollection,
  })
}

export const onRequestError = Sentry.captureRequestError
