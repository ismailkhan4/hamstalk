"use client"

import { useSyncExternalStore } from "react"

import { feedbackPreferences } from "@/lib/appearance"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  window.addEventListener("hamstalk-appearance", onChange)
  window.addEventListener("storage", onChange)
  return () => {
    media.removeEventListener("change", onChange)
    window.removeEventListener("hamstalk-appearance", onChange)
    window.removeEventListener("storage", onChange)
  }
}

/**
 * True when the learner asked for less motion, on their device or in Hamstalk's own settings.
 * Celebrations then still happen (sound, colour, words), just without things flying around.
 *
 * The server can't know, so it renders with motion and the browser switches straight after
 * hydrating: both first renders agree, which keeps hydration intact.
 */
export function useLessMotion() {
  return useSyncExternalStore(
    subscribe,
    () => feedbackPreferences().reduceMotion,
    () => false
  )
}
