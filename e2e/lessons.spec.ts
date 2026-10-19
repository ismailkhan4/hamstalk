import { expect, test } from "@playwright/test"

import { lessons } from "@/content/courses/de/lessons/registry"

import { expectLessonDone, openLesson, solve } from "./solve"

/**
 * Every built lesson, played start to finish in the real lesson runner, answering everything
 * right first time. Catches a lesson whose content and screens disagree, such as a right answer
 * the screen won't accept.
 */
for (const lesson of lessons) {
  test(`${lesson.id} can be finished right first time`, async ({ page }) => {
    await openLesson(page, lesson.id)
    for (const exercise of lesson.exercises) await solve(page, exercise)
    await expectLessonDone(page, lesson.kind)
  })
}

test("a wrong answer is explained, saved, and can be tried again", async ({
  page,
}) => {
  const lesson = lessons.find((item) => item.id === "a1-u1-l1")!
  await openLesson(page, lesson.id)
  const at = lesson.exercises.findIndex(
    (exercise) => exercise.type === "choice"
  )
  for (const exercise of lesson.exercises.slice(0, at))
    await solve(page, exercise)

  const choice = lesson.exercises[at]!
  if (choice.type !== "choice") throw new Error("expected a choice exercise")
  const wrong = choice.options.findIndex(
    (_, i) => i !== choice.correct && !choice.alternatives.includes(i)
  )
  await page
    .getByRole("radio")
    .filter({ has: page.getByText(choice.options[wrong]!, { exact: true }) })
    .click()
  await page.getByRole("button", { name: "Check", exact: true }).click()

  await expect(
    page.getByText(choice.feedback.wrong[String(wrong)]!)
  ).toBeVisible()
  await expect(page.getByText(/mistakes/i).first()).toBeVisible()
  await page.getByRole("button", { name: "Try again" }).click()

  await solve(page, choice)
  for (const exercise of lesson.exercises.slice(at + 1))
    await solve(page, exercise)
  await expectLessonDone(page, lesson.kind)
})
