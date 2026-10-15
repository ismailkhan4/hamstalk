"use client"

import { getUnit } from "@/content/curriculum"
import type { LessonProgress } from "@/features/path/model"

import {
  sampleActivity,
  sampleCards,
  samplePhrases,
  sampleShell,
} from "./notes-preview"
import { buildNotifications } from "./notifications/items"
import { NotificationsView } from "./notifications/notifications-view"
import { PracticeView } from "./practice/practice-view"
import { ProgressView } from "./progress/progress-view"
import { cleanQuery, searchAll } from "./search/search"
import { SearchView } from "./search/search-view"

export type ScreensView =
  | "practice"
  | "practice-empty"
  | "search"
  | "search-results"
  | "search-none"
  | "notifications"
  | "notifications-empty"
  | "progress"
  | "progress-new"

const unitDone: LessonProgress[] = (getUnit("a1-u1")?.lessons ?? []).map(
  (lesson) => ({ lessonId: lesson.id, status: "completed", step: 0, xp: 30 })
)

const identity = { name: sampleShell.name, email: sampleShell.email }
const now = Date.now()
const day = 86_400_000

export function ScreensPreview({ view }: { view: ScreensView }) {
  const counts = sampleShell.counts
  const empty = { phrases: 0, mistakes: 0, due: 0 }

  switch (view) {
    case "practice":
      return (
        <PracticeView
          {...identity}
          counts={counts}
          overview={{
            due: sampleCards,
            needsPractice: 1,
            total: 9,
            nextDue: null,
          }}
          progress={unitDone}
        />
      )
    case "practice-empty":
      return (
        <PracticeView
          {...identity}
          counts={empty}
          overview={{ due: [], needsPractice: 0, total: 0, nextDue: null }}
          progress={[]}
        />
      )
    case "search":
    case "search-results":
    case "search-none": {
      const query = cleanQuery(
        view === "search"
          ? ""
          : view === "search-none"
            ? "Kündigungsfrist"
            : "Hallo"
      )
      return (
        <SearchView
          {...identity}
          counts={counts}
          query={query}
          results={searchAll(query, samplePhrases)}
        />
      )
    }
    case "notifications":
      return (
        <NotificationsView
          {...identity}
          counts={counts}
          items={buildNotifications({
            dueWords: 6,
            startLevel: "beginner",
            progress: unitDone,
            completedStandups: [],
          })}
        />
      )
    case "notifications-empty":
      return <NotificationsView {...identity} counts={empty} items={[]} />
    case "progress":
      return (
        <ProgressView
          {...identity}
          counts={counts}
          startLevel="beginner"
          progress={unitDone}
          facts={{
            completedAt: [
              new Date(now).toISOString(),
              new Date(now - day).toISOString(),
              new Date(now - day).toISOString(),
              new Date(now - 3 * day).toISOString(),
            ],
            xp: 160,
            strengths: { weak: 2, medium: 4, strong: 3 },
            mistakesLearned: 2,
            standups: 1,
          }}
          activity={sampleActivity}
        />
      )
    case "progress-new":
      return (
        <ProgressView
          {...identity}
          counts={empty}
          startLevel="beginner"
          progress={[]}
          facts={{
            completedAt: [],
            xp: 0,
            strengths: { weak: 0, medium: 0, strong: 0 },
            mistakesLearned: 0,
            standups: 0,
          }}
          activity={[]}
        />
      )
  }
}
