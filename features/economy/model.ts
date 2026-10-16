import { z } from "zod"

/**
 * Hamsti's stash: hazelnuts to spend, the Akku that a lesson's missed answers drain, today's plan
 * of three quests, and pins on Hamsti's lanyard. supabase/migrations/economy.sql decides every
 * amount; this file mirrors its numbers for display only. Keep the two in step.
 */

export const AKKU_MAX = 5
export const AKKU_REFILL_HOURS = 4
/** Words reviewed per Akku bar recharged by practice. */
export const REVIEWS_PER_BAR = 5

export const economySchema = z.object({
  nuts: z.number().int().min(0),
  akku: z.number().int().min(0).max(AKKU_MAX),
  nextBarAt: z.string().nullable(),
  boostUntil: z.string().nullable(),
  freezes: z.number().int().min(0).max(2),
  quests: z.array(
    z.object({
      id: z.string(),
      target: z.number().int().positive(),
      progress: z.number().int().min(0),
      reward: z.number().int().positive(),
      done: z.boolean(),
    })
  ),
  pins: z.array(
    z.object({
      pin: z.string(),
      tier: z.number().int().min(1),
      unlockedAt: z.string(),
    })
  ),
})

export type Economy = z.infer<typeof economySchema>
export type Quest = Economy["quests"][number]

export const akkuResultSchema = z.object({
  akku: z.number().int().min(0).max(AKKU_MAX),
  nextBarAt: z.string().nullable(),
})

/** The Akku as of `now`, counting bars refilled since the server last settled it. */
export function akkuAt(
  economy: Pick<Economy, "akku" | "nextBarAt">,
  now: number
): { akku: number; nextBarAt: number | null } {
  if (economy.akku >= AKKU_MAX || !economy.nextBarAt)
    return { akku: economy.akku, nextBarAt: null }
  const step = AKKU_REFILL_HOURS * 3_600_000
  const first = Date.parse(economy.nextBarAt)
  if (now < first) return { akku: economy.akku, nextBarAt: first }
  const bars = 1 + Math.floor((now - first) / step)
  const akku = Math.min(AKKU_MAX, economy.akku + bars)
  return { akku, nextBarAt: akku >= AKKU_MAX ? null : first + bars * step }
}

/** "3 h 20 min", "45 min" or "under a minute", for refill countdowns. */
export function waitText(ms: number) {
  const minutes = Math.ceil(ms / 60_000)
  if (minutes <= 0) return "under a minute"
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

/** What a quest asks for, from its id (see economy_quests()). */
export function questText(id: string) {
  if (id === "goal") return "Reach your daily goal"
  if (id === "new-lesson") return "Finish a new lesson"
  const [kind, count] = id.split("-")
  const n = Number(count)
  if (kind === "xp") return `Earn ${n} XP`
  if (kind === "lessons")
    return n === 1 ? "Finish a lesson" : `Finish ${n} lessons`
  if (kind === "reviews") return `Review ${n} words`
  return "Practise today"
}

export type ShopItemId = "freeze" | "recharge" | "boost"

export const SHOP: readonly {
  id: ShopItemId
  price: number
  title: string
  body: string
}[] = [
  {
    id: "recharge",
    price: 300,
    title: "Full recharge",
    body: "Fills the Akku back up to five bars, so you can keep going right now.",
  },
  {
    id: "freeze",
    price: 150,
    title: "Streak freeze",
    body: "Covers one day you miss, so your streak keeps going. You can hold two.",
  },
  {
    id: "boost",
    price: 80,
    title: "Double XP, 15 minutes",
    body: "Every XP you earn in the next 15 minutes counts twice.",
  },
]

export type PinId =
  "streak" | "xp" | "stations" | "standups" | "cheeks" | "planner"

/** Lanyard pins, with each tier's threshold as in economy_pin_tiers(). */
export const PINS: readonly {
  id: PinId
  name: string
  /** What reaching a tier takes, from its threshold. */
  goal: (n: number) => string
  tiers: readonly number[]
}[] = [
  {
    id: "streak",
    name: "Steady",
    goal: (n) => `Keep a ${n}-day streak`,
    tiers: [3, 7, 30, 100, 365],
  },
  {
    id: "stations",
    name: "Explorer",
    goal: (n) => (n === 1 ? "Finish your first lesson" : `Finish ${n} lessons`),
    tiers: [1, 5, 15, 30, 60],
  },
  {
    id: "xp",
    name: "Hard worker",
    goal: (n) => `Earn ${n.toLocaleString("en")} XP`,
    tiers: [100, 500, 1000, 2500, 5000],
  },
  {
    id: "cheeks",
    name: "Full cheeks",
    goal: (n) => `Review ${n} words`,
    tiers: [10, 50, 200, 500],
  },
  {
    id: "standups",
    name: "Speaks up",
    goal: (n) => (n === 1 ? "Give your first standup" : `Give ${n} standups`),
    tiers: [1, 3, 8],
  },
  {
    id: "planner",
    name: "Planner",
    goal: (n) =>
      n === 1 ? "Finish a quest from your plan" : `Finish ${n} quests`,
    tiers: [1, 10, 30, 100],
  },
]

export function pinById(id: string) {
  return PINS.find((pin) => pin.id === id)
}

/** The highest tier reached for each pin, 0 when it isn't earned yet. */
export function pinTiers(pins: Economy["pins"]): Record<PinId, number> {
  const tiers = Object.fromEntries(PINS.map((pin) => [pin.id, 0])) as Record<
    PinId,
    number
  >
  for (const { pin, tier } of pins)
    if (pin in tiers) tiers[pin as PinId] = Math.max(tiers[pin as PinId], tier)
  return tiers
}
