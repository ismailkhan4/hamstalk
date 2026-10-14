"use client"

import { getUnit } from "@/content/curriculum"
import { getStandup } from "@/content/standup"
import type { LessonProgress } from "@/features/path/model"

import { StandupSession } from "./standup-session"
import { TeamView } from "./team-view"

export type TeamPreviewView =
  "locked" | "ready" | "done" | "standup" | "standup-save-fails"

const finishedUnit: LessonProgress[] = (getUnit("a1-u1")?.lessons ?? []).map(
  (lesson) => ({
    lessonId: lesson.id,
    status: "completed",
    step: 0,
    xp: 30,
  })
)

const shell = {
  name: "Sam Haddad",
  email: "sam@example.com",
  counts: { phrases: 6, mistakes: 3, due: 6 },
}

export function TeamPreview({ view }: { view: TeamPreviewView }) {
  const standup = getStandup("a1-u1")
  if ((view === "standup" || view === "standup-save-fails") && standup)
    return (
      <StandupSession
        standup={standup}
        firstName="Sam"
        initials="SH"
        onComplete={async () =>
          view === "standup"
            ? { ok: true }
            : {
                ok: false,
                message:
                  "Your standup wasn’t saved. Check your connection and finish it again.",
              }
        }
      />
    )

  return (
    <TeamView
      {...shell}
      startedAt="2026-10-12T08:00:00Z"
      progress={view === "locked" ? [] : finishedUnit}
      completedStandups={view === "done" ? ["a1-u1"] : []}
    />
  )
}
