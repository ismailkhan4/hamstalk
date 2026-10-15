import type { Metadata } from "next"

import { loadLearner } from "@/features/learner/load-learner"
import { buildNotifications } from "@/features/notifications/items"
import { NotificationsView } from "@/features/notifications/notifications-view"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"
import { loadCompletedStandups } from "@/features/team/data"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Notifications" }

export default async function NotificationsPage() {
  const learner = await loadLearner("/notifications")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const completedStandups = await loadCompletedStandups(await createClient())

  return (
    <NotificationsView
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
      items={buildNotifications({
        dueWords: learner.counts.due,
        startLevel: learner.preferences.startLevel,
        progress: learner.progress,
        completedStandups,
      })}
    />
  )
}
