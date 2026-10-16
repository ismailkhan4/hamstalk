import type { League, Profile } from "@/features/leagues/model"

/**
 * Development only: a sample league. `mid` is mid-table with pacers, `top` is in the promotion
 * places, `bottom` in relegation, `full` is a table of 20 learners, `new` hasn't joined yet, and
 * `promoted` / `relegated` / `stayed` add last week's result.
 */
export function sampleLeague(state = "mid"): League {
  const endsAt = new Date(Date.now() + 2.4 * 86_400_000).toISOString()
  const learners = [
    "Mira K.",
    "Tom B.",
    "Ana P.",
    "Leo S.",
    "Yuki T.",
    "Ravi N.",
    "Sofia L.",
    "Omar F.",
    "Ines D.",
    "Paul G.",
    "Lea M.",
    "Noah W.",
    "Emma R.",
    "Jan H.",
    "Ida V.",
    "Ben C.",
    "Zoe A.",
    "Kai R.",
    "Nora E.",
  ]
  const full = state === "full"
  const myXp =
    state === "top" ? 380 : state === "bottom" ? 20 : full ? 210 : 120
  const others = full
    ? learners.map((name, i) => ({
        kind: "learner" as const,
        ref: `${name.split(" ")[0]!.toLowerCase()}-${i}`,
        name,
        xp: Math.max(0, 520 - i * 29),
        me: false,
      }))
    : [
        {
          kind: "learner" as const,
          ref: "mira-1",
          name: "Mira K.",
          xp: 245,
          me: false,
        },
        { kind: "pacer" as const, ref: "jk", name: null, xp: 165, me: false },
        { kind: "pacer" as const, ref: "lf", name: null, xp: 140, me: false },
        {
          kind: "learner" as const,
          ref: null,
          name: "Tom B.",
          xp: 95,
          me: false,
        },
        { kind: "pacer" as const, ref: "ao", name: null, xp: 85, me: false },
        { kind: "pacer" as const, ref: "mb", name: null, xp: 60, me: false },
        { kind: "pacer" as const, ref: "cm", name: null, xp: 45, me: false },
        { kind: "pacer" as const, ref: "bk", name: null, xp: 30, me: false },
        { kind: "pacer" as const, ref: "aw", name: null, xp: 25, me: false },
      ]
  const rows = [
    ...others,
    {
      kind: "learner" as const,
      ref: "sam-38c6cb",
      name: "Sam H.",
      xp: myXp,
      me: true,
    },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((row, i) => ({ ...row, rank: i + 1 }))
  const result =
    state === "promoted" || state === "relegated" || state === "stayed"
      ? {
          week: "2026-10-05",
          // The division last week, so this week's division follows from the result.
          division: state === "promoted" ? 1 : state === "relegated" ? 3 : 2,
          rank: state === "promoted" ? 2 : state === "relegated" ? 9 : 5,
          result: state as "promoted" | "relegated" | "stayed",
        }
      : null
  return {
    week: "2026-10-12",
    endsAt,
    division: 2,
    xp: state === "new" ? 0 : myXp,
    joined: state !== "new",
    promote: full ? 3 : 3,
    relegate: full ? 3 : 3,
    table: state === "new" ? [] : rows,
    result,
  }
}

export function sampleProfile(me = false): Profile {
  return {
    handle: me ? "sam-38c6cb" : "mira-1",
    displayName: me ? "Sam H." : "Mira K.",
    joinedAt: "2026-09-02T10:00:00Z",
    me,
    isPublic: true,
    division: 3,
    streak: 12,
    longestStreak: 19,
    xp: 1840,
    lessons: 14,
    pins: [
      { pin: "stations", tier: 2, unlockedAt: "2026-09-10T10:00:00Z" },
      { pin: "streak", tier: 2, unlockedAt: "2026-09-12T10:00:00Z" },
      { pin: "xp", tier: 3, unlockedAt: "2026-10-01T10:00:00Z" },
      { pin: "planner", tier: 1, unlockedAt: "2026-10-02T10:00:00Z" },
    ],
  }
}
