"use client"

import { Lightbulb } from "lucide-react"
import { useRef, useState } from "react"

import { Avatar } from "@/components/learning/avatar"
import { cn } from "@/lib/utils"

import type { Scene } from "./content"
import styles from "./landing.module.css"

export function WeekTabs({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function focusTab(index: number) {
    const next = (index + scenes.length) % scenes.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: scenes.length - 1,
    }
    const target = keys[event.key]
    if (target === undefined) return
    event.preventDefault()
    focusTab(target)
  }

  return (
    <div className={styles.week}>
      <div
        className={styles.days}
        role="tablist"
        aria-label="Pick a day of the week"
        aria-orientation="vertical"
      >
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`day-${scene.id}`}
            aria-selected={i === active}
            aria-controls={`scene-${scene.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => onKeyDown(event, i)}
          >
            <b lang="de" aria-hidden="true">
              {scene.dayShort}
            </b>
            <span className="sr-only">{scene.dayLabel}: </span>
            <span>{scene.topic}</span>
          </button>
        ))}
      </div>
      <div>
        {scenes.map((scene, i) => (
          <article
            key={scene.id}
            id={`scene-${scene.id}`}
            role="tabpanel"
            aria-labelledby={`day-${scene.id}`}
            hidden={i !== active}
            className={styles.scene}
          >
            <div className={styles["scene-h"]}>
              <b lang="de">{scene.title}</b>
              <span>{scene.time}</span>
              <em>{scene.level}</em>
            </div>
            {scene.turns.map((turn) => (
              <div key={turn.de} className={styles.turn}>
                <Avatar
                  person={turn.person}
                  initials={turn.initials}
                  size="sm"
                />
                <div>
                  <p className={cn(styles.say, styles.de)} lang="de">
                    {turn.de}
                  </p>
                  <p className={styles.en}>{turn.en}</p>
                </div>
              </div>
            ))}
            <p className={styles.tip}>
              <Lightbulb aria-hidden="true" className={styles.icon} />
              {scene.tip}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
