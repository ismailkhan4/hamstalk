"use client"

import { BatteryCharging, BookOpenCheck, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"

import type { BuyResult } from "../actions"
import { REVIEWS_PER_BAR, SHOP, waitText } from "../model"
import { useNow } from "../use-now"
import { AkkuMeter } from "./akku-meter"
import { Nut } from "./nut"

const RECHARGE = SHOP.find((item) => item.id === "recharge")!

/**
 * Shown in place of the next exercise when the Akku runs flat. The place in the lesson is saved,
 * so every way out (recharge, practise, wait or leave) loses nothing.
 */
export function AkkuEmpty({
  nuts,
  nextBarAt,
  exitHref,
  buy,
  onRecharged,
}: {
  /** Null when the balance isn't known (no stash yet): recharging isn't offered. */
  nuts: number | null
  nextBarAt: number | null
  exitHref: string
  buy: () => Promise<BuyResult>
  onRecharged: () => void
}) {
  const now = useNow()
  const [pending, startTransition] = useTransition()
  const [problem, setProblem] = useState<string | null>(null)
  const canPay = nuts !== null && nuts >= RECHARGE.price

  function recharge() {
    setProblem(null)
    startTransition(async () => {
      const result = await buy()
      if (result.ok) onRecharged()
      else setProblem(result.message)
    })
  }

  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-(--lesson-max) flex-1 flex-col items-center px-[clamp(20px,4vw,32px)] py-10 text-center"
    >
      <Mascot mood="sleepy" size={128} />
      <AkkuMeter akku={0} size="lg" className="mt-3" />
      <h1
        lang={TARGET_LANG}
        className="mt-3 font-display text-[clamp(32px,5vw,44px)] leading-tight font-semibold"
      >
        {ACTIVE_COURSE.phrases.akkuEmpty}
      </h1>
      <p className="mt-2 max-w-[44ch] text-lg font-semibold text-secondary-text">
        {MASCOT_NAME} needs a breather. Your place in this lesson is saved, so
        pick up right here whenever you’re ready.
      </p>

      {problem && (
        <Alert
          tone="error"
          title="Not recharged"
          className="mt-6 w-full text-left"
        >
          {problem}
        </Alert>
      )}

      <ul className="mt-8 flex w-full flex-col gap-3 text-left">
        {nuts !== null && (
          <li className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-border bg-card p-4">
            <BatteryCharging
              aria-hidden="true"
              className="size-7 shrink-0 text-success-text"
            />
            <div className="min-w-[12rem] flex-1">
              <p className="font-extrabold">Recharge now</p>
              <p className="text-sm font-semibold text-muted-foreground">
                Five bars straight away. You have {nuts.toLocaleString("en")}{" "}
                nuts.
              </p>
            </div>
            <Button
              variant={canPay ? "reward" : "outline"}
              disabled={!canPay}
              loading={pending}
              onClick={recharge}
            >
              <Nut className="size-5" />
              {RECHARGE.price}
              <span className="sr-only"> nuts, recharge</span>
            </Button>
          </li>
        )}
        <li className="flex flex-wrap items-center gap-3 rounded-3xl border-2 border-border bg-card p-4">
          <BookOpenCheck
            aria-hidden="true"
            className="size-7 shrink-0 text-primary-text"
          />
          <div className="min-w-[12rem] flex-1">
            <p className="font-extrabold">Practise to charge it</p>
            <p className="text-sm font-semibold text-muted-foreground">
              Every {REVIEWS_PER_BAR} words you review charge one bar. Reviews
              never use the Akku.
            </p>
          </div>
          <Link
            href="/review"
            className={buttonVariants({ variant: "outline" })}
          >
            Review words
          </Link>
        </li>
        {nextBarAt && (
          <li className="flex items-center gap-3 rounded-3xl border-2 border-dashed border-border p-4">
            <Clock
              aria-hidden="true"
              className="size-7 shrink-0 text-muted-foreground"
            />
            <p className="font-semibold text-secondary-text">
              Or wait: the next bar charges in{" "}
              <b className="font-extrabold text-foreground">
                {waitText(nextBarAt - now)}
              </b>
              .
            </p>
          </li>
        )}
      </ul>
      <Link
        href={exitHref}
        className={buttonVariants({
          variant: "ghost",
          size: "lg",
          className: "mt-6",
        })}
      >
        Leave the lesson for now
      </Link>
    </main>
  )
}
