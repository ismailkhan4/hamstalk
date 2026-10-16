import "server-only"

import type { createClient } from "@/lib/supabase/server"

type Supabase = Awaited<ReturnType<typeof createClient>>

/** Units whose Express run the learner has passed. Empty until adaptive.sql is applied. */
export async function loadExpressPassed(supabase: Supabase): Promise<string[]> {
  const { data, error } = await supabase.from("unit_express").select("unit_id")
  return error ? [] : (data ?? []).map((row) => row.unit_id)
}
