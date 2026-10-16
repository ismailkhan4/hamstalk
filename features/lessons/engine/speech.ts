import type { HeardWord } from "@/lib/stt/elevenlabs"

import type { SpeakExercise } from "../schema"
import type { Verdict } from "./attempt"

/**
 * Grading a spoken answer from its transcript. Speech recognition is never perfect, least of all
 * for a beginner on a phone mic, so this is lenient: punctuation, case and filler words don't
 * matter, one letter off in a longer word still counts, and four words in five is a pass.
 */

/** Share of the line's words that must be heard. */
export const SPEECH_PASS = 0.8

/** Below this confidence (about 55%) a heard word is marked "say it again", but still counts. */
export const UNSURE_LOGPROB = Math.log(0.55)

const NUMBERS = [
  "null",
  "eins",
  "zwei",
  "drei",
  "vier",
  "fünf",
  "sechs",
  "sieben",
  "acht",
  "neun",
  "zehn",
  "elf",
  "zwölf",
  "dreizehn",
  "vierzehn",
  "fünfzehn",
  "sechzehn",
  "siebzehn",
  "achtzehn",
  "neunzehn",
  "zwanzig",
]

/**
 * Lower case, ß as ss, umlauts as ae/oe/ue (so "Buero" = "Büro"), no punctuation, and digits up to
 * 20 as words ("8 Uhr" = "acht Uhr").
 */
export function speechWords(text: string, locale = "de"): string[] {
  return text
    .normalize("NFC")
    .toLocaleLowerCase(locale)
    .replaceAll("ß", "ss")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/[\s-]+/)
    .map((word) => word.replace(/^'+|'+$/g, ""))
    .filter(Boolean)
    .map((word) =>
      /^\d+$/.test(word) && Number(word) <= 20
        ? speechWords(NUMBERS[Number(word)]!, locale)[0]!
        : word
    )
}

function oneEditApart(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++
      j++
      continue
    }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (b.length > a.length) j++
    else {
      i++
      j++
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

function close(expected: string, heard: string) {
  return (
    expected === heard ||
    (expected.length >= 5 && oneEditApart(expected, heard))
  )
}

export type WordResult = {
  /** The word as written in the line. */
  text: string
  status: "heard" | "unsure" | "missed"
}

export type SpeechGrade = {
  verdict: Verdict
  words: WordResult[]
  score: number
}

/** Matches one written line against what was heard, keeping word order (a longest common subsequence). */
function gradeLine(line: string, heard: HeardWord[]): SpeechGrade {
  const shown = line.split(/\s+/).filter((word) => speechWords(word).length)
  const expected = shown.map((word) => speechWords(word).join(" "))
  const said = heard.map((word) => ({
    word: speechWords(word.text).join(" "),
    logprob: word.logprob,
  }))

  const rows = expected.length + 1
  const cols = said.length + 1
  const table: number[][] = Array.from({ length: rows }, () =>
    Array<number>(cols).fill(0)
  )
  for (let i = expected.length - 1; i >= 0; i--)
    for (let j = said.length - 1; j >= 0; j--)
      table[i]![j] = close(expected[i]!, said[j]!.word)
        ? table[i + 1]![j + 1]! + 1
        : Math.max(table[i + 1]![j]!, table[i]![j + 1]!)

  const words: WordResult[] = []
  let i = 0
  let j = 0
  while (i < expected.length) {
    if (j < said.length && close(expected[i]!, said[j]!.word)) {
      const exact = expected[i] === said[j]!.word
      const sure = said[j]!.logprob >= UNSURE_LOGPROB
      words.push({
        text: shown[i]!,
        status: exact && sure ? "heard" : "unsure",
      })
      i++
      j++
    } else if (j < said.length && table[i]![j + 1]! >= table[i + 1]![j]!) {
      j++
    } else {
      words.push({ text: shown[i]!, status: "missed" })
      i++
    }
  }

  const matched = words.filter((word) => word.status !== "missed").length
  const score = expected.length ? matched / expected.length : 0
  return { verdict: score >= SPEECH_PASS ? "correct" : "wrong", words, score }
}

/** The best match among the line and its accepted alternatives. Word marks are always for the line. */
export function gradeSpeech(
  exercise: Pick<SpeakExercise, "target" | "accept">,
  heard: HeardWord[]
): SpeechGrade {
  const main = gradeLine(exercise.target, heard)
  if (main.verdict === "correct") return main
  const alternative = exercise.accept.some(
    (line) => gradeLine(line, heard).verdict === "correct"
  )
  return alternative
    ? {
        ...main,
        verdict: "correct",
        words: main.words.map((word) => ({ ...word, status: "heard" })),
      }
    : main
}
