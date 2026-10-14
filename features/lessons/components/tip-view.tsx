import { Lightbulb } from "lucide-react"

import { GermanText } from "@/components/learning/german-text"
import { Button } from "@/components/ui/button"

import { personalise, type TipExercise } from "../schema"
import { ActionFooter } from "./footer"
import { ExerciseHeading } from "./exercise-heading"
import type { Learner } from "./types"

type TipViewProps = {
  exercise: TipExercise
  learner: Learner
  onDone: () => void
}

export function TipView({ exercise, learner, onDone }: TipViewProps) {
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
        <div
          tabIndex={0}
          role="region"
          aria-label={exercise.title}
          className="mt-8 overflow-x-auto rounded-xl border border-border bg-card"
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-inset text-sm">
                {exercise.columns.map((column, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-3 py-2.5 font-semibold sm:px-4"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exercise.rows.map((row, r) => (
                <tr
                  key={r}
                  className="border-b border-border-subtle last:border-b-0"
                >
                  {row.map((cell, c) => (
                    <td key={c} className="px-3 py-3 align-top sm:px-4">
                      {c === 0 ? (
                        <span className="text-[15px] text-secondary-text">
                          {cell}
                        </span>
                      ) : (
                        <GermanText className="text-lg">
                          {personalise(cell, learner)}
                        </GermanText>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 flex flex-col gap-3">
          {exercise.examples.map((example) => (
            <li key={example.de}>
              <GermanText as="p" className="text-xl">
                {personalise(example.de, learner)}
              </GermanText>
              <p className="text-[15px] text-muted-foreground">
                {personalise(example.en, learner)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex gap-3 rounded-xl bg-reward-subtle p-4 text-[15px] text-reward-text">
          <Lightbulb
            aria-hidden="true"
            className="mt-0.5 size-[18px] shrink-0"
          />
          {personalise(exercise.note, learner)}
        </p>
      </main>
      <ActionFooter>
        <Button size="lg" onClick={onDone}>
          Continue
        </Button>
      </ActionFooter>
    </>
  )
}
