import "server-only"

import { after } from "next/server"
import { PostHog } from "posthog-node"

import type { AnalyticsEvent, AnalyticsEvents } from "./events"
import {
  flushPostHogLogs,
  logServerActionCompleted,
} from "../observability/posthog-logs"
import { posthogHosts } from "./hosts"

let client: PostHog | null = null

function posthog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const hosts = posthogHosts()
  if (!key || !hosts) return null
  client ??= new PostHog(key, {
    host: hosts.api,
    flushAt: 1,
    flushInterval: 0,
  })
  return client
}

/**
 * Sends an event that only the server can vouch for, such as XP awarded. It's sent after the
 * response, so analytics never slows down or breaks the action that triggered it.
 */
export function trackServer<E extends AnalyticsEvent>(
  userId: string,
  event: E,
  properties: AnalyticsEvents[E]
) {
  logServerActionCompleted(event)
  after(() => flushPostHogLogs().catch(() => {}))

  const ph = posthog()
  if (!ph) return
  after(() =>
    ph
      .captureImmediate({ distinctId: userId, event, properties })
      .catch(() => {})
  )
}
