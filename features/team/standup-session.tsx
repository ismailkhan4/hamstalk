"use client"

import { Check, Languages } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Alert } from "@/components/feedback/alert"
import { AnswerOption } from "@/components/exercises/answer-option"
import { Avatar, type Person } from "@/components/learning/avatar"
import { FocusHeader } from "@/components/learning/focus-header"
import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { personaliseLine, type Standup } from "@/content/standup"
import {
  ActionFooter,
  FeedbackFooter,
  rightTitle,
} from "@/features/lessons/components/footer"
import { ListenButton } from "@/features/lessons/components/listen-button"
import { cn } from "@/lib/utils"

import type { StandupResult } from "./actions"
import { optionOrder } from "@/features/lessons/engine/shuffle"

type Said = { who: "lena" | "me"; de: string; en: string }

const cast: { person: Person; initials: string; name: string }[] = [
  { person: "lf", initials: "LF", name: "Lena" },
  { person: "jk", initials: "JK", name: "Jonas" },
  { person: "ao", initials: "AÖ", name: "Aylin" },
  { person: "aw", initials: "AW", name: "Anna" },
]

type StandupSessionProps = {
  standup: Standup
  firstName: string
  initials: string
  onComplete: (unitId: string) => Promise<StandupResult>
}

export function StandupSession({
  standup,
  firstName,
  initials,
  onComplete,
}: StandupSessionProps) {
  const router = useRouter()
  const first = standup.prompts[0]?.ask
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<Said[]>(
    first ? [{ who: "lena", ...personaliseLine(first, firstName) }] : []
  )
  const [selection, setSelection] = useState<number | null>(null)
  const [result, setResult] = useState<"right" | "wrong" | null>(null)
  const [showEnglish, setShowEnglish] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prompt = standup.prompts[index]
  const last = index === standup.prompts.length - 1
  if (!prompt) return null

  const answered = result === "right"

  function check() {
    if (selection === null || !prompt) return
    setResult(selection === prompt.correct ? "right" : "wrong")
  }

  async function next() {
    if (!prompt) return
    const mine = prompt.options[prompt.correct]
    if (!mine) return
    const said: Said[] = [
      { who: "me", ...personaliseLine(mine, firstName) },
      { who: "lena", ...personaliseLine(prompt.react, firstName) },
    ]
    setHistory((current) => [...current, ...said])
    setSelection(null)
    setResult(null)
    if (!last) {
      setIndex(index + 1)
      return
    }
    await save()
  }

  async function save() {
    setSaving(true)
    setError(null)
    const outcome = await onComplete(standup.unitId)
    setSaving(false)
    if (outcome.ok) setSaved(true)
    else setError(outcome.message)
  }

  const finished = saved || error !== null || saving
  const wrongNote =
    result === "wrong" && selection !== null
      ? (prompt.wrong[selection] ?? "That isn’t what you’d say here.")
      : null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <FocusHeader
        closeLabel="Leave the standup"
        onClose={() => router.push("/team")}
        progress={{
          current: Math.min(index, standup.prompts.length - 1),
          total: standup.prompts.length,
          done: saved,
        }}
      />
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-8 pb-48"
      >
        <p className="rounded-lg bg-muted px-3 py-2 text-[0.8438rem] text-secondary-text">
          Educational simulation. Lena and the team are fictional, and nothing
          you choose here is sent to anyone.
        </p>

        <div className="mt-6 flex items-start justify-between gap-4 border-b border-border-subtle pb-5">
          <ul className="flex flex-wrap gap-4" aria-label="In the meeting">
            {cast.map((member) => (
              <li
                key={member.name}
                className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
              >
                <Avatar person={member.person} initials={member.initials} />
                {member.name}
              </li>
            ))}
            <li className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <Avatar person="me" initials={initials} />
              You
            </li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={showEnglish}
            onClick={() => setShowEnglish((on) => !on)}
          >
            <Languages aria-hidden="true" data-icon="inline-start" />
            English
          </Button>
        </div>

        <ol className="mt-6 flex flex-col gap-5" aria-label="The conversation">
          {history.map((line, i) => (
            <li key={i} className="flex gap-3">
              {line.who === "lena" ? (
                <Avatar person="lf" initials="LF" />
              ) : (
                <Avatar person="me" initials={initials} />
              )}
              <div className="min-w-0">
                <p className="text-[0.8125rem] font-semibold text-muted-foreground">
                  {line.who === "lena" ? "Lena" : "You"}
                </p>
                <GermanText
                  as="p"
                  className={cn(
                    "text-xl leading-snug",
                    line.who === "me" && "text-primary-text"
                  )}
                >
                  {line.de}
                </GermanText>
                {showEnglish && (
                  <p className="text-sm text-secondary-text">{line.en}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {!finished && (
          <section
            aria-labelledby="your-turn"
            className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="your-turn" className="font-semibold">
                Your turn · {prompt.task}
              </h2>
              <ListenButton
                text={history.filter((l) => l.who === "lena").at(-1)?.de ?? ""}
                label="Hear Lena again"
              />
            </div>
            <div
              role="radiogroup"
              aria-labelledby="your-turn"
              className="mt-4 flex flex-col gap-2.5"
            >
              {optionOrder(
                prompt.options.length,
                `standup:${standup.unitId}:${index}`
              ).map((i, position) => {
                const option = prompt.options[i]
                if (!option) return null
                const mine = selection === i
                return (
                  <AnswerOption
                    key={option.de}
                    index={position}
                    lang="de"
                    translation={showEnglish ? option.en : undefined}
                    locked={answered}
                    state={
                      answered && i === prompt.correct
                        ? "correct"
                        : result === "wrong" && mine
                          ? "incorrect"
                          : mine
                            ? "selected"
                            : "idle"
                    }
                    onSelect={() => {
                      setSelection(i)
                      setResult(null)
                    }}
                  >
                    {option.de}
                  </AnswerOption>
                )
              })}
            </div>
            <details className="mt-4 border-t border-dashed border-border pt-4">
              <summary className="cursor-pointer text-sm font-semibold text-primary-text">
                Useful phrases
              </summary>
              <ul className="mt-3 space-y-1">
                {prompt.phrases.map((phrase) => (
                  <li key={phrase.de}>
                    <GermanText>{phrase.de}</GermanText>
                    <span className="text-sm text-secondary-text">
                      {" "}
                      · {phrase.en}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        )}

        {error && (
          <Alert tone="error" title="Not saved" className="mt-6">
            {error}
          </Alert>
        )}
        {saved && (
          <div
            role="status"
            className="mt-8 flex items-start gap-3 rounded-xl border border-success-border bg-success-subtle p-4 text-success-text"
          >
            <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Standup complete</p>
              <p className="text-sm">
                This step is saved to your progress. It stays in the application
                and isn’t sent to anyone.
              </p>
            </div>
          </div>
        )}
      </main>

      {saved ? (
        <ActionFooter hint="Your next standup line arrives with the next unit.">
          <Button size="lg" onClick={() => router.push("/team")}>
            Back to team
          </Button>
        </ActionFooter>
      ) : error ? (
        <ActionFooter hint="Your answers are fine. Only saving failed.">
          <Button size="lg" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Try saving again"}
          </Button>
        </ActionFooter>
      ) : result === "right" ? (
        <FeedbackFooter
          result="correct"
          title={rightTitle(index)}
          titleLang="de"
          action={
            <Button size="lg" onClick={next} disabled={saving}>
              {last ? "Finish standup" : "Continue"}
            </Button>
          }
        >
          {prompt.right}
        </FeedbackFooter>
      ) : result === "wrong" ? (
        <FeedbackFooter
          result="incorrect"
          title="Not quite"
          action={
            <Button
              size="lg"
              onClick={() => {
                setSelection(null)
                setResult(null)
              }}
            >
              Try again
            </Button>
          }
        >
          {wrongNote}
        </FeedbackFooter>
      ) : (
        <ActionFooter hint="Pick what you would say. Open “Useful phrases” if you’re unsure.">
          <Button size="lg" disabled={selection === null} onClick={check}>
            Say it
          </Button>
        </ActionFooter>
      )}
    </div>
  )
}
