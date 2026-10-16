"use client"

import { Check, Languages, Send, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"

import { Alert } from "@/components/feedback/alert"
import { FocusHeader } from "@/components/learning/focus-header"
import { Avatar, type Person } from "@/components/learning/avatar"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ACTIVE_COURSE, TARGET_LANG } from "@/content/courses"
import type { Roleplay } from "@/content/courses/de/roleplays"
import { celebrate } from "@/features/celebrations/confetti"
import { playFeedback } from "@/features/celebrations/feedback"
import { Mascot } from "@/features/celebrations/mascot"
import { MASCOT_NAME } from "@/features/celebrations/mascot-name"
import { StashSummary } from "@/features/economy/components/stash-summary"
import type { Rewards } from "@/features/rewards/payload"
import { cn } from "@/lib/utils"

import type { RoleplayFeedback, RoleplayLine, RoleplayTurn } from "../actions"
import { MAX_TURNS } from "../model"

type Fail = { ok: false; message: string }

export type RoleplayActions = {
  turn: (
    history: RoleplayLine[]
  ) => Promise<{ ok: true; turn: RoleplayTurn } | Fail>
  finish: (
    history: RoleplayLine[]
  ) => Promise<
    { ok: true; feedback: RoleplayFeedback; rewards: Rewards | null } | Fail
  >
}

type Message = RoleplayLine & {
  native?: string
  correction?: RoleplayTurn["correction"]
}

/**
 * A typed conversation with a team character, played by AI. The goals tick off as the learner
 * manages them; a slip gets a gentle "better:" under their message; the end brings feedback.
 */
