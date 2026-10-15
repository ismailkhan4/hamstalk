import { cn } from "@/lib/utils"

type Article = "der" | "die" | "das"

const articleStyles: Record<
  Article,
  { className: string; gender: string; label: string }
> = {
  der: { className: "text-article-der", gender: "m", label: "masculine" },
  die: { className: "text-article-die", gender: "f", label: "feminine" },
  das: { className: "text-article-das", gender: "n", label: "neuter" },
}

type ArticleWordProps = {
  article: Article
  word: string
  plural?: boolean
  showGender?: boolean
  className?: string
}

function ArticleWord({
  article,
  word,
  plural = false,
  showGender = false,
  className,
}: ArticleWordProps) {
  const style = articleStyles[article]
  return (
    <span className={cn("font-voice", className)}>
      <span lang="de">
        <b className={cn("font-semibold", style.className)}>{article}</b> {word}
      </span>
      {showGender && (
        <sub className="ml-0.5 font-sans text-[0.6em] font-semibold text-muted-foreground">
          <span aria-hidden="true">{plural ? "pl" : style.gender}</span>
          <span className="sr-only">
            {plural ? ", plural" : `, ${style.label}`}
          </span>
        </sub>
      )}
    </span>
  )
}

export { ArticleWord }
export type { Article }
