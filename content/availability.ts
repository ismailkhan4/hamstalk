const AVAILABLE_LESSONS = new Set<string>([])

export function isLessonAvailable(lessonId: string) {
  return AVAILABLE_LESSONS.has(lessonId)
}
