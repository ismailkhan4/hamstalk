"use client"

import { createContext, useContext } from "react"

import type { Economy } from "./model"

const EconomyContext = createContext<Economy | null>(null)

/** The stash, loaded once by the (app) layout, for the shell's nut count and Akku. */
export function EconomyProvider({
  economy,
  children,
}: {
  economy: Economy | null
  children: React.ReactNode
}) {
  return <EconomyContext value={economy}>{children}</EconomyContext>
}

export function useEconomy() {
  return useContext(EconomyContext)
}
