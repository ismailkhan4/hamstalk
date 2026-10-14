export type Outcome = "first_try" | "second_try" | "shown"
export type Verdict = "correct" | "alternative" | "wrong"
export type Phase = "answering" | "right" | "wrong" | "shown"

export type Attempt = { phase: Phase; tries: number; outcome: Outcome | null }

export const MAX_TRIES = 2

export function startAttempt(): Attempt {
  return { phase: "answering", tries: 0, outcome: null }
}

export function check(attempt: Attempt, verdict: Verdict): Attempt {
  if (attempt.phase !== "answering") return attempt
  if (verdict !== "wrong") {
    return {
      phase: "right",
      tries: attempt.tries,
      outcome: attempt.tries === 0 ? "first_try" : "second_try",
    }
  }
  const tries = attempt.tries + 1
  return tries >= MAX_TRIES
    ? { phase: "shown", tries, outcome: "shown" }
    : { phase: "wrong", tries, outcome: null }
}

export function retry(attempt: Attempt): Attempt {
  return attempt.phase === "wrong"
    ? { ...attempt, phase: "answering" }
    : attempt
}

export function isFinished(attempt: Attempt) {
  return attempt.phase === "right" || attempt.phase === "shown"
}

export function collapseOutcomes(outcomes: Outcome[]): Outcome {
  if (outcomes.every((outcome) => outcome === "first_try")) return "first_try"
  return outcomes.includes("shown") ? "shown" : "second_try"
}
