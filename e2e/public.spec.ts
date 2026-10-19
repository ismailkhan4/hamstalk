import { expect, test } from "@playwright/test"

/** What someone who isn't signed in can and can't reach. */

test("the landing page loads with its headline", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("learner pages ask you to sign in, keeping where you were going", async ({
  page,
}) => {
  await page.goto("/league")
  await expect(page).toHaveURL(/\/signin\?next=%2Fleague$/)
  await expect(
    page.getByRole("heading", { name: "Welcome back" })
  ).toBeVisible()
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
})

test("paid APIs refuse signed-out requests", async ({ request }) => {
  const form = new FormData()
  form.append("audio", new Blob([new Uint8Array(64)], { type: "audio/webm" }))
  const speech = await request.post("/api/speech", { multipart: form })
  // 401 when ElevenLabs is set up, 503 when it isn't: never a transcription.
  expect([401, 503]).toContain(speech.status())

  const tts = await request.post("/api/tts", {
    data: { text: "Hallo, %N!", speaker: null, speed: "normal" },
  })
  expect(tts.ok()).toBe(false)
})

test("the microphone is allowed on our own pages, for speaking", async ({
  request,
}) => {
  const page = await request.get("/")
  expect(page.headers()["permissions-policy"]).toContain("microphone=(self)")
})
