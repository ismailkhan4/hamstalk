"use client"

import { cn } from "@/lib/utils"

import { useFieldControl } from "@/components/forms/field"

type InputProps = React.ComponentProps<"input"> & {
  leadingIcon?: React.ReactNode
  trailing?: React.ReactNode
}

function Input({ className, leadingIcon, trailing, id, ...props }: InputProps) {
  const control = useFieldControl(id)

  return (
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-[18px]">
          {leadingIcon}
        </span>
      )}
      <input
        data-slot="input"
        {...control}
        {...props}
        className={cn(
          "h-11 w-full rounded-md border-[1.5px] border-input bg-card px-3 text-base text-foreground transition-[border-color,box-shadow] duration-(--duration-fast) ease-out placeholder:text-placeholder read-only:bg-inset hover:border-muted-foreground focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-danger aria-invalid:focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--danger)_18%,transparent)] data-[valid]:border-success",
          leadingIcon && "pl-10",
          trailing && "pr-12",
          className
        )}
      />
      {trailing && (
        <span className="absolute top-1/2 right-1.5 -translate-y-1/2">
          {trailing}
        </span>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
