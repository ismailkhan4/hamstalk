import { Avatar } from "@/components/learning/avatar"
import { cn } from "@/lib/utils"

import styles from "./landing.module.css"

const tenets = [
  [
    "In context",
    "New words and grammar arrive inside a short scene, never as a bare list.",
  ],
  [
    "Practised before used",
    "Hear it, build it, say it, then use it with a teammate.",
  ],
  [
    "Remembered over time",
    "Spaced review brings words back just before you would forget them.",
  ],
  [
    "Everyday German first",
    "Grammar, listening and daily life come first. Work German grows on top.",
  ],
] as const

export function WhySection() {
  return (
    <section className={styles.sec} id="why" aria-labelledby="why-title">
      <div className={styles.wrap}>
        <h2 className={styles.h2} id="why-title">
          Don’t just memorise German. Start using it.
        </h2>
        <div className={styles["why-grid"]}>
          <p className={styles.statement}>
            A word list tells you what{" "}
            <span className={styles.de} lang="de">
              die Besprechung
            </span>{" "}
            means. A team tells you what to say when it starts.
          </p>
          <div className={styles.versus}>
            <div>
              <p className={styles.vh}>On a list</p>
              <p className={styles.vocab}>
                <span className={styles.de} lang="de">
                  <b className="font-semibold text-article-die">die</b>{" "}
                  Besprechung
                </span>
                <span className={styles.en}>meeting</span>
              </p>
              <p className={styles.vocab}>
                <span className={styles.de} lang="de">
                  beginnen
                </span>
                <span className={styles.en}>to begin</span>
              </p>
              <p className={styles.vocab}>
                <span className={styles.de} lang="de">
                  dabei sein
                </span>
                <span className={styles.en}>to be there</span>
              </p>
            </div>
            <div>
              <p className={styles.vh}>
                At work <span>· the same words, in use</span>
              </p>
              <div className={styles.line}>
                <Avatar person="lf" initials="LF" size="sm" />
                <div>
                  <p className={cn(styles.say, styles.de)} lang="de">
                    Die <span className={styles.u}>Besprechung</span>{" "}
                    <span className={styles.u}>beginnt</span> um zehn.
                  </p>
                  <p className={styles.en}>The meeting starts at ten.</p>
                </div>
              </div>
              <div className={styles.line}>
                <Avatar person="me" initials="Du" size="sm" />
                <div>
                  <p className={cn(styles.say, styles.de)} lang="de">
                    Alles klar, ich <span className={styles.u}>bin dabei</span>.
                  </p>
                  <p className={styles.en}>Got it, I’ll be there.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tenets}>
          {tenets.map(([title, text]) => (
            <div key={title}>
              <b>{title}</b>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
