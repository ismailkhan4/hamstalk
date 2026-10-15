"use client"

import { motion, type TargetAndTransition } from "motion/react"

import { cn } from "@/lib/utils"

import { MASCOT_NAME } from "./mascot-name"
import { useLessMotion } from "./use-less-motion"

export { MASCOT_NAME }

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
   * Hamsti is decoration by default: the words around it say what happened. Pass a label only
   * where Hamsti itself is the message.
   */
  label?: string
}

/**
 * Hamsti, Klarlingo's hamster. In German, *hamstern* means to stockpile, and Hamsti stockpiles the
 * words you learn: the cheeks puff up whenever something good happens. An SVG with Motion; the
 * props are the contract, so a Rive file can replace the drawing later without touching a screen.
 */
export function Mascot({
  mood = "idle",
  size = 96,
  className,
  label,
}: MascotProps) {
  const still = useLessMotion()
  const joyful = JOYFUL.has(mood)
  const armsUp = mood === "cheer"

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
        // Motion measures SVG origins against the element's own box.
        style={{ originX: 0.5, originY: 0.95 }}
        animate={still ? undefined : BODY[mood]}
      >
        {/* Ears */}
        <motion.g
          style={{ originX: 0.5, originY: 1 }}
          animate={still ? EAR_POSE[mood] : EARS[mood]}
        >
          <circle cx="36" cy="30" r="10" fill="var(--hamster-fur)" />
          <circle cx="36" cy="30" r="5" fill="var(--hamster-pink)" />
        </motion.g>
        <motion.g
          style={{ originX: 0.5, originY: 1 }}
          animate={still ? EAR_POSE_R[mood] : EARS_R[mood]}
        >
          <circle cx="84" cy="30" r="10" fill="var(--hamster-fur)" />
          <circle cx="84" cy="30" r="5" fill="var(--hamster-pink)" />
        </motion.g>

        {armsUp && (
          <>
            <ellipse
              cx="22"
              cy="48"
              rx="7"
              ry="9"
              fill="var(--hamster-fur-dark)"
              transform="rotate(-25 22 48)"
            />
            <ellipse
              cx="98"
              cy="48"
              rx="7"
              ry="9"
              fill="var(--hamster-fur-dark)"
              transform="rotate(25 98 48)"
            />
          </>
        )}

        {/* Body and belly */}
        <ellipse cx="60" cy="74" rx="38" ry="36" fill="var(--hamster-fur)" />
        <ellipse cx="60" cy="84" rx="25" ry="24" fill="var(--hamster-cream)" />

        {/* Cheek pouches: they fill up when something good happens */}
        {[34, 86].map((cx) => (
          <motion.ellipse
            key={cx}
            cx={cx}
            cy="72"
            rx={joyful ? 13 : 9}
            ry={joyful ? 11 : 8}
            fill="var(--hamster-cream)"
            style={{ originX: 0.5, originY: 0.5 }}
            animate={
              still || !joyful
                ? undefined
                : { scale: [1, 1.12, 1], transition: loop(1.2) }
            }
          />
        ))}

        <Eyes mood={mood} still={still} />
        {mood === "onFire" && (
          <g
            stroke="var(--hamster-eye)"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M43 51l10 2.5" />
            <path d="M77 51l-10 2.5" />
          </g>
        )}

        {/* Nose, mouth, blush */}
        <path d="M57 67h6l-3 3.5z" fill="var(--hamster-pink)" />
        <Mouth mood={mood} />
        {[38, 82].map((cx) => (
          <ellipse
            key={cx}
            cx={cx}
            cy="72"
            rx="5"
            ry="3"
            fill="var(--hamster-pink)"
            opacity={mood === "sad" ? 0.3 : 0.75}
          />
        ))}

        {/* Paws: in front, one at the chin while thinking, or up for a cheer */}
        {!armsUp && (
          <>
            <ellipse
              cx="47"
              cy="96"
              rx="6"
              ry="5"
              fill="var(--hamster-fur-dark)"
            />
            <ellipse
              cx={mood === "thinking" ? 68 : 73}
              cy={mood === "thinking" ? 82 : 96}
              rx="6"
              ry="5"
              fill="var(--hamster-fur-dark)"
            />
          </>
        )}
        <ellipse
          cx="44"
          cy="108"
          rx="9"
          ry="4.5"
          fill="var(--hamster-fur-dark)"
        />
        <ellipse
          cx="76"
          cy="108"
          rx="9"
          ry="4.5"
          fill="var(--hamster-fur-dark)"
        />

        {mood === "sad" && <Tear still={still} />}
      </motion.g>

      {mood === "sleepy" && <Snore still={still} />}
      {mood === "thinking" && <ThoughtDots still={still} />}
    </motion.svg>
  )
}

const JOYFUL = new Set<MascotMood>(["happy", "cheer", "dance", "onFire"])

function Eyes({ mood, still }: { mood: MascotMood; still: boolean }) {
  const line = {
    fill: "none",
    stroke: "var(--hamster-eye)",
    strokeLinecap: "round" as const,
  }
  if (mood === "happy" || mood === "cheer" || mood === "dance")
    return (
      <g {...line} strokeWidth="3.2">
        <path d="M44 62q5-7 10 0" />
        <path d="M66 62q5-7 10 0" />
      </g>
    )
  if (mood === "sleepy")
    return (
      <g {...line} strokeWidth="3">
        <path d="M44 60q5 4 10 0" />
        <path d="M66 60q5 4 10 0" />
      </g>
    )
  const up = mood === "thinking" ? -2 : mood === "sad" ? 1.5 : 0
  const side = mood === "thinking" ? 1.4 : 0
  return (
    // A blink every few seconds keeps an idle hamster alive.
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
      {[49, 71].map((cx) => (
        <g key={cx}>
          <circle cx={cx + side} cy={60 + up} r="5" fill="var(--hamster-eye)" />
          <circle cx={cx + side + 1.6} cy={58.6 + up} r="1.6" fill="#ffffff" />
          {mood === "sad" && (
            <path
              d={cx < 60 ? `M${cx - 6} 57q5-2 12-4` : `M${cx - 6} 53q7 2 12 4`}
              {...line}
              strokeWidth="2.4"
            />
          )}
        </g>
      ))}
    </motion.g>
  )
}

