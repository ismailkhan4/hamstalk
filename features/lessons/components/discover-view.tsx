"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { useState } from "react"

import { Avatar } from "@/components/learning/avatar"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { DiscoverExercise } from "../schema"
import { personalise } from "../schema"
import { ActionFooter } from "./footer"
import { ExerciseHeading } from "./exercise-heading"
import { ListenButton } from "./listen-button"
import type { Learner } from "./types"

type DiscoverViewProps = {
  exercise: DiscoverExercise
  learner: Learner
  savedKeys: string[]
  /** Saves or removes a phrase; resolves to an error message when it didn't work. */
  onToggleSave: (saveKey: string, save: boolean) => Promise<string | null>
  onDone: () => void
}

export function DiscoverView({
  exercise,
  learner,
  savedKeys,
  onToggleSave,
  onDone,
}: DiscoverViewProps) {
  const [saved, setSaved] = useState(new Set(savedKeys))
  const [error, setError] = useState<string | null>(null)

  async function toggle(saveKey: string, phrase: string) {
    const save = !saved.has(saveKey)
    setError(null)
    setSaved((current) => {
      const next = new Set(current)
      if (save) next.add(saveKey)
      else next.delete(saveKey)
      return next
    })
    const problem = await onToggleSave(saveKey, save)
    if (problem) {
      setSaved((current) => {
        const next = new Set(current)
        if (save) next.delete(saveKey)
        else next.add(saveKey)
        return next
      })
      setError(`Couldn’t ${save ? "save" : "remove"} “${phrase}”. ${problem}`)
    }
  }

  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-36"
      >
        <ExerciseHeading
          kind={exercise.kind}
          title={exercise.title}
          sub={exercise.sub}
        />
        <ul className="mt-8 flex flex-col gap-5">
          {exercise.lines.map((line) => {
            const mine = line.speaker.person === "me"
            const de = personalise(line.target, learner)
            const isSaved = line.saveKey ? saved.has(line.saveKey) : false
            return (
              <li
                key={line.target + line.speaker.label}
                className={cn(
                  "flex items-start gap-3",
                  mine && "flex-row-reverse"
                )}
              >
                <Avatar
                  person={line.speaker.person}
                  initials={personalise(line.speaker.initials, learner)}
                  size="md"
                />
                <div
                  className={cn(
                    "max-w-[85%] min-w-0 rounded-2xl border border-border bg-card p-4",
                    mine && "border-primary-border bg-primary-subtle"
                  )}
                >
                  <p className="text-xs text-muted-foreground">
                    {personalise(line.speaker.label, learner)}
                  </p>
                  <TargetText
                    as="p"
                    className="mt-1 text-[1.375rem] leading-snug"
                  >
                    {de}
                  </TargetText>
                  <p className="text-[0.9375rem] text-muted-foreground">
                    {personalise(line.native, learner)}
                  </p>
                  {line.note && (
                    <p className="mt-2.5 border-t border-dashed border-border pt-2.5 text-sm font-semibold text-primary-text">
                      {line.note}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <ListenButton text={de} speaker={line.speaker.person} />
                    {line.saveKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        aria-pressed={isSaved}
                        iconLeft={isSaved ? <BookmarkCheck /> : <Bookmark />}
                        className={cn(
                          isSaved &&
                            "border-reward-border bg-reward-subtle text-reward-text shadow-none"
                        )}
                        onClick={() => toggle(line.saveKey!, de)}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <p
          role="status"
          aria-live="polite"
          className="mt-6 min-h-6 text-sm text-danger-text"
        >
          {error}
        </p>
      </main>
      <ActionFooter hint="Saved phrases go to your phrasebook.">
        <Button size="lg" onClick={onDone}>
          Continue
        </Button>
      </ActionFooter>
    </>
  )
}
