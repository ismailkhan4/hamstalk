"use client"

import { Mic, MicOff, Square } from "lucide-react"
import { useState, useSyncExternalStore } from "react"

import { TARGET_LANG } from "@/content/courses"
import { Alert } from "@/components/feedback/alert"
import { Button } from "@/components/ui/button"
import type { Transcript } from "@/lib/stt/elevenlabs"
import { useRecorder } from "@/lib/stt/recorder"
import { cn } from "@/lib/utils"

import { check, retry, startAttempt, type Attempt } from "../engine/attempt"
import { gradeSpeech, type SpeechGrade } from "../engine/speech"
import { useMaxTries } from "../engine/tries-context"
import { personalise, type SpeakExercise } from "../schema"
import { ExerciseHeading } from "./exercise-heading"
import { ActionFooter, FeedbackFooter, rightTitle } from "./footer"
import { ListenButton } from "./listen-button"
import type { ExerciseProps } from "./types"

/** "Can't speak now" pauses speaking exercises for an hour, on this device. */
const PAUSE_KEY = "klarlingo:speaking-paused-until"
const PAUSE_MS = 60 * 60 * 1000

function pausedNow() {
  try {
    return Number(localStorage.getItem(PAUSE_KEY)) > Date.now()
  } catch {
    return false
  }
}

function onStorage(change: () => void) {
  window.addEventListener("storage", change)
  return () => window.removeEventListener("storage", change)
}

function setPaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(PAUSE_KEY, String(Date.now() + PAUSE_MS))
    else localStorage.removeItem(PAUSE_KEY)
  } catch {
    // Without storage the pause lasts for this exercise only.
  }
}

const PROBLEMS: Record<string, string> = {
  "sign-in": "Sign in to have your speaking checked.",
  limit:
    "That’s all the speaking checks for today. Carry on and speak again tomorrow.",
  "not-configured": "Speaking checks aren’t set up yet.",
  invalid:
    "That recording didn’t come through. Try once more, a little closer to the mic.",
}

/**
 * Say a line aloud. The answer is recorded in the browser, transcribed by /api/speech and graded
 * here, leniently (see engine/speech.ts). Speech recognition can fail on a good answer, so a miss
 * here never costs Akku or goes into the mistakes notebook, and the learner can always skip.
 */
