import { ChevronRight } from "lucide-react"

import { LevelBadge } from "@/components/learning/level-badge"

import type { LandingProps } from "./landing-page"
import { LEVELS } from "./stories"

/** The week repeats, and your role grows: four levels as four steps up the team. */
export function GrowthSection({ copy, story }: LandingProps) {
  return (
    <section
      id="growth"
      aria-labelledby="growth-title"
      className="border-t-2 border-border-subtle py-16 md:py-24"
    >
      <div className="mx-auto max-w-280 px-4 sm:px-6">
        <h2
          id="growth-title"
          className="max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] font-semibold text-balance"
        >
          {copy.growth.title}
        </h2>
        <p className="mt-4 max-w-xl text-lg font-semibold text-secondary-text">
          {copy.growth.lede}
        </p>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((level, i) => (
            <li
              key={level}
              className="relative flex flex-col rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] lg:mt-[calc(var(--step)*1rem)]"
              style={{ "--step": 3 - i } as React.CSSProperties}
            >
              <div className="flex items-center justify-between gap-2">
                <LevelBadge level={level} />
                {i < LEVELS.length - 1 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="hidden size-5 text-muted-foreground lg:block"
                    strokeWidth={3}
                  />
                )}
              </div>
              <p className="mt-3 font-display text-xl font-semibold">
                {copy.growth.roles[level]}
              </p>
              <p
                lang={story.course}
                className="mt-3 border-t-2 border-dashed border-border-subtle pt-3 font-bold text-secondary-text"
              >
                {story.levels[level]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
