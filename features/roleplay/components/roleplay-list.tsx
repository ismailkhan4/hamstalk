import { ArrowRight, Lock, MessagesSquare } from "lucide-react"
import Link from "next/link"

import { Avatar, type Person } from "@/components/learning/avatar"
import { ACTIVE_COURSE } from "@/content/courses"
import { getUnit } from "@/content/courses/de/curriculum"
import { roleplays } from "@/content/courses/de/roleplays"
import { isUnitCompleted, type LessonProgress } from "@/features/path/model"

/** "Talk to the team": the roleplays, each open once its unit is done. */
export function RoleplayList({
  progress,
  ai,
}: {
  progress: LessonProgress[]
  /** Whether AI is switched on; without it the roleplays are listed as coming. */
  ai: boolean
}) {
  return (
    <section aria-labelledby="talk" className="mt-10">
      <h2
        id="talk"
        className="flex items-center gap-2 font-display text-h2 font-bold"
      >
        <MessagesSquare
          aria-hidden="true"
          className="size-6 text-primary-text"
        />
        Talk to the team
      </h2>
      <p className="mt-1 text-secondary-text">
        Short typed conversations in {ACTIVE_COURSE.language}. The character
        answers in simple sentences, gently fixes your slips, and gives you
        feedback at the end.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {roleplays.map((roleplay) => {
          const unit = getUnit(roleplay.unlockUnit)
          const open = ai && unit && isUnitCompleted(unit, progress)
          const pacer = ACTIVE_COURSE.pacers.find(
            (p) => p.id === roleplay.character
          )
          const body = (
            <>
              <Avatar
                person={roleplay.character as Person}
                initials={pacer?.initials ?? "?"}
                size="lg"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">{roleplay.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {open
                    ? `With ${pacer?.name.split(" ")[0]} · ${roleplay.where}`
                    : !ai
                      ? "Coming soon"
                      : `Opens after Unit ${unit?.number}`}
                </span>
              </span>
              {open ? (
                <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
              ) : (
                <Lock
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              )}
            </>
          )
          return (
            <li key={roleplay.id}>
              {open ? (
                <Link
                  href={`/team/roleplay/${roleplay.id}`}
                  className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-[0_4px_0_var(--border)] hover:bg-background-subtle"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border p-4 opacity-80">
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {ai && (
        <p className="mt-3 text-sm text-muted-foreground">
          The characters are played by AI for practice. What you type isn’t sent
          to a real person.
        </p>
      )}
    </section>
  )
}
