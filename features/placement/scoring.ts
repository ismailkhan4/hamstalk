import { placementQuestions, type PlacementSkill } from "./questions"

export type PlacementLevel = "beginner" | "a1" | "a2" | "b1"

/** One entry per question: -1 not answered, 0-2 an option, 3 "I don't know yet". */
export type PlacementAnswers = number[]

function isRight(answers: PlacementAnswers, index: number) {
  return answers[index] === placementQuestions[index]?.correct
}

function countRight(answers: PlacementAnswers, indexes: number[]) {
  return indexes.filter((index) => isRight(answers, index)).length
}

/**
 * Questions 1-4 are A1, 5-6 A2 and 7-8 B1. The suggestion only moves past A1 when every harder
 * step is mostly right, so a few lucky guesses don't skip the basics.
 */
export function suggestLevel(answers: PlacementAnswers): PlacementLevel {
  const a1 = countRight(answers, [0, 1, 2, 3])
  const a2 = countRight(answers, [4, 5])
  const b1 = countRight(answers, [6, 7])
  if (a1 <= 1) return "beginner"
  if (a1 >= 3 && a2 === 2 && b1 >= 1) return b1 === 2 ? "b1" : "a2"
  return "a1"
}

export function skillResults(answers: PlacementAnswers) {
  const skills: PlacementSkill[] = [
    "Vocabulary",
    "Grammar",
    "Reading",
    "Listening",
  ]
  return skills.map((skill) => {
    const indexes = placementQuestions.flatMap((question, index) =>
      question.skill === skill ? [index] : []
    )
    return {
      skill,
      right: indexes.map((index) => isRight(answers, index)),
      total: indexes.length,
    }
  })
}

export function answeredCount(answers: PlacementAnswers) {
  return answers.filter((answer) => answer >= 0).length
}
