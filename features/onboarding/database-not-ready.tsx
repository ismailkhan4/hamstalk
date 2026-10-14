import { Database } from "lucide-react"

import { EmptyState } from "@/components/feedback/empty-state"

/** Shown instead of a crash when this copy of Klarlingo has no learner tables yet. */
export function DatabaseNotReady() {
  return (
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-background px-4"
    >
      <EmptyState
        icon={Database}
        tone="error"
        title="The database isn’t set up yet"
      >
        Your account works, but the tables that store your answers are missing.
        If you run this copy of Klarlingo, apply the SQL files in{" "}
        <code className="font-mono text-sm">supabase/migrations</code>, then
        reload this page.
      </EmptyState>
    </main>
  )
}
