import type {
  BuildExercise,
  ChoiceExercise,
  ConversationExercise,
  ConversationTurn,
  MatchExercise,
  TranslateExercise,
} from "../schema"
import { buildText, choiceNote, gradeMatch, type Assignments } from "./grading"

/** What goes into the mistakes notebook after a first miss. */
export type MistakeRecord = {
  itemKey: string
  topic: string | null
  prompt: string
  learnerAnswer: string
  correctAnswer: string
  reason: string
}

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text

function finish(record: MistakeRecord): MistakeRecord {
  return {
    ...record,
    prompt: clip(record.prompt, 400),
    learnerAnswer: clip(record.learnerAnswer, 400),
    correctAnswer: clip(record.correctAnswer, 400),
    reason: clip(record.reason, 600),
  }
}

function filled(exercise: ChoiceExercise, option: string) {
  return exercise.fill
    ? `${exercise.fill.before} ${option} ${exercise.fill.after}`
        .replace(/\s+/g, " ")
        .trim()
    : option
}

export function choiceMistake(
  lessonId: string,
  index: number,
  exercise: ChoiceExercise,
  selection: number
) {
  return finish({
    itemKey: `${lessonId}:${index}`,
    topic: exercise.topic ?? null,
    prompt: exercise.prompt,
    learnerAnswer: filled(exercise, exercise.options[selection] ?? ""),
    correctAnswer: filled(exercise, exercise.options[exercise.correct] ?? ""),
    reason: choiceNote(exercise, selection),
  })
}

export function matchMistake(
  lessonId: string,
  index: number,
  exercise: MatchExercise,
  assignments: Assignments
) {
  const { correct } = gradeMatch(exercise, assignments)
  const wrong = exercise.pairs.flatMap((pair, i) =>
    correct[i] ? [] : [`${pair.phrase} → ${assignments[i] ?? "?"}`]
  )
  return finish({
    itemKey: `${lessonId}:${index}`,
    topic: exercise.topic ?? null,
    prompt: exercise.prompt,
    learnerAnswer: wrong.join("; "),
    correctAnswer: exercise.pairs
      .map((pair) => `${pair.phrase} → ${pair.meaning}`)
      .join("; "),
    reason: exercise.explanation,
  })
}

export function buildMistake(
  lessonId: string,
  index: number,
  exercise: BuildExercise,
  placed: number[]
) {
  return finish({
    itemKey: `${lessonId}:${index}`,
    topic: exercise.topic ?? null,
    prompt: `${exercise.prompt} (${exercise.sub})`,
    learnerAnswer: buildText(exercise, placed),
    correctAnswer: buildText(exercise, exercise.answer),
    reason: exercise.feedback.wrong,
  })
}

export function turnMistake(
  lessonId: string,
  index: number,
  turnIndex: number,
  exercise: ConversationExercise,
  turn: ConversationTurn,
  selection: number
) {
  return finish({
    itemKey: `${lessonId}:${index}.${turnIndex}`,
    topic: exercise.topic ?? null,
    prompt: `${turn.speaker.label}: „${turn.line}“ — ${turn.task}`,
    learnerAnswer: turn.options[selection]?.de ?? "",
    correctAnswer: turn.options[turn.correct]?.de ?? "",
    reason: choiceNote(turn, selection),
  })
}

export function translateMistake(
  lessonId: string,
  index: number,
  exercise: TranslateExercise,
  answer: string
) {
  return finish({
    itemKey: `${lessonId}:${index}`,
    topic: exercise.topic ?? null,
    prompt: `${exercise.prompt} „${exercise.source}“`,
    learnerAnswer: answer.trim(),
    correctAnswer: exercise.accept[0] ?? "",
    reason: exercise.feedback.wrong,
  })
}
