import { ArrowRight, Info } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { Mascot } from "@/features/celebrations/mascot"
import { COURSES, landingPath } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { CourseLink } from "./course-link"
import type { LandingProps } from "./landing-page"
import { DAY_IDS, schedule, stories } from "./stories"

/** Monday morning: the promise on the left, your week planner on the right. */
export function Hero(props: LandingProps) {
  const { copy, story, cta } = props
  return (
    <section id="top" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-280 grid-cols-1 items-center gap-12 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div>
          <CoursePicker {...props} />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-spark-subtle px-3 py-1 text-sm font-extrabold text-spark-text">
            <span className="size-2 shrink-0 rounded-full bg-spark motion-safe:animate-pulse" />
            {copy.hero.kicker}
          </p>
          <h1
            id="hero-title"
            className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold text-balance"
          >
            {copy.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold text-secondary-text sm:text-xl">
            {copy.hero.lede}
          </p>
          {!story.available && (
            <p className="mt-5 flex max-w-xl items-start gap-2.5 rounded-2xl border-2 border-info bg-info/10 px-4 py-3 font-semibold">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-info"
              />
              {copy.courses.notReady}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={cta.href}
              // Long labels may wrap on the narrowest phones instead of overflowing.
              className={cn(
                buttonVariants({ size: "xl" }),
                "h-auto min-h-14 max-w-full py-3 text-center whitespace-normal"
              )}
            >
              {cta.label}
              <ArrowRight aria-hidden="true" strokeWidth={3} />
            </Link>
            <p className="font-semibold text-muted-foreground">
              {copy.hero.signInPrompt}{" "}
              <Link
                href="/signin"
                className="font-extrabold text-primary-text underline decoration-2 underline-offset-4"
              >
                {copy.cta.signIn}
              </Link>
            </p>
          </div>
        </div>
        <WeekPlanner {...props} />
      </div>
    </section>
  )
}

/** Which language you want to learn. Each course is its own page, so the links can be shared. */
function CoursePicker({ copy, story, locale }: LandingProps) {
  return (
    <nav aria-labelledby="course-picker-label">
      <p
        id="course-picker-label"
        className="text-sm font-extrabold tracking-wider text-muted-foreground uppercase"
      >
        {copy.courses.label}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {COURSES.map((course) => {
          const current = course === story.course
          return (
            <li key={course}>
              <CourseLink
                course={course}
                href={landingPath(locale, course)}
                aria-current={current ? "page" : undefined}
                scroll={false}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl border-2 px-4 font-extrabold transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  current
                    ? "border-primary-edge bg-primary text-primary-foreground shadow-[0_3px_0_var(--primary-edge)]"
                    : "border-border bg-card text-foreground shadow-[0_3px_0_var(--border)] hover:bg-background-subtle"
                )}
              >
                {copy.courses.names[course]}
                {!stories[course].available && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-extrabold",
                      current
                        ? "bg-primary-foreground/15"
                        : "bg-background-subtle text-muted-foreground"
                    )}
                  >
                    {copy.courses.comingSoon}
                  </span>
                )}
              </CourseLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** The week ahead, as a planner card. Decoration: the story below says it all in words. */
function WeekPlanner({ copy, story }: LandingProps) {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-105 pt-10">
      <div className="absolute -top-2 right-4 z-10 motion-safe:animate-float">
        <Mascot mood="thinking" size={96} />
      </div>
      <div className="relative rotate-[1.5deg] rounded-3xl border-2 border-border bg-card p-5 shadow-[0_6px_0_var(--border)]">
        <p className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
          {copy.hero.planner}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {DAY_IDS.map((id, i) => (
            <li
              key={id}
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
                {story.days[id].short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold">
                  {copy.week.days[id].title}
                </span>
                <span className="block text-sm font-semibold text-muted-foreground">
                  {schedule[id].time}
                </span>
              </span>
              {i === 0 ? (
                <span className="rounded-full bg-spark px-2 py-0.5 text-xs font-extrabold text-spark-foreground">
                  {copy.hero.now}
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
