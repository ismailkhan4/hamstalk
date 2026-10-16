import { Check } from "lucide-react"
import Link from "next/link"

import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { cn } from "@/lib/utils"

import { questText, type Economy } from "../model"
import { Nut } from "./nut"

/**
 * Today's plan: three small quests, each paying nuts into Hamsti's stash the moment it's done.
 * The plan changes at the learner's midnight.
 */
export function TodayPlan({ economy }: { economy: Economy }) {
  const done = economy.quests.filter((quest) => quest.done).length
  const all = done === economy.quests.length && done > 0

  return (
    <section
      aria-labelledby="today-plan-title"
      className="rounded-3xl border-2 border-border bg-card p-5 shadow-[0_4px_0_var(--border)]"
    >
      <div className="flex items-center gap-3">
        <h2
          id="today-plan-title"
          className="font-display text-lg font-semibold"
        >
          <span lang={TARGET_LANG}>{ACTIVE_COURSE.phrases.dailyPlan}</span>
          <span className="sr-only">: today’s quests</span>
        </h2>
        <span className="font-mono text-sm font-semibold text-muted-foreground tabular-nums">
          {done}/{economy.quests.length}
        </span>
        <Link
          href="/shop"
          className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 font-extrabold text-reward-text tabular-nums hover:bg-accent"
        >
          <Nut />
          {economy.nuts.toLocaleString("en")}
          <span className="sr-only"> nuts, open the shop</span>
        </Link>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {economy.quests.map((quest) => (
          <li
            key={quest.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5",
              quest.done
                ? "border-success-border bg-success-subtle"
                : "border-border-subtle"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full border-[3px]",
                quest.done
                  ? "border-success bg-success text-success-foreground"
                  : "border-border-edge"
              )}
            >
              {quest.done && <Check className="size-4" strokeWidth={3.4} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                {questText(quest.id)}
                <span className="sr-only">
                  {quest.done
                    ? ", done"
                    : `, ${quest.progress} of ${quest.target}`}
                </span>
              </p>
              {!quest.done && quest.target > 1 && (
                <span
                  aria-hidden="true"
                  className="mt-1.5 block h-2 overflow-hidden rounded-full bg-muted"
                >
                  <span
                    className="block h-full rounded-full bg-reward"
                    style={{
                      width: `${(quest.progress / quest.target) * 100}%`,
                    }}
                  />
                </span>
              )}
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-0.5 text-sm font-extrabold tabular-nums",
                quest.done
                  ? "text-success-text"
                  : "bg-reward-subtle text-reward-text"
              )}
            >
              {quest.done ? "Stashed" : `+${quest.reward}`}
              <Nut className="size-4" />
              <span className="sr-only"> nuts</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Mascot mood={all ? "cheer" : "idle"} size={30} />
        {all
          ? `All done for today. ${MASCOT_NAME}’s cheeks are full.`
          : `${MASCOT_NAME} stashes the nuts as soon as a quest is done. A new plan comes at midnight.`}
      </p>
    </section>
  )
}
