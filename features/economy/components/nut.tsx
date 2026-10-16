import { cn } from "@/lib/utils"

/** A hazelnut, the stash's currency. Decoration: the number beside it says what it's worth. */
export function Nut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      {/* The nut */}
      <path
        d="M12 21.5c-4.4 0-7.5-3.1-7.5-7.2 0-2.6 1.3-4.6 3.2-5.6h8.6c1.9 1 3.2 3 3.2 5.6 0 4.1-3.1 7.2-7.5 7.2Z"
        fill="var(--hamster-fur)"
      />
      <path
        d="M8.4 13.2c.3 2.6 1.6 4.6 3.6 5.4"
        fill="none"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* The husk on top, with its little stalk */}
      <path
        d="M4.6 9.4c.8-2.6 3.8-4.4 7.4-4.4s6.6 1.8 7.4 4.4c-1 .9-2.2.4-3.1 0-.9.8-2.2.8-3 0-.8.6-1.8.6-2.6 0-.8.8-2.1.8-3 0-.9.4-2.1.9-3.1 0Z"
        fill="var(--hamster-fur-dark)"
      />
      <path
        d="M12 5.2c0-1.2.5-2.2 1.5-2.7"
        fill="none"
        stroke="var(--hamster-fur-dark)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
