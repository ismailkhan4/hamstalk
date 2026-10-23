/** Renders copy where words in another language are wrapped in *asterisks*: in italics, tagged. */
export function RichText({ text, lang }: { text: string; lang: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <i key={i} lang={lang}>
        {part}
      </i>
    ) : (
      part
    )
  )
}
