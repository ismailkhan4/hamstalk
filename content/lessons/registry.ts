import type { Lesson } from "@/features/lessons/schema"

import { lesson1 } from "./a1-u1-l1"
import { lesson2 } from "./a1-u1-l2"
import { lesson3 } from "./a1-u1-l3"
import { lesson4 } from "./a1-u1-l4"
import { review } from "./a1-u1-review"

export const lessons: Lesson[] = [lesson1, lesson2, lesson3, lesson4, review]

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null
}
