import { cn } from "@/lib/utils"

import { phrasebookPages } from "./content"
import styles from "./landing.module.css"

export function PhrasebookSection() {
  return (
    <section
      className={styles.sec}
      id="phrasebook"
      aria-labelledby="phrasebook-title"
    >
      <div className={styles.wrap}>
        <h2 className={styles.h2} id="phrasebook-title">
          A phrasebook for your first months.
        </h2>
        <p className={cn(styles.lede, "mt-5")}>
          The conversations you’ll actually have, practised until they come
          easily. Level marks show roughly when each one appears in the course.
        </p>
        <div className={styles.book}>
          {phrasebookPages.map((page) => (
            <div key={page.title} className={styles.page}>
              <p className={styles["page-h"]}>
                {page.title} <span lang="de">{page.page}</span>
              </p>
              <ul>
                {page.phrases.map((phrase) => (
                  <li key={phrase.de} className={styles.phrase}>
                    <p className={styles.sit}>{phrase.situation}</p>
                    <p className={cn(styles.say, styles.de)} lang="de">
                      {phrase.de}
                    </p>
                    <p className={styles.en}>{phrase.en}</p>
                    <p className={styles.lvc}>
                      <span className="sr-only">Level </span>
                      {phrase.level}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.everyday}>
          <b>Life outside the office comes first.</b> Ordering at the bakery,
          booking an appointment, finding a flat and small talk at lunch are
          part of the course from day one. Technical words never replace the
          grammar and conversation you need everywhere.
        </p>
      </div>
    </section>
  )
}
