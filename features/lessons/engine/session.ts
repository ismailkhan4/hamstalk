import { isGraded, type ConversationExercise, type Lesson } from "../schema"
import { collapseOutcomes, type Outcome } from "./attempt"

/** Outcomes per exercise (null until done). Conversation turns are kept separately for reviews. */
export type SessionState = {
  outcomes: (Outcome | null)[]
  turnOutcomes: Record<number, Outcome[]>
}

export function startSession(
  lesson: Lesson,
  saved: Outcome[] = []
): SessionState {
  return {
    outcomes: lesson.exercises.map((_, index) => saved[index] ?? null),
    turnOutcomes: {},
  }
}

export function recordOutcome(
  state: SessionState,
  index: number,
  outcome: Outcome
): SessionState {
  return {
    ...state,
    outcomes: state.outcomes.map((value, i) => (i === index ? outcome : value)),
  }
}

export function recordConversation(
  state: SessionState,
  index: number,
  turns: Outcome[]
): SessionState {
  const recorded = recordOutcome(state, index, collapseOutcomes(turns))
  return {
    ...recorded,
    turnOutcomes: { ...recorded.turnOutcomes, [index]: turns },
  }
}

/** Where to pick up: the first exercise without an outcome, or the last if every one is done. */
export function resumeIndex(lesson: Lesson, saved: Outcome[]) {
  const first = lesson.exercises.findIndex(
    (_, index) => saved[index] === undefined
  )
  return first === -1 ? lesson.exercises.length - 1 : first
}

type GradedItem = { outcome: Outcome; revisits: number | undefined }

function gradedItems(lesson: Lesson, state: SessionState): GradedItem[] {
  const items: GradedItem[] = []
  lesson.exercises.forEach((exercise, index) => {
    if (!isGraded(exercise)) return
    const outcome = state.outcomes[index]
    if (!outcome) return
    if (exercise.type === "conversation" && lesson.kind === "review") {
      items.push(
        ...conversationItems(exercise, outcome, state.turnOutcomes[index])
      )
    } else {
      items.push({
        outcome,
        revisits: "revisits" in exercise ? exercise.revisits : undefined,
      })
    }
  })
  return items
}

/** In a review each turn counts on its own, because each one revisits a different lesson. */
function conversationItems(
  exercise: ConversationExercise,
  collapsed: Outcome,
  turns: Outcome[] | undefined
) {
  return exercise.turns.map((turn, i) => ({
    outcome: turns?.[i] ?? collapsed,
    revisits: turn.revisits,
  }))
}

export type LessonSummary = {
  xp: number
  graded: number
  firstTry: number
  /** For a review: how each revisited lesson went. */
  byLesson: {
    lessonId: string
    label: string
    title: string
    firstTry: number
    total: number
  }[]
}

export function summarise(lesson: Lesson, state: SessionState): LessonSummary {
  const items = gradedItems(lesson, state)
  const firstTry = items.filter((item) => item.outcome === "first_try").length
  const byLesson = (lesson.revisitedLessons ?? []).map((revisited, index) => {
    const mine = items.filter((item) => item.revisits === index)
    return {
      ...revisited,
      firstTry: mine.filter((item) => item.outcome === "first_try").length,
      total: mine.length,
    }
  })
  return { xp: lesson.xp, graded: items.length, firstTry, byLesson }
}

export function isComplete(state: SessionState) {
  return state.outcomes.every((outcome) => outcome !== null)
}
