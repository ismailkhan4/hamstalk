import { BuddySection } from "./buddy-section"
import { ClosingSection } from "./closing-section"
import { FaqSection } from "./faq-section"
import { GrowthSection } from "./growth-section"
import { Hero } from "./hero"
import { LandingFooter } from "./landing-footer"
import { LandingHeader } from "./landing-header"
import { WeekStory } from "./week-story"

/** One story, top to bottom: Monday morning, the week, the weeks after, your buddy, the invite. */
export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only z-(--z-toast) rounded-md bg-card px-3 py-2 shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <LandingHeader />
      <main id="main">
        <Hero />
        <WeekStory />
        <GrowthSection />
        <BuddySection />
        <FaqSection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
