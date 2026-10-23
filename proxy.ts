import { NextResponse, type NextRequest } from "next/server"

import {
  COURSE_COOKIE,
  courseFromSlug,
  isLocale,
  landingPath,
  LOCALE_COOKIE,
  preferredCourse,
  preferredLocale,
} from "@/lib/i18n"
import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [first = "", ...rest] = pathname.slice(1).split("/")

  // `/` and `/de` have no content of their own: they open the landing page for a course.
  if (pathname === "/") return redirectToLanding(request, null)
  if (isLocale(first) && rest.length === 0)
    return redirectToLanding(request, first)

  const response = await updateSession(request)
  if (isLocale(first) && rest.length === 1 && courseFromSlug(rest[0] ?? "")) {
    response.headers.set("Content-Language", first)
  }
  return response
}

function redirectToLanding(request: NextRequest, locale: string | null) {
  const lang = isLocale(locale)
    ? locale
    : preferredLocale(
        request.cookies.get(LOCALE_COOKIE)?.value,
        request.headers.get("accept-language")
      )
  const course = preferredCourse(
    request.cookies.get(COURSE_COOKIE)?.value,
    lang
  )
  const url = request.nextUrl.clone()
  url.pathname = landingPath(lang, course)
  // The query string survives, so campaign and referral parameters still reach analytics.
  const response = NextResponse.redirect(url)
  response.headers.set("Vary", "Cookie, Accept-Language")
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|ingest|icon.svg|sw.js|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
