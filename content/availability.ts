import { getLesson } from "./lessons/registry"

export function isLessonAvailable(lessonId: string) {
  return getLesson(lessonId) !== null
}