export function SpeakView({
  exercise,
  index,
  learner,
  onDone,
}: ExerciseProps<SpeakExercise>) {
  const [attempt, setAttempt] = useState<Attempt>(startAttempt)
  const [grade, setGrade] = useState<SpeechGrade | null>(null)
  const [heard, setHeard] = useState("")
  const [checking, setChecking] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const storedPause = useSyncExternalStore(onStorage, pausedNow, () => false)
  const [pauseChoice, setPausedState] = useState<boolean | null>(null)
  const paused = pauseChoice ?? storedPause
  const maxTries = useMaxTries()
  const target = personalise(exercise.target, learner)
  const accept = exercise.accept.map((line) => personalise(line, learner))

  async function onRecorded(audio: Blob) {
    setChecking(true)
    setProblem(null)
    try {
      const form = new FormData()
      form.append("audio", audio)
      const response = await fetch("/api/speech", {
        method: "POST",
        body: form,
      })
      const data = (await response.json().catch(() => ({}))) as Partial<
        Transcript & { error: string }
      >
      if (!response.ok || !data.words) {
        setProblem(
          PROBLEMS[data.error ?? ""] ??
            "We couldn’t check that just now. Try again in a moment."
        )
        return
      }
      if (data.words.length === 0) {
        setProblem(
          "We didn’t hear anything. Tap the mic and speak up a little."
        )
        return
      }
      const result = gradeSpeech({ target, accept }, data.words)
      setGrade(result)
      setHeard(data.text ?? "")
      setAttempt(check(attempt, result.verdict, maxTries))
    } catch {
      setProblem("You seem to be offline. Try again when you’re connected.")
    } finally {
      setChecking(false)
    }
  }

  const recorder = useRecorder((audio) => void onRecorded(audio))
  const recording = recorder.status === "recording"
  const answering = attempt.phase === "answering"
  const blocked =
    paused || recorder.status === "unsupported" || recorder.status === "denied"

  function skip() {
    setPaused(true)
    setPausedState(true)
    onDone("first_try")
  }

  const unsure = grade?.words.filter((word) => word.status === "unsure") ?? []

  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-40"
      >
        <ExerciseHeading
          kind={exercise.kind}
          title={personalise(exercise.prompt, learner)}
        />

        <div className="mt-8 rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <p
              lang={TARGET_LANG}
              className="min-w-0 flex-1 font-voice text-2xl leading-snug"
            >
              {grade
                ? grade.words.map((word, i) => (
                    <span
                      key={i}
                      className={cn(
                        word.status === "missed" &&
                          "text-danger-text underline decoration-wavy decoration-2 underline-offset-4",
                        word.status === "unsure" &&
                          "text-warning-text underline decoration-dotted decoration-2 underline-offset-4",
                        word.status === "heard" && "text-success-text"
                      )}
                    >
                      {i > 0 && " "}
                      {word.text}
                    </span>
                  ))
                : target}
            </p>
            <ListenButton
              text={target}
              speaker={exercise.speaker ?? null}
              slow
            />
          </div>
          <p className="mt-2 text-muted-foreground">
            {personalise(exercise.native, learner)}
          </p>
        </div>

        {answering && !blocked && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={checking || recorder.status === "asking"}
              aria-pressed={recording}
              aria-label={recording ? "Stop recording" : "Start speaking"}
              onClick={() =>
                recording ? recorder.stop() : void recorder.start()
              }
              className={cn(
                "relative grid size-24 place-items-center rounded-full border-b-4 text-primary-foreground transition-transform focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none active:translate-y-0.5 active:border-b-2 disabled:opacity-60",
                recording
                  ? "border-danger-border bg-danger"
                  : "border-primary-border bg-primary"
              )}
            >
              {recording && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-danger/40 motion-safe:animate-ping"
                />
              )}
              {recording ? (
                <Square className="relative size-9" aria-hidden="true" />
              ) : (
                <Mic className="relative size-10" aria-hidden="true" />
              )}
            </button>
            <p
              role="status"
              className="text-sm font-semibold text-muted-foreground"
            >
              {checking
                ? "Checking…"
                : recording
                  ? "Listening… tap to stop"
                  : recorder.status === "asking"
                    ? "Allow the microphone to start"
                    : "Tap and say it aloud"}
            </p>
          </div>
        )}

        {answering && blocked && (
          <div className="mt-8">
            <Alert
              tone="info"
              title={
                paused
                  ? "Speaking is paused for now"
                  : recorder.status === "denied"
                    ? "No microphone access"
                    : "This browser can’t record"
              }
            >
              {paused
                ? "Say it quietly to yourself, then carry on. Speaking exercises come back in an hour."
                : recorder.status === "denied"
                  ? "Allow the microphone in your browser’s site settings to practise speaking. For now, say it to yourself and carry on."
                  : "Say it to yourself and carry on. Speaking works in current Chrome, Safari, Edge and Firefox."}
            </Alert>
          </div>
        )}

        {problem && answering && !blocked && (
          <div className="mt-6">
            <Alert tone="warning" title="Not checked">
              {problem}
            </Alert>
          </div>
        )}
      </main>

      {answering && !blocked && (
        <ActionFooter hint="Say the whole line. Filler words like “äh” don’t matter.">
          <Button
            size="lg"
            variant="ghost"
            iconLeft={<MicOff />}
            disabled={recording || checking}
            onClick={skip}
          >
            Can’t speak now
          </Button>
        </ActionFooter>
      )}
      {answering && blocked && (
        <ActionFooter>
          {paused && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setPaused(false)
                setPausedState(false)
              }}
            >
              Speak again
            </Button>
          )}
          <Button size="lg" onClick={() => onDone("first_try")}>
            Continue
          </Button>
        </ActionFooter>
      )}
      {attempt.phase === "right" && (
        <FeedbackFooter
          result="correct"
          title={rightTitle(index)}
          titleLang={TARGET_LANG}
          action={
            <Button
              size="lg"
              onClick={() => onDone(attempt.outcome ?? "first_try")}
            >
              Continue
            </Button>
          }
        >
          {personalise(exercise.feedback.right, learner)}
          {unsure.length > 0 &&
            ` Listen to ${unsure.map((word) => `„${word.text.replace(/[^\p{L}\p{N}]+$/u, "")}“`).join(", ")} once more: it was nearly there.`}
        </FeedbackFooter>
      )}
      {attempt.phase === "wrong" && (
        <FeedbackFooter
          result="incorrect"
          title="Not quite"
          action={
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setGrade(null)
                setAttempt(retry(attempt))
              }}
            >
              Try again
            </Button>
          }
        >
          {heard ? `We heard „${heard}“. ` : ""}
          {personalise(exercise.feedback.wrong, learner)} Listen once more, then
          have another go.
        </FeedbackFooter>
      )}
      {attempt.phase === "shown" && (
        <FeedbackFooter
          result="shown"
          title="Let’s keep going"
          action={
            // Recognition can miss a good answer, so this counts as a second try, never a loss.
            <Button size="lg" onClick={() => onDone("second_try")}>
              Continue
            </Button>
          }
        >
          {heard ? `We heard „${heard}“. ` : ""}Speech checks aren’t perfect, so
          this one costs nothing. Play it again and say it along.
        </FeedbackFooter>
      )}
    </>
  )
}
