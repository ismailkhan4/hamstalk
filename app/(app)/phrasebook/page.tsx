import type { Metadata } from "next"

import { AppShell } from "@/components/layout/app-shell"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { PhrasebookClient } from "@/features/phrasebook/phrasebook-client"
import { loadPhrasebook } from "@/features/phrasebook/data"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Phrasebook" }

export default async function PhrasebookPage() {
  const learner = await loadLearner("/phrasebook")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const phrases = await loadPhrasebook(await createClient())

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
          <PhrasebookClient phrases={phrases} due={learner.counts.due} />
        </div>
      </main>
    </AppShell>
  )
}
