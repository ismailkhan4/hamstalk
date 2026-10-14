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
      <p className="text-[13.5px] font-semibold text-primary-text">{kind}</p>
      <h1 className="mt-1 font-display text-h2 font-bold text-balance">
        {title}
      </h1>
      {sub && <p className="mt-2 text-body-lg text-secondary-text">{sub}</p>}
    </>
  )
}
