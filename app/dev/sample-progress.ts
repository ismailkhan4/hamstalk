import type { LessonProgress } from "@/features/path/model"

/**
 * Development only: a learner partway through the course. `stage` picks how far: "new", "unit2"
 * (Unit 1 done with its standup, halfway through Unit 2) or "done" (all built units finished).
 */
export function sampleProgress(stage: string | undefined): {
  progress: LessonProgress[]
  completedStandups: string[]
} {
  const done = (id: string): LessonProgress => ({
    lessonId: id,
    status: "completed",
    step: 0,
    xp: 30,
  })
  const unit = (n: number) =>
    ["l1", "l2", "l3", "l4", "review"].map((l) => done(`a1-u${n}-${l}`))
  if (stage === "new") return { progress: [], completedStandups: [] }
  if (stage === "done")
    return {
      progress: [...unit(1), ...unit(2), ...unit(3)],
      completedStandups: ["a1-u1", "a1-u2"],
    }
  return {
    progress: [
      ...unit(1),
      done("a1-u2-l1"),
      { lessonId: "a1-u2-l2", status: "in_progress", step: 3, xp: 0 },
    ],
    completedStandups: ["a1-u1"],
  }
}
