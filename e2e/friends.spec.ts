import { expect, test } from "@playwright/test"

/** The league page's friends table, in the development preview with sample friends. */

test("friends this week, with a nudge for a friend who hasn’t practised", async ({
  page,
}) => {
  await page.goto("/dev/league?state=mid")
  const friends = page.getByRole("region", { name: "Friends this week" })
  await expect(friends).toBeVisible()

  const rows = friends.getByRole("listitem")
  await expect(rows).toHaveCount(4)
  await expect(rows.first()).toContainText("Priya S.")
  await expect(rows.nth(1)).toContainText("You")

  // Only Tomasz can be nudged: he follows back and hasn't practised today.
  await expect(friends.getByRole("button", { name: /^Nudge/ })).toHaveCount(1)
  await friends.getByRole("button", { name: "Nudge Tomasz K." }).click()
  await expect(friends.getByText("Nudge sent.")).toBeVisible()
  await expect(friends.getByRole("button", { name: /^Nudge/ })).toHaveCount(0)
})

test("with no friends yet, it explains how to find some", async ({ page }) => {
  await page.goto("/dev/league?state=mid&friends=none")
  const friends = page.getByRole("region", { name: "Friends this week" })
  await expect(friends.getByText(/Follow learners to race them/)).toBeVisible()
  await expect(
    friends.getByRole("searchbox", { name: "Find friends" })
  ).toBeVisible()
  await expect(
    friends.getByRole("button", { name: "Share profile" })
  ).toBeVisible()
})
