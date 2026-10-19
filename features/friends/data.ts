import "server-only"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

import {
  friendWeekSchema,
  profileFriendsSchema,
  type FriendWeek,
  type ProfileFriends,
} from "./model"

/**
 * Who a profile follows and who follows it. Null when the profile isn't visible, or friends.sql
 * isn't applied yet, which hides friends everywhere.
 */
export async function loadProfileFriends(
  handle: string
): Promise<ProfileFriends | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("profile_friends", {
    p_handle: handle,
  })
  if (error || !data) return null
  const parsed = profileFriendsSchema.safeParse(data)
  return parsed.success ? parsed.data : null
}

/** This league week's XP for the learner and everyone they follow. Null before friends.sql. */
export async function loadFriendsWeek(): Promise<FriendWeek[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("friends_week")
  if (error) return null
  const parsed = z.array(friendWeekSchema).safeParse(data)
  return parsed.success ? parsed.data : null
}

/** Whether friends may nudge the learner. Null before friends.sql. */
export async function loadAllowNudges(userId: string): Promise<boolean | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("allow_nudges")
    .eq("user_id", userId)
    .maybeSingle()
  return error || !data ? null : data.allow_nudges
}
