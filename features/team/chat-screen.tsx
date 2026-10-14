"use client"

import { ArrowLeft, Check, Languages, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { AnswerOption } from "@/components/exercises/answer-option"
import { AppShell } from "@/components/layout/app-shell"
import { Avatar } from "@/components/learning/avatar"
import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"
import { chat } from "@/content/team-tasks"
import { ListenButton } from "@/features/lessons/components/listen-button"
import type { NotebookCounts } from "@/features/review/data"
import { cn } from "@/lib/utils"

type Props = {
  shell: { name: string; email: string; counts?: NotebookCounts }
  firstName: string
}

const personalise = (text: string, name: string) => text.replaceAll("%N", name)

export function ChatScreen({ shell, firstName }: Props) {
  const [translation, setTranslation] = useState(false)
  const [mode, setMode] = useState<"choose" | "write">("choose")
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [draft, setDraft] = useState("")
  const [compared, setCompared] = useState(false)

  const message = personalise(chat.message.de, firstName)
  const chosen = picked === null ? null : chat.replies[picked]
  const right = chosen?.correct === true

  const tab = (value: "choose" | "write", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === value}
      onClick={() => setMode(value)}
      className={cn(
        "min-h-10 rounded-md px-4 text-[0.9375rem] font-semibold",
        mode === value
          ? "bg-card text-foreground shadow-xs"
          : "text-secondary-text hover:text-foreground"
      )}
    >
      {label}
    </button>
  )

  return (
    <AppShell {...shell}>
      <main
        id="main"
        className="mx-auto max-w-(--content-max) px-4 py-8 sm:px-6 lg:px-10"
      >
        <Link
          href="/team"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-secondary-text hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-[18px]" />
          Team
        </Link>
        <h1 className="mt-2 font-display text-h1 font-bold">
          Message from Jonas
        </h1>
        <p className="mt-2 max-w-[62ch] text-body-lg text-secondary-text">
          Read it, check the words you need, then reply the way a colleague
          would. Jonas is a made-up teammate: nothing you write is sent to
          anyone.
        </p>

        <div className="mt-6 max-w-3xl">
          <div className="flex gap-3">
            <Avatar person="jk" initials={chat.from.initials} size="lg" />
            <div className="min-w-0">
              <p className="text-sm">
                <b>{chat.from.name}</b>{" "}
                <span className="text-muted-foreground">{chat.from.time}</span>
              </p>
              <div className="mt-1 rounded-2xl rounded-tl-sm border border-border bg-card p-4">
                <GermanText as="p" className="text-xl leading-relaxed">
                  {message}
                </GermanText>
                {translation && (
                  <p className="mt-3 border-t border-dashed border-border pt-3 text-secondary-text">
                    {personalise(chat.message.en, firstName)}
                  </p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-pressed={translation}
                  onClick={() => setTranslation((on) => !on)}
                >
                  <Languages aria-hidden="true" data-icon="inline-start" />
                  {translation ? "Hide translation" : "Show translation"}
                </Button>
                <ListenButton text={message} label="Listen" />
              </div>
              <ul
                aria-label="Words you may need"
                className="mt-3 flex flex-wrap gap-2"
              >
                {chat.chips.map((chip) => (
                  <li
                    key={chip.word}
                    className="rounded-lg bg-inset px-3 py-1.5 text-sm"
                  >
                    <GermanText className="text-base">{chip.word}</GermanText>{" "}
                    <span className="text-muted-foreground">{chip.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section
            aria-labelledby="reply-title"
            className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="reply-title" className="font-semibold">
                Your reply
              </h2>
              <div
                role="tablist"
                aria-label="How to reply"
                className="inline-flex rounded-lg bg-muted p-1"
              >
                {tab("choose", "Choose a reply")}
                {tab("write", "Write your own")}
              </div>
            </div>

            {mode === "choose" ? (
              <div role="tabpanel" className="mt-5">
                <div
                  role="radiogroup"
                  aria-label="Choose a reply"
                  className="flex flex-col gap-2.5"
                >
                  {chat.replies.map((reply, i) => (
                    <AnswerOption
                      key={reply.de}
                      index={i}
                      lang="de"
                      translation={reply.en}
                      locked={checked && right}
                      state={
                        checked && picked === i
                          ? reply.correct
                            ? "correct"
                            : "incorrect"
                          : picked === i
                            ? "selected"
                            : "idle"
                      }
                      onSelect={() => {
                        setPicked(i)
                        setChecked(false)
                      }}
                    >
                      {reply.de}
                    </AnswerOption>
                  ))}
                </div>
                {checked && chosen && (
                  <div
                    role={right ? "status" : "alert"}
                    className={cn(
                      "mt-4 flex gap-3 rounded-lg border p-4 text-sm",
                      right
                        ? "border-success-border bg-success-subtle text-success-text"
                        : "border-danger-border bg-danger-subtle text-danger-text"
                    )}
                  >
                    {right ? (
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0"
                      />
                    ) : (
                      <X
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0"
                      />
                    )}
                    <p>
                      <b className="block">
                        {right ? "Good reply" : (chosen.title ?? "Not quite")}
                      </b>
                      {chosen.note}
                    </p>
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  {!checked && (
                    <Button
                      size="lg"
                      disabled={picked === null}
                      onClick={() => setChecked(true)}
                    >
                      Check reply
                    </Button>
                  )}
                  {checked && !right && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setPicked(null)
                        setChecked(false)
                      }}
                    >
                      Try another reply
                    </Button>
                  )}
                  {checked && right && (
                    <Link
                      href="/team"
                      className="inline-flex h-12 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground"
                    >
                      Back to team
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div role="tabpanel" className="mt-5">
                <label htmlFor="own-reply" className="block font-semibold">
                  Write in German
                </label>
                <textarea
                  id="own-reply"
                  lang="de"
                  rows={3}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-describedby="own-reply-note"
                  className="mt-2 w-full rounded-lg border-[1.5px] border-input bg-card p-3 font-voice text-lg focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-none"
                />
                <p
                  id="own-reply-note"
                  className="mt-1.5 text-sm text-muted-foreground"
                >
                  Klarlingo doesn’t grade free writing yet. Compare your reply
                  with model answers instead. Your text stays on this page and
                  isn’t sent or saved.
                </p>
                {compared && (
                  <div className="mt-4 rounded-xl bg-inset p-4">
                    <h3 className="text-sm font-semibold">Model replies</h3>
                    <ul className="mt-2 space-y-1">
                      {chat.modelReplies.map((reply) => (
                        <li key={reply}>
                          <GermanText className="text-lg">{reply}</GermanText>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-3 space-y-1.5 text-sm text-secondary-text">
                      {chat.checklist.map((item) => (
                        <li key={item.text} className="flex gap-2">
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-success-text"
                          />
                          <span>
                            {item.text}{" "}
                            {item.example && (
                              <GermanText>{item.example}</GermanText>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-5">
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={draft.trim().length === 0}
                    onClick={() => setCompared(true)}
                  >
                    Compare with model replies
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  )
}
