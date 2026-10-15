import posthog from "posthog-js"

import type { AnalyticsEvent, AnalyticsEvents } from "./events"
import { posthogHosts } from "./hosts"

/** The PostHog project key. */
export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

/** Requests go through our own origin (see the /ingest rewrite in next.config.ts). */
export const POSTHOG_PROXY_PATH = "/ingest"

export function initAnalytics() {
  if (!posthogKey) {
    if (process.env.NODE_ENV === "development")
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured"
      )
    return
  }

  const hosts = posthogHosts()
  if (!hosts) {
    if (process.env.NODE_ENV === "development")
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
      )
    return
  }

  posthog.init(posthogKey, {
    api_host: POSTHOG_PROXY_PATH,
    ui_host: hosts.ui,
    defaults: "2026-08-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    person_profiles: "identified_only",
    respect_dnt: true,
  })
}

export function track<E extends AnalyticsEvent>(
  event: E,
  properties: AnalyticsEvents[E]
) {
  if (!posthogKey) return
  posthog.capture(event, properties)
}

/** Ties this browser's events to the signed-in learner with the Supabase user id. */
export function identify(
  userId: string,
  personProperties: Record<string, string>
) {
  if (!posthogKey || posthog.get_distinct_id() === userId) return
  posthog.identify(userId, personProperties)
}

export function resetAnalytics() {
  if (!posthogKey) return
  posthog.reset()
}
