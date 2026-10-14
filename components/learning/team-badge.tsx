import { CircleCheck } from "lucide-react"

import { cn } from "@/lib/utils"

type BadgeRow = { label: string; value: string | null }

type TeamBadgeProps = {
  name: string
  rows: BadgeRow[]
  footer?: { text: string; ready?: boolean }
  className?: string
}

import { initialsOf as initialsFor } from "@/features/lessons/initials"
export { initialsFor }

/**
 * The onboarding's memory: it previews the learner's name on sign-up, fills in row by row
 * during onboarding and becomes the profile card later.
 */
export function TeamBadge({ name, rows, footer, className }: TeamBadgeProps) {
  const trimmed = name.trim()
  const initials = trimmed ? initialsFor(trimmed) : "?"

  return (
    <figure
      aria-label="Your team badge"
      className={cn(
        "relative w-full max-w-[310px] rounded-[18px] border border-border-subtle bg-card px-[22px] pt-8 pb-[18px] text-foreground shadow-lg",
        "before:absolute before:top-[13px] before:left-1/2 before:-ml-[23px] before:h-[7px] before:w-[46px] before:rounded-[9px] before:bg-background-subtle before:shadow-[inset_0_1px_2px_rgb(20_33_28/0.22)]",
        className
      )}
    >
      <p className="flex items-center justify-between text-[12.5px] leading-none font-semibold text-muted-foreground">
        Kaffeesatz GmbH · Berlin
        <i aria-hidden="true" className="size-2.5 rounded-full bg-spark" />
      </p>
      <div className="mt-[18px] flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-[58px] shrink-0 place-items-center rounded-full text-[19px] leading-none font-bold",
            trimmed
              ? "bg-(--person-me) text-(--person-me-foreground) shadow-[0_0_0_4px_var(--spark-subtle)]"
              : "bg-background-subtle font-semibold text-muted-foreground shadow-[inset_0_0_0_1.5px_var(--border)]"
          )}
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "font-display text-[21px] leading-[1.15] font-[650] tracking-[-0.02em] break-words",
              !trimmed && "text-placeholder"
            )}
          >
            {trimmed || "Your name"}
          </p>
          <p className="mt-[3px] font-voice text-[15px] leading-[1.3] text-primary-text italic">
            <span lang="de">Neu im Team</span>{" "}
            <span className="font-sans text-[12.5px] text-muted-foreground not-italic">
              · new on the team
            </span>
          </p>
        </div>
      </div>
      <dl className="mt-[18px] border-t border-dashed border-border text-[13.5px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-3 border-b border-border-subtle py-2.5 last:border-b-0"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd
              className={cn(
                "text-right font-semibold",
                !row.value && "font-normal text-placeholder"
              )}
            >
              {row.value ?? "Not set yet"}
            </dd>
          </div>
        ))}
      </dl>
      {footer && (
        <p
          className={cn(
            "mt-2.5 flex items-center gap-2 text-[12.5px] text-muted-foreground",
            footer.ready && "font-semibold text-success-text"
          )}
        >
          {footer.ready && (
            <CircleCheck aria-hidden="true" className="size-4" />
          )}
          {footer.text}
        </p>
      )}
    </figure>
  )
}
