"use client"

import { useCallback, useSyncExternalStore } from "react"

import { moveLegacyKeys } from "./stored-keys"

// Every page loads this module (AppearanceSync is in the root layout), before anything reads storage.
if (typeof window !== "undefined") moveLegacyKeys()

export const MOTION_OPTIONS = ["system", "reduce"] as const
export const TEXT_SIZE_OPTIONS = ["default", "large"] as const
export const TOGGLE_OPTIONS = ["on", "off"] as const

export type Motion = (typeof MOTION_OPTIONS)[number]
export type TextSize = (typeof TEXT_SIZE_OPTIONS)[number]
export type Toggle = (typeof TOGGLE_OPTIONS)[number]

const KEYS = {
  motion: "hamstalk-motion",
  textSize: "hamstalk-text-size",
  sound: "hamstalk-sound",
  haptics: "hamstalk-haptics",
}
const CHANGE_EVENT = "hamstalk-appearance"

function read<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T
): T {
  try {
    const value = window.localStorage.getItem(key)
    return allowed.find((option) => option === value) ?? fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private windows can refuse storage. The setting still applies until the page closes.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** Applies the saved choices to the page. Kept in this browser only; they are display preferences, not learner data. */
export function applyAppearance() {
  const root = document.documentElement
  const motion = read(KEYS.motion, MOTION_OPTIONS, "system")
  const textSize = read(KEYS.textSize, TEXT_SIZE_OPTIONS, "default")
  if (motion === "reduce") root.dataset.motion = "reduce"
  else delete root.dataset.motion
  if (textSize === "large") root.dataset.textSize = "large"
  else delete root.dataset.textSize
}

export function useAppearance() {
  const motion = useSyncExternalStore(
    subscribe,
    () => read(KEYS.motion, MOTION_OPTIONS, "system"),
    () => "system" as Motion
  )
  const textSize = useSyncExternalStore(
    subscribe,
    () => read(KEYS.textSize, TEXT_SIZE_OPTIONS, "default"),
    () => "default" as TextSize
  )
  const sound = useSyncExternalStore(
    subscribe,
    () => read(KEYS.sound, TOGGLE_OPTIONS, "on"),
    () => "on" as Toggle
  )
  const haptics = useSyncExternalStore(
    subscribe,
    () => read(KEYS.haptics, TOGGLE_OPTIONS, "on"),
    () => "on" as Toggle
  )
  const setMotion = useCallback(
    (value: Motion) => write(KEYS.motion, value),
    []
  )
  const setTextSize = useCallback(
    (value: TextSize) => write(KEYS.textSize, value),
    []
  )
  const setSound = useCallback((value: Toggle) => write(KEYS.sound, value), [])
  const setHaptics = useCallback(
    (value: Toggle) => write(KEYS.haptics, value),
    []
  )
  return {
    motion,
    textSize,
    sound,
    haptics,
    setMotion,
    setTextSize,
    setSound,
    setHaptics,
  }
}

/**
 * The feedback choices as they are right now, for code that runs outside React (sound and
 * vibration fire from event handlers). Motion follows the device unless the learner reduced it here.
 */
export function feedbackPreferences() {
  if (typeof window === "undefined")
    return { sound: false, haptics: false, reduceMotion: true }
  return {
    sound: read(KEYS.sound, TOGGLE_OPTIONS, "on") === "on",
    haptics: read(KEYS.haptics, TOGGLE_OPTIONS, "on") === "on",
    reduceMotion:
      read(KEYS.motion, MOTION_OPTIONS, "system") === "reduce" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }
}
