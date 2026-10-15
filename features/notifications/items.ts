import { isLessonAvailable } from "@/content/courses/de/availability"
import type { StartLevel } from "@/features/onboarding/options"
import { nextLesson, type LessonProgress } from "@/features/path/model"
import { getLesson } from "@/content/courses/de/lessons/registry"
import { standups } from "@/content/courses/de/standup"
import type { StreakState } from "@/features/streaks/model"
import { standupState } from "@/features/team/model"

export type Notification = {
  id: string
  kind: "streak" | "review" | "lesson" | "standup"
  title: string
  text: string
  href: string
  action: string
}

type Input = {
  dueWords: number
  startLevel: StartLevel | null
  progress: LessonProgress[]
  completedStandups: string[]
  /** Null when the habit tables don't exist yet. */
  streak?: StreakState | null
}

/**
 * What is waiting for the learner right now, worked out from their own progress each time. Nothing
 * here is stored, scheduled or sent; there are no unread flags because there is no inbox behind it.
 */
export function buildNotifications({
  dueWords,
  startLevel,
  progress,
  completedStandups,
  streak,
}: Input): Notification[] {
  const items: Notification[] = []

  // A streak that ends tonight comes first: everything else can wait a day.
  if (streak?.kind === "at-risk")
    items.push({
      id: "streak",
      kind: "streak",
      title: `Your ${streak.count} day streak ends at midnight`,
      text:
        streak.freezing > 0
          ? "Practise today and a streak freeze covers the day you missed."
          : "Earn 10 XP today to keep it: one lesson or a short review does it.",
      href: dueWords > 0 ? "/review" : "/path",
      action: "Keep my streak",
    })

  if (dueWords > 0)
    items.push({
      id: "review",
      kind: "review",
      title: `${dueWords} ${dueWords === 1 ? "word is" : "words are"} ready for review`,
      text: "A few minutes now keeps them fresh.",
      href: "/review",
      action: "Review now",
    })

  const next = nextLesson(startLevel, progress)
  if (next && isLessonAvailable(next.lesson.id)) {
    const title = getLesson(next.lesson.id)?.title ?? next.lesson.title
    items.push(
      next.resumeAt !== null
        ? {
            id: `resume:${next.lesson.id}`,
            kind: "lesson",
            title: `Pick up “${title}” where you left off`,
            text: `You stopped at exercise ${next.resumeAt + 1}. Your answers so far are saved.`,
            href: `/learn/${next.lesson.id}`,
            action: "Continue lesson",
          }
        : {
            id: `next:${next.lesson.id}`,
            kind: "lesson",
            title: `Next lesson: “${title}”`,
            text: next.lesson.goal,
            href: `/learn/${next.lesson.id}`,
            action: "Start lesson",
          }
    )
  }

  const ready = standups.find(
    (standup) =>
      standupState(standup.unitId, progress, completedStandups) === "ready"
  )
  if (ready)
    items.push({
      id: `standup:${ready.unitId}`,
      kind: "standup",
      title: "Your daily standup is ready",
      text: "Greet the team with the German you’ve learned.",
      href: "/team/standup",
      action: "Join standup",
    })

  return items
}
