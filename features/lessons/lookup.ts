import { getLesson } from "@/content/lessons/registry"

import { gradeChoice } from "./engine/grading"
import type { ChoiceExercise, ConversationTurn, Lesson } from "./schema"

/** Where a mistake came from: `<lessonId>:<exercise>` or `<lessonId>:<exercise>.<turn>`. */
export function parseItemKey(itemKey: string) {
  const match = /^([a-z0-9-]{3,64}):(\d{1,2})(?:\.(\d))?$/.exec(itemKey)
  if (!match) return null
  return {
    lessonId: match[1]!,
    exercise: Number(match[2]),
    turn: match[3] === undefined ? null : Number(match[3]),
  }
}

export type RetryQuestion = {
  prompt: string
  options: { de: string; en?: string }[]
  optionsLanguage: "de" | "en"
  /** A fill-in sentence, with the blank. */
  fill?: { before: string; after: string }
  item: Pick<
    ChoiceExercise | ConversationTurn,
    "correct" | "alternatives" | "feedback"
  >
}

/**
 * The question behind a mistake, when it can be asked again on its own: multiple choice, fill-in,
 * listening and conversation turns. Matching and sentence building are replayed in their lesson.
 */
export function retryQuestion(itemKey: string): RetryQuestion | null {
  const key = parseItemKey(itemKey)
  if (!key) return null
  const lesson = getLesson(key.lessonId)
  const exercise = lesson?.exercises[key.exercise]
  if (!lesson || !exercise) return null

  if (exercise.type === "choice") {
    return {
      prompt: exercise.listening
        ? `${exercise.prompt} (“${exercise.listening.clip}”)`
        : exercise.prompt,
      options: exercise.options.map((de) => ({ de })),
      optionsLanguage: exercise.optionsLanguage,
      ...(exercise.fill ? { fill: exercise.fill } : {}),
      item: exercise,
    }
  }
  if (exercise.type === "conversation" && key.turn !== null) {
    const turn = exercise.turns[key.turn]
    if (!turn) return null
    return {
      prompt: `${turn.speaker.label}: „${turn.line}“ — ${turn.task}`,
      options: turn.options,
      optionsLanguage: "de",
      item: turn,
    }
  }
  return null
}

export function gradeRetry(itemKey: string, selection: number) {
  const question = retryQuestion(itemKey)
  if (!question || selection < 0 || selection >= question.options.length)
    return null
  return { verdict: gradeChoice(question.item, selection), question }
}

export function lessonLabel(lesson: Lesson | null, lessonId: string) {
  if (!lesson) return lessonId
  const unit = /^a1-u(\d)/.exec(lessonId)?.[1]
  const place =
    lesson.kind === "review"
      ? "Review"
      : `Lesson ${lessonId.split("-l")[1] ?? ""}`
  return `Unit ${unit ?? "?"} · ${place}`
}
