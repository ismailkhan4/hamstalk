"use client"

import { UserCheck, UserPlus } from "lucide-react"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { followAction, unfollowAction } from "../actions"

/** Follow or unfollow a learner. "Follow back" when they already follow you. */
export function FollowButton({
  handle,
  following,
  followsMe = false,
  size = "md",
}: {
  handle: string
  following: boolean
  followsMe?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const [on, setOn] = useState(following)
  const [problem, setProblem] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !on
    setOn(next)
    setProblem(null)
    startTransition(async () => {
      const result = await (next ? followAction : unfollowAction)(handle)
      if (!result.ok) {
        setOn(!next)
        setProblem(result.message)
      }
    })
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        size={size}
        variant={on ? "outline" : "primary"}
        iconLeft={on ? <UserCheck /> : <UserPlus />}
        aria-pressed={on}
        disabled={pending}
        onClick={toggle}
      >
        {on ? "Following" : followsMe ? "Follow back" : "Follow"}
      </Button>
      {problem && (
        <span role="alert" className="text-sm font-semibold text-danger-text">
          {problem}
        </span>
      )}
    </span>
  )
}
