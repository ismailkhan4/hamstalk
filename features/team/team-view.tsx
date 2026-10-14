import {
  ArrowRight,
  Check,
  Lock,
  MessageSquare,
  Ticket,
  Users,
} from "lucide-react"
import Link from "next/link"

import { Avatar, type Person } from "@/components/learning/avatar"
import { GermanText } from "@/components/learning/german-text"
import { AppShell } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button-variants"
import { getLevel, getUnit } from "@/content/curriculum"
import { TICKET_UNIT_ID } from "@/content/team-tasks"
import { getStandup, standups } from "@/content/standup"
import { dayAtCompany } from "@/features/learner/day-at-company"
import type { NotebookCounts } from "@/features/review/data"
import { isUnitCompleted, type LessonProgress } from "@/features/path/model"
import { cn } from "@/lib/utils"

import { playableStandup, standupState, type StandupState } from "./model"

const people: {
  person: Person
  initials: string
  name: string
  role: string
}[] = [
  {
    person: "lf",
    initials: "LF",
    name: "Lena Fischer",
    role: "Team lead · speaks clearly, explains twice",
  },
  {
    person: "jk",
    initials: "JK",
    name: "Jonas Krüger",
    role: "Backend · fast talker, loves a bug hunt",
  },
  {
    person: "ao",
    initials: "AÖ",
    name: "Aylin Öztürk",
    role: "Design · asks “why?”",
  },
  {
    person: "aw",
    initials: "AW",
    name: "Anna Weber",
    role: "Developer · mobile app",
  },
]

type TeamViewProps = {
  name: string
  email: string
  counts?: NotebookCounts
  startedAt: string | null
  progress: LessonProgress[]
  completedStandups: string[]
}

const stateLabel: Record<StandupState, string> = {
  done: "Done",
  ready: "Ready",
  locked: "Locked",
  planned: "Planned",
}

