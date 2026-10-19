import { z } from "zod"

/**
 * Friends: one-way follows, the weekly table of the people you follow, and nudges. friends.sql
 * decides everything; this file only describes what it returns.
 */

export const friendSchema = z.object({
  handle: z.string(),
  displayName: z.string(),
  streak: z.number().int().min(0),
  me: z.boolean(),
})

export type Friend = z.infer<typeof friendSchema>

export const profileFriendsSchema = z.object({
  following: z.array(friendSchema),
  followers: z.array(friendSchema),
  followingCount: z.number().int().min(0),
  followersCount: z.number().int().min(0),
  iFollow: z.boolean(),
  followsMe: z.boolean(),
})

export type ProfileFriends = z.infer<typeof profileFriendsSchema>

export const friendWeekSchema = friendSchema.extend({
  xp: z.number().int().min(0),
  practisedToday: z.boolean(),
  canNudge: z.boolean(),
})

export type FriendWeek = z.infer<typeof friendWeekSchema>

export const searchResultSchema = friendSchema.extend({ iFollow: z.boolean() })

export type SearchResult = z.infer<typeof searchResultSchema>

/** What nudge() answers, and what each answer tells the learner. */
export const NUDGE_RESULTS = {
  sent: "Nudge sent.",
  unknown: "That profile isn’t available any more.",
  "not-mutual": "You can nudge friends who follow you back.",
  practised: "They’ve already practised today.",
  already: "You’ve nudged them today already.",
  off: "They’ve turned nudges off.",
  limit: "They’ve had enough nudges for today.",
} as const

export type NudgeResult = keyof typeof NUDGE_RESULTS
