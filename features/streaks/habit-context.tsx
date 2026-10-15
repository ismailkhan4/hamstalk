"use client"

import { createContext, useContext } from "react"

import type { Habit } from "./data"

const HabitContext = createContext<Habit | null>(null)

/**
 * The learner's streak and today's XP, loaded once by the (app) layout and read by the app shell,
 * which some pages render from client components that can't load data themselves.
 */
export function HabitProvider({
  habit,
  children,
}: {
  habit: Habit | null
  children: React.ReactNode
}) {
  return <HabitContext value={habit}>{children}</HabitContext>
}

export function useHabit() {
  return useContext(HabitContext)
}
