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
      {/* Hamsti peeking over a chat bubble that's typing: hamster + talk. */}
      <circle cx="16" cy="13" r="4.6" fill="var(--hamster-fur)" />
      <circle cx="16" cy="13" r="2.1" fill="var(--hamster-pink)" />
      <circle cx="32" cy="13" r="4.6" fill="var(--hamster-fur)" />
      <circle cx="32" cy="13" r="2.1" fill="var(--hamster-pink)" />
      <circle cx="24" cy="22" r="11" fill="var(--hamster-fur)" />
      <circle cx="20" cy="19.5" r="1.7" fill="var(--logo-ink)" />
      <circle cx="28" cy="19.5" r="1.7" fill="var(--logo-ink)" />
      <ellipse cx="24" cy="22.4" rx="1.3" ry="1" fill="var(--logo-ink)" />
      <path
        d="M14 24h20a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6H20l-6 4v-4.3a6 6 0 0 1-6-5.7v-4a6 6 0 0 1 6-6z"
        fill="var(--logo-paper)"
      />
      <ellipse
        cx="19.3"
        cy="24.4"
        rx="2.7"
        ry="1.9"
        fill="var(--hamster-fur)"
      />
      <ellipse
        cx="28.7"
        cy="24.4"
        rx="2.7"
        ry="1.9"
        fill="var(--hamster-fur)"
      />
      <circle cx="17.5" cy="32" r="2.1" fill="var(--logo-ink)" />
      <circle cx="24" cy="32" r="2.1" fill="var(--spark)" />
      <circle cx="30.5" cy="32" r="2.1" fill="var(--logo-ink)" />
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
