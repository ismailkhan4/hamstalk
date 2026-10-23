/**
 * The languages Hamstalk's public pages are written in. This is the interface language, the one a
 * visitor reads, not the language a course teaches. Only the landing page is translated so far:
 * it lives at /de, /en and /it, and `/` redirects to the visitor's language.
 */
export const LOCALES = ["de", "en", "it"] as const

export type Locale = (typeof LOCALES)[number]

/** English is what the app itself speaks, so it's the safe guess for anyone we can't place. */
export const DEFAULT_LOCALE: Locale = "en"

/** Remembers a language picked in the switcher. Read by the proxy when someone opens `/`. */
export const LOCALE_COOKIE = "hamstalk-locale"

/** Each language in its own words, so people can find theirs whatever the page is in. */
export const LOCALE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  it: "Italiano",
}

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

/**
 * The best supported language from an Accept-Language header such as `it-CH,it;q=0.9,en;q=0.8`,
 * or null when it names none of them. Regions are ignored: de-AT and de-CH both get German.
 */
export function negotiateLocale(
  acceptLanguage: string | null | undefined
): Locale | null {
  if (!acceptLanguage) return null
  const ranked = acceptLanguage
    .split(",")
    .map((entry, order) => {
      const [tag = "", ...params] = entry.trim().split(";")
      const q = params
        .map((param) => /^\s*q=([\d.]+)\s*$/.exec(param)?.[1])
        .find(Boolean)
      return {
        lang: (tag.split("-")[0] ?? "").toLowerCase(),
        q: q === undefined ? 1 : Number(q),
        order,
      }
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.order - b.order)
  for (const entry of ranked) if (isLocale(entry.lang)) return entry.lang
  return null
}

/**
 * The languages the landing page offers to teach, separate from the language it's written in:
 * /it/english is the English course, explained in Italian. The slugs are the page addresses.
 */
export const COURSES = ["de", "en", "it"] as const

export type Course = (typeof COURSES)[number]

export const COURSE_SLUGS: Record<Course, string> = {
  de: "german",
  en: "english",
  it: "italian",
}

/** Remembers a course picked on the landing page, so `/` opens it again. */
export const COURSE_COOKIE = "hamstalk-course"

export function isCourse(value: unknown): value is Course {
  return COURSES.includes(value as Course)
}

export function courseFromSlug(slug: string): Course | null {
  for (const course of COURSES) if (COURSE_SLUGS[course] === slug) return course
  return null
}

/** The landing page for a course, written in a language. */
export function landingPath(locale: Locale, course: Course) {
  return `/${locale}/${COURSE_SLUGS[course]}`
}

/**
 * The course to show: the one picked before, else a language other than the visitor's own.
 * German speakers see English; everyone else sees German.
 */
export function preferredCourse(
  cookie: string | null | undefined,
  locale: Locale
): Course {
  if (isCourse(cookie)) return cookie
  return locale === "de" ? "en" : "de"
}

/** Where `/` sends a visitor: the language they picked before, else their browser's, else English. */
export function preferredLocale(
  cookie: string | null | undefined,
  acceptLanguage: string | null | undefined
): Locale {
  if (isLocale(cookie)) return cookie
  return negotiateLocale(acceptLanguage) ?? DEFAULT_LOCALE
}
