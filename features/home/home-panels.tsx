import { NotebookPen, Target, Zap } from "lucide-react"
import Link from "next/link"

import { Avatar } from "@/components/learning/avatar"
import { initialsFor } from "@/components/learning/team-badge"
import {
  goalOptions,
  levelOptions,
  type Preferences,
} from "@/features/onboarding/options"

export function TeamCard({ name }: { name: string }) {
  return (
    <section
      aria-labelledby="team-title"
      className="rounded-2xl bg-inset p-5 sm:flex sm:gap-6 sm:p-6"
    >
      <span
        className="flex shrink-0 [&>*]:shadow-[0_0_0_2.5px_var(--inset)] [&>*+*]:-ml-2"
        aria-hidden="true"
      >
        <Avatar person="lf" initials="LF" size="lg" />
        <Avatar person="jk" initials="JK" size="lg" />
        <Avatar person="ao" initials="AÖ" size="lg" />
        <Avatar person="aw" initials="AW" size="lg" />
        <Avatar person="me" initials={initialsFor(name) || "?"} size="lg" />
      </span>
      <div className="mt-4 sm:mt-0">
        <h2 id="team-title" className="font-bold">
          Your team at Kaffeesatz GmbH
        </h2>
        <p className="mt-1 text-secondary-text">
          Kaffeesatz GmbH is a small software company in Berlin, made up for
          this course. Lena, Jonas, Aylin and Anna are your teammates. Each
          lesson is a moment from your working day with them, and every unit
          adds one line you can say at the 9:30 standup.
        </p>
      </div>
    </section>
  )
}

export function PlanPanel({ preferences }: { preferences: Preferences }) {
  const rows = [
    [
      "Goal",
      preferences.goal ? goalOptions[preferences.goal].title : "Not set",
    ],
    [
      "Daily target",
      preferences.dailyMinutes
        ? `${preferences.dailyMinutes} min a day`
        : "Not set",
    ],
    [
      "Starting level",
      preferences.startLevel
        ? levelOptions[preferences.startLevel].title
        : "Not set",
    ],
    ["Today", "Nothing yet today"],
  ]
  return (
    <section aria-labelledby="plan-title">
      <div className="flex items-baseline justify-between">
        <h2 id="plan-title" className="font-bold">
          Your plan
        </h2>
        <span className="text-xs text-muted-foreground">From onboarding</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href="/onboarding/goal"
        className="mt-4 inline-block text-sm font-semibold text-primary-text underline underline-offset-[3px]"
      >
        Change goal or daily target
      </Link>
    </section>
  )
}

const howItWorks = [
  {
    icon: Target,
    title: "Short lessons",
    text: "Six to twelve minutes each. Every answer gets instant feedback and a one-line explanation.",
  },
  {
    icon: NotebookPen,
    title: "Mistakes are part of it",
    text: "A wrong answer gets a hint and a second try. Missed answers go to your mistakes notebook and come back in reviews.",
  },
  {
    icon: Zap,
    title: "XP shows effort, not level",
    text: "You earn XP for practising. Your level only changes when you pass the A1 checkpoint after Unit 8.",
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title">
      <h2 id="how-title" className="font-bold">
        How it works
      </h2>
      <ul className="mt-3 flex flex-col gap-4 text-sm">
        {howItWorks.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <Icon
              aria-hidden="true"
              className="mt-0.5 size-[18px] shrink-0 text-primary-text"
            />
            <span>
              <b className="block">{title}</b>
              <span className="text-secondary-text">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
