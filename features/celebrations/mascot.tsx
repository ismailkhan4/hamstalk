"use client"

import { motion, type TargetAndTransition } from "motion/react"

import { cn } from "@/lib/utils"

import { useLessMotion } from "./use-less-motion"

/** The duck's name, in one place. Quietscheentchen is German for rubber duck. */
export const MASCOT_NAME = "Quietschi"

export type MascotMood =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "cheer"
  | "dance"
  | "sleepy"
  | "onFire"

type MascotProps = {
  mood?: MascotMood
  /** Rendered size in px; the drawing scales cleanly. */
  size?: number
  className?: string
  /**
   * The duck is decoration by default: the words around it say what happened. Pass a label only
   * where the duck itself is the message.
   */
  label?: string
}

/**
 * Quietschi, Klarlingo's rubber duck: a nod to rubber-duck debugging, and the face of every
 * celebration. An SVG with Motion today; the props are the contract, so a Rive file can replace
 * the drawing later without touching any screen.
 */
export function Mascot({
  mood = "idle",
  size = 96,
  className,
  label,
}: MascotProps) {
  const still = useLessMotion()
  const eyes = EYES[mood]
  const mouthOpen = OPEN_MOUTH.has(mood)

  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0 overflow-visible", className)}
      data-mood={mood}
    >
      {mood === "onFire" && <Flame still={still} />}
      {mood === "cheer" && <Sparkles still={still} />}

      <motion.g
        key={mood}
        style={{ originX: "50%", originY: "90%" }}
        animate={still ? undefined : BODY[mood]}
      >
        {/* Body, with the tail flicking up at the back */}
        <path
          d="M22 82c0-17 18-23 36-19 15 3 27 0 37-11 6-6 13-2 12 7-1 12-3 22-7 31-6 12-21 18-40 18-23 0-38-10-38-26Z"
          fill="var(--duck-body)"
        />
        <path
          d="M27 92c7 9 18 14 33 14 17 0 29-5 35-14-8 5-20 8-35 8-14 0-25-3-33-8Z"
          fill="var(--duck-shade)"
        />
        {/* Wing */}
        <motion.path
          d="M57 77c8-9 25-8 30 3-6 9-21 11-30 4-2-2-2-5 0-7Z"
          fill="var(--duck-shade)"
          // Motion measures SVG origins against the element's own box: pivot at the wing's root.
          style={{ originX: 0.1, originY: 0.6 }}
          animate={still ? undefined : WING[mood]}
        />

        {/* Head */}
        <motion.g
          style={{ originX: 0.6, originY: 0.9 }}
          animate={still ? HEAD_POSE[mood] : HEAD[mood]}
        >
          <circle cx="46" cy="42" r="25" fill="var(--duck-body)" />
          <path
            d="M24 52c4 10 13 15 24 15 9 0 16-4 20-10-6 4-13 6-20 6-10 0-18-4-24-11Z"
            fill="var(--duck-shade)"
            opacity="0.7"
          />
          {/* Beak */}
          <path
            d="M25 43c-9-3-17 0-17 5 0 4 9 6 19 3Z"
            fill="var(--duck-beak)"
          />
          {mouthOpen ? (
            <path
              d="M25 52c-7 2-13 4-12 8 2 4 10 2 16-3Z"
              fill="var(--duck-beak-shade)"
            />
          ) : (
            <path
              d="M27 51c-6 1-12 0-15-2 2 3 8 5 15 4Z"
              fill="var(--duck-beak-shade)"
            />
          )}
          <ellipse
            cx="50"
            cy="51"
            rx="5"
            ry="3"
            fill="var(--duck-cheek)"
            opacity={mood === "sad" ? 0.35 : 0.75}
          />
          <Eye kind={eyes} still={still} />
          {mood === "onFire" && (
            <path
              d="M33 31l11-3"
              stroke="var(--duck-eye)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {mood === "sad" && <Tear still={still} />}
        </motion.g>
      </motion.g>

      {mood === "sleepy" && <Snore still={still} />}
      {mood === "thinking" && <ThoughtDots still={still} />}
    </motion.svg>
  )
}

type EyeKind = "open" | "happy" | "closed" | "up" | "droopy"

const EYES: Record<MascotMood, EyeKind> = {
  idle: "open",
  happy: "happy",
  sad: "droopy",
  thinking: "up",
  cheer: "happy",
  dance: "happy",
  sleepy: "closed",
  onFire: "open",
}

const OPEN_MOUTH = new Set<MascotMood>(["happy", "cheer", "dance", "onFire"])

function Eye({ kind, still }: { kind: EyeKind; still: boolean }) {
  if (kind === "happy")
    return (
      <path
        d="M35 40q5-6 10 0"
        fill="none"
        stroke="var(--duck-eye)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    )
  if (kind === "closed")
    return (
      <path
        d="M35 39q5 4 10 0"
        fill="none"
        stroke="var(--duck-eye)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )
  if (kind === "droopy")
    // Looking down, with a heavy lid: disappointed, not cross.
    return (
      <g>
        <circle cx="40" cy="40" r="5" fill="var(--duck-eye)" />
        <circle cx="41.4" cy="39" r="1.4" fill="#ffffff" />
        <path d="M34 33h12v5.5c-4-2.5-8-2.5-12 0Z" fill="var(--duck-body)" />
        <path
          d="M34 38.5c4-2.5 8-2.5 12 0"
          fill="none"
          stroke="var(--duck-eye)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    )
  const up = kind === "up"
  return (
    // A blink every few seconds keeps an idle duck alive.
    <motion.g
      style={{ originX: 0.5, originY: 0.5 }}
      animate={still ? undefined : { scaleY: [1, 1, 0.1, 1] }}
      transition={{
        duration: 0.3,
        times: [0, 0.4, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 3.4,
      }}
    >
      <circle cx="40" cy={up ? 36 : 38} r="5" fill="var(--duck-eye)" />
      <circle cx="41.8" cy={up ? 34.2 : 36.2} r="1.7" fill="#ffffff" />
    </motion.g>
  )
}

const loop = (duration: number) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut" as const,
})

/** Whole-duck movement for each mood. */
const BODY: Record<MascotMood, TargetAndTransition> = {
  idle: { y: [0, -3, 0], transition: loop(2.6) },
  happy: {
    y: [0, -16, 0, -6, 0],
    scaleY: [1, 1.04, 0.94, 1.02, 1],
    transition: { duration: 0.8, ease: "easeOut" },
  },
  sad: {
    y: [0, 3],
    rotate: [0, -4],
    transition: { duration: 0.5, ease: "easeOut" },
  },
  thinking: { y: [0, -2, 0], transition: loop(2) },
  cheer: {
    y: [0, -18, 0],
    scaleY: [1, 1.05, 0.92],
    transition: { duration: 0.55, repeat: Infinity, repeatDelay: 0.15 },
  },
  dance: {
    rotate: [-8, 8, -8],
    y: [0, -6, 0, -6, 0],
    transition: loop(0.9),
  },
  sleepy: { y: [0, 2, 0], scaleY: [1, 0.98, 1], transition: loop(3.4) },
  onFire: { y: [0, -5, 0], transition: loop(0.5) },
}

const HEAD: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: {},
  sad: { rotate: 10, y: 3, transition: { duration: 0.5 } },
  thinking: { rotate: [0, 8, 6], transition: { duration: 0.6 } },
  cheer: {},
  dance: { rotate: [6, -6, 6], transition: loop(0.9) },
  sleepy: { rotate: 12, y: 4, transition: { duration: 0.8 } },
  onFire: { rotate: -4 },
}

/** The same head poses, held still, for reduced motion. */
const HEAD_POSE: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: {},
  sad: { rotate: 10, y: 3, transition: { duration: 0 } },
  thinking: { rotate: 6, transition: { duration: 0 } },
  cheer: {},
  dance: {},
  sleepy: { rotate: 12, y: 4, transition: { duration: 0 } },
  onFire: { rotate: -4, transition: { duration: 0 } },
}

const WING: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: {
    rotate: [0, -30, 0, -20, 0],
    transition: { duration: 0.8 },
  },
  sad: {},
  thinking: {},
  cheer: { rotate: [0, -45, 0], transition: loop(0.35) },
  dance: { rotate: [0, -25, 0], transition: loop(0.45) },
  sleepy: {},
  onFire: { rotate: [0, -20, 0], transition: loop(0.5) },
}

