import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import {
  DEFAULT_SIGNED_IN_PATH,
  isProtectedPath,
  isSignedOutOnlyPath,
} from "@/lib/auth/routes"
import { parsePublicEnv, readPublicEnvSource } from "@/lib/env"

/**
 * Refreshes the Supabase session cookie before any page renders and redirects for UX.
 * This is not the security boundary: pages re-check the user and the database enforces RLS.
 */
export async function updateSession(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  let response = NextResponse.next({ request })
  let signedIn = false

  let env: ReturnType<typeof parsePublicEnv> | null = null
  try {
    env = parsePublicEnv(readPublicEnvSource())
  } catch {
    env = null
  }

  if (env) {
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet, headers) {
            for (const { name, value } of cookiesToSet)
              request.cookies.set(name, value)
            response = NextResponse.next({ request })
            for (const { name, value, options } of cookiesToSet)
              response.cookies.set(name, value, options)
            for (const [key, value] of Object.entries(headers ?? {}))
              response.headers.set(key, value)
          },
        },
      }
    )
    const { data } = await supabase.auth.getClaims()
    signedIn = Boolean(data?.claims?.sub)
  }

  if (!signedIn && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    url.search = ""
    url.searchParams.set("next", `${pathname}${search}`)
    return redirectWithCookies(url, response)
  }

  if (signedIn && isSignedOutOnlyPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = DEFAULT_SIGNED_IN_PATH
    url.search = ""
    return redirectWithCookies(url, response)
  }

  return response
}

function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url)
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie)
  return redirect
}
