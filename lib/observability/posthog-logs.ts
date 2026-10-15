import "server-only"

import { SeverityNumber } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

import { posthogHosts } from "@/lib/analytics/hosts"

const LOGGER_NAME = "klarlingo.posthog"

let loggerProvider: LoggerProvider | null = null

/**
 * Configures a provider used only by the purpose-written PostHog action logs below. It is not
 * registered globally, so existing application, framework, and Sentry loggers remain untouched.
 */
export function initializePostHogLogExporter() {
  if (loggerProvider) return loggerProvider

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured"
      )
    }
    return null
  }

  const hosts = posthogHosts()
  if (!hosts) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
      )
    }
    return null
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "klarlingo" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${hosts.api}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  })

  return loggerProvider
}

/** Emits one safe, structured success record for a completed server-side product action. */
export function logServerActionCompleted(action: string) {
  const provider = initializePostHogLogExporter()
  if (!provider) return

  provider.getLogger(LOGGER_NAME).emit({
    body: "server_action_completed",
    severityNumber: SeverityNumber.INFO,
    attributes: { action, outcome: "succeeded" },
  })
}

/** Flushes only the dedicated PostHog logger before a short-lived action finishes. */
export function flushPostHogLogs() {
  return loggerProvider?.forceFlush() ?? Promise.resolve()
}
