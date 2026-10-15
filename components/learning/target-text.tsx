import { TARGET_LANG } from "@/content/courses"
import { cn } from "@/lib/utils"

type TargetTextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "span" | "p" | "div"
}

/** Text in the language the learner is learning, marked for screen readers and set in its face. */
function TargetText({
  as: Tag = "span",
  className,
  ...props
}: TargetTextProps) {
  return (
    <Tag
      lang={TARGET_LANG}
      className={cn("font-voice", className)}
      {...props}
    />
  )
}

export { TargetText }