function Mouth({ mood }: { mood: MascotMood }) {
  const ink = "var(--hamster-eye)"
  if (mood === "cheer" || mood === "dance" || mood === "onFire")
    return (
      <>
        <path d="M54 73q6 9 12 0z" fill={ink} />
        <rect x="57.6" y="73" width="2.2" height="3.2" rx=".6" fill="#fff" />
        <rect x="60.2" y="73" width="2.2" height="3.2" rx=".6" fill="#fff" />
      </>
    )
  if (mood === "happy")
    return (
      <>
        <path d="M55.5 73.5q4.5 6 9 0z" fill={ink} />
        <rect x="57.8" y="73.5" width="2" height="2.8" rx=".6" fill="#fff" />
        <rect x="60.2" y="73.5" width="2" height="2.8" rx=".6" fill="#fff" />
      </>
    )
  if (mood === "sad")
    return (
      <path
        d="M56 77q4-4 8 0"
        fill="none"
        stroke={ink}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )
  if (mood === "thinking")
    return (
      <path
        d="M56.5 75h7"
        stroke={ink}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    )
  return <ellipse cx="60" cy="75" rx="2" ry="2.4" fill={ink} />
}

const loop = (duration: number) => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut" as const,
})

/** Whole-hamster movement for each mood. */
const BODY: Record<MascotMood, TargetAndTransition> = {
  idle: { y: [0, -3, 0], transition: loop(2.6) },
  happy: {
    y: [0, -16, 0, -6, 0],
    scaleY: [1, 1.04, 0.94, 1.02, 1],
    transition: { duration: 0.8, ease: "easeOut" },
  },
  sad: {
    y: [0, 3],
    rotate: [0, -3],
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

/** Ears perk up with joy and droop with disappointment. These are the left ear's. */
const EARS: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: { rotate: [0, -14, 0], transition: { duration: 0.6 } },
  sad: { rotate: -28, y: 6, transition: { duration: 0.5 } },
  thinking: { rotate: -6 },
  cheer: { rotate: [0, -16, 0], transition: loop(0.55) },
  dance: { rotate: [-10, 10, -10], transition: loop(0.9) },
  sleepy: { rotate: -18, y: 4, transition: { duration: 0.8 } },
  onFire: { rotate: -8 },
}

/** The right ear mirrors the left. */
const EARS_R: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: { rotate: [0, 14, 0], transition: { duration: 0.6 } },
  sad: { rotate: 28, y: 6, transition: { duration: 0.5 } },
  thinking: { rotate: 6 },
  cheer: { rotate: [0, 16, 0], transition: loop(0.55) },
  dance: { rotate: [10, -10, 10], transition: loop(0.9) },
  sleepy: { rotate: 18, y: 4, transition: { duration: 0.8 } },
  onFire: { rotate: 8 },
}

const held = (target: TargetAndTransition): TargetAndTransition => ({
  ...target,
  transition: { duration: 0 },
})

/** The same ear poses, held still, for reduced motion. */
const EAR_POSE: Record<MascotMood, TargetAndTransition> = {
  idle: {},
  happy: {},
  sad: held({ rotate: -28, y: 6 }),
  thinking: held({ rotate: -6 }),
  cheer: {},
  dance: {},
  sleepy: held({ rotate: -18, y: 4 }),
  onFire: held({ rotate: -8 }),
}
const EAR_POSE_R: Record<MascotMood, TargetAndTransition> = {
  ...EAR_POSE,
  sad: held({ rotate: 28, y: 6 }),
  thinking: held({ rotate: 6 }),
  sleepy: held({ rotate: 18, y: 4 }),
  onFire: held({ rotate: 8 }),
}

function Tear({ still }: { still: boolean }) {
  return (
    <motion.path
      d="M45 66c-2 3-3 5-1 6.5 2 1 3.5-1 2.5-3.5z"
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
        { x: 86, y: 22, size: 12, delay: 0 },
        { x: 96, y: 12, size: 15, delay: 0.6 },
        { x: 106, y: 2, size: 18, delay: 1.2 },
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
        { cx: 88, cy: 26, r: 3 },
        { cx: 96, cy: 17, r: 4 },
        { cx: 106, cy: 7, r: 5 },
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
        { x: 10, y: 22, s: 1 },
        { x: 108, y: 24, s: 0.8 },
        { x: 112, y: 76, s: 0.6 },
        { x: 6, y: 80, s: 0.7 },
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
          : { scaleY: [1, 1.08, 0.96, 1], opacity: [0.9, 1, 0.92, 0.9] }
      }
      transition={loop(0.6)}
    >
      <path
        d="M60 114c-32 0-46-22-38-48 3 10 9 14 14 14-6-16 2-36 18-46-2 14 6 22 14 28 2-8 8-12 14-14-4 10 0 18 6 24 4 6 6 12 6 18 0 14-14 24-34 24Z"
        fill="var(--streak)"
      />
      <path
        d="M60 114c-20 0-30-12-25-28 3 6 7 8 10 8-3-10 2-20 12-26-1 9 4 14 9 18 1-5 5-8 9-9-2 7 0 12 4 16 3 4 4 7 4 11 0 7-9 10-23 10Z"
        fill="var(--gold)"
      />
    </motion.g>
  )
}
