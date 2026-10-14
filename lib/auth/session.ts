import "server-only"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export type SessionUser = { id: string; email: string; fullName: string }

/**
 * Server-side identity check for protected pages. getClaims verifies the JWT, unlike getSession,
 * so the result can be trusted for rendering decisions. Data access is still guarded by RLS.
 */
export async function requireUser(nextPath: string): Promise<SessionUser> {
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    redirect(`/signin?next=${encodeURIComponent(nextPath)}`)
  }
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) redirect(`/signin?next=${encodeURIComponent(nextPath)}`)

  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>
  const fullName =
    typeof metadata.full_name === "string" ? metadata.full_name.trim() : ""
  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    fullName,
  }
}

export function firstName(user: SessionUser) {
  return user.fullName.split(/\s+/)[0] || user.email.split("@")[0] || "there"
}
