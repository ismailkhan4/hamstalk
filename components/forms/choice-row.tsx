import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type ChoiceRowProps = {
  type: "radio" | "checkbox"
  name: string
  value: string
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  description?: string
  leading?: React.ReactNode
  disabled?: boolean
  className?: string
}

/**
 * A whole-row choice built on a native input, so arrow keys, Space and screen readers behave as
 * expected. Selected is never colour alone: the border thickens, the fill tints and a check appears.
 */
export function ChoiceRow({
  type,
  name,
  value,
  checked,
  onChange,
  title,
  description,
  leading,
  disabled = false,
  className,
}: ChoiceRowProps) {
  return (
    <label
      className={cn(
        "group relative flex min-h-[72px] cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] border-border bg-card px-3.5 py-3 transition-[border-color,background-color,box-shadow] duration-(--duration-fast) hover:border-input",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        checked &&
          "border-primary bg-primary-subtle shadow-[inset_0_0_0_1px_var(--primary)] hover:border-primary",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] leading-snug font-semibold">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[22px] shrink-0 place-items-center border-[1.5px] border-input bg-card text-transparent transition-colors duration-(--duration-fast)",
          type === "radio" ? "rounded-full" : "rounded-[6px]",
          checked && "border-primary bg-primary text-primary-foreground"
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </label>
  )
}
