"use client"

import { ACTIVE_COURSE } from "@/content/courses"
import { Flame, Snowflake, Target } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { celebrate } from "@/features/celebrations/confetti"
import { CountUp } from "@/features/celebrations/count-up"
import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot, type MascotMood } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import type { Rewards } from "@/features/rewards/payload"
import { cn } from "@/lib/utils"

function headline(rewards: Rewards) {
  const { streak } = rewards
  if (!streak.extended) return "Daily goal reached!"
  if (streak.after === 1) return "First commit. Streak started!"
  return `Day ${streak.after} committed.`
}

function subline(rewards: Rewards) {
  const { streak } = rewards
  if (!streak.extended)
    return `${rewards.xpToday} XP today. ${MASCOT_NAME} is impressed.`
  if (streak.milestone)
    return (
      ACTIVE_COURSE.phrases.milestones[streak.milestone] ??
      ACTIVE_COURSE.phrases.milestoneOther
    )
  if (streak.after === 1) return "Practise again tomorrow to keep it going."
  return "Commit again tomorrow to keep the graph green."
}

function moodFor(rewards: Rewards): MascotMood {
  if (!rewards.streak.extended) return "dance"
  if (rewards.streak.milestone) return "cheer"
  return "onFire"
}

/**
 * The streak moment after a lesson: the flame counts up from yesterday, the week lights up, and
 * freezes and goals get a line each. Shown over the lesson summary; Continue returns to it.
 */
export function StreakCelebration({
  rewards,
  onClose,
}: {
  rewards: Rewards
  onClose: () => void
}) {
  const { streak } = rewards
  const button = useRef<HTMLButtonElement>(null)
  const played = useRef(false)

  useEffect(() => {
    button.current?.focus()
    if (played.current) return
    played.current = true
    playFeedback(streak.extended ? "streak" : "complete")
    if (streak.milestone) celebrate("big")
  }, [streak.extended, streak.milestone])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-title"
      aria-describedby="streak-sub"
      className="fixed inset-0 z-(--z-modal) flex flex-col items-center justify-center overflow-y-auto bg-background px-6 py-10 text-center motion-safe:animate-in motion-safe:fade-in"
    >
      <Mascot mood={moodFor(rewards)} size={128} />

      {streak.extended && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-spark-subtle px-3.5 py-1 font-extrabold text-spark-text">
          <Flame aria-hidden="true" className="size-4 fill-spark text-spark" />
          <CountUp from={streak.before} to={streak.after} delay={0.35} /> day
          streak
        </p>
      )}

      <h2
        id="streak-title"
        className="mt-3 font-display text-[clamp(1.75rem,6vw,2.5rem)] leading-tight font-semibold"
      >
        {headline(rewards)}
      </h2>
      <p
        id="streak-sub"
        lang={streak.milestone ? ACTIVE_COURSE.lang : undefined}
        className="mt-1 text-lg font-bold text-secondary-text"
      >
        {subline(rewards)}
      </p>

      {streak.extended && (
        <CommitGraph
          after={streak.after}
          frozen={streak.freezesUsed}
          className="mt-6"
        />
      )}

      <ul className="mt-5 flex max-w-sm flex-col gap-2 text-left">
        {streak.freezesUsed > 0 && (
          <Note icon={Snowflake} tone="info">
            {streak.freezesUsed === 1
              ? "A streak freeze covered the day you missed."
              : `Streak freezes covered the ${streak.freezesUsed} days you missed.`}
          </Note>
        )}
        {streak.freezeEarned && (
          <Note icon={Snowflake} tone="info">
            You earned a streak freeze! You have {streak.freezes} now.
          </Note>
        )}
        {rewards.goalReached && streak.extended && (
          <Note icon={Target} tone="primary">
            Daily goal reached: {rewards.xpToday} of {rewards.goalXp} XP.
          </Note>
        )}
      </ul>

      <Button
        ref={button}
        size="xl"
        className="mt-8 min-w-60"
        onClick={onClose}
      >
        Continue
      </Button>
    </div>
  )
}

function Note({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof Flame
  tone: "info" | "primary"
  children: React.ReactNode
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-2.5 rounded-2xl px-4 py-2.5 font-bold",
        tone === "info"
          ? "bg-info-subtle text-info-text"
          : "bg-primary-subtle text-primary-text"
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      {children}
    </li>
  )
}

const WEEKS = 12

/**
 * The streak as a contribution graph: twelve weeks, a row per weekday. Practised days are green,
 * frozen days are ice, and today's square is the newest commit.
 */
function CommitGraph({
  after,
  frozen,
  className,
}: {
  after: number
  frozen: number
  className?: string
}) {
  const total = WEEKS * 7
  // Days back from today: 0 is today, the last square.
  const cells = Array.from({ length: total }, (_, i) => total - 1 - i)
  return (
    <figure
      className={cn(
        "rounded-3xl border-2 border-border bg-card p-4 shadow-[0_4px_0_var(--border)]",
        className
      )}
    >
      <ol
        aria-hidden="true"
        className="grid grid-flow-col grid-rows-7 gap-[3px]"
      >
        {cells.map((ago) => {
          const isFrozen = ago > 0 && ago <= frozen
          const done = ago === 0 || (!isFrozen && ago - frozen <= after - 1)
          return (
            <li
              key={ago}
              className={cn(
                "size-3.5 rounded-[3px] sm:size-4",
                ago === 0
                  ? "bg-spark ring-2 ring-spark-border motion-safe:animate-pop"
                  : isFrozen
                    ? "bg-info"
                    : done
                      ? "bg-success"
                      : "bg-muted"
              )}
              style={ago === 0 ? { animationDelay: "500ms" } : undefined}
            />
          )
        })}
      </ol>
      <figcaption className="sr-only">
        {after} days practised in a row
        {frozen > 0 ? `, with ${frozen} covered by a streak freeze` : ""}.
      </figcaption>
    </figure>
  )
}
