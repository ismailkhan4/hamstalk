import {
  BookOpen,
  CircleX,
  Headphones,
  LayoutGrid,
  Mic,
  Play,
  Repeat,
  SquareCheck,
  Target,
} from "lucide-react"

import { cn } from "@/lib/utils"

import styles from "./landing.module.css"

const waveHeights = [12, 22, 32, 16, 26, 34, 14, 24, 18, 10, 20, 28, 12, 8]

function Feature({
  icon: Icon,
  title,
  text,
  specimen,
}: {
  icon: typeof Mic
  title: string
  text: string
  specimen?: React.ReactNode
}) {
  return (
    <li className={cn(styles.fitem, specimen && styles.wide)}>
      <span className={styles.ic}>
        <Icon aria-hidden="true" className={styles.icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      {specimen}
    </li>
  )
}

export function FeaturesSection() {
  return (
    <section
      className={styles.sec}
      id="features"
      aria-labelledby="features-title"
    >
      <div className={cn(styles.wrap, styles["feat-grid"])}>
        <div className={styles["feat-side"]}>
          <h2 className={styles.h2} id="features-title">
            What you’ll practise.
          </h2>
          <p className={styles.lede}>
            Every activity has one job: help you understand, remember or say
            German. Klarlingo is in early development, so this is what the
            course is being built to include.
          </p>
          <p className={styles["xp-note"]}>
            <b>Points reward practice, not ability.</b> XP and streaks count how
            often you learn. Your German is measured separately, by what you
            remember weeks later and by an assessment at the end of each level.
          </p>
        </div>
        <ul className={styles.flist}>
          <Feature
            icon={SquareCheck}
            title="Interactive exercises"
            text="Multiple choice, gap fills and matching, with feedback that shows the right form and why."
            specimen={
              <div className={styles.specimen}>
                <p className={styles.fb}>
                  <CircleX
                    aria-hidden="true"
                    className={cn(styles.icon, "text-danger-text")}
                  />
                  <span>
                    <b>Not quite.</b> It’s{" "}
                    <span className={cn(styles.de, "text-base")} lang="de">
                      die Aufgabe
                    </span>
                    : most nouns ending in -e are feminine.
                  </span>
                </p>
              </div>
            }
          />
          <Feature
            icon={Headphones}
            title="Listening practice"
            text="Teammates speak at natural speed, with a slower replay and a transcript when you need them."
            specimen={
              <div
                className={cn(styles.specimen, "flex items-center gap-3")}
                aria-hidden="true"
              >
                <span className={styles.play}>
                  <Play className="size-[18px]" />
                </span>
                <span className={styles.wave}>
                  {waveHeights.map((height, i) => (
                    <i
                      key={i}
                      className={cn(i < 5 && styles.p)}
                      style={{ height }}
                    />
                  ))}
                </span>
                <span className="text-[13.5px] text-muted-foreground">
                  0.75×
                </span>
              </div>
            }
          />
          <Feature
            icon={Repeat}
            title="Vocabulary review with spaced repetition"
            text="Each word comes back just before you would forget it. Short, regular reviews instead of cramming."
          />
          <Feature
            icon={LayoutGrid}
            title="Sentence building"
            text="Put the words in order yourself. It is the fastest way to feel German word order."
            specimen={
              <div
                className={cn(styles.specimen, styles.slots, "gap-1.5")}
                lang="de"
                aria-hidden="true"
              >
                {["Heute", "teste", "ich"].map((word, i) => (
                  <span
                    key={word}
                    className={cn(styles.slot, i === 1 && styles.v)}
                  >
                    <b className="!h-10 !text-lg">{word}</b>
                  </span>
                ))}
                <span className={styles.slot}>
                  <b className="!h-10 !border-dashed !text-lg text-muted-foreground">
                    …
                  </b>
                </span>
              </div>
            }
          />
          <Feature
            icon={Mic}
            title="Speaking and shadowing"
            text="Listen, repeat right after the speaker, then compare. Optional, and always skippable."
          />
          <Feature
            icon={BookOpen}
            title="Grammar in context"
            text="Rules arrive when you need them: example first, explanation second, the technical term last."
          />
          <Feature
            icon={Target}
            title="Daily missions and achievements"
            text="A few small goals each day, a streak that forgives rest days, and milestones for real firsts like your first standup in German."
          />
        </ul>
      </div>
    </section>
  )
}
