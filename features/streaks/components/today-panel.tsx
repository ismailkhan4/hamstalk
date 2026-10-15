import { loadHabit } from "../data"
import { TodayCard } from "./today-card"

/** The home screen's streak and goal card, or nothing until the habit tables exist. */
export async function TodayPanel() {
  const habit = await loadHabit()
  return habit ? <TodayCard habit={habit} /> : null
}
