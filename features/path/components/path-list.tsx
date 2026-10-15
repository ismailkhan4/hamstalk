import { Check, Flag, Lock } from "lucide-react"
import Link from "next/link"

import type { Level } from "@/content/courses/de/curriculum"
import type { StartLevel } from "@/features/onboarding/options"
import { cn } from "@/lib/utils"

import { completedLessonCount, unitStatus, type LessonProgress } from "../model"
import { unitStatusLabel } from "./unit-panel"

type PathListProps = {
  level: Level
  startLevel: StartLevel | null
  progress: LessonProgress[]
  selectedUnitId: string | null
  basePath: string
}

export function PathList({
  level,
  startLevel,
  progress,
  selectedUnitId,
  basePath,
}: PathListProps) {
  return (
    <ol
      className="relative flex flex-col gap-1"
      aria-label={`${level.code} units`}
    >
      <span
        aria-hidden="true"
        className="absolute top-8 bottom-8 left-[21px] w-0.5 bg-border"
      />
      {level.units.map((unit) => {
        const status = unitStatus(unit, startLevel, progress)
        const selected = unit.id === selectedUnitId
        const done = completedLessonCount(unit, progress)
        const label =
          status === "up_next" || status === "in_progress"
            ? `${unitStatusLabel[status]} · ${done} of ${unit.lessons.length}`
            : unitStatusLabel[status]
        const node = (
          <span
            aria-hidden="true"
            className={cn(
              "relative z-[1] grid size-11 shrink-0 place-items-center rounded-full border-2 border-dashed border-input bg-background text-sm font-bold text-muted-foreground",
              (status === "available" || status === "review") &&
                "border-solid border-primary text-primary-text",
              status === "completed" &&
                "border-solid border-primary bg-primary text-primary-foreground",
              (status === "up_next" || status === "in_progress") &&
                "border-spark bg-spark-subtle text-spark-text shadow-[0_0_0_4px_color-mix(in_srgb,var(--spark)_15%,transparent)]"
            )}
          >
            {status === "completed" ? (
              <Check className="size-5" />
            ) : status === "locked" || status === "preview" ? (
              <Lock className="size-4" />
            ) : (
              unit.number
            )}
          </span>
        )
        const body = (
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground">
              Unit {unit.number}
            </span>
            <span className="block font-semibold">{unit.title}</span>
            <span className="block text-sm text-secondary-text">
              {unit.summary}
            </span>
          </span>
        )
        const badge = (
          <span
            className={cn(
              "shrink-0 text-xs font-semibold text-muted-foreground",
              (status === "up_next" || status === "in_progress") &&
                "text-spark-text",
              (status === "available" || status === "completed") &&
                "text-primary-text"
            )}
          >
            {label}
          </span>
        )
        const rowClass = cn(
          "flex items-start gap-4 rounded-xl border-[1.5px] border-transparent p-2.5 pr-4 hover:bg-card",
          selected && "lg:border-primary lg:bg-card"
        )
        return (
          <li key={unit.id}>
            <Link
              href={`${basePath}?level=${level.code.toLowerCase()}&unit=${unit.id}`}
              aria-current={selected ? "true" : undefined}
              scroll={false}
              className={rowClass}
            >
              {node}
              {body}
              {badge}
            </Link>
          </li>
        )
      })}
      <li className="flex items-start gap-4 p-2.5 pr-4">
        <span
          aria-hidden="true"
          className="relative z-[1] grid size-11 shrink-0 place-items-center rounded-lg border-2 border-dashed border-input bg-background text-muted-foreground"
        >
          <Flag className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted-foreground">
            End of level
          </span>
          <span className="block font-semibold">{level.checkpoint.title}</span>
          <span className="block text-sm text-secondary-text">
            {level.checkpoint.summary}
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {level.code === "A1" ? "After Unit 8" : "Planned"}
        </span>
      </li>
    </ol>
  )
}
