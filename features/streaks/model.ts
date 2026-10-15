/**
 * How a streak looks right now. The database settles missed days only when the learner next earns
 * XP, so between visits this works out what that will mean, without writing anything: the same
 * rules as award_xp() in supabase/migrations/habit_loop.sql.
 */

export type StreakRow = {
  current: number
  longest: number
  lastActive: string | null
  freezes: number
  frozenDates: string[]
}

export type StreakState =
  /** Never practised. */
  | { kind: "none" }
  /** Practised today: safe until tomorrow. */
  | { kind: "done"; count: number }
  /** Still alive, but today's practice is needed. `freezing` missed days will use freezes. */
  | { kind: "at-risk"; count: number; freezing: number }
  /** Missed more days than freezes cover: today starts a new one. */
  | { kind: "lost"; previous: number }

/** XP in a day that counts as practising that day. Matches c_streak_xp in award_xp(). */
export const STREAK_XP = 10

/** The learner's local date as YYYY-MM-DD, in their time zone (UTC when unknown). */
export function localDate(zone: string | null, now = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: zone ?? "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now)
  } catch {
    return now.toISOString().slice(0, 10)
  }
}

/** Whole days from `from` to `to`, both YYYY-MM-DD. */
export function daysBetween(from: string, to: string) {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86_400_000
  )
}

/** YYYY-MM-DD `days` after `date` (negative for before). */
export function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + days)
  return next.toISOString().slice(0, 10)
}

export function streakState(row: StreakRow | null, today: string): StreakState {
  if (!row?.lastActive || row.current === 0) return { kind: "none" }
  const gap = daysBetween(row.lastActive, today)
  if (gap <= 0) return { kind: "done", count: row.current }
  const missed = gap - 1
  if (missed <= row.freezes)
    return { kind: "at-risk", count: row.current, freezing: missed }
  return { kind: "lost", previous: row.current }
}

/** The number to show next to the flame. */
export function streakCount(state: StreakState) {
  return state.kind === "done" || state.kind === "at-risk" ? state.count : 0
}

/** The daily goal is chosen in minutes; a lesson earns about 3 XP a minute. Matches award_xp(). */
export function goalXpFor(minutes: number | null) {
  return (minutes ?? 10) * 3
}
