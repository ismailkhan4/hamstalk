import "server-only"

import { cache } from "react"

import { isMissingTable } from "@/features/onboarding/data"
import { createClient } from "@/lib/supabase/server"

import {
  addDays,
  goalXpFor,
  localDate,
  streakState,
  type StreakRow,
  type StreakState,
} from "./model"

export type Habit = {
  today: string
  state: StreakState
  streak: StreakRow | null
  xpToday: number
  goalXp: number
  /** XP per local day for the last `days` days, oldest first. */
  days: { date: string; xp: number; frozen: boolean }[]
}

/**
 * The learner's streak, today's XP and recent days, for the app shell, home and progress. Cached
 * per request, so a page that shows it in several places reads it once. Null when the habit
 * tables aren't set up yet, so every screen still works without them.
 */
export const loadHabit = cache(async (days = 35): Promise<Habit | null> => {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return null

  const prefs = await supabase
    .from("learner_preferences")
    .select("timezone, daily_minutes")
    .eq("user_id", userId)
    .maybeSingle()
  const today = localDate(prefs.data?.timezone ?? null)
  const since = addDays(today, -(days - 1))

  const [streak, activity] = await Promise.all([
    supabase
      .from("streaks")
      .select(
        "current_streak, longest_streak, last_active_date, freezes, frozen_dates"
      )
      .maybeSingle(),
    supabase
      .from("daily_activity")
      .select("local_date, xp")
      .gte("local_date", since)
      .order("local_date"),
  ])
  if (isMissingTable(streak.error) || isMissingTable(activity.error))
    return null
  if (streak.error || activity.error) return null

  const row: StreakRow | null = streak.data
    ? {
        current: Number(streak.data.current_streak),
        longest: Number(streak.data.longest_streak),
        lastActive: streak.data.last_active_date,
        freezes: Number(streak.data.freezes),
        frozenDates: streak.data.frozen_dates ?? [],
      }
    : null

  const xpByDay = new Map(
    (activity.data ?? []).map((entry) => [entry.local_date, Number(entry.xp)])
  )
  const frozen = new Set(row?.frozenDates ?? [])
  return {
    today,
    state: streakState(row, today),
    streak: row,
    xpToday: xpByDay.get(today) ?? 0,
    goalXp: goalXpFor(prefs.data?.daily_minutes ?? null),
    days: Array.from({ length: days }, (_, i) => {
      const date = addDays(since, i)
      return { date, xp: xpByDay.get(date) ?? 0, frozen: frozen.has(date) }
    }),
  }
})
