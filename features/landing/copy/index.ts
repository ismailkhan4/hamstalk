import type { Course, Locale } from "@/lib/i18n"

import { stories } from "../stories"
import { de } from "./de"
import { en } from "./en"
import { it } from "./it"
import type { CopyFor, LandingCopy } from "./types"

export type { LandingCopy }

const copyFor: Record<Locale, CopyFor> = { de, en, it }

/** The landing page's words for a course, in a language. */
export function landingCopy(locale: Locale, course: Course): LandingCopy {
  return copyFor[locale](stories[course])
}
