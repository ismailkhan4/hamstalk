import { cn } from "@/lib/utils"

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="spinner"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none motion-reduce:border-r-current motion-reduce:opacity-60",
        className
      )}
    />
  )
}

export { Spinner }