function Tear({ still }: { still: boolean }) {
  return (
    <motion.path
      d="M37 46c-2 3-3 5-1 6 2 1 3-1 2-3Z"
      fill="var(--info)"
      initial={{ opacity: 0, y: -2 }}
      animate={
        still ? { opacity: 1 } : { opacity: [0, 1, 1, 0], y: [-2, 0, 8, 12] }
      }
      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
    />
  )
}

function Snore({ still }: { still: boolean }) {
  return (
    <g fill="var(--info)" fontFamily="var(--font-display)" fontWeight="700">
      {[
        { x: 74, y: 22, size: 12, delay: 0 },
        { x: 86, y: 12, size: 15, delay: 0.6 },
        { x: 100, y: 2, size: 18, delay: 1.2 },
      ].map((z) => (
        <motion.text
          key={z.x}
          x={z.x}
          y={z.y}
          fontSize={z.size}
          initial={{ opacity: still ? 1 : 0 }}
          animate={
            still ? undefined : { opacity: [0, 1, 0], y: [z.y, z.y - 6] }
          }
          transition={{ duration: 2, repeat: Infinity, delay: z.delay }}
        >
          z
        </motion.text>
      ))}
    </g>
  )
}

function ThoughtDots({ still }: { still: boolean }) {
  return (
    <g fill="var(--border-edge)">
      {[
        { cx: 72, cy: 20, r: 3 },
        { cx: 82, cy: 12, r: 4 },
        { cx: 94, cy: 4, r: 5 },
      ].map((dot, i) => (
        <motion.circle
          key={dot.cx}
          {...dot}
          animate={still ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </g>
  )
}

function Sparkles({ still }: { still: boolean }) {
  return (
    <g fill="var(--gold)">
      {[
        { x: 8, y: 14, s: 1 },
        { x: 98, y: 20, s: 0.8 },
        { x: 104, y: 70, s: 0.6 },
        { x: 4, y: 74, s: 0.7 },
      ].map((star, i) => (
        // Placement lives on the group: Motion's transform would replace an SVG transform attribute.
        <g
          key={i}
          transform={`translate(${star.x} ${star.y}) scale(${star.s})`}
        >
          <motion.path
            d="M0-8 2-2 8 0 2 2 0 8-2 2-8 0-2-2Z"
            animate={
              still ? undefined : { opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }
            }
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        </g>
      ))}
    </g>
  )
}

function Flame({ still }: { still: boolean }) {
  return (
    <motion.g
      style={{ originX: 0.5, originY: 1 }}
      animate={
        still
          ? undefined
          : { scaleY: [1, 1.08, 0.96, 1], opacity: [0.85, 1, 0.9, 0.85] }
      }
      transition={loop(0.6)}
    >
      <path
        d="M60 112c-30 0-44-20-36-44 3 10 9 14 14 14-6-16 2-34 18-44-2 14 6 22 14 28 2-8 8-12 14-14-4 10 0 18 6 24 4 6 6 12 6 18 0 12-14 18-36 18Z"
        fill="var(--streak)"
      />
      <path
        d="M60 112c-20 0-30-12-25-28 3 6 7 8 10 8-3-10 2-20 12-26-1 9 4 14 9 18 1-5 5-8 9-9-2 7 0 12 4 16 3 4 4 7 4 11 0 7-9 10-23 10Z"
        fill="var(--gold)"
      />
    </motion.g>
  )
}
