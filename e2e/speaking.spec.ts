import { expect, test, type Page } from "@playwright/test"

import { lessons } from "@/content/courses/de/lessons/registry"
import type { SpeakExercise } from "@/features/lessons/schema"

import { expectLessonDone, openLesson, solve } from "./solve"

/**
 * Speaking exercises with the browser's fake microphone (see playwright.config.ts). /api/speech is
 * answered by the test, so nothing is sent to ElevenLabs: each test decides what was "heard".
 */

const lesson = lessons.find((item) => item.id === "a1-u1-l1")!
const at = lesson.exercises.findIndex((exercise) => exercise.type === "speak")
const speak = lesson.exercises[at] as SpeakExercise

/** Plays the lesson up to its speaking exercise. */
async function reachSpeaking(page: Page) {
  await openLesson(page, lesson.id)
  for (const exercise of lesson.exercises.slice(0, at))
    await solve(page, exercise)
  await expect(page.getByText(speak.target, { exact: true })).toBeVisible()
}

/** What /api/speech answers: these words heard, or an error. */
async function hear(
  page: Page,
  heard: string | { status: number; error: string }
) {
  await page.route("**/api/speech", (route) =>
    typeof heard === "string"
      ? route.fulfill({
          json: {
            text: heard,
            words: heard
              .split(" ")
              .filter(Boolean)
              .map((text) => ({ text, logprob: -0.01 })),
          },
        })
      : route.fulfill({ status: heard.status, json: { error: heard.error } })
  )
}

async function record(page: Page) {
  await page.getByRole("button", { name: "Start speaking" }).click()
  await expect(page.getByText("Listening… tap to stop")).toBeVisible()
  await page.getByRole("button", { name: "Stop recording" }).click()
}

test("saying the line right passes", async ({ page }) => {
  await hear(page, "hallo zusammen")
  await reachSpeaking(page)
  await record(page)
  await expect(page.getByText(speak.feedback.right)).toBeVisible()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await expectLessonDone(page, lesson.kind)
})

test("two misses move on without a penalty", async ({ page }) => {
  await hear(page, "tschüss")
  await reachSpeaking(page)

  await record(page)
  await expect(page.getByText("Not quite")).toBeVisible()
  await expect(page.getByText("We heard „tschüss“.")).toBeVisible()
  await page.getByRole("button", { name: "Try again" }).click()

  await record(page)
  await expect(page.getByText("Let’s keep going")).toBeVisible()
  await expect(page.getByText(/costs nothing/)).toBeVisible()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await expectLessonDone(page, lesson.kind)
})

test("a check that fails says why and keeps the exercise open", async ({
  page,
}) => {
  await hear(page, { status: 401, error: "sign-in" })
  await reachSpeaking(page)
  await record(page)
  await expect(
    page.getByText("Sign in to have your speaking checked.")
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Start speaking" })
  ).toBeEnabled()
})

test("“Can’t speak now” skips speaking for an hour", async ({ page }) => {
  await reachSpeaking(page)
  await page.getByRole("button", { name: "Can’t speak now" }).click()
  await expectLessonDone(page, lesson.kind)

  // The next speaking exercise, in another lesson, is paused too.
  const next = lessons.find((item) => item.id === "a1-u1-l2")!
  const nextAt = next.exercises.findIndex(
    (exercise) => exercise.type === "speak"
  )
  await openLesson(page, next.id)
  for (const exercise of next.exercises.slice(0, nextAt))
    await solve(page, exercise)
  await expect(page.getByText("Speaking is paused for now")).toBeVisible()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await expectLessonDone(page, next.kind)
})
