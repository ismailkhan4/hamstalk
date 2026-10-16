import { Dumbbell } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/feedback/empty-state"
import { buttonVariants } from "@/components/ui/button-variants"
import { getUnit } from "@/content/courses/de/curriculum"
import { buyAction, drainAkkuAction } from "@/features/economy/actions"
import { loadEconomy } from "@/features/economy/data"
import { loadLearner } from "@/features/learner/load-learner"
import { LessonRunner } from "@/features/lessons/components/lesson-runner"
import { initialsOf } from "@/features/lessons/initials"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { createClient } from "@/lib/supabase/server"

import { finishPracticeAction } from "../actions"
import { startPractice } from "../data"
import type { PracticeKind } from "../generate"

/** Practice saves nothing mid-session: the whole session is recorded when it ends. */
async function ok() {
  "use server"
  return { ok: true as const }
}

async function rechargeAkku() {
  "use server"
  return buyAction("recharge")
}

const EMPTY: Record<string, { title: string; body: string }> = {
  empty: {
    title: "Nothing to practise yet",
    body: "Finish a lesson first: practice is built from exercises you’ve already met.",
  },
  locked: {
    title: "This Express isn’t running yet",
    body: "Finish every lesson in the unit to unlock its Express run.",
  },
  "not-set-up": {
    title: "Practice isn’t set up yet",
    body: "Practice sessions need the adaptive migration. If you run this copy of Hamstalk, apply supabase/migrations/adaptive.sql.",
  },
}

/**
 * A practice session: built for the learner by the session generator and played in the lesson
 * runner. Smart practice and mistakes never use the Akku; the Express does, one try per answer.
 */
export async function PracticeSession({
  kind,
  unitId,
}: {
  kind: PracticeKind
  unitId?: string
}) {
  const path = unitId ? `/practice/express/${unitId}` : `/practice/${kind}`
  const learner = await loadLearner(path)
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const supabase = await createClient()
  const [session, economy] = await Promise.all([
    startPractice(supabase, learner.user.id, kind, learner.progress, unitId),
    kind === "express" ? loadEconomy() : null,
  ])

  if (!session.ok) {
    const copy = EMPTY[session.reason]!
    return (
      <main
        id="main"
        className="grid min-h-svh place-items-center bg-background px-4"
      >
        <EmptyState
          icon={Dumbbell}
          title={copy.title}
          actions={
            <Link
              href="/practice"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to practice
            </Link>
          }
        >
          {copy.body}
        </EmptyState>
      </main>
    )
  }

  const unit = unitId ? getUnit(unitId) : undefined
  return (
    <LessonRunner
      lesson={session.lesson}
      kicker={
        kind === "express"
          ? `Unit ${unit?.number} · Express`
          : kind === "mistakes"
            ? "Practice · Your mistakes"
            : "Practice · Picked for you"
      }
      learner={{
        firstName: learner.firstName,
        initials: initialsOf(learner.name),
      }}
      initial={{ step: 0, outcomes: [], savedPhraseKeys: [] }}
      replay={false}
      upNext={null}
      unitProgress={null}
      exitHref="/practice"
      pathHref="/practice"
      tries={kind === "express" ? 1 : 2}
      practice={{ kind, unitNumber: unit?.number }}
      actions={{
        saveProgress: ok,
        complete: finishPracticeAction.bind(null, session.sessionId),
        recordMistake: ok,
        savePhrase: ok,
        drainAkku: drainAkkuAction,
        rechargeAkku,
      }}
      stash={
        economy && {
          akku: economy.akku,
          nextBarAt: economy.nextBarAt,
          nuts: economy.nuts,
        }
      }
    />
  )
}
