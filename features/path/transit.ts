import {
  getLevel,
  type CefrLevel,
  type LessonMeta,
  type Unit,
} from "@/content/courses/de/curriculum"
import { isLessonAvailable } from "@/content/courses/de/availability"
import type { StartLevel } from "@/features/onboarding/options"
import { standupState, type StandupState } from "@/features/team/model"

import {
  completedLessonCount,
  lessonStatus,
  unitStatus,
  type LessonProgress,
  type LessonStatus,
  type UnitStatus,
} from "./model"

/**
 * The learning path as a transit line: each level is a line (A1 = U1), each lesson a station, a
 * unit's review an interchange, the unit's team standup its last stop, and the level's checkpoint
 * the terminus. Pure, so the map and Home draw from the same answer.
 */

export const LINE_NUMBER: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
}

export type Station = {
  lesson: LessonMeta
  status: LessonStatus
  /** A unit review: drawn as an interchange. */
  interchange: boolean
  /** Where the learner is now: the next lesson, or the one in progress. */
  here: boolean
}

export type Section = {
  unit: Unit
  status: UnitStatus
  done: number
  total: number
  /** No lesson in the unit is built yet: shown as a stretch under construction. */
  underConstruction: boolean
  /** The learner has already travelled through it. */
  passed: boolean
  stations: Station[]
  standup: StandupState
  /** The unit's Express run: locked until the unit is done, gold once passed. */
  express: "locked" | "open" | "gold"
}

export type Line = {
  level: CefrLevel
  number: number
  sections: Section[]
  /** Whether the learner's "you are here" marker is on this line. */
  hasHere: boolean
}

export function transitLine(
  levelCode: CefrLevel,
  startLevel: StartLevel | null,
  progress: LessonProgress[],
  completedStandups: string[],
  expressPassed: readonly string[] = []
): Line {
  const level = getLevel(levelCode)
  const sections = level.units.map((unit): Section => {
    const status = unitStatus(unit, startLevel, progress)
    const stations = unit.lessons.map((lesson): Station => {
      const lessonState = lessonStatus(lesson, unit, startLevel, progress)
      return {
        lesson,
        status: lessonState,
        interchange: lesson.kind === "review",
        here: lessonState === "up_next" || lessonState === "in_progress",
      }
    })
    return {
      unit,
      status,
      done: completedLessonCount(unit, progress),
      total: unit.lessons.length,
      underConstruction:
        unit.lessons.length === 0 ||
        unit.lessons.every((lesson) => !isLessonAvailable(lesson.id)),
      passed: status === "completed",
      stations,
      standup: standupState(unit.id, progress, completedStandups),
      express:
        status !== "completed"
          ? "locked"
          : expressPassed.includes(unit.id)
            ? "gold"
            : "open",
    }
  })
  return {
    level: levelCode,
    number: LINE_NUMBER[levelCode],
    sections,
    hasHere: sections.some((section) => section.stations.some((s) => s.here)),
  }
}

/** The section the learner is in, for Home's strip of the line. */
export function currentSection(line: Line): Section | null {
  return (
    line.sections.find((section) => section.stations.some((s) => s.here)) ??
    line.sections.find(
      (section) => !section.passed && !section.underConstruction
    ) ??
    null
  )
}
