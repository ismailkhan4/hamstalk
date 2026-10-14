import type { MistakeRecord } from "../engine/mistakes"
import type { Outcome } from "../engine/attempt"

export type Learner = { firstName: string; initials: string }

export type ExerciseProps<E> = {
  exercise: E
  index: number
  learner: Learner
  onMiss: (record: MistakeRecord) => void
  onDone: (outcome: Outcome, turnOutcomes?: Outcome[]) => void
}
