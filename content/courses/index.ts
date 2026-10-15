import { german } from "./de/course"
import type { Course } from "./types"

export type { Course }

/** Every course, by id. Add a course here once its first lessons exist. */
export const COURSES: Readonly<Record<string, Course>> = { de: german }

/**
 * The course the app teaches. There is one for now; when there are more, this becomes the
 * learner's choice, stored with their preferences.
 */
export const ACTIVE_COURSE: Course = german

/** The `lang` attribute for target-language text in the active course. */
export const TARGET_LANG = ACTIVE_COURSE.lang

/**
 * The course a lesson or unit belongs to. Course ids are two letters and lesson ids start with a
 * level (`a1-…`), so a prefix like `it-` can never be mistaken for part of a German id.
 */
export function courseOf(id: string): Course {
  const prefix = /^([a-z]{2})-/.exec(id)?.[1]
  return (prefix && COURSES[prefix]) || german
}
