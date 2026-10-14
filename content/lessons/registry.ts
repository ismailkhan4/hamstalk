import type { Lesson } from "@/features/lessons/schema"

export const lessons: Lesson[] = []

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId) ?? null
}
