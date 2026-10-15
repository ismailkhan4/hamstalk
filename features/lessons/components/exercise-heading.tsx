export function ExerciseHeading({
  kind,
  title,
  sub,
}: {
  kind: string
  title: string
  sub?: string
}) {
  return (
    <>
      <p className="text-[0.8125rem] font-extrabold tracking-wide text-primary-text uppercase">
        {kind}
      </p>
      {/* Prompts are full sentences: the rounded sans reads better than the display face. */}
      <h1 className="mt-1 text-h2 font-extrabold text-balance">{title}</h1>
      {sub && <p className="mt-2 text-body-lg text-secondary-text">{sub}</p>}
    </>
  )
}
