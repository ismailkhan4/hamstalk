import { Avatar } from "@/components/learning/avatar"
import { cn } from "@/lib/utils"

import { cast, scenes } from "./content"
import styles from "./landing.module.css"
import { WeekTabs } from "./week-tabs"

export function TeamSection() {
  return (
    <section className={styles.band} id="team" aria-labelledby="team-title">
      <svg
        className={styles["band-lines"]}
        viewBox="0 0 420 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="var(--deep-line)" strokeWidth="2">
          <path d="M300 0v900" />
          <path d="M300 260c0 90-80 140-180 150" />
          <path d="M300 520c0 70 50 120 120 130" />
        </g>
        <circle cx="120" cy="410" r="7" fill="var(--coral-500)" />
        <circle
          cx="300"
          cy="260"
          r="6"
          fill="var(--deep)"
          stroke="var(--mint)"
          strokeWidth="2"
        />
        <circle
          cx="300"
          cy="520"
          r="6"
          fill="var(--deep)"
          stroke="var(--mint)"
          strokeWidth="2"
        />
      </svg>
      <div className={cn(styles.wrap, "relative")}>
        <h2 className={styles.h2} id="team-title">
          Your German starts on your first day at work.
        </h2>
        <p className={cn(styles.lede, "mt-5")}>
          Kaffeesatz GmbH is a fictional product team in Berlin, written for
          learners. Every situation is real work, with the German first and a
          translation underneath. Pick a day.
        </p>
        <WeekTabs scenes={scenes} />
        <div className={styles.cast}>
          {cast.map((person) => (
            <div key={person.name}>
              <Avatar
                person={person.person}
                initials={person.initials}
                size="sm"
              />
              <p>
                <b>{person.name}</b>
                {person.bio}
              </p>
            </div>
          ))}
          <p className={styles.fic}>
            The company and its people are invented. They give your German a
            context; Klarlingo is not a job or a hiring programme.
          </p>
        </div>
      </div>
    </section>
  )
}
