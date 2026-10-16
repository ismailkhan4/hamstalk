"use client"

import { createContext, useContext } from "react"

import { MAX_TRIES } from "./attempt"

const TriesContext = createContext(MAX_TRIES)

/**
 * How many tries an answer gets. Lessons give two (a hint, then a second try); an Express run
 * gives one, and shows the answer straight away when it's wrong.
 */
export function TriesProvider({
  tries,
  children,
}: {
  tries: number
  children: React.ReactNode
}) {
  return <TriesContext value={tries}>{children}</TriesContext>
}

export function useMaxTries() {
  return useContext(TriesContext)
}
