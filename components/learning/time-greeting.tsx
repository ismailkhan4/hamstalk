"use client"

import { useSyncExternalStore } from "react"

/** Lesson 2's rule: Guten Morgen until about 11, Guten Tag until about 6 pm, then Guten Abend. */
export function greetingFor(hour: number) {
  if (hour >= 5 && hour < 11) return "Guten Morgen"
  if (hour >= 11 && hour < 18) return "Guten Tag"
  return "Guten Abend"
}

const subscribe = () => () => {}

export function TimeGreeting({ name }: { name: string }) {
  const greeting = useSyncExternalStore(
    subscribe,
    () => greetingFor(new Date().getHours()),
    () => "Hallo"
  )
  return (
    <>
      {greeting}, {name}.
    </>
  )
}
