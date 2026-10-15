import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  tone?: "neutral" | "error" | "offline"
  headingLevel?: 2 | 3
  className?: string
}

/** Empty and error states: say what fills the space (or what is safe), then offer one way forward. */
function EmptyState({
  icon: Icon,
  title,
  children,
  actions,
  tone = "neutral",
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center px-4 py-10 text-center",
        className
      )}
    >
      <span
        className={cn(
          "grid size-14 place-items-center rounded-full",
          tone === "neutral" && "bg-primary-subtle text-primary-text",
          tone === "error" && "bg-danger-subtle text-danger-text",
          tone === "offline" && "bg-warning-subtle text-warning-text"
        )}
      >
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <Heading className="mt-4 font-display text-h3 font-bold">{title}</Heading>
      <div className="mt-2 text-body text-secondary-text">{children}</div>
      {actions && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
