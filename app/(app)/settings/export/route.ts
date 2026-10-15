import { NextResponse } from "next/server"

import { requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

const TABLES = [
  "learner_preferences",
  "placement_attempts",
  "lesson_progress",
  "saved_phrases",
  "review_items",
  "mistakes",
  "standup_completions",
] as const

/** A copy of everything stored for the signed-in learner. Policies limit every query to their own rows. */
export async function GET() {
  const user = await requireUser("/settings")
  const supabase = await createClient()

  const results = await Promise.all(
    TABLES.map(async (table) => {
      const { data, error } = await supabase.from(table).select("*")
      return [table, error ? null : data] as const
    })
  )
  if (results.some(([, data]) => data === null))
    return NextResponse.json(
      { error: "Your data couldn’t be read. Try again in a moment." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )

  return new NextResponse(
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        account: { email: user.email, name: user.fullName },
        data: Object.fromEntries(results),
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="klarlingo-data.json"',
        "Cache-Control": "no-store",
      },
    }
  )
}
