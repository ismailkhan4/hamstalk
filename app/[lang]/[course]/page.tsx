import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { landingCopy } from "@/features/landing/copy"
import { LandingPage } from "@/features/landing/landing-page"
import {
  COURSE_SLUGS,
  COURSES,
  courseFromSlug,
  isLocale,
  landingPath,
  LOCALES,
} from "@/lib/i18n"

/**
 * The landing page for each course in each language, e.g. /it/english: the English course,
 * explained in Italian. Built ahead of time; any other pair is a 404.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    COURSES.map((course) => ({ lang, course: COURSE_SLUGS[course] }))
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[course]">): Promise<Metadata> {
  const { lang, course: slug } = await params
  const course = courseFromSlug(slug)
  if (!isLocale(lang) || !course) return {}
  const { meta } = landingCopy(lang, course)
  const path = landingPath(lang, course)
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((code) => [code, landingPath(code, course)])
        ),
        // `/` picks a language and a course for whoever arrives.
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Hamstalk",
      url: path,
      title: meta.title,
      description: meta.description,
      locale: meta.ogLocale,
      alternateLocale: LOCALES.filter((code) => code !== lang).map(
        (code) => landingCopy(code, course).meta.ogLocale
      ),
    },
  }
}

export default async function Page({ params }: PageProps<"/[lang]/[course]">) {
  const { lang, course: slug } = await params
  const course = courseFromSlug(slug)
  if (!isLocale(lang) || !course) notFound()
  return <LandingPage locale={lang} course={course} />
}
