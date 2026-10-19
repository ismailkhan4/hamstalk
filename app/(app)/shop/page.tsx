import { Store } from "lucide-react"
import type { Metadata } from "next"

import { EmptyState } from "@/components/feedback/empty-state"
import { AppShell } from "@/components/layout/app-shell"
import { buyAction } from "@/features/economy/actions"
import { ShopView } from "@/features/economy/components/shop-view"
import { loadEconomy } from "@/features/economy/data"
import { loadLearner } from "@/features/learner/load-learner"
import { DatabaseNotReady } from "@/features/onboarding/database-not-ready"

export const metadata: Metadata = { title: "Shop" }

export default async function ShopPage() {
  const learner = await loadLearner("/shop")
  if (learner === "database-not-ready") return <DatabaseNotReady />
  const economy = await loadEconomy()

  return (
    <AppShell
      name={learner.name}
      email={learner.user.email}
      counts={learner.counts}
    >
      {economy ? (
        <ShopView economy={economy} buy={buyAction} />
      ) : (
        <main id="main" className="grid min-h-[60svh] place-items-center px-4">
          <EmptyState
            icon={Store}
            tone="offline"
            title="The shop isn’t open yet"
          >
            Nuts, the Akku and the shop need the economy migration. If you run
            this copy of Hamstalk, apply supabase/migrations/economy.sql.
          </EmptyState>
        </main>
      )}
    </AppShell>
  )
}
