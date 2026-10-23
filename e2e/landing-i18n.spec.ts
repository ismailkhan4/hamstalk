import { expect, test, type Page } from "@playwright/test"

import { landingCopy } from "@/features/landing/copy"
import { DAY_IDS, stories } from "@/features/landing/stories"
import {
  COURSE_COOKIE,
  COURSES,
  landingPath,
  LOCALE_COOKIE,
  LOCALES,
  type Course,
  type Locale,
} from "@/lib/i18n"

/**
 * The landing page in German, English and Italian, for each language Hamstalk teaches: routing,
 * switching language and course, and the words themselves.
 */

/** Every string in a copy object, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings)
  return []
}

/** Copy as it reads on the page: marked words lose their *asterisks*. */
const plain = (text: string) => text.replace(/\*([^*]+)\*/g, "$1")

const pairs = LOCALES.flatMap((locale) =>
  COURSES.map((course) => [locale, course] as const)
)

test.describe("translations", () => {
  test("every page fills in every field, with no stray markup", () => {
    for (const [locale, course] of pairs)
      for (const text of strings(landingCopy(locale, course))) {
        const where = `${locale}/${course}`
        expect(text.trim(), `${where}: empty string`).not.toBe("")
        expect(text, `${where}: unfilled name`).not.toMatch(/undefined|\$\{/)
        expect(
          (text.match(/\*/g) ?? []).length % 2,
          `${where}: unbalanced * in “${text}”`
        ).toBe(0)
      }
  })

  test("every course has a gloss and a tip for every other language", () => {
    for (const course of COURSES)
      for (const id of DAY_IDS) {
        const day = stories[course].days[id]
        for (const locale of LOCALES) {
          expect(day.tips[locale].trim(), `${course} ${id} tip`).not.toBe("")
          if (locale !== course)
            expect(
              day.glosses[locale],
              `${course} ${id} ${locale}`
            ).toHaveLength(2)
        }
      }
  })

  test("German and Italian copy is translated, not copied from English", () => {
    const shared = new Set(["Hamsti", "FAQ"])
    for (const course of COURSES) {
      const english = new Set(strings(landingCopy("en", course)))
      for (const locale of ["de", "it"] as const)
        for (const text of strings(landingCopy(locale, course)))
          if (!shared.has(text))
            expect(english.has(text), `${locale}/${course}: “${text}”`).toBe(
              false
            )
    }
  })
})

async function expectPage(page: Page, locale: Locale, course: Course) {
  const copy = landingCopy(locale, course)
  await expect(page).toHaveURL(new RegExp(`${landingPath(locale, course)}$`))
  await expect(page.locator("html")).toHaveAttribute("lang", locale)
  await expect(page).toHaveTitle(copy.meta.title)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    copy.hero.title
  )
}

for (const [locale, course] of pairs) {
  const path = landingPath(locale, course)
  test(`${path} is in one language, about one course`, async ({ page }) => {
    const errors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })
    await page.goto(path)
    await expectPage(page, locale, course)
    await page.waitForLoadState("networkidle")
    // The server and the browser render the same words (dev mode reports mismatches).
    expect(errors.filter((e) => /hydrat|didn.t match/i.test(e))).toEqual([])

    const copy = landingCopy(locale, course)
    for (const heading of [
      copy.week.title,
      copy.growth.title,
      copy.buddy.title,
      copy.faq.title,
      copy.invite.heading,
    ])
      await expect(page.getByRole("heading", { name: heading })).toBeVisible()

    // The course's own lines are on the page, in its language.
    const story = stories[course]
    await expect(
      page.locator(`p[lang="${course}"]`, {
        hasText: story.days.mon.lines[0].target,
      })
    ).toBeVisible()
    // So is the notice, exactly when the course isn't ready.
    await expect(page.getByText(copy.courses.notReady)).toHaveCount(
      story.available ? 0 : 1
    )

    const text = await page.locator("body").innerText()
    expect(text).not.toMatch(/\*\w/)
    // No sentence from another language's version of this page shows up here.
    const own = strings(copy).map(plain)
    for (const other of LOCALES.filter((code) => code !== locale))
      for (const line of strings(landingCopy(other, course)).map(plain))
        if (line.length > 12 && !own.includes(line))
          expect(text, `${other} text on ${path}`).not.toContain(line)
  })
}

test("/ sends visitors to their language, and a course in another one", async ({
  browser,
}) => {
  // The browser's own language setting, which it sends as Accept-Language.
  for (const [browserLocale, locale, course] of [
    ["it-CH", "it", "de"],
    ["de-AT", "de", "en"],
    ["en-US", "en", "de"],
    ["ja-JP", "en", "de"],
  ] as const) {
    const context = await browser.newContext({ locale: browserLocale })
    const page = await context.newPage()
    await page.goto("/?utm_source=test")
    await expect(page).toHaveURL(
      new RegExp(`${landingPath(locale, course)}\\?utm_source=test$`)
    )
    await context.close()
  }
})

test("picking a course changes the story and is remembered", async ({
  page,
  context,
}) => {
  await page.goto(landingPath("en", "de"))
  const nav = page.getByRole("navigation", {
    name: landingCopy("en", "de").courses.label,
  })
  await expect(nav.getByRole("link", { name: "German" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  await nav.getByRole("link", { name: /Italian/ }).click()
  await expectPage(page, "en", "it")
  const cookies = await context.cookies()
  expect(cookies.find((c) => c.name === COURSE_COOKIE)?.value).toBe("it")

  await page.goto("/en")
  await expectPage(page, "en", "it")
})

test("picking a language keeps the course and is remembered", async ({
  page,
  context,
}) => {
  await page.goto(landingPath("en", "en"))
  await page
    .getByRole("button", {
      name: `${landingCopy("en", "en").nav.language}: English`,
    })
    .click()
  const italian = page.getByRole("menuitem", { name: "Italiano" })
  await expect(italian).toHaveAttribute("hreflang", "it")
  await expect(page.getByRole("menuitem", { name: "English" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  await italian.click()

  await expectPage(page, "it", "en")
  const cookies = await context.cookies()
  expect(cookies.find((c) => c.name === LOCALE_COOKIE)?.value).toBe("it")

  await page.reload()
  await expectPage(page, "it", "en")
  await page.goto("/")
  await expectPage(page, "it", "en")
})

test("the language menu works from the keyboard", async ({ page }) => {
  await page.goto(landingPath("de", "en"))
  const trigger = page.getByRole("button", {
    name: `${landingCopy("de", "en").nav.language}: Deutsch`,
  })
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("menu")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("menu")).toBeHidden()
  await expect(trigger).toBeFocused()

  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("menu")).toBeVisible()
  await page.getByRole("menuitem", { name: "English" }).focus()
  await page.keyboard.press("Enter")
  await expectPage(page, "en", "en")
})

test("a course that isn't ready points to one that is", async ({ page }) => {
  await page.goto(landingPath("en", "it"))
  const copy = landingCopy("en", "it")
  await page
    .getByRole("main")
    .getByRole("link", { name: copy.courses.tryAvailable })
    .first()
    .click()
  await expectPage(page, "en", "de")
})

test("leaving the landing page gives the app back its own language", async ({
  page,
}) => {
  await page.goto(landingPath("de", "en"))
  await page
    .getByRole("link", { name: landingCopy("de", "en").cta.signIn })
    .first()
    .click()
  await expect(page).toHaveURL(/\/signin$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
})
