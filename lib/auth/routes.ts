export const DEFAULT_SIGNED_IN_PATH = "/home"

const PROTECTED_PREFIXES = [
  "/home",
  "/onboarding",
  "/placement",
  "/path",
  "/learn",
  "/review",
  "/practice",
  "/phrasebook",
  "/mistakes",
  "/team",
  "/progress",
  "/settings",
  "/search",
  "/notifications",
  "/activity",
  "/reset-password",
] as const

const SIGNED_OUT_ONLY = ["/signin", "/signup", "/forgot-password"] as const

function matches(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => matches(pathname, prefix))
}

export function isSignedOutOnlyPath(pathname: string) {
  return SIGNED_OUT_ONLY.some((prefix) => matches(pathname, prefix))
}

/**
 * Only same-site paths inside the app are allowed as a post-sign-in destination, so a crafted
 * `next` parameter cannot send a learner to another site (open redirect).
 */
export function safeNextPath(
  next: string | null | undefined,
  fallback: string = DEFAULT_SIGNED_IN_PATH
) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\")
  )
    return fallback
  let url: URL
  try {
    url = new URL(next, "https://klarlingo.invalid")
  } catch {
    return fallback
  }
  if (
    url.origin !== "https://klarlingo.invalid" ||
    !isProtectedPath(url.pathname)
  )
    return fallback
  return `${url.pathname}${url.search}`
}
