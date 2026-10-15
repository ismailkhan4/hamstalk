import { loadHabit } from "../data"
import { StreakCalendar } from "./streak-calendar"

/** The progress page's streak card, or nothing until the habit tables exist. */
export async function StreakSection() {
  const habit = await loadHabit()
  return habit ? <StreakCalendar habit={habit} /> : null
}
