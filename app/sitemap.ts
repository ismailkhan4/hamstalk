import type { MetadataRoute } from "next"

import { COURSES, landingPath, LOCALES } from "@/lib/i18n"

/** The public pages search engines should know about: each course's landing page, in each language. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hamstalk.com"
  ).replace(/\/$/, "")
  return COURSES.flatMap((course) => {
    const languages = Object.fromEntries(
      LOCALES.map((code) => [code, `${base}${landingPath(code, course)}`])
    )
    return LOCALES.map((code) => ({
      url: `${base}${landingPath(code, course)}`,
      alternates: { languages },
    }))
  })
}
