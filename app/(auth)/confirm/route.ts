import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import { safeNextPath } from "@/lib/auth/routes"
import { createClient } from "@/lib/supabase/server"

const OTP_TYPES: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]

/**
 * Landing point for links in auth emails. Supports the token-hash links recommended for
 * server-side apps and the PKCE `code` links Supabase sends by default.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const rawType = searchParams.get("type")
  const code = searchParams.get("code")
  const type = OTP_TYPES.find((value) => value === rawType)
  const isRecovery =
    type === "recovery" || searchParams.get("next") === "/reset-password"
  const next = isRecovery
    ? "/reset-password"
    : safeNextPath(searchParams.get("next"))

  const failure = new URL(
    isRecovery ? "/forgot-password?expired=1" : "/verify-email?expired=1",
    request.url
  )

  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return NextResponse.redirect(
      new URL("/signin?notice=link-invalid", request.url)
    )
  }

  let ok = false
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    })
    ok = !error
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    ok = !error
  }

  return NextResponse.redirect(ok ? new URL(next, request.url) : failure)
}
