import { cn } from "@/lib/utils"

type SymbolProps = { className?: string; title?: string }

/** The Branch-K: a K drawn as a commit graph. The coral node is "you", the newest commit. */
function LogoSymbol({ className, title }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("size-8 shrink-0", className)}
    >
      <rect
        width="48"
        height="48"
        rx="13"
        fill="var(--primary)"
        className="dark:fill-[var(--spruce-600)]"
      />
      <g
        stroke="var(--paper-25)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M17 12v24" />
        <path d="M17 29c0-7 5-12.5 12.5-13.5" />
        <path d="M20 24.5 30.5 35.5" />
      </g>
      <circle cx="32.5" cy="15.5" r="5" fill="var(--coral-500)" />
    </svg>
  )
}

type LogoProps = { className?: string; symbolClassName?: string }

function Logo({ className, symbolClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoSymbol className={symbolClassName} />
      <span className="font-display text-[22px] leading-none font-bold tracking-[-0.03em] text-foreground">
        klarlingo
      </span>
    </span>
  )
}

export { Logo, LogoSymbol }
