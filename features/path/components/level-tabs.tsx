import { Lock } from "lucide-react"
import Link from "next/link"

import { levels, type CefrLevel } from "@/content/courses/de/curriculum"
import { cn } from "@/lib/utils"

type LevelTabsProps = { selected: CefrLevel; home: CefrLevel; basePath: string }

/** Links rather than ARIA tabs: each level is its own URL, so it can be shared and reloaded. */
export function LevelTabs({ selected, home, basePath }: LevelTabsProps) {
  return (
    <nav aria-label="Levels" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {levels.map((level) => {
        const active = level.code === selected
        return (
          <Link
            key={level.code}
            href={`${basePath}?level=${level.code.toLowerCase()}`}
            aria-current={active ? "page" : undefined}
            scroll={false}
            className={cn(
              "rounded-xl border-[1.5px] border-border bg-card px-3.5 py-2.5 hover:border-input",
              active &&
                "border-foreground shadow-[inset_0_0_0_1px_var(--foreground)]"
            )}
          >
            <span className="flex items-center gap-2">
              <b className="font-display text-lg">{level.code}</b>
              {level.code !== "A1" && (
                <>
                  <Lock
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground"
                  />
                  <span className="sr-only">(preview)</span>
                </>
              )}
              {level.code === home && (
                <span className="rounded-sm bg-spark-subtle px-1.5 py-0.5 text-[0.6875rem] font-semibold text-spark-text">
                  You are here
                </span>
              )}
            </span>
            <span className="block text-xs text-muted-foreground">
              {level.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
