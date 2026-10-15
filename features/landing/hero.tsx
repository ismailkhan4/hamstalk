import { Avatar } from "@/components/learning/avatar"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

import styles from "./landing.module.css"

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={cn(styles.wrap, styles["hero-grid"])}>
        <div className={styles.hl}>
          <span className={styles.rail} aria-hidden="true" />
          <p className={styles.status}>
            <i aria-hidden="true" />
            An open-source German course, in early development
          </p>
          <h1 className={styles.h1} id="hero-title">
            <span>
              <i className={cn(styles.node, styles.on)} aria-hidden="true" />
              Learn German.
            </span>{" "}
            <span>
              <i className={cn(styles.node, styles.on)} aria-hidden="true" />
              Work in German.
            </span>{" "}
            <span>
              <i className={cn(styles.node, styles.you)} aria-hidden="true" />
              Belong in Germany.
            </span>
          </h1>
          <div className={styles["hero-copy"]}>
            <p className={styles.lede}>
              Turn your German into your first weeks at a German tech company.
              Practise conversations, daily standups and real workplace
              communication, one mission at a time.
            </p>
            <div className={styles.ctas}>
              <a
                className={cn(
                  buttonVariants({ size: "xl" }),
                  "h-auto min-h-14 max-w-full shrink py-3 text-center whitespace-normal"
                )}
                href="#journey"
              >
                Explore the learning journey
              </a>
              <a className={styles.tlink} href="#how">
                See how it works
              </a>
            </div>
          </div>
        </div>
        <figure
          className={styles.sheet}
          aria-label="Example: your first daily standup at a fictional German tech team"
        >
          <div className={styles["sheet-h"]}>
            <div>
              <b>Daily standup</b>
              <br />
              <span>Tuesday, 09:30</span>
            </div>
            <span className={styles.faces} aria-hidden="true">
              <Avatar person="lf" initials="LF" size="sm" />
              <Avatar person="jk" initials="JK" size="sm" />
              <Avatar person="ao" initials="AÖ" size="sm" />
              <Avatar person="me" initials="Du" size="sm" />
            </span>
          </div>
          <div className={styles.log}>
            <div className={styles.entry}>
              <i className={styles.node} aria-hidden="true" />
              <p className={styles.who}>
                Lena <span>team lead</span>
              </p>
              <p className={cn(styles.say, styles.de)} lang="de">
                Guten Morgen! Was machst du heute?
              </p>
              <p className={styles.en}>
                Good morning! What are you doing today?
              </p>
            </div>
            <div className={styles.entry}>
              <i className={cn(styles.node, styles.you)} aria-hidden="true" />
              <p className={styles.who}>
                You <span>your first update · A1</span>
              </p>
              <p className={cn(styles.say, styles.de)} lang="de">
                Heute <span className={styles.mark}>teste</span> ich die
                Anmeldung.
              </p>
              <p className={styles.en}>Today I’m testing the sign-in.</p>
              <p className={styles.note}>
                <b>A1 · verb second</b>
                After Heute, the verb comes next, then ich.
              </p>
            </div>
          </div>
          <div className={styles.mission}>
            <b>Mission: your first standup update · A1, Unit 3</b>
            <span className={styles.segs} role="img" aria-label="Step 2 of 3">
              <i className={styles.on} />
              <i className={styles.on} />
              <i />
            </span>
          </div>
        </figure>
      </div>
    </section>
  )
}
