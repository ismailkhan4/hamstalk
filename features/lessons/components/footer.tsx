import { ExerciseFeedback } from "@/components/exercises/exercise-feedback"
import { ACTIVE_COURSE } from "@/content/courses"

type ActionFooterProps = {
  hint?: string
  hintId?: string
  children: React.ReactNode
}

/** The sticky lesson footer before an answer: a short hint and the primary action. */
export function ActionFooter({ hint, hintId, children }: ActionFooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-border-subtle bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-(--lesson-max) items-center gap-4 px-[clamp(20px,4vw,32px)] py-3.5">
        {hint && (
          <p
            id={hintId}
            className="min-w-0 flex-1 text-sm text-muted-foreground"
          >
            {hint}
          </p>
        )}
        <div className="ml-auto flex shrink-0 gap-3">{children}</div>
      </div>
    </footer>
  )
}

type FeedbackFooterProps = React.ComponentProps<typeof ExerciseFeedback>

/** The same footer after an answer: right, first miss or answer shown. */
export function FeedbackFooter(props: FeedbackFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-(--z-sticky) pb-[env(safe-area-inset-bottom)]">
      <ExerciseFeedback {...props} />
    </div>
  )
}

/** Rotates the course's confirmations so repeated right answers don't all say the same word. */
export function rightTitle(seed: number) {
  const titles = ACTIVE_COURSE.phrases.right
  return titles[seed % titles.length] ?? titles[0] ?? ""
}
