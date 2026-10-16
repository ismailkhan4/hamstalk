import { Lock } from "lucide-react"
import Link from "next/link"

import { levels, type CefrLevel } from "@/content/courses/de/curriculum"
import { cn } from "@/lib/utils"

import { LINE_NUMBER } from "../transit"
import { LINE_COLOR } from "./transit-line"

type LevelTabsProps = { selected: CefrLevel; home: CefrLevel; basePath: string }

/**
 * One tab per line, like line badges on a station sign. Links rather than ARIA tabs: each level
 * is its own URL, so it can be shared and reloaded.
 */
export function LevelTabs({ selected, home, basePath }: LevelTabsProps) {
  return (
    <nav aria-label="Lines" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {levels.map((level) => {
        const active = level.code === selected
        return (
          <Link
            key={level.code}
            href={`${basePath}?level=${level.code.toLowerCase()}`}
            aria-current={active ? "page" : undefined}
            scroll={false}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5 hover:border-input",
              active && "border-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className="grid h-8 min-w-11 place-items-center rounded-md px-1.5 font-display text-sm font-semibold text-[#1d2b33]"
              style={{ background: LINE_COLOR[level.code] }}
            >
              U{LINE_NUMBER[level.code]}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                <b className="font-display text-lg leading-tight">
                  {level.code}
                </b>
                {level.code !== "A1" && (
                  <>
                    <Lock
                      aria-hidden="true"
                      className="size-3.5 text-muted-foreground"
                    />
                    <span className="sr-only">(preview)</span>
                  </>
                )}
              </span>
              <span className="block truncate text-xs font-semibold text-muted-foreground">
                {level.code === home ? "Your line" : level.name}
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
