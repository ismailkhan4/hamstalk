import { COURSES, landingPath, type Course, type Locale } from "@/lib/i18n"

import { BuddySection } from "./buddy-section"
import { ClosingSection } from "./closing-section"
import { landingCopy, type LandingCopy } from "./copy"
import { DocumentLang } from "./document-lang"
import { FaqSection } from "./faq-section"
import { GrowthSection } from "./growth-section"
import { Hero } from "./hero"
import { LandingFooter } from "./landing-footer"
import { LandingHeader } from "./landing-header"
import { stories, type Story } from "./stories"
import { WeekStory } from "./week-story"

/** Everything a section needs: the words, the course's story, and where the main button goes. */
export type LandingProps = {
  copy: LandingCopy
  story: Story
  locale: Locale
  /** Sign up while the course is open; until then, a course you can take today. */
  cta: { href: string; label: string }
}

/** One story, top to bottom: Monday morning, the week, the weeks after, your buddy, the invite. */
export function LandingPage({
  locale,
  course,
}: {
  locale: Locale
  course: Course
}) {
  const copy = landingCopy(locale, course)
  const story = stories[course]
  const open = COURSES.find((c) => stories[c].available) ?? "de"
  const props: LandingProps = {
    copy,
    story,
    locale,
    cta: story.available
      ? { href: "/signup", label: copy.cta.start }
      : { href: landingPath(locale, open), label: copy.courses.tryAvailable },
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Sets <html lang> before first paint; DocumentLang keeps it right after navigations. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
        }}
      />
      <DocumentLang lang={locale} />
      <a
        href="#main"
        className="sr-only z-(--z-toast) rounded-md bg-card px-3 py-2 shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.nav.skipToContent}
      </a>
      <LandingHeader {...props} />
      <main id="main">
        <Hero {...props} />
        <WeekStory {...props} />
        <GrowthSection {...props} />
        <BuddySection {...props} />
        <FaqSection {...props} />
        <ClosingSection {...props} />
      </main>
      <LandingFooter {...props} />
    </div>
  )
}
