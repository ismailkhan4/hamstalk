import { cva } from "class-variance-authority"

/**
 * Solid buttons are chunky and 3D: a solid edge sits under them and they press down into it, so a
 * tap feels like pushing a real key. The edge is a box-shadow, so it never changes layout.
 */
const press =
  "active:translate-y-[4px] active:shadow-none disabled:translate-y-0 data-[loading]:translate-y-[2px]"

/** Shared by <Button> and by links styled as buttons in Server Components. */
export const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 font-extrabold tracking-[0.01em] whitespace-nowrap transition-[background-color,color,box-shadow,transform,filter] duration-(--duration-instant) ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-[0_4px_0_var(--border)] data-[loading]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: `bg-primary text-primary-foreground shadow-[0_4px_0_var(--primary-edge)] hover:bg-primary-hover active:bg-primary-active data-[loading]:bg-primary-active ${press}`,
        secondary: `bg-secondary text-secondary-foreground shadow-[0_4px_0_var(--secondary-edge)] hover:bg-secondary-hover ${press}`,
        outline: `bg-card text-foreground shadow-[inset_0_0_0_2px_var(--border),0_4px_0_var(--border-edge)] hover:bg-background-subtle active:translate-y-[4px] active:shadow-[inset_0_0_0_2px_var(--border)] disabled:translate-y-0`,
        ghost:
          "text-secondary-text hover:bg-accent hover:text-foreground active:translate-y-px",
        danger: `bg-danger text-danger-foreground shadow-[0_4px_0_var(--danger-edge)] hover:bg-danger-hover active:bg-danger-active ${press}`,
        success: `bg-success text-success-foreground shadow-[0_4px_0_var(--success-edge)] hover:bg-success-hover ${press}`,
        reward: `bg-reward text-reward-foreground shadow-[0_4px_0_var(--reward-edge)] hover:bg-reward-hover ${press}`,
        link: "h-auto px-0 text-primary-text underline decoration-2 underline-offset-[3px] hover:decoration-[3px]",
        inverse: `bg-deep-foreground text-deep shadow-[0_4px_0_rgb(0_0_0/0.25)] hover:bg-card ${press}`,
      },
      size: {
        xs: "h-7 rounded-sm px-2.5 text-[0.8125rem] [&_svg]:size-3.5",
        sm: "h-9 rounded-md px-3.5 text-sm [&_svg]:size-4",
        md: "h-11 rounded-lg px-4 text-[0.9375rem] [&_svg]:size-[18px]",
        lg: "h-12 rounded-lg px-6 text-base [&_svg]:size-5",
        xl: "h-14 rounded-xl px-8 text-[1.0625rem] [&_svg]:size-5",
      },
      iconOnly: { true: "aspect-square px-0" },
      fullWidth: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  }
)
