import "server-only"

import { createClient } from "@supabase/supabase-js"

import { getPublicEnv } from "@/lib/env"

import type { Database } from "./database.types"

/**
 * A Supabase client with the project's secret key: it bypasses row level security. Only for
 * trusted server jobs that act for no single learner, such as the reminder endpoint. Null when
 * SUPABASE_SECRET_KEY isn't set.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) return null
  return createClient<Database>(getPublicEnv().NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
