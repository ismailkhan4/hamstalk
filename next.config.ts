import { withSentryConfig } from "@sentry/nextjs/config"
import type { NextConfig } from "next"

import { posthogHosts } from "./lib/analytics/hosts"

function supabaseOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin
  } catch {
    return null
  }
}

/** Where Sentry sends events: the DSN's host, e.g. https://o1.ingest.de.sentry.io. */
function sentryOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SENTRY_DSN ?? "").origin
  } catch {
    return null
  }
}

function contentSecurityPolicy() {
  const connect = [supabaseOrigin(), sentryOrigin()].filter(Boolean)
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // PostHog needs no entry: it's proxied through /ingest on our own origin.
    ["connect-src 'self'", ...connect].join(" "),
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ")
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PostHog's API paths end in a slash; redirecting them would break the /ingest proxy.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    const posthog = posthogHosts()
    if (!posthog) return []

    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthog.assets}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${posthog.assets}/array/:path*`,
      },
      { source: "/ingest/:path*", destination: `${posthog.api}/:path*` },
    ]
  },
  turbopack: {
    root: import.meta.dirname,
  },
  async headers() {
    const production = process.env.NODE_ENV === "production"
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(production
            ? [
                {
                  key: "Content-Security-Policy",
                  value: contentSecurityPolicy(),
                },
              ]
            : []),
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Content-Type", value: "text/javascript; charset=utf-8" },
        ],
      },
    ]
  },
}

// Uploads source maps on production builds so stack traces show the original code, then deletes
// them so they never ship. Skipped silently when SENTRY_AUTH_TOKEN is unset. The release name comes
// from the Vercel commit SHA.
export default withSentryConfig(nextConfig, {
  org: "heyismail",
  project: "klarlingo",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  silent: !process.env.CI,
})
