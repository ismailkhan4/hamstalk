"use client"

import Link from "next/link"
import type { ComponentProps } from "react"

import { COURSE_COOKIE, type Course } from "@/lib/i18n"

const ONE_YEAR = 60 * 60 * 24 * 365

/**
 * A link to a course's landing page that remembers the choice, so `/` opens this course next time.
 * Set on click rather than when the page loads, because Next prefetches every link in view.
 */
export function CourseLink({
  course,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { course: Course }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        document.cookie = `${COURSE_COOKIE}=${course}; path=/; max-age=${ONE_YEAR}; samesite=lax`
        onClick?.(event)
      }}
    />
  )
}
