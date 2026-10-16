import "server-only"

import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

import { economySchema, type Economy } from "./model"

/**
 * The learner's stash, Akku, today's plan and pins, from my_economy(). Cached per request. Null
 * when the learner is signed out or economy.sql isn't applied yet, so every screen still works.
 */
export const loadEconomy = cache(async (): Promise<Economy | null> => {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub) return null
  const { data, error } = await supabase.rpc("my_economy")
  if (error) return null
  const parsed = economySchema.safeParse(data)
  return parsed.success ? parsed.data : null
})
