import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { Mascot } from "@/features/celebrations/mascot"
import { cn } from "@/lib/utils"

import { cta, hero, week } from "./content"

/** Monday morning: the promise on the left, your week planner on the right. */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-280 grid-cols-1 items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-spark-subtle px-3 py-1 text-sm font-extrabold text-spark-text">
            <span className="size-2 rounded-full bg-spark motion-safe:animate-pulse" />
            {hero.kicker}
          </p>
          <h1
            id="hero-title"
            className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold text-balance"
          >
            {hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold text-secondary-text sm:text-xl">
            {hero.lede}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/signup" className={buttonVariants({ size: "xl" })}>
              {cta.start}
              <ArrowRight aria-hidden="true" strokeWidth={3} />
            </Link>
            <p className="font-semibold text-muted-foreground">
              {hero.signInPrompt}{" "}
              <Link
                href="/signin"
                className="font-extrabold text-primary-text underline decoration-2 underline-offset-4"
              >
                {cta.signIn}
              </Link>
            </p>
          </div>
        </div>
        <WeekPlanner />
      </div>
    </section>
  )
}

/** The week ahead, as a planner card. Decoration: the story below says it all in words. */
function WeekPlanner() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-105 pt-10">
      <div className="absolute -top-2 right-4 z-10 motion-safe:animate-float">
        <Mascot mood="thinking" size={96} />
      </div>
      <div className="relative rotate-[1.5deg] rounded-3xl border-2 border-border bg-card p-5 shadow-[0_6px_0_var(--border)]">
        <p className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
          Your first week
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {week.map((day, i) => (
            <li
              key={day.short}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5",
                i === 0
                  ? "border-spark bg-spark-subtle"
                  : "border-border-subtle bg-background-subtle"
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl font-display text-lg font-semibold",
                  i === 0
                    ? "bg-spark text-spark-foreground"
                    : "bg-card text-muted-foreground"
                )}
              >
                {day.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold">
                  {day.title}
                </span>
                <span className="block text-sm font-semibold text-muted-foreground">
                  {day.time}
                </span>
              </span>
              {i === 0 ? (
                <span className="rounded-full bg-spark px-2 py-0.5 text-xs font-extrabold text-spark-foreground">
                  Now
                </span>
              ) : (
                <span className="size-5 rounded-md border-2 border-border" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
