/** PostHog endpoints derived from the configured ingestion host. */
export function posthogHosts() {
  const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (!configuredHost) return null

  try {
    const api = new URL(configuredHost)
    const assetsHostname = api.hostname.replace(
      ".i.posthog.com",
      "-assets.i.posthog.com"
    )
    const uiHostname = api.hostname.replace(".i.", ".")

    return {
      api: api.origin,
      assets: `${api.protocol}//${assetsHostname}`,
      ui: `${api.protocol}//${uiHostname}`,
    }
  } catch {
    return null
  }
}
