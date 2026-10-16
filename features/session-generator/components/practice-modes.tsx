import {
  ArrowRight,
  Lock,
  NotebookPen,
  Sparkles,
  TramFront,
} from "lucide-react"
import Link from "next/link"

import { getLevel } from "@/content/courses/de/curriculum"
import { isLessonAvailable } from "@/content/courses/de/availability"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { isUnitCompleted, type LessonProgress } from "@/features/path/model"
import { cn } from "@/lib/utils"

/**
 * Practice built for the learner: a smart session, their mistakes once more, and the Express run of
 * every finished unit.
 */
export function PracticeModes({
  progress,
  mistakes,
  expressPassed,
}: {
  progress: LessonProgress[]
  mistakes: number
  expressPassed: readonly string[]
}) {
  const started = progress.some((entry) => entry.status === "completed")
  const units = getLevel("A1").units.filter((unit) =>
    unit.lessons.some((lesson) => isLessonAvailable(lesson.id))
  )

  return (
    <section aria-labelledby="picked-title" className="mt-8">
      <h2 id="picked-title" className="sr-only">
        Practice picked for you
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={started ? "/practice/smart" : "/path"}
          className="group flex items-center gap-4 rounded-3xl border-2 border-primary-border bg-primary-subtle p-5 shadow-[0_4px_0_var(--primary-border)] hover:bg-primary-subtle-hover"
        >
          <Mascot mood="happy" size={64} />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-sm font-extrabold text-primary-text">
              <Sparkles aria-hidden="true" className="size-4" />
              Smart practice
            </span>
            <span className="block font-display text-xl font-semibold">
              {started
                ? "Ten exercises, picked for you"
                : "Finish a lesson first"}
            </span>
            <span className="block text-sm font-semibold text-secondary-text">
              {started
                ? `${MASCOT_NAME} mixes what you’ve nearly got with what you missed. No Akku needed.`
                : "Practice is built from exercises you’ve already met."}
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>

        <Link
          href={mistakes > 0 ? "/practice/mistakes" : "/mistakes"}
          className="group flex items-center gap-4 rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)] hover:bg-background-subtle"
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-danger-subtle text-danger-text">
            <NotebookPen aria-hidden="true" className="size-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-danger-text">
              Your mistakes
            </span>
            <span className="block font-display text-xl font-semibold">
              {mistakes > 0
                ? `${mistakes} to put right`
                : "Nothing to put right"}
            </span>
            <span className="block text-sm font-semibold text-secondary-text">
              {mistakes > 0
                ? "Right first time and they leave your notebook."
                : "Missed answers land here, ready for another go."}
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>
      </div>

      {units.length > 0 && (
        <div className="mt-6">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
            <TramFront aria-hidden="true" className="size-5 text-reward-text" />
            Express runs
          </h3>
          <p className="text-sm font-semibold text-secondary-text">
            A finished unit’s hardest exercises, one try each. Get 8 of 10 right
            first time and its stretch of your line turns gold.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {units.map((unit) => {
              const open = isUnitCompleted(unit, progress)
              const gold = expressPassed.includes(unit.id)
              return (
                <li key={unit.id}>
                  {open ? (
                    <Link
                      href={`/practice/express/${unit.id}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 font-bold",
                        gold
                          ? "border-reward-border bg-reward-subtle text-reward-text"
                          : "border-border bg-card hover:bg-background-subtle"
                      )}
                    >
                      Unit {unit.number}
                      <span className="text-sm font-semibold">
                        {gold ? "★ Gold" : "Ride the Express"}
                      </span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-3 py-2 font-bold text-muted-foreground">
                      <Lock aria-hidden="true" className="size-4" />
                      Unit {unit.number}
                      <span className="sr-only">: finish the unit first</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
