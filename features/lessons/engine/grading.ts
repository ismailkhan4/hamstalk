import type {
  BuildExercise,
  ChoiceExercise,
  ConversationTurn,
  MatchExercise,
  TranslateExercise,
} from "../schema"
import type { Verdict } from "./attempt"

type Choosable = Pick<
  ChoiceExercise | ConversationTurn,
  "correct" | "alternatives" | "feedback"
>

export function gradeChoice(item: Choosable, selection: number): Verdict {
  if (selection === item.correct) return "correct"
  return item.alternatives.includes(selection) ? "alternative" : "wrong"
}

/** The note shown for a selection: why it is right, why an alternative also works, or why it is wrong. */
export function choiceNote(item: Choosable, selection: number): string {
  const verdict = gradeChoice(item, selection)
  if (verdict === "correct") return item.feedback.right
  if (verdict === "alternative")
    return item.feedback.alternative[String(selection)] ?? item.feedback.right
  return item.feedback.wrong[String(selection)] ?? item.feedback.right
}

/** Matching: `assignments[i]` is the meaning the learner paired with phrase i, or null. */
export type Assignments = (string | null)[]

export function emptyAssignments(exercise: MatchExercise): Assignments {
  return exercise.pairs.map(() => null)
}

export function gradeMatch(exercise: MatchExercise, assignments: Assignments) {
  const correct = exercise.pairs.map(
    (pair, index) => assignments[index] === pair.meaning
  )
  return {
    correct,
    allCorrect: correct.every(Boolean),
    complete: assignments.every((value) => value !== null),
  }
}

/** On a retry, right pairs stay in place and only the wrong ones are cleared. */
export function retryAssignments(
  exercise: MatchExercise,
  assignments: Assignments
): Assignments {
  const { correct } = gradeMatch(exercise, assignments)
  return assignments.map((value, index) => (correct[index] ? value : null))
}

/** The answer shown after a second miss. */
export function solvedAssignments(exercise: MatchExercise): Assignments {
  return exercise.pairs.map((pair) => pair.meaning)
}

/** Meanings not yet paired, in the order the exercise offers them. */
export function unpairedMeanings(
  exercise: MatchExercise,
  assignments: Assignments
) {
  const used = [...assignments]
  return exercise.meaningOrder.filter((meaning) => {
    const at = used.indexOf(meaning)
    if (at === -1) return true
    used[at] = null
    return false
  })
}

/** Building: `placed` holds tile indexes in the order the learner put them. */
export function gradeBuild(exercise: BuildExercise, placed: number[]): Verdict {
  const right =
    placed.length === exercise.answer.length &&
    placed.every((tile, position) => tile === exercise.answer[position])
  return right ? "correct" : "wrong"
}

export function buildText(exercise: BuildExercise, tiles: number[]) {
  return tiles.map((index) => exercise.tiles[index]).join(" ")
}

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, "i am"],
  [/\bit's\b/g, "it is"],
  [/\b(he|she)'s\b/g, "$1 is"],
  [/\b(you|we|they)'re\b/g, "$1 are"],
  [/\bthat's\b/g, "that is"],
  [/\bwhat's\b/g, "what is"],
  [/\bdon't\b/g, "do not"],
]

/** Lower case, straight apostrophes, contractions written out, punctuation and extra spaces dropped. */
export function normaliseAnswer(text: string) {
  let value = text.toLocaleLowerCase("en").replaceAll("’", "'").trim()
  for (const [pattern, replacement] of CONTRACTIONS)
    value = value.replace(pattern, replacement)
  return value
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function gradeTranslate(
  exercise: TranslateExercise,
  answer: string
): Verdict {
  const given = normaliseAnswer(answer)
  if (!given) return "wrong"
  return exercise.accept.some((option) => normaliseAnswer(option) === given)
    ? "correct"
    : "wrong"
}
