import { expect, type Page } from "@playwright/test"

import { ACTIVE_COURSE } from "@/content/courses"
import {
  personalise,
  type Exercise,
  type Lesson,
} from "@/features/lessons/schema"

/** The learner the lesson preview plays as (features/lessons/components/lesson-preview.tsx). */
export const PREVIEW_LEARNER = { firstName: "Sam", initials: "SH" }

const say = (text: string) => personalise(text, PREVIEW_LEARNER)

/** An answer option whose own text is exactly `text` (options can contain one another). */
function option(page: Page, text: string) {
  return page
    .getByRole("radio")
    .filter({ has: page.getByText(say(text), { exact: true }) })
}

async function check(page: Page, label = "Check") {
  await page.getByRole("button", { name: label, exact: true }).click()
}

async function next(page: Page, label = "Continue") {
  await page.getByRole("button", { name: label, exact: true }).click()
}

/**
 * Answers one exercise right first time, from its content, the way a learner would: by clicking
 * the options, tiles and buttons they see. Speaking exercises are skipped with "Can't speak now";
 * e2e/speaking.spec.ts covers speaking itself.
 */
export async function solve(page: Page, exercise: Exercise) {
  switch (exercise.type) {
    case "discover":
    case "tip":
      await next(page)
      return

    case "choice":
      await option(page, exercise.options[exercise.correct]!).click()
      await check(page)
      await next(page)
      return

    case "match":
      for (const pair of exercise.pairs) {
        await page
          .getByRole("button", { name: `${pair.phrase}.`, exact: false })
          .first()
          .click()
        await page
          .getByRole("button", { name: pair.meaning, exact: true })
          .click()
      }
      await check(page)
      await next(page)
      return

    case "build": {
      const bank = page.getByRole("list", { name: "Words to use" })
      for (const tile of exercise.answer)
        await bank
          .getByRole("button", {
            name: say(exercise.tiles[tile]!),
            exact: true,
          })
          .first()
          .click()
      await check(page)
      await next(page)
      return
    }

    case "translate":
      await page.getByRole("textbox").fill(say(exercise.accept[0]!))
      await check(page)
      await next(page)
      return

    case "conversation":
      for (const [i, turn] of exercise.turns.entries()) {
        await option(page, turn.options[turn.correct]!.target).click()
        await check(page, "Say it")
        await next(page, i === exercise.turns.length - 1 ? "Continue" : "Next")
      }
      return

    case "speak":
      await page.getByRole("button", { name: "Can’t speak now" }).click()
      return
  }
}

/** Opens a lesson in the preview and waits for its intro. */
export async function openLesson(page: Page, lessonId: string) {
  // Speaking starts on for every test; skipping one pauses it in this browser only.
  await page.goto(`/dev/lesson?id=${lessonId}`)
  await page.getByRole("button", { name: "Start lesson" }).click()
}

/** The end screen: "Lektion geschafft!", or "Wiederholung geschafft!" after a unit review. */
export async function expectLessonDone(page: Page, kind: Lesson["kind"]) {
  const { lessonDone, reviewDone } = ACTIVE_COURSE.phrases
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: kind === "review" ? reviewDone : lessonDone,
    })
  ).toBeVisible()
}
