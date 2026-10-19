import { defineConfig, devices } from "@playwright/test"

/**
 * End-to-end tests: the real app in a real browser. They drive the development previews under
 * /dev (real screens, sample data, nothing saved) and the signed-out pages, so they need no
 * account and never write to the database.
 *
 *   bun run test:e2e              against the dev server on :3000, started if it isn't running
 *   E2E_BASE_URL=… bun run test:e2e   against another server (dev previews must be on there)
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000"

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // The dev server compiles each route on first visit, which is slow the first time.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["microphone"],
    // A microphone that plays a test tone, allowed without a prompt, for speaking exercises.
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "bun run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