export function TeamView({
  name,
  email,
  counts,
  startedAt,
  progress,
  completedStandups,
}: TeamViewProps) {
  const units = getLevel("A1").units
  const unitIds = standups.map((standup) => standup.unitId)
  const playable = playableStandup(progress, unitIds)
  const featuredId = playable ?? unitIds[0]
  const featured = featuredId ? getStandup(featuredId) : null
  const featuredState = featuredId
    ? standupState(featuredId, progress, completedStandups)
    : "planned"
  const featuredUnit = units.find((unit) => unit.id === featuredId)
  const tasksUnit = getUnit(TICKET_UNIT_ID)
  const tasksOpen = tasksUnit ? isUnitCompleted(tasksUnit, progress) : false

  return (
    <AppShell name={name} email={email} counts={counts}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <p className="text-sm text-muted-foreground">
          Kaffeesatz GmbH · Produktteam Berlin · a fictional team
        </p>
        <h1 className="mt-1 font-display text-h1 font-bold">Your team</h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          Day {dayAtCompany(startedAt)} at the office. This is an educational
          simulation: the team is made up, and nothing you do here is sent to a
          real person, company or tool.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] xl:gap-14">
          <div className="min-w-0">
            <h2 className="font-display text-h2 font-bold">
              Today at the office
            </h2>

            {featured && featuredUnit && (
              <section
                aria-labelledby="standup-title"
                className={cn(
                  "mt-4 rounded-2xl p-5 sm:p-6",
                  featuredState === "ready"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    featuredState === "ready"
                      ? "opacity-90"
                      : "text-muted-foreground"
                  )}
                >
                  09:30 · meeting room
                </p>
                <h3 id="standup-title" className="mt-1 text-xl font-bold">
                  Daily standup with Lena
                </h3>
                <p
                  className={cn(
                    "mt-1",
                    featuredState === "ready"
                      ? "opacity-90"
                      : "text-secondary-text"
                  )}
                >
                  {featured.prompts.length} short prompts, using only the German
                  from Unit {featuredUnit.number}.
                </p>
                <GermanText as="p" className="mt-3 text-xl">
                  {featured.line.de}
                </GermanText>
                <div className="mt-4">
                  {featuredState === "locked" && (
                    <p className="flex items-center gap-2 text-sm text-secondary-text">
                      <Lock aria-hidden="true" className="size-4" />
                      Opens when you finish Unit {featuredUnit.number}.
                      <Link
                        href={`/path?unit=${featuredUnit.id}`}
                        className="font-semibold text-primary-text underline underline-offset-[3px]"
                      >
                        See the unit
                      </Link>
                    </p>
                  )}
                  {featuredState === "ready" && (
                    <Link
                      href="/team/standup"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "secondary" })
                      )}
                    >
                      Join standup
                      <ArrowRight aria-hidden="true" data-icon="inline-end" />
                    </Link>
                  )}
                  {featuredState === "done" && (
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-success-text">
                        <Check aria-hidden="true" className="size-4" />
                        Standup done
                      </p>
                      <Link
                        href="/team/standup"
                        className={buttonVariants({ variant: "outline" })}
                      >
                        Play it again
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <Ticket aria-hidden="true" className="size-4" />,
                  kind: "Task · 11:00",
                  title: "Ticket KLAR-142: test the new sign-in",
                  text: "Read the ticket and tell Lena what you’re doing today.",
                  href: "/team/tickets/KLAR-142",
                  action: "Open ticket",
                },
                {
                  icon: <MessageSquare aria-hidden="true" className="size-4" />,
                  kind: "Message · 14:02",
                  title: "Jonas needs a quick review",
                  text: "Read his message and reply the way a colleague would.",
                  href: "/team/chat",
                  action: "Read and reply",
                },
              ].map((task) => (
                <li
                  key={task.href}
                  className={cn(
                    "rounded-2xl p-5",
                    tasksOpen
                      ? "border border-border bg-card"
                      : "border border-dashed border-input"
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    {task.icon}
                    {task.kind}
                    {!tasksOpen && " · locked"}
                  </p>
                  <p className="mt-2 font-semibold">{task.title}</p>
                  <p className="mt-1 text-sm text-secondary-text">
                    {tasksOpen
                      ? task.text
                      : `Opens when you finish Unit ${tasksUnit?.number}. It uses the German from that unit.`}
                  </p>
                  {tasksOpen && (
                    <Link
                      href={task.href}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mt-3"
                      )}
                    >
                      {task.action}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              These are practice tasks. The tickets and messages are made up,
              and nothing you answer is sent to a person or saved.
            </p>

            <section aria-labelledby="ladder" className="mt-10">
              <h2 id="ladder" className="font-display text-h2 font-bold">
                Your standup, unit by unit
              </h2>
              <p className="mt-1 text-secondary-text">
                Each unit adds one step, written only with German that unit has
                taught.
              </p>
              <ol className="mt-4 divide-y divide-border-subtle rounded-xl border border-border-subtle">
                {units.map((unit) => {
                  const state = standupState(
                    unit.id,
                    progress,
                    completedStandups
                  )
                  return (
                    <li
                      key={unit.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm text-muted-foreground">
                          Unit {unit.number}
                        </span>
                        <span className="block truncate font-semibold">
                          {unit.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-sm font-semibold",
                          state === "done" && "text-success-text",
                          state === "ready" && "text-primary-text",
                          (state === "locked" || state === "planned") &&
                            "text-muted-foreground"
                        )}
                      >
                        {stateLabel[state]}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>

          <aside aria-labelledby="who" className="lg:pt-1">
            <h2 id="who" className="flex items-center gap-2 font-bold">
              <Users
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
              Who’s who
            </h2>
            <ul className="mt-3 divide-y divide-border-subtle">
              {people.map((person) => (
                <li key={person.name} className="flex items-center gap-3 py-3">
                  <Avatar
                    person={person.person}
                    initials={person.initials}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-secondary-text">{person.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </AppShell>
  )
}
