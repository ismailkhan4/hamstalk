import type { Metadata } from "next"

import { AppShell } from "@/components/layout/app-shell"
import { loadLearner } from "@/features/learner/load-learner"
import { loadMistakes } from "@/features/mistakes/data"
import { MistakesClient } from "@/features/mistakes/mistakes-client"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Mistakes notebook" }

type Props = { searchParams: Promise<{ lesson?: string | string[] }> }

export default async function MistakesPage({ searchParams }: Props) {
  const learner = await loadLearner("/mistakes")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const [mistakes, params] = await Promise.all([
    loadMistakes(await createClient()),
    searchParams,
  ])

  return (
    <AppShell
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
    >
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="max-w-3xl">
          <MistakesClient
            mistakes={mistakes}
            lessonFilter={
              typeof params.lesson === "string" ? params.lesson : null
            }
          />
        </div>
      </main>
    </AppShell>
  )
}
