import "server-only"

import { headers } from "next/headers"

/** The origin used in links inside auth emails. Supabase only accepts redirect URLs on its allowlist. */
export async function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) {
    try {
      return new URL(configured).origin
    } catch {
      // Fall back to the request origin below.
    }
  }
  const requestHeaders = await headers()
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000"
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")
  return `${protocol}://${host}`
}
