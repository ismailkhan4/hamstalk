import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { TARGET_LANG } from "@/content/courses"
import { Logo } from "@/components/brand/logo"
import { Avatar } from "@/components/learning/avatar"
import { initialsFor } from "@/components/learning/team-badge"
import { TimeGreeting } from "@/components/learning/time-greeting"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  DatabaseNotReadyError,
  loadPreferences,
} from "@/features/onboarding/data"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { requireUser } from "@/lib/auth/session"
import { firstName } from "@/lib/auth/user-name"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "You’re all set" }

const handoff = {
  beginner: {
    kicker: "Mission 1 · Unit 1, Lesson 1 · Hallo!",
    text: "Your path starts with Unit 1, Lesson 1: hello and goodbye. Then the rest of Unit 1: greetings for the time of day, your name and danke. Lena, Jonas and Aylin will greet you at the 9:30 standup.",
  },
  a1: {
    kicker: "Mission 1 · Unit 3, Lesson 1 · Wie heißt du?",
    text: "Your path starts at Unit 3: names, jobs and countries. Units 1 and 2 stay open if you want a quick review.",
  },
  preview: {
    kicker: "Your path · preview",
    text: "Lessons at your level are planned but not built yet. Your path shows what’s coming, and Unit 1 is the first to open.",
  },
}

export default async function ReadyPage() {
  const user = await requireUser("/onboarding/ready")
  const supabase = await createClient()
  let preferences
  try {
    preferences = await loadPreferences(supabase, user.id)
  } catch (error) {
    if (error instanceof DatabaseNotReadyError) return <DatabaseNotReady />
    throw error
  }
  if (!preferences.onboardedAt) redirect(`/onboarding/${preferences.step}`)

  const level = preferences.startLevel ?? "beginner"
  const copy =
    level === "beginner"
      ? handoff.beginner
      : level === "a1"
        ? handoff.a1
        : handoff.preview
  const name = firstName(user)

  return (
    <div className="flex min-h-svh flex-col bg-deep px-[clamp(20px,5vw,112px)] py-6 text-deep-foreground">
      <header>
        <Link
          href="/"
          aria-label="Hamstalk home"
          className="[&_span]:text-deep-foreground"
        >
          <Logo symbolClassName="size-[30px]" />
        </Link>
      </header>
      <main id="main" className="flex flex-1 flex-col justify-center py-16">
        <p className="flex items-center gap-2 text-sm font-semibold text-mint">
          <i aria-hidden="true" className="size-2.5 rounded-full bg-spark" />
          {copy.kicker}
        </p>
        <h1
          lang={TARGET_LANG}
          className="mt-4 max-w-[14ch] font-voice text-[clamp(44px,5.6vw,72px)] leading-[1.04]"
        >
          <TimeGreeting name={name} />
        </h1>
        <p className="mt-5 max-w-[48ch] text-body-lg text-deep-muted">
          {copy.text}
        </p>
        <p className="mt-6 flex items-center gap-3 text-sm text-deep-muted">
          <span className="flex [&>*]:shadow-[0_0_0_2px_var(--deep)] [&>*+*]:-ml-2">
            <Avatar person="lf" initials="LF" size="sm" />
            <Avatar person="jk" initials="JK" size="sm" />
            <Avatar person="ao" initials="AÖ" size="sm" />
            <Avatar
              person="me"
              initials={initialsFor(user.fullName || name)}
              size="sm"
            />
          </span>
          Your team today
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/home"
            className={buttonVariants({ variant: "inverse", size: "lg" })}
          >
            Go to my Home
          </Link>
          <Link
            href="/onboarding/plan"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
              className:
                "text-deep-foreground shadow-[inset_0_0_0_1.5px_var(--deep-line)] hover:bg-deep-raise hover:text-deep-foreground",
            })}
          >
            <ArrowLeft aria-hidden="true" />
            Back to my plan
          </Link>
        </div>
      </main>
    </div>
  )
}
