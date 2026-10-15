export type Rating = "again" | "remembered"
export type Strength = 1 | 2 | 3

export type Schedule = { strength: Strength; dueAt: Date }

const DAY_MS = 86_400_000
const REMEMBERED_DAYS: Record<Strength, number> = { 1: 2, 2: 4, 3: 7 }

export function firstDue(now: Date): Date {
  return new Date(now.getTime() + DAY_MS)
}

export function rate(strength: Strength, rating: Rating, now: Date): Schedule {
  if (rating === "again") {
    return {
      strength: Math.max(1, strength - 1) as Strength,
      dueAt: new Date(now.getTime() + DAY_MS),
    }
  }
  const next = Math.min(3, strength + 1) as Strength
  return {
    strength: next,
    dueAt: new Date(now.getTime() + REMEMBERED_DAYS[next] * DAY_MS),
  }
}

export function isDue(dueAt: Date | string, now: Date) {
  return new Date(dueAt).getTime() <= now.getTime()
}

export function nextDueLabel(rating: Rating, strength: Strength) {
  if (rating === "again") return "Comes back tomorrow"
  return strength >= 3
    ? "Comes back in about a week"
    : "Comes back in a few days"
}
