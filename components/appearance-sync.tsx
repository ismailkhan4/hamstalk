"use client"

import { useEffect } from "react"

import { applyAppearance } from "@/lib/appearance"

/** Applies the learner's motion and text-size choices on every page, and again whenever they change. */
export function AppearanceSync() {
  useEffect(() => {
    applyAppearance()
    window.addEventListener("klarlingo-appearance", applyAppearance)
    window.addEventListener("storage", applyAppearance)
    return () => {
      window.removeEventListener("klarlingo-appearance", applyAppearance)
      window.removeEventListener("storage", applyAppearance)
    }
  }, [])
  return null
}
