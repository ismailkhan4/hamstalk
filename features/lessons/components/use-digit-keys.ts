"use client"

import { useEffect } from "react"

export function useDigitKeys(
  count: number,
  enabled: boolean,
  onPick: (index: number) => void
) {
  useEffect(() => {
    if (!enabled) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return
      const number = Number(event.key)
      if (Number.isInteger(number) && number >= 1 && number <= count)
        onPick(number - 1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [count, enabled, onPick])
}
