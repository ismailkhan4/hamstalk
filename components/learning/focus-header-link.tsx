import { X } from "lucide-react"
import Link from "next/link"

/** Focus-mode header for server-rendered screens: a close link instead of a close button. */
export function FocusHeaderLink({
  href,
  closeLabel,
  title,
}: {
  href: string
  closeLabel: string
  title: string
}) {
  return (
    <header className="sticky top-0 z-(--z-header) border-b border-border-subtle bg-background">
      <div className="flex min-h-[60px] items-center gap-4 px-[clamp(12px,3vw,32px)]">
        <Link
          href={href}
          aria-label={closeLabel}
          className="grid size-11 shrink-0 place-items-center rounded-md text-secondary-text hover:bg-accent hover:text-foreground"
        >
          <X aria-hidden="true" className="size-5" />
        </Link>
        <p className="truncate text-[0.9062rem] font-semibold text-secondary-text">
          {title}
        </p>
      </div>
    </header>
  )
}
