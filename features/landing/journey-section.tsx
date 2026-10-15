import { cn } from "@/lib/utils"

import { levels } from "./content"
import styles from "./landing.module.css"

const stairPath =
  "M8 216 H232 C252 216 262 206 262 186 V176 C262 166 272 156 292 156 H504 C524 156 534 146 534 126 V116 C534 106 544 96 564 96 H776 C796 96 806 86 806 66 V56 C806 46 816 36 836 36 H1080"

const levelColour = {
  A1: "text-level-a1",
  A2: "text-level-a2",
  B1: "text-level-b1",
  B2: "text-level-b2",
} as const

export function JourneySection() {
  return (
    <section
      className={styles.sec}
      id="journey"
      aria-labelledby="journey-title"
    >
      <div className={styles.wrap}>
        <h2 className={styles.h2} id="journey-title">
          From your first Hallo to explaining trade-offs.
        </h2>
        <p className={cn(styles.lede, "mt-5")}>
          The course follows the four CEFR stages. Each one combines everyday
          German with a bigger role in your team.
        </p>
        <div className={styles["levels-wrap"]}>
          <svg
            className={styles.stairs}
            viewBox="0 0 1088 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={stairPath} opacity=".18" />
            <path className={styles.draw} d={stairPath} />
          </svg>
          <ol className={styles.levels}>
            {levels.map((level) => (
              <li
                key={level.code}
                className={cn(styles.lv, levelColour[level.code])}
              >
                <p className={styles.code}>
                  <i aria-hidden="true" />
                  {level.code}
                </p>
                <div className="text-foreground">
                  <h3>{level.title}</h3>
                  <p className={styles.role}>{level.role}</p>
                  <ul>
                    {level.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <blockquote>
                    <p className={cn(styles.say, styles.de)} lang="de">
                      {level.de}
                    </p>
                    <p className={styles.en}>{level.en}</p>
                  </blockquote>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.honest}>
          These are learning goals based on the Common European Framework of
          Reference. Each stage takes months of steady practice, and how long
          depends on you. Klarlingo supports your learning; it can’t guarantee a
          level, an exam result or a job.
        </p>
      </div>
    </section>
  )
}
