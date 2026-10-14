import { Avatar } from "@/components/learning/avatar"
import { cn } from "@/lib/utils"

import styles from "./landing.module.css"

function Step({
  n,
  title,
  text,
  children,
}: {
  n: number
  title: string
  text: string
  children: React.ReactNode
}) {
  return (
    <li className={styles.step}>
      <span className={styles.num} aria-hidden="true">
        {n}
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className={styles.spec}>{children}</div>
    </li>
  )
}

export function HowSection() {
  return (
    <section className={styles.sec} id="how" aria-labelledby="how-title">
      <div className={styles.wrap}>
        <div className={styles["how-head"]}>
          <h2 className={styles.h2} id="how-title">
            One loop. Five steps. Every day.
          </h2>
          <p className={cn(styles.lede, "max-w-[44ch]")}>
            Every unit follows the same rhythm, so you always know what comes
            next and why.
          </p>
        </div>
        <div className={styles.steps}>
          <span className={styles.track} aria-hidden="true" />
          <span className={styles.fill} aria-hidden="true" />
          <ol>
            <Step
              n={1}
              title="Join your virtual team"
              text="You start as the newest developer at a small product team. First lessons: greetings, introductions, names, roles and simple questions."
            >
              <div className={styles.roster}>
                <div>
                  <Avatar person="lf" initials="LF" size="sm" />
                  <div>
                    <b>Lena</b>
                    <span lang="de">Teamleiterin</span>
                  </div>
                </div>
                <div>
                  <Avatar person="jk" initials="JK" size="sm" />
                  <div>
                    <b>Jonas</b>
                    <span>Backend</span>
                  </div>
                </div>
                <div>
                  <Avatar person="me" initials="Du" size="sm" />
                  <div>
                    <b>You</b>
                    <span>Frontend, new</span>
                  </div>
                </div>
              </div>
              <p
                className={cn(
                  styles.say,
                  styles.de,
                  "mt-[18px] text-[1.375rem]"
                )}
                lang="de"
              >
                Hallo, ich bin neu im Team.
              </p>
              <p className={cn(styles.en, "text-[0.9375rem]")}>
                Hi, I’m new on the team.
              </p>
            </Step>
            <Step
              n={2}
              title="Learn the language"
              text="Short lessons build vocabulary, grammar, listening and sentence structure, each one shown first in a real example."
            >
              <div
                className={styles.slots}
                role="img"
                aria-label="Heute, position 1. arbeite, position 2, the verb. ich, position 3. an der Anmeldung, position 4."
              >
                {[
                  ["Heute", "1"],
                  ["arbeite", "2, the verb"],
                  ["ich", "3"],
                  ["an der Anmeldung", "4"],
                ].map(([word, pos], i) => (
                  <span
                    key={word}
                    className={cn(styles.slot, i === 1 && styles.v)}
                  >
                    <b lang="de">{word}</b>
                    <span>{pos}</span>
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[0.9375rem] text-secondary-text">
                Today I’m working on the sign-in. In German, the verb always
                takes position two.
              </p>
            </Step>
            <Step
              n={3}
              title="Complete daily missions"
              text="Use it at work: give your standup update, describe a ticket, ask a teammate for help, reply to a review."
            >
              <div className={styles.ticket}>
                <span className={styles.id}>KLAR-142</span>
                <span className={cn(styles.tt, styles.de)} lang="de">
                  Passwort-Reset-E-Mail kommt nicht an
                </span>
                <span />
                <span className={cn(styles.en, "text-[0.9375rem]")}>
                  Password reset email doesn’t arrive
                </span>
                <p className={styles.ask}>
                  Mission: tell Lena in one sentence what this ticket is about.
                </p>
              </div>
            </Step>
            <Step
              n={4}
              title="Review and reinforce"
              text="Earlier words and phrases come back at the right time. Replay listening exercises and say things aloud until they feel natural."
            >
              <div className={styles.recall}>
                <div>
                  <p className={cn(styles.word, styles.de)} lang="de">
                    <b className="font-semibold text-article-die">die</b>{" "}
                    Anmeldung
                  </p>
                  <p className={cn(styles.en, "text-[0.9062rem]")}>
                    the sign-in
                  </p>
                </div>
                <div className={styles.rates} aria-hidden="true">
                  {[
                    ["Again", "now"],
                    ["Hard", "1 day"],
                    ["Good", "4 days"],
                    ["Easy", "10 days"],
                  ].map(([label, when]) => (
                    <span
                      key={label}
                      className={cn(label === "Good" && styles.g)}
                    >
                      {label}
                      <small>{when}</small>
                    </span>
                  ))}
                </div>
              </div>
            </Step>
            <Step
              n={5}
              title="Unlock what comes next"
              text="Finished lessons open the next part of your path. Steady practice builds the habit; assessments mark each new level."
            >
              <div
                className={styles["mini-path"]}
                role="img"
                aria-label="Unit progress: three lessons done, the fourth just unlocked, then a locked unit check"
              >
                <i />
                <em />
                <i />
                <em />
                <i />
                <em />
                <i className={styles.open} />
                <em className={styles.d} />
                <i className={styles.lock} />
              </div>
              <p className="mt-4 text-[0.9375rem] text-secondary-text">
                <span
                  className={cn(styles.de, "text-lg text-foreground")}
                  lang="de"
                >
                  Ich brauche Hilfe
                </span>{" "}
                just unlocked. The unit check comes after it.
              </p>
            </Step>
          </ol>
        </div>
      </div>
    </section>
  )
}
