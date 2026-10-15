import type { Metadata } from "next"

import { AppShell } from "@/components/layout/app-shell"
import { ActivityList } from "@/features/activity/activity-list"
import { loadActivity } from "@/features/activity/data"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Activity" }

export default async function ActivityPage() {
  const learner = await loadLearner("/activity")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const entries = await loadActivity(await createClient())

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
          <h1 className="font-display text-h1 font-bold">Activity</h1>
          <p className="mt-2 text-body-lg text-secondary-text">
            What you’ve done recently. Open anything to practise it again.
          </p>
          <ActivityList entries={entries} />
        </div>
      </main>
    </AppShell>
  )
}
