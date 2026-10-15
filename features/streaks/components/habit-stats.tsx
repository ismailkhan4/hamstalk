"use client"

import { useHabit } from "../habit-context"
import { HabitBadgesView } from "./habit-badges-view"

/** The shell's streak and goal badges, from the habit the (app) layout loaded. */
export function HabitStats({ className }: { className?: string }) {
  const habit = useHabit()
  return habit ? <HabitBadgesView habit={habit} className={className} /> : null
}
