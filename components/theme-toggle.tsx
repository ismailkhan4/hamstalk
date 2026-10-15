"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

const subscribe = () => () => {}

function withThemeTransition(update: () => void) {
  const root = document.documentElement
  if (
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update()
    return
  }
  root.dataset.themeTransition = ""
  const transition = document.startViewTransition(() => flushSync(update))
  transition.finished.finally(() => delete root.dataset.themeTransition)
}

/** One-click light/dark switch. The full Light / Dark / System choice lives in Settings. */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() =>
        withThemeTransition(() => setTheme(isDark ? "light" : "dark"))
      }
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "grid size-11 place-items-center rounded-lg text-secondary-text transition-colors duration-(--duration-fast) hover:bg-accent hover:text-foreground",
        className
      )}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-5" />
      ) : (
        <Moon aria-hidden="true" className="size-5" />
      )}
    </button>
  )
}

export { ThemeToggle }
