export type StrengthCounts = { weak: number; medium: number; strong: number }

export function strengthTotal(counts: StrengthCounts) {
  return counts.weak + counts.medium + counts.strong
}

export type DayBar = {
  key: string
  label: string
  count: number
  today: boolean
}

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

/**
 * Lessons finished on each of the last seven days in the learner's own calendar, oldest first.
 * Counting lessons, not minutes: Klarlingo doesn't time sessions, so it doesn't claim a duration.
 */
export function weekBars(completedAt: string[], now: Date): DayBar[] {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (6 - i)
    )
    return {
      key: dayKey(date),
      label: date.toLocaleDateString("en-GB", { weekday: "short" }),
      count: 0,
      today: i === 6,
    }
  })
  for (const iso of completedAt) {
    const bar = days.find((day) => day.key === dayKey(new Date(iso)))
    if (bar) bar.count += 1
  }
  return days
}
