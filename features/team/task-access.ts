import "server-only"

import { redirect } from "next/navigation"

import { getUnit } from "@/content/courses/de/curriculum"
import { TICKET_UNIT_ID } from "@/content/courses/de/team-tasks"
import { loadLearner } from "@/features/learner/load-learner"
import { isUnitCompleted } from "@/features/path/model"

/** The learner for a workplace task page. The tasks open when Unit 3 is finished; until then the Team page explains. */
export async function loadTaskLearner(path: string) {
  const learner = await loadLearner(path)
  if (learner === "database-not-ready") return learner
  const unit = getUnit(TICKET_UNIT_ID)
  if (!unit || !isUnitCompleted(unit, learner.progress)) redirect("/team")
  return learner
}
