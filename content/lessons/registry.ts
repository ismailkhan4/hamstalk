import type { Lesson } from "@/features/lessons/schema"

import { lesson1 } from "./a1-u1-l1"
import { lesson2 } from "./a1-u1-l2"
import { lesson3 } from "./a1-u1-l3"
import { lesson4 } from "./a1-u1-l4"
import { review } from "./a1-u1-review"
import { lesson1 as u2lesson1 } from "./a1-u2-l1"
import { lesson2 as u2lesson2 } from "./a1-u2-l2"
import { lesson3 as u2lesson3 } from "./a1-u2-l3"
import { lesson4 as u2lesson4 } from "./a1-u2-l4"
import { review as u2review } from "./a1-u2-review"

export const lessons: Lesson[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  review,
  u2lesson1,
  u2lesson2,
  u2lesson3,
  u2lesson4,
  u2review,
]

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null
}
