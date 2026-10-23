"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { celebrate } from "@/features/celebrations/confetti"
import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import { divisionName, DIVISIONS, ordinal, type LeagueResult } from "../model"
import { DivisionCrest } from "./division-crest"

/**
 * Last week's result, shown once: promotion gets the confetti, staying up a pat on the back and
 * relegation an encouraging word. Dismissing it marks it seen.
 */
export function ResultCard({
  result,
  onSeen,
}: {
  result: LeagueResult
  onSeen: (week: string) => Promise<void> | void
}) {
  const [open, setOpen] = useState(true)
  const next = Math.min(
    DIVISIONS,
    Math.max(
      1,
      result.division +
        (result.result === "promoted"
          ? 1
          : result.result === "relegated"
            ? -1
            : 0)
    )
  )
  const promoted = result.result === "promoted"

  const cheered = useRef(false)
  useEffect(() => {
    if (!promoted || cheered.current) return
    cheered.current = true
    playFeedback("perfect")
    celebrate("big")
  }, [promoted])

  if (!open) return null
  const title =
    result.result === "promoted"
      ? ACTIVE_COURSE.phrases.promoted
      : result.result === "relegated"
        ? ACTIVE_COURSE.phrases.relegated
        : ACTIVE_COURSE.phrases.stayed

  return (
    <section
      aria-labelledby="result-title"
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-3xl border-2 p-5 motion-safe:animate-rise",
        promoted
          ? "border-success-border bg-success-subtle"
          : result.result === "relegated"
            ? "border-border bg-card"
            : "border-info-border bg-info-subtle"
      )}
    >
      <Mascot
        mood={
          promoted ? "cheer" : result.result === "relegated" ? "sad" : "happy"
        }
        size={72}
      />
      <div className="min-w-[14rem] flex-1">
        <p className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
          Last week’s result
        </p>
        <h2
          id="result-title"
          lang={TARGET_LANG}
          className="font-display text-h2 leading-tight font-semibold"
        >
          {title}
        </h2>
        <p className="mt-1 font-semibold text-secondary-text">
          You finished {ordinal(result.rank)} in{" "}
          <span lang={TARGET_LANG}>{divisionName(result.division)}</span>.{" "}
          {result.result === "promoted"
            ? "This week you play one division up, in "
            : result.result === "relegated"
              ? "A fresh start this week in "
              : "You stay in "}
          <span lang={TARGET_LANG}>{divisionName(next)}</span>.
        </p>
      </div>
      <DivisionCrest division={next} size={52} />
      <Button
        variant={promoted ? "success" : "outline"}
        onClick={() => {
          setOpen(false)
          void onSeen(result.week)
        }}
      >
        Got it
      </Button>
    </section>
  )
}
