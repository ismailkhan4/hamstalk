import { ClosingSection } from "./closing-section"
import { FaqSection } from "./faq-section"
import { FeaturesSection } from "./features-section"
import { HowSection } from "./how-section"
import { Hero } from "./hero"
import { JourneySection } from "./journey-section"
import styles from "./landing.module.css"
import { LandingFooter } from "./landing-footer"
import { LandingHeader } from "./landing-header"
import { OpenSourceSection } from "./open-source-section"
import { PhrasebookSection } from "./phrasebook-section"
import { TeamSection } from "./team-section"
import { WhySection } from "./why-section"

export function LandingPage() {
  return (
    <div className={styles.root}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <LandingHeader />
      <main id="main">
        <Hero />
        <WhySection />
        <HowSection />
        <TeamSection />
        <JourneySection />
        <FeaturesSection />
        <PhrasebookSection />
        <OpenSourceSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
