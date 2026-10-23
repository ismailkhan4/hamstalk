import { z } from "zod"

import { ACTIVE_COURSE } from "@/content/courses"

/**
 * The weekly league: ten divisions, a table per week, promotion and relegation. leagues.sql decides
 * everything; this file only describes what it returns and how to name it.
 */

export const DIVISIONS = 10

/** A place in a table: 1st, 2nd, 3rd, 11th, 22nd. */
export const ordinal = (n: number) =>
  `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`

export const leagueRowSchema = z.object({
  rank: z.number().int().positive(),
  kind: z.enum(["learner", "pacer"]),
  /** A learner's public handle (null when their profile is private), or a pacer's id. */
  ref: z.string().nullable(),
  name: z.string().nullable(),
  xp: z.number().int().min(0),
  me: z.boolean(),
})

export const leagueResultSchema = z.object({
  week: z.string(),
  division: z.number().int().min(1).max(DIVISIONS),
  rank: z.number().int().positive(),
  result: z.enum(["promoted", "stayed", "relegated"]),
})

export const leagueSchema = z.object({
  week: z.string(),
  endsAt: z.string(),
  division: z.number().int().min(1).max(DIVISIONS),
  xp: z.number().int().min(0),
  joined: z.boolean(),
  promote: z.number().int().min(0),
  relegate: z.number().int().min(0),
  table: z.array(leagueRowSchema),
  result: leagueResultSchema.nullable(),
})

export type League = z.infer<typeof leagueSchema>
export type LeagueRow = z.infer<typeof leagueRowSchema>
export type LeagueResult = z.infer<typeof leagueResultSchema>

export const profileSchema = z.object({
  handle: z.string(),
  displayName: z.string(),
  joinedAt: z.string(),
  me: z.boolean(),
  isPublic: z.boolean(),
  division: z.number().int().min(1).max(DIVISIONS),
  streak: z.number().int().min(0),
  longestStreak: z.number().int().min(0),
  xp: z.number().int().min(0),
  lessons: z.number().int().min(0),
  pins: z.array(
    z.object({
      pin: z.string(),
      tier: z.number().int().min(1),
      unlockedAt: z.string(),
    })
  ),
})

export type Profile = z.infer<typeof profileSchema>

export const myProfileSchema = z.object({
  handle: z.string(),
  displayName: z.string(),
  isPublic: z.boolean(),
})

export type MyProfile = z.infer<typeof myProfileSchema>

export function divisionName(division: number) {
  return ACTIVE_COURSE.phrases.divisions[division - 1] ?? `Division ${division}`
}

export function pacerOf(id: string | null) {
  return ACTIVE_COURSE.pacers.find((pacer) => pacer.id === id) ?? null
}

/** Which zone a rank is in, for a table of `size`. */
export function zoneOf(
  rank: number,
  size: number,
  league: Pick<League, "promote" | "relegate">
): "promotion" | "relegation" | null {
  if (rank <= league.promote) return "promotion"
  if (rank > size - league.relegate) return "relegation"
  return null
}

/** "3 days", "5 hours", "40 min": time left until the final whistle. */
export function timeLeft(ms: number) {
  const hours = ms / 3_600_000
  if (hours >= 48) return `${Math.floor(hours / 24)} days`
  if (hours >= 2) return `${Math.floor(hours)} hours`
  return `${Math.max(1, Math.ceil(ms / 60_000))} min`
}
