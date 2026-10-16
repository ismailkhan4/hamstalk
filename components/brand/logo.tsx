import { cn } from "@/lib/utils"

type SymbolProps = { className?: string; title?: string }

function LogoSymbol({ className, title }: SymbolProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="48" height="48" rx="13" fill="var(--primary)" />
      <g
        stroke="var(--primary-foreground)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M17 12v24" />
        <path d="M17 27.5c0-5 3.6-8.5 7.5-8.5s7.5 3.5 7.5 8.5v8.5" />
      </g>
      <circle cx="33" cy="12.5" r="5" fill="var(--spark)" />
    </svg>
  )
}

type LogoProps = { className?: string; symbolClassName?: string }

function Wordmark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-baseline font-display text-[1.4375rem] leading-none font-[650] tracking-[-0.015em] text-foreground",
        className
      )}
    >
      hamstalk
      {/* The spark from the symbol, as a full stop. */}
      <b className="ml-[0.06em] inline-block size-[0.2em] rounded-full bg-spark" />
    </span>
  )
}

function Logo({ className, symbolClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoSymbol className={symbolClassName} />
      <Wordmark />
      <span className="sr-only">Hamstalk</span>
    </span>
  )
}

export { Logo, LogoSymbol, Wordmark }
