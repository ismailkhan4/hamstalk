import type { Course } from "@/lib/i18n"

import { english } from "./english"
import { german } from "./german"
import { italian } from "./italian"
import type { Story } from "./types"

export * from "./types"

/** Every course the landing page tells a story for. */
export const stories: Record<Course, Story> = {
  de: german,
  en: english,
  it: italian,
}
