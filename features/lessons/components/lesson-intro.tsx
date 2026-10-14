import { Avatar } from "@/components/learning/avatar"
import { GermanText } from "@/components/learning/german-text"
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
}

export function LessonIntro({
  lesson,
  kicker,
  learner,
  resumeAt,
  replay,
  onStart,
  onResume,
}: LessonIntroProps) {
  return (
    <>
      <main
        id="main"
        className="mx-auto w-full max-w-(--lesson-max) flex-1 px-[clamp(20px,4vw,32px)] py-10 pb-36"
      >
        <p className="flex items-center gap-2 text-[13.5px] font-semibold text-primary-text">
          <i aria-hidden="true" className="size-2 rounded-full bg-spark" />
          {kicker}
        </p>
        <h1
          lang={lesson.titleIsGerman ? "de" : undefined}
          className={
            lesson.titleIsGerman
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

        <div className="mt-6 flex items-start gap-4">
          <Avatar
            person={lesson.intro.speaker.person}
            initials={lesson.intro.speaker.initials}
            size="xl"
          />
          <div>
            <GermanText as="p" className="text-2xl">
              {personalise(lesson.intro.de, learner)}
            </GermanText>
            <p className="mt-1 text-[15px] text-muted-foreground">
              {personalise(lesson.intro.en, learner)}
            </p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 border-y border-border py-4 sm:grid-cols-3">
          <div>
            <dt className="text-[13px] text-muted-foreground">
              Estimated time
            </dt>
            <dd className="mt-1 font-semibold">
              About {lesson.minutes} min (estimate)
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted-foreground">Exercises</dt>
            <dd className="mt-1 font-semibold">
              {lesson.exercises.length} exercises
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted-foreground">Focus</dt>
            <dd className="mt-1 font-semibold">{lesson.focus}</dd>
          </div>
        </dl>

        <h2 className="mt-6 text-sm font-semibold text-secondary-text">
          You’ll practise
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {lesson.phrases.map((phrase) => (
            <li
              key={phrase}
              className="rounded-lg bg-card px-3 py-1.5 shadow-[inset_0_0_0_1px_var(--border)]"
            >
              <GermanText className="text-lg">{phrase}</GermanText>
            </li>
          ))}
        </ul>
        {replay && (
          <p className="mt-6 rounded-lg bg-info-subtle p-3 text-sm text-info-text">
            You’ve finished this one. You can replay it any time; replays don’t
            add XP.
          </p>
        )}
      </main>
      <ActionFooter hint="You can leave and come back. Your place is saved.">
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
            Start lesson
          </Button>
        )}
      </ActionFooter>
    </>
  )
}
