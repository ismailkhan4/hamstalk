import { cn } from "@/lib/utils"

type GermanTextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "span" | "p" | "div"
}

function GermanText({
  as: Tag = "span",
  className,
  ...props
}: GermanTextProps) {
  return <Tag lang="de" className={cn("font-voice", className)} {...props} />
}

export { GermanText }
