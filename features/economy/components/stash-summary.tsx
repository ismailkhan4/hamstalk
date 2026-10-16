import { BatteryCharging, Check, Star } from "lucide-react"
import Link from "next/link"

import { CountUp } from "@/features/celebrations/count-up"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import type { Rewards } from "@/features/rewards/payload"

import { pinById, questText } from "../model"
import { Nut } from "./nut"

/**
 * After an activity: what went into Hamsti's stash. Quests finished, pins unlocked and the nuts
 * they paid. Nothing when nothing changed.
 */
export function StashSummary({
  rewards,
  className,
  style,
}: {
  rewards: Rewards | null
  className?: string
  style?: React.CSSProperties
}) {
  if (!rewards?.nuts) return null
  const { quests, pins, akkuCharged } = rewards
  const { earned, balance } = rewards.nuts
  if (earned === 0 && !akkuCharged) return null
  // The daily goal and streak milestones pay too; they share one line.
  const bonus =
    earned -
    quests.reduce((sum, quest) => sum + quest.reward, 0) -
    pins.reduce((sum, pin) => sum + 25 * pin.tier, 0)

  return (
    <section
      aria-labelledby="stash-title"
      className={`overflow-hidden rounded-3xl border-2 border-reward-border bg-reward-subtle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <Mascot mood="cheer" size={56} />
        <div className="min-w-0 flex-1">
          <h2
            id="stash-title"
            className="font-display text-xl font-semibold text-reward-text"
          >
            {earned > 0 ? (
              <>
                {MASCOT_NAME} stashed <CountUp to={earned} prefix="+" /> nuts
              </>
            ) : (
              `${MASCOT_NAME} is charged up`
            )}
          </h2>
          <p className="inline-flex items-center gap-1 text-sm font-bold text-secondary-text tabular-nums">
            <Nut className="size-4" />
            {balance.toLocaleString("en")} in the stash
          </p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 px-4 pb-4">
        {quests.map((quest) => (
          <li
            key={quest.id}
            className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2 font-bold"
          >
            <Check
              aria-hidden="true"
              className="size-4 shrink-0 text-success-text"
              strokeWidth={3.4}
            />
            <span className="min-w-0 flex-1">
              Quest done: {questText(quest.id)}
            </span>
            <span className="inline-flex items-center gap-1 text-reward-text tabular-nums">
              +{quest.reward}
              <Nut className="size-4" />
            </span>
          </li>
        ))}
        {pins.map((pin) => {
          const meta = pinById(pin.pin)
          if (!meta) return null
          return (
            <li
              key={`${pin.pin}-${pin.tier}`}
              className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2 font-bold motion-safe:animate-pop"
            >
              <span
                aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center rounded-full bg-gold text-[0.65rem] font-extrabold text-[#1d2b33]"
              >
                {pin.tier}
              </span>
              <span className="min-w-0 flex-1">
                New pin: {meta.name}
                {pin.tier > 1 ? `, tier ${pin.tier}` : ""}
              </span>
              <span className="inline-flex items-center gap-1 text-reward-text tabular-nums">
                +{25 * pin.tier}
                <Nut className="size-4" />
              </span>
            </li>
          )
        })}
        {bonus > 0 && (
          <li className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2 font-bold">
            <Star
              aria-hidden="true"
              className="size-4 shrink-0 fill-reward text-reward-text"
            />
            <span className="min-w-0 flex-1">Daily goal and streak bonus</span>
            <span className="inline-flex items-center gap-1 text-reward-text tabular-nums">
              +{bonus}
              <Nut className="size-4" />
            </span>
          </li>
        )}
        {akkuCharged && (
          <li className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2 font-bold">
            <BatteryCharging
              aria-hidden="true"
              className="size-4 shrink-0 text-success-text"
            />
            Practice charged one Akku bar
          </li>
        )}
      </ul>
      {pins.length > 0 && (
        <Link
          href="/progress#lanyard-title"
          className="block border-t-2 border-reward-border px-4 py-2.5 text-sm font-extrabold text-reward-text hover:underline"
        >
          See {MASCOT_NAME}’s lanyard
        </Link>
      )}
    </section>
  )
}