export function RoleplayChat({
  roleplay,
  character,
  actions,
}: {
  roleplay: Pick<
    Roleplay,
    "id" | "title" | "where" | "brief" | "goals" | "opening" | "phrases"
  >
  character: { id: string; name: string; initials: string; role: string }
  actions: RoleplayActions
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [met, setMet] = useState<string[]>([])
  const [ended, setEnded] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [shown, setShown] = useState<Record<number, boolean>>({})
  const [result, setResult] = useState<{
    feedback: RoleplayFeedback
    rewards: Rewards | null
  } | null>(null)
  const [pending, startTransition] = useTransition()
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const turns = messages.filter((m) => m.role === "learner").length
  const history = (list: Message[]): RoleplayLine[] =>
    list.map(({ role, text }) => ({ role, text }))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, pending, result])

  function send(text: string) {
    const said = text.trim()
    if (!said || pending || ended) return
    const next: Message[] = [...messages, { role: "learner", text: said }]
    setMessages(next)
    setDraft("")
    setProblem(null)
    startTransition(async () => {
      const response = await actions.turn(history(next))
      if (!response.ok) {
        setProblem(response.message)
        setMessages(messages)
        setDraft(said)
        return
      }
      const { turn } = response
      setMessages([
        ...next.slice(0, -1),
        { ...next[next.length - 1]!, correction: turn.correction },
        {
          role: "character",
          text: turn.reply.target,
          native: turn.reply.native,
        },
      ])
      if (turn.goalsMet.length > met.length) playFeedback("correct")
      setMet(turn.goalsMet)
      if (turn.done || turns + 1 >= MAX_TURNS) setEnded(true)
    })
  }

  function finish() {
    setProblem(null)
    startTransition(async () => {
      const response = await actions.finish(history(messages))
      if (!response.ok) {
        setProblem(response.message)
        return
      }
      setEnded(true)
      setResult({ feedback: response.feedback, rewards: response.rewards })
      playFeedback(response.feedback.stars === 3 ? "perfect" : "complete")
      celebrate(response.feedback.stars === 3 ? "big" : "small")
    })
  }

  const avatar = (
    <Avatar
      person={character.id as Person}
      initials={character.initials}
      size="md"
    />
  )

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <FocusHeader
        closeLabel="Leave the conversation"
        onClose={() => router.push("/team")}
        title={roleplay.title}
        progress={{
          current: met.length,
          total: roleplay.goals.length,
          done: result !== null || met.length >= roleplay.goals.length,
        }}
      />
      <main
        id="main"
        className="mx-auto flex w-full max-w-(--lesson-max) flex-1 flex-col px-[clamp(16px,4vw,32px)] pt-6 pb-48"
      >
        <section className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="flex items-center gap-3">
            <Avatar
              person={character.id as Person}
              initials={character.initials}
              size="lg"
            />
            <span>
              <span className="block font-extrabold">{character.name}</span>
              <span className="block text-sm text-muted-foreground">
                {character.role} · {roleplay.where}
              </span>
            </span>
          </p>
          <p className="mt-3 font-semibold text-secondary-text">
            {roleplay.brief}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Your goals">
            {roleplay.goals.map((goal) => {
              const done = met.includes(goal.id)
              return (
                <li
                  key={goal.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-sm font-bold transition-colors",
                    done
                      ? "border-success-border bg-success-subtle text-success-text"
                      : "border-border-subtle text-muted-foreground"
                  )}
                >
                  {done && <Check aria-hidden="true" className="size-3.5" />}
                  {goal.text}
                  <span className="sr-only">{done ? ", done" : ""}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <ol className="mt-6 flex flex-col gap-4" aria-live="polite">
          <CharacterLine
            avatar={avatar}
            target={roleplay.opening.target}
            native={roleplay.opening.native}
            shown={shown[-1] ?? false}
            onToggle={() => setShown({ ...shown, [-1]: !shown[-1] })}
          />
          {messages.map((message, i) =>
            message.role === "character" ? (
              <CharacterLine
                key={i}
                avatar={avatar}
                target={message.text}
                native={message.native}
                shown={shown[i] ?? false}
                onToggle={() => setShown({ ...shown, [i]: !shown[i] })}
              />
            ) : (
              <li key={i} className="flex flex-col items-end">
                <TargetText
                  as="p"
                  className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-lg text-primary-foreground"
                >
                  {message.text}
                </TargetText>
                {message.correction && (
                  <p className="mt-1.5 max-w-[85%] rounded-xl bg-warning-subtle px-3 py-2 text-sm text-warning-text">
                    <span className="font-bold">Better: </span>
                    <TargetText>{message.correction.better}</TargetText>
                    <span className="block text-xs">
                      {message.correction.note}
                    </span>
                  </p>
                )}
              </li>
            )
          )}
          {pending && !result && (
            <li className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              {avatar}
              {ended
                ? `${MASCOT_NAME} is writing your feedback…`
                : `${character.name} is typing…`}
            </li>
          )}
        </ol>

        {result && (
          <section
            aria-labelledby="roleplay-done"
            className="mt-8 rounded-3xl border-2 border-border bg-card p-5 motion-safe:animate-rise"
          >
            <div className="flex items-center gap-4">
              <Mascot
                mood={result.feedback.stars === 3 ? "cheer" : "happy"}
                size={72}
              />
              <div>
                <p
                  className="flex gap-1"
                  aria-label={`${result.feedback.stars} of 3 stars`}
                >
                  {[1, 2, 3].map((n) => (
                    <Star
                      key={n}
                      aria-hidden="true"
                      className={cn(
                        "size-7",
                        n <= result.feedback.stars
                          ? "fill-reward text-reward-text"
                          : "text-border-edge"
                      )}
                    />
                  ))}
                </p>
                <h2
                  id="roleplay-done"
                  className="mt-1 font-display text-xl font-semibold"
                >
                  {result.feedback.summary}
                </h2>
              </div>
            </div>
            {result.feedback.highlights.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1.5">
                {result.feedback.highlights.map((item) => (
                  <li key={item} className="flex gap-2 font-semibold">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-success-text"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {result.feedback.fixes.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {result.feedback.fixes.map((fix) => (
                  <li
                    key={fix.said}
                    className="rounded-xl bg-background-subtle p-3"
                  >
                    <TargetText className="text-danger-text line-through decoration-1">
                      {fix.said}
                    </TargetText>{" "}
                    →{" "}
                    <TargetText className="font-semibold text-success-text">
                      {fix.better}
                    </TargetText>
                    <span className="block text-sm text-muted-foreground">
                      {fix.why}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <StashSummary rewards={result.rewards} className="mt-4" />
            {result.rewards && result.rewards.awarded > 0 && (
              <p className="mt-3 font-display text-lg font-semibold text-reward-text">
                +{result.rewards.awarded} XP
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {/* A full page load starts a fresh conversation. */}
              <a
                href={`/team/roleplay/${roleplay.id}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Talk again
              </a>
              <Link href="/team" className={buttonVariants({ size: "lg" })}>
                Back to the team
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {character.name} is played by AI for practice. Nothing here is
              sent to a real person.
            </p>
          </section>
        )}
        <div ref={endRef} />
      </main>

      {!result && (
        <footer className="fixed inset-x-0 bottom-0 border-t-2 border-border-subtle bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-(--lesson-max) px-[clamp(16px,4vw,32px)] py-3">
            {problem && (
              <Alert tone="error" title="Not sent" className="mb-3">
                {problem}
              </Alert>
            )}
            {ended ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-secondary-text">
                  That’s the conversation. Ready for {MASCOT_NAME}’s feedback?
                </p>
                <Button size="lg" loading={pending} onClick={finish}>
                  Finish and get feedback
                </Button>
              </div>
            ) : (
              <>
                {turns === 0 && (
                  <ul
                    className="mb-2 flex flex-wrap gap-2"
                    aria-label="Phrases to start with"
                  >
                    {roleplay.phrases.map((phrase) => (
                      <li key={phrase}>
                        <button
                          type="button"
                          onClick={() => setDraft(phrase.replace(" …", " "))}
                          className="rounded-lg border-2 border-border bg-card px-2.5 py-1 font-semibold hover:bg-background-subtle"
                        >
                          <TargetText>{phrase}</TargetText>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <form
                  className="flex items-end gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    send(draft)
                  }}
                >
                  <label htmlFor="roleplay-input" className="sr-only">
                    Your reply to {character.name}
                  </label>
                  <textarea
                    id="roleplay-input"
                    lang={TARGET_LANG}
                    rows={1}
                    maxLength={300}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        send(draft)
                      }
                    }}
                    placeholder={`Write in ${ACTIVE_COURSE.language} …`}
                    className="min-h-12 flex-1 resize-none rounded-xl border-2 border-input bg-card px-3 py-2.5 text-lg focus-visible:border-primary focus-visible:outline-none"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!draft.trim() || pending}
                    aria-label="Send"
                  >
                    <Send aria-hidden="true" />
                  </Button>
                </form>
                <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {turns}/{MAX_TURNS} messages · Shift+Enter for a new line
                  </span>
                  {turns > 0 && (
                    <button
                      type="button"
                      onClick={() => setEnded(true)}
                      className="font-bold text-primary-text hover:underline"
                    >
                      End here
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}

function CharacterLine({
  avatar,
  target,
  native,
  shown,
  onToggle,
}: {
  avatar: React.ReactNode
  target: string
  native?: string
  shown: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-end gap-2">
      {avatar}
      <div className="max-w-[85%]">
        <TargetText
          as="p"
          className="rounded-2xl rounded-bl-sm border-2 border-border bg-card px-4 py-2.5 text-lg"
        >
          {target}
        </TargetText>
        {native && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={shown}
            className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <Languages aria-hidden="true" className="size-3.5" />
            {shown ? native : "Show English"}
          </button>
        )}
      </div>
    </li>
  )
}
