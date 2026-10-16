"use client"

import Link from "next/link"

import { ACTIVE_COURSE } from "@/content/courses"
import { cn } from "@/lib/utils"

import { useEconomy } from "../economy-context"
import { AKKU_MAX } from "../model"
import { AkkuMeter } from "./akku-meter"
import { Nut } from "./nut"

/** The shell's nut count and Akku, linking to the shop. Nothing until economy.sql is applied. */
export function StashStats({ className }: { className?: string }) {
  const economy = useEconomy()
  if (!economy) return null
  return (
    <Link
      href="/shop"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 font-extrabold tabular-nums hover:bg-accent",
        className
      )}
    >
      <span className="inline-flex items-center gap-1 text-reward-text">
        <Nut />
        {economy.nuts.toLocaleString("en")}
        <span className="sr-only"> nuts</span>
      </span>
      <span className="inline-flex items-center gap-1 text-sm text-secondary-text">
        <AkkuMeter akku={economy.akku} size="sm" />
        <span aria-hidden="true" className="max-sm:hidden">
          {economy.akku}
        </span>
        <span className="sr-only">
          , {ACTIVE_COURSE.phrases.akku} {economy.akku} of {AKKU_MAX} bars. Open
          the shop
        </span>
      </span>
    </Link>
  )
}
