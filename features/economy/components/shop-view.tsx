"use client"

import { BatteryCharging, Snowflake, Zap, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import type { BuyResult } from "../actions"
import {
  AKKU_MAX,
  REVIEWS_PER_BAR,
  SHOP,
  akkuAt,
  waitText,
  type Economy,
  type ShopItemId,
} from "../model"
import { useNow } from "../use-now"
import { AkkuMeter } from "./akku-meter"
import { Nut } from "./nut"

const ICONS: Record<ShopItemId, LucideIcon> = {
  recharge: BatteryCharging,
  freeze: Snowflake,
  boost: Zap,
}

/**
 * Hamsti's Vorrat: what the stash buys. Every price and check is the server's; this only offers
 * what makes sense right now and says why the rest doesn't.
 */
export function ShopView({
  economy,
  buy,
}: {
  economy: Economy
  buy: (item: ShopItemId) => Promise<BuyResult>
}) {
  const now = useNow()
  const { akku, nextBarAt } = akkuAt(economy, now)
  const boostLeft = economy.boostUntil
    ? Date.parse(economy.boostUntil) - now
    : 0
  const [pending, startTransition] = useTransition()
  const [buying, setBuying] = useState<ShopItemId | null>(null)
  const [message, setMessage] = useState<{
    tone: "success" | "error"
    text: string
  } | null>(null)

  function blocked(id: ShopItemId): string | null {
    if (id === "recharge" && akku >= AKKU_MAX) return "Your Akku is full"
    if (id === "freeze" && economy.freezes >= 2) return "You hold two already"
    if (id === "boost" && boostLeft > 0)
      return `Running · ${waitText(boostLeft)} left`
    return null
  }

  function onBuy(id: ShopItemId, title: string) {
    setBuying(id)
    setMessage(null)
    startTransition(async () => {
      const result = await buy(id)
      setBuying(null)
      if (result.ok) {
        playFeedback("complete")
        setMessage({ tone: "success", text: `${title}: done. Enjoy!` })
      } else setMessage({ tone: "error", text: result.message })
    })
  }

  return (
    <main id="main" className="mx-auto max-w-(--reading-max) px-4 py-8 sm:px-6">
      <div className="flex items-center gap-4">
        <Mascot mood="happy" size={88} />
        <div className="min-w-0">
          <h1 className="font-display text-h1 leading-tight font-semibold">
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.stash}</span>
          </h1>
          <p className="font-semibold text-secondary-text">
            {MASCOT_NAME}’s store cupboard. Quests and pins fill it; spend nuts
            on what keeps you going.
          </p>
        </div>
      </div>

      <p className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-reward-subtle px-4 py-2 font-display text-2xl font-semibold text-reward-text tabular-nums">
        <Nut className="size-7" />
        {economy.nuts.toLocaleString("en")}
        <span className="text-base font-bold">nuts</span>
      </p>

      <section
        aria-labelledby="akku-title"
        className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl border-2 border-border bg-card p-5"
      >
        <AkkuMeter akku={akku} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 id="akku-title" className="font-display text-xl font-semibold">
            <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.akku}</span>: {akku}{" "}
            of {AKKU_MAX} bars
          </h2>
          <p className="text-sm font-semibold text-muted-foreground">
            {nextBarAt
              ? `Next bar in ${waitText(nextBarAt - now)}. `
              : "Full. "}
            A lesson takes a bar for each answer you miss after the hint.
            Reviewing {REVIEWS_PER_BAR} words charges one back.
          </p>
        </div>
        {akku < AKKU_MAX && (
          <Link
            href="/review"
            className="text-sm font-extrabold text-primary-text hover:underline"
          >
            Review words
          </Link>
        )}
      </section>

      {message && (
        <Alert
          tone={message.tone === "success" ? "success" : "error"}
          title={message.tone === "success" ? "Bought" : "Not bought"}
          className="mt-6"
        >
          {message.text}
        </Alert>
      )}

      <h2 className="mt-8 font-display text-xl font-semibold">On the shelf</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {SHOP.map((item) => {
          const Icon = ICONS[item.id]
          const reason = blocked(item.id)
          const short = economy.nuts < item.price
          return (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-border bg-card p-4 shadow-[0_4px_0_var(--border)]"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-2xl",
                  item.id === "recharge" &&
                    "bg-success-subtle text-success-text",
                  item.id === "freeze" && "bg-info-subtle text-info-text",
                  item.id === "boost" && "bg-reward-subtle text-reward-text"
                )}
              >
                <Icon className="size-7" strokeWidth={2.4} />
              </span>
              <div className="min-w-[12rem] flex-1">
                <h3 className="font-extrabold">{item.title}</h3>
                <p className="text-sm font-semibold text-muted-foreground">
                  {item.body}
                  {item.id === "freeze" && ` You hold ${economy.freezes} of 2.`}
                </p>
              </div>
              <Button
                variant={reason || short ? "outline" : "reward"}
                disabled={Boolean(reason) || short || pending}
                loading={buying === item.id}
                onClick={() => onBuy(item.id, item.title)}
                className="shrink-0"
              >
                {reason ?? (
                  <>
                    <Nut className="size-5" />
                    {item.price}
                    <span className="sr-only"> nuts, buy {item.title}</span>
                  </>
                )}
              </Button>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-sm font-semibold text-muted-foreground">
        Earn nuts from your daily plan on Home, from reaching your daily goal,
        from streak milestones and from new pins on {MASCOT_NAME}’s lanyard.
      </p>
    </main>
  )
}
