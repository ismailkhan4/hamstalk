"use client"

import { ArrowLeft, Info, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { AnswerOption } from "@/components/exercises/answer-option"
import { Alert } from "@/components/feedback/alert"
import { FocusHeader } from "@/components/learning/focus-header"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import {
  applyPlacementAction,
  completePlacementAction,
  restartPlacementAction,
  savePlacementProgressAction,
} from "../actions"
import { IDK, placementQuestions } from "../questions"
import {
  answeredCount,
  skillResults,
  suggestLevel,
  type PlacementLevel,
} from "../scoring"
import { ListeningPlayer } from "./listening-player"
import { optionOrder } from "@/features/lessons/engine/shuffle"

const TOTAL = placementQuestions.length

const levelCopy: Record<
  PlacementLevel,
  { code: string; name: string; text: string; cta: string }
> = {
  beginner: {
    code: "Start",
    name: "Complete beginner",
    text: "Start from the very first lesson: sounds, greetings and your first sentence.",
    cta: "Start at Unit 1",
  },
  a1: {
    code: "A1",
    name: "A1 · Some basics",
    text: "You know everyday words. Start at Unit 3 with introductions and jobs; Units 1 and 2 stay open for review.",
    cta: "Start at A1, Unit 3",
  },
  a2: {
    code: "A2",
    name: "A2 · Simple conversations",
    text: "You handle short exchanges. A2 starts with talking about yesterday and team messages. A2 lessons are planned, so your path opens as a preview.",
    cta: "Start with the A2 preview",
  },
  b1: {
    code: "B1",
    name: "B1 · Familiar situations",
    text: "You follow work topics. B1 starts with explaining problems and giving reasons. B1 lessons are planned, so your path opens as a preview.",
    cta: "Start with the B1 preview",
  },
}

const codeStyles: Record<PlacementLevel, string> = {
  beginner: "bg-reward-subtle text-reward-text",
  a1: "bg-level-a1-subtle text-level-a1",
  a2: "bg-level-a2-subtle text-level-a2",
  b1: "bg-level-b1-subtle text-level-b1",
}

type PlacementCheckProps = {
  initialAnswers: number[]
  initialQuestion: number
  initialPhase: "intro" | "result"
  /** Where "Choose my level myself" and closing lead. */
  levelHref: string
  closeHref: string
}

export function PlacementCheck({
  initialAnswers,
  initialQuestion,
  initialPhase,
  levelHref,
  closeHref,
}: PlacementCheckProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<"intro" | "question" | "result">(
    initialPhase
  )
  const [answers, setAnswers] = useState(initialAnswers)
  const [index, setIndex] = useState(initialQuestion)
  const [plays, setPlays] = useState<Record<number, number>>({})
  const [exitOpen, setExitOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const answered = answeredCount(answers)
  const paused = phase === "intro" && answered > 0
  const question = placementQuestions[index]
  const selected = answers[index] ?? -1

  function choose(option: number) {
    setAnswers((current) =>
      current.map((value, i) => (i === index ? option : value))
    )
  }

  function save(nextIndex: number, then: () => void) {
    startTransition(async () => {
      const result = await savePlacementProgressAction({
        answers,
        currentQuestion: nextIndex,
      })
      if (!result.ok) {
        setError(result.message)
        return
      }
      setError(null)
      then()
    })
  }

  function next() {
    if (selected < 0) return
    if (index === TOTAL - 1) {
      startTransition(async () => {
        const result = await completePlacementAction(answers)
        if (!result.ok) setError(result.message)
        else {
          setError(null)
          setPhase("result")
        }
      })
      return
    }
    save(index + 1, () => setIndex(index + 1))
  }

  function pause() {
    save(index, () => {
      setExitOpen(false)
      setPhase("intro")
    })
  }

  function apply() {
    startTransition(async () => {
      const result = await applyPlacementAction()
      if (!result.ok) setError(result.message)
    })
  }

  if (phase === "result") {
    const level = suggestLevel(answers)
    const copy = levelCopy[level]
    return (
      <div className="min-h-svh bg-background">
        <FocusHeader
          closeLabel="Close"
          onClose={() => router.push(closeHref)}
          title="Placement check · optional"
        />
        <main
          id="main"
          className="mx-auto max-w-(--lesson-max) px-[clamp(20px,4vw,32px)] py-12"
        >
          <p className="flex items-center gap-2 text-[0.8438rem] font-semibold text-primary-text">
            <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
            Your suggestion
          </p>
          <h1 className="mt-2 font-display text-h1 font-bold">
            {level === "beginner"
              ? "Start from the beginning"
              : `We suggest starting at ${copy.code}`}
          </h1>
          <div className="mt-6 flex gap-4">
            <span
              className={cn(
                "grid h-16 w-16 shrink-0 place-items-center rounded-xl font-display text-xl font-bold",
                codeStyles[level]
              )}
            >
              {copy.code}
            </span>
            <div>
              <p className="font-display text-h3 font-bold">{copy.name}</p>
              <p className="mt-1 text-secondary-text">{copy.text}</p>
            </div>
          </div>
          <dl className="mt-8 border-t border-border">
            {skillResults(answers).map((skill) => {
              const right = skill.right.filter(Boolean).length
              return (
                <div
                  key={skill.skill}
                  className="flex items-center gap-4 border-b border-border py-3"
                >
                  <dt className="w-28 font-semibold">{skill.skill}</dt>
                  <dd className="flex flex-1 items-center justify-between">
                    <span aria-hidden="true" className="flex gap-1.5">
                      {skill.right.map((isRight, i) => (
                        <i
                          key={i}
                          className={cn(
                            "size-2.5 rounded-full border-[1.5px] border-primary",
                            isRight && "bg-primary"
                          )}
                        />
                      ))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {right} of {skill.total} right
                    </span>
                  </dd>
                </div>
              )
            })}
          </dl>
          <p className="mt-6 flex gap-3 rounded-xl border border-dashed border-input p-4 text-sm text-secondary-text">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Based on {TOTAL} short questions in vocabulary, grammar, reading and
            listening. Speaking and writing weren’t checked. This is a
            suggestion for where to start, not a CEFR level or certificate.
          </p>
          {error && (
            <Alert tone="error" title="Not saved yet" className="mt-6">
              {error}
            </Alert>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" loading={pending} onClick={apply}>
              {copy.cta}
            </Button>
            <Link
              href={levelHref}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Choose another level
            </Link>
            <form action={restartPlacementAction}>
              <Button
                type="submit"
                variant="ghost"
                size="lg"
                iconLeft={<RefreshCw />}
              >
                Take the check again
              </Button>
            </form>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {level === "a2" || level === "b1"
              ? "A2 to B2 lessons are planned, so your path opens as a preview. Unit 1 is the first to open."
              : "Units before your starting point stay open, so you can review them any time."}
          </p>
        </main>
      </div>
    )
  }

  if (phase === "intro" || !question) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <FocusHeader
          closeLabel="Close"
          onClose={() => router.push(closeHref)}
          title="Placement check · optional"
        />
        <main
          id="main"
          className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-12 pb-32"
        >
          <p className="flex items-center gap-2 text-[0.8438rem] font-semibold text-primary-text">
            <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
            Optional · about 6 minutes
          </p>
          <h1 className="mt-2 font-display text-h1 font-bold">
            Find your starting point
          </h1>
          <p className="mt-3 text-body-lg text-secondary-text">
            Eight short questions, getting a little harder as you go. At the end
            we suggest where to start. You decide.
          </p>
          {paused && (
            <Alert tone="info" title="Welcome back" className="mt-6">
              You paused at question {index + 1} of {TOTAL}. Your answers so far
              are kept.
            </Alert>
          )}
          <dl className="mt-8 grid gap-4 border-y border-border py-4 sm:grid-cols-3">
            {[
              ["Questions", "8, about 6 min"],
              ["Skills checked", "Vocabulary, grammar, reading, listening"],
              ["Not checked", "Speaking and writing"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.8125rem] text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 flex gap-3 rounded-xl border border-dashed border-input p-4 text-sm text-secondary-text">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            This is a quick, informal check, not a CEFR certificate or exam. It
            can only suggest a starting point. If lessons feel too easy or too
            hard, you can change your level any time.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure about an answer? Choose “I don’t know yet”. Guessing makes
            the suggestion less useful.
          </p>
        </main>
        <footer className="fixed inset-x-0 bottom-0 border-t border-border-subtle bg-background">
          <div className="mx-auto flex max-w-(--lesson-max) flex-wrap items-center justify-end gap-3 px-[clamp(20px,4vw,32px)] py-3.5">
            <Link
              href={levelHref}
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Choose my level myself
            </Link>
            <Button size="lg" onClick={() => setPhase("question")}>
              {paused ? `Continue at question ${index + 1}` : "Start the check"}
            </Button>
          </div>
        </footer>
      </div>
    )
  }

  const options = [...question.options, "I don’t know yet"]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <FocusHeader
        closeLabel="Stop the placement check"
        onClose={() => setExitOpen(true)}
        progress={{ current: index, total: TOTAL }}
      />
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-32"
      >
        <p className="flex items-center gap-3 text-[0.8438rem] font-semibold text-primary-text">
          {question.skill}
          <span className="rounded-sm bg-primary-subtle px-1.5 py-0.5 text-xs">
            {question.level}
          </span>
        </p>
        <h1 className="mt-2 font-display text-h2 font-bold">
          {question.prompt}
        </h1>
        {question.german && (
          <TargetText as="p" className="mt-4 text-2xl">
            {question.german}
          </TargetText>
        )}
        {question.sign && (
          <TargetText
            as="p"
            className="mt-5 w-fit rounded-xl border-2 border-foreground bg-card px-8 py-4 text-center text-xl font-semibold whitespace-pre-line"
          >
            {question.sign}
          </TargetText>
        )}
        {question.mail && (
          <div className="mt-5 rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              {question.mail.from}
            </p>
            <TargetText as="p" className="mt-2 text-lg">
              {question.mail.text}
            </TargetText>
          </div>
        )}
        {question.listening && (
          <div className="mt-5">
            <ListeningPlayer
              key={index}
              text={question.listening}
              plays={plays[index] ?? 0}
              onPlayed={() =>
                setPlays((current) => ({
                  ...current,
                  [index]: (current[index] ?? 0) + 1,
                }))
              }
            />
          </div>
        )}
        <div
          role="radiogroup"
          aria-label="Answers"
          className="mt-6 flex flex-col gap-3"
        >
          {[...optionOrder(IDK, `placement:${index}`), IDK].map(
            (optionIndex, position) => {
              const option = options[optionIndex] ?? ""
              const isIdk = optionIndex === IDK
              return (
                <AnswerOption
                  key={option}
                  index={position}
                  keyLabel={isIdk ? "?" : undefined}
                  language={
                    question.optionsInTarget && !isIdk ? "target" : "native"
                  }
                  state={selected === optionIndex ? "selected" : "idle"}
                  onSelect={() => choose(optionIndex)}
                >
                  {option}
                </AnswerOption>
              )
            }
          )}
        </div>
        {error && (
          <Alert tone="error" title="Not saved yet" className="mt-6">
            {error}
          </Alert>
        )}
      </main>
      <footer className="fixed inset-x-0 bottom-0 border-t border-border-subtle bg-background">
        <div className="mx-auto flex max-w-(--lesson-max) flex-wrap items-center gap-3 px-[clamp(20px,4vw,32px)] py-3.5">
          <p className="hidden flex-1 text-sm text-muted-foreground sm:block">
            {question.listening
              ? "Listen first, then choose."
              : "Choose one answer. It’s fine not to know."}
          </p>
          {index > 0 && (
            <Button
              variant="ghost"
              size="lg"
              iconLeft={<ArrowLeft />}
              onClick={() => setIndex(index - 1)}
            >
              Back
            </Button>
          )}
          <Button
            size="lg"
            className="ml-auto"
            disabled={selected < 0}
            loading={pending}
            onClick={next}
          >
            {index === TOTAL - 1 ? "See my suggestion" : "Next question"}
          </Button>
        </div>
      </footer>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent size="sm">
          <DialogTitle>Stop the placement check?</DialogTitle>
          <DialogDescription>
            You’ve answered {answered} of {TOTAL} questions. Pause and your
            answers stay here for 24 hours, or choose your level yourself.
          </DialogDescription>
          <DialogActions className="sm:flex-wrap">
            <Link
              href={levelHref}
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Choose my level myself
            </Link>
            <Button
              variant="outline"
              size="lg"
              loading={pending}
              onClick={pause}
            >
              Pause for now
            </Button>
            <Button size="lg" onClick={() => setExitOpen(false)}>
              Keep going
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  )
}
