import "server-only"

import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

import {
  leagueSchema,
  myProfileSchema,
  profileSchema,
  type League,
  type MyProfile,
  type Profile,
} from "./model"

/**
 * The learner's league this week, from my_league(), which also settles finished weeks and joins a
 * table once there's XP. Null when signed out or leagues.sql isn't applied yet.
 */
export const loadLeague = cache(async (): Promise<League | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("my_league")
  if (error) return null
  const parsed = leagueSchema.safeParse(data)
  return parsed.success ? parsed.data : null
})

/** A learner's public profile, or null when it's unknown or private. */
export async function loadProfile(handle: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("public_profile", {
    p_handle: handle,
  })
  if (error || !data) return null
  const parsed = profileSchema.safeParse(data)
  return parsed.success ? parsed.data : null
}

/** The learner's own handle and name, created on first use. */
export const loadMyProfile = cache(async (): Promise<MyProfile | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("my_profile")
  if (error) return null
  const parsed = myProfileSchema.safeParse(data)
  return parsed.success ? parsed.data : null
})
