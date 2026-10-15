import { getUnit } from "@/content/curriculum"
import { getStandup } from "@/content/standup"
import { isUnitCompleted, type LessonProgress } from "@/features/path/model"

export type StandupState = "planned" | "locked" | "ready" | "done"

export function standupState(
  unitId: string,
  progress: LessonProgress[],
  completedUnits: string[]
): StandupState {
  const unit = getUnit(unitId)
  if (!unit || !getStandup(unitId)) return "planned"
  if (completedUnits.includes(unitId)) return "done"
  return isUnitCompleted(unit, progress) ? "ready" : "locked"
}

export function playableStandup(
  progress: LessonProgress[],
  unitIds: string[]
): string | null {
  const open = unitIds.filter((id) => {
    const unit = getUnit(id)
    return unit && getStandup(id) && isUnitCompleted(unit, progress)
  })
  return open.at(-1) ?? null
}
