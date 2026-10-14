import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type FocusHeaderProps = {
  closeLabel: string
  onClose: () => void
  title?: string
  progress?: { current: number; total: number; done?: boolean }
}

/** Focus mode chrome for lessons and checks: a close button, segmented progress and a count. */
export function FocusHeader({
  closeLabel,
  onClose,
  title,
  progress,
}: FocusHeaderProps) {
  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border-subtle bg-background">
      <div className="flex min-h-[60px] items-center gap-4 px-[clamp(12px,3vw,32px)]">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="grid size-11 shrink-0 place-items-center rounded-md text-secondary-text hover:bg-accent hover:text-foreground"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        {progress ? (
          <>
            <ol aria-hidden="true" className="flex flex-1 gap-1">
              {Array.from({ length: progress.total }, (_, i) => (
                <li
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full bg-muted transition-colors duration-(--duration-slow)",
                    (progress.done || i < progress.current) && "bg-primary",
                    !progress.done && i === progress.current && "bg-spark"
                  )}
                />
              ))}
            </ol>
            <p
              aria-live="polite"
              className="shrink-0 text-sm text-muted-foreground tabular-nums"
            >
              {progress.done
                ? "Done"
                : `${progress.current + 1} of ${progress.total}`}
            </p>
          </>
        ) : (
          <p className="truncate text-[14.5px] font-semibold text-secondary-text">
            {title}
          </p>
        )}
      </div>
    </header>
  )
}
