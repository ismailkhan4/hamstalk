import { TARGET_LANG } from "@/content/courses"
import { Avatar } from "@/components/learning/avatar"
import { TargetText } from "@/components/learning/target-text"
import { Button } from "@/components/ui/button"

import { personalise, type Lesson } from "../schema"
import { ActionFooter } from "./footer"
import type { Learner } from "./types"

type LessonIntroProps = {
  lesson: Lesson
  kicker: string
  learner: Learner
  /** The exercise a saved lesson would continue at (1-based), when there is one. */
  resumeAt: number | null
  replay: boolean
  onStart: () => void
  onResume: () => void
  /** A practice session: no team intro, and it saves when it ends rather than as it goes. */
  practice?: "smart" | "mistakes" | "express"
}

export function LessonIntro({
  lesson,
  kicker,
  learner,
  resumeAt,
  replay,
  onStart,
  onResume,
  practice,
}: LessonIntroProps) {
  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-36"
      >
        <p className="flex items-center gap-2 text-[0.8438rem] font-semibold text-primary-text">
          <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
          {kicker}
        </p>
        <h1
          lang={lesson.titleInTarget ? TARGET_LANG : undefined}
          className={
            lesson.titleInTarget
              ? "mt-2 font-voice text-[clamp(40px,6vw,56px)] leading-tight"
              : "mt-2 font-display text-h1 font-bold"
          }
        >
          {lesson.title}
        </h1>
        {lesson.titleEn && (
          <p className="text-lg text-muted-foreground">{lesson.titleEn}</p>
        )}
        <p className="mt-4 text-body-lg text-secondary-text">{lesson.goal}</p>

        {!practice && (
          <div className="mt-6 flex items-start gap-4">
            <Avatar
              person={lesson.intro.speaker.person}
              initials={lesson.intro.speaker.initials}
              size="xl"
            />
            <div>
              <TargetText as="p" className="text-2xl">
                {personalise(lesson.intro.target, learner)}
              </TargetText>
              <p className="mt-1 text-[0.9375rem] text-muted-foreground">
                {personalise(lesson.intro.native, learner)}
              </p>
            </div>
          </div>
        )}

        <dl className="mt-8 grid gap-4 border-y border-border py-4 sm:grid-cols-3">
          <div>
            <dt className="text-[0.8125rem] text-muted-foreground">
              Estimated time
            </dt>
            <dd className="mt-1 font-semibold">
              About {lesson.minutes} min (estimate)
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted-foreground">
              Exercises
            </dt>
            <dd className="mt-1 font-semibold">
              {lesson.exercises.length} exercises
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-muted-foreground">Focus</dt>
            <dd className="mt-1 font-semibold">{lesson.focus}</dd>
          </div>
        </dl>

        {lesson.phrases.length > 0 && (
          <h2 className="mt-6 text-sm font-semibold text-secondary-text">
            You’ll practise
          </h2>
        )}
        <ul className="mt-2 flex flex-wrap gap-2">
          {lesson.phrases.map((phrase) => (
            <li
              key={phrase}
              className="rounded-lg bg-card px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--border)]"
            >
              <TargetText className="text-lg">{phrase}</TargetText>
            </li>
          ))}
        </ul>
        {replay && (
          <p className="mt-6 rounded-lg bg-info-subtle p-3 text-sm text-info-text">
            You’ve finished this one. Replay it any time: a replay earns a
            little practice XP once a day.
          </p>
        )}
      </main>
      <ActionFooter
        hint={
          practice === "express"
            ? "One try per answer, and each miss takes an Akku bar."
            : practice
              ? "Takes a few minutes. Practice never uses the Akku."
              : "You can leave and come back. Your place is saved."
        }
      >
        {resumeAt ? (
          <>
            <Button variant="outline" size="lg" onClick={onStart}>
              Start over
            </Button>
            <Button size="lg" onClick={onResume}>
              Continue at exercise {resumeAt}
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onStart}>
            {practice === "express"
              ? "Ride the Express"
              : practice
                ? "Start practice"
                : "Start lesson"}
          </Button>
        )}
      </ActionFooter>
    </>
  )
}
