"use client"

import { animate, useMotionValue, useTransform, motion } from "motion/react"
import { useEffect } from "react"

import { useLessMotion } from "./use-less-motion"

type CountUpProps = {
  to: number
  /** Seconds. */
  duration?: number
  delay?: number
  prefix?: string
  className?: string
}

/**
 * A number that rolls up to its value, for XP and scores. Screen readers and reduced-motion
 * learners get the final number straight away.
 */
export function CountUp({
  to,
  duration = 1.1,
  delay = 0.2,
  prefix = "",
  className,
}: CountUpProps) {
  const still = useLessMotion()
  const value = useMotionValue(still ? to : 0)
  const text = useTransform(value, (latest) => `${prefix}${Math.round(latest)}`)

  useEffect(() => {
    if (still) {
      value.set(to)
      return
    }
    const controls = animate(value, to, {
      duration,
      delay,
      ease: [0.2, 0.8, 0.2, 1],
    })
    return () => controls.stop()
  }, [still, to, duration, delay, value])

  return (
    <span className={className}>
      <motion.span aria-hidden="true">{text}</motion.span>
      <span className="sr-only">
        {prefix}
        {to}
      </span>
    </span>
  )
}
