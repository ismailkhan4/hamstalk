import { cn } from "@/lib/utils"

/** The fictional cast of Kaffeesatz GmbH and its neighbourhood, plus "me" for the learner. */
type Person = "lf" | "jk" | "ao" | "aw" | "mb" | "bk" | "cm" | "me"

const personStyles: Record<Person, string> = {
  lf: "bg-(--person-lf) text-(--person-lf-foreground)",
  jk: "bg-(--person-jk) text-(--person-jk-foreground)",
  ao: "bg-(--person-ao) text-(--person-ao-foreground)",
  aw: "bg-(--person-aw) text-(--person-aw-foreground)",
  mb: "bg-(--person-mb) text-(--person-mb-foreground)",
  bk: "bg-(--person-bk) text-(--person-bk-foreground)",
  cm: "bg-(--person-cm) text-(--person-cm-foreground)",
  me: "bg-(--person-me) text-(--person-me-foreground)",
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-9 text-[12.5px]",
  lg: "size-11 text-sm",
  xl: "size-14 text-base",
}

type AvatarProps = {
  person: Person
  initials: string
  /** Accessible name; omit when the name is already written next to the avatar. */
  label?: string
  size?: keyof typeof sizes
  className?: string
}

function Avatar({
  person,
  initials,
  label,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full leading-none font-bold",
        personStyles[person],
        sizes[size],
        className
      )}
    >
      {initials}
    </span>
  )
}

export { Avatar }
export type { Person }
