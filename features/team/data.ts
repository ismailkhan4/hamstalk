import "server-only"

import { z } from "zod"

import { isMissingTable } from "@/features/onboarding/data"
import type { createClient } from "@/lib/supabase/server"

type Supabase = Awaited<ReturnType<typeof createClient>>

export async function loadCompletedStandups(
  supabase: Supabase
): Promise<string[]> {
  const { data, error } = await supabase
    .from("standup_completions")
    .select("unit_id")
  if (isMissingTable(error)) return []
  if (error)
    throw new Error(`Could not load standups (${error.code ?? "unknown"})`)
  return z
    .array(z.object({ unit_id: z.string() }))
    .parse(data)
    .map((row) => row.unit_id)
}
