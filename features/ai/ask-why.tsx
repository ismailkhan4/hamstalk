"use client"

import { Lightbulb } from "lucide-react"
import { useState, useTransition } from "react"

import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"

import type { ExplainResult, Explanation } from "./explain"

/** "Why was that wrong?" Hamsti explains this exact answer, once asked. */
export function AskWhy({ explain }: { explain: () => Promise<ExplainResult> }) {
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (explanation)
    return (
      <div
        role="status"
        className="mt-4 flex gap-3 rounded-2xl border-2 border-info-border bg-info-subtle p-4 motion-safe:animate-rise"
      >
        <Mascot mood="thinking" size={44} className="shrink-0" />
        <div className="min-w-0 text-[0.9375rem]">
          <p className="font-bold text-info-text">{MASCOT_NAME} explains</p>
          <p className="mt-1">{explanation.why}</p>
          <p className="mt-2 flex gap-2 font-semibold">
            <Lightbulb
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-reward-text"
            />
            {explanation.rule}
          </p>
          <TargetText as="p" className="mt-2 text-lg">
            {explanation.example.target}
          </TargetText>
          <p className="text-sm text-muted-foreground">
            {explanation.example.native}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Written by AI for your answer. If something looks off, the note
            above is the reference.
          </p>
        </div>
      </div>
    )

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        loading={pending}
        loadingText={`${MASCOT_NAME} is thinking…`}
        onClick={() =>
          startTransition(async () => {
            setProblem(null)
            const result = await explain()
            if (result.ok) setExplanation(result.explanation)
            else setProblem(result.message)
          })
        }
      >
        <Mascot mood="thinking" size={22} />
        Why? Ask {MASCOT_NAME}
      </Button>
      {problem && (
        <p role="alert" className="mt-1 text-sm text-danger-text">
          {problem}
        </p>
      )}
    </div>
  )
}
