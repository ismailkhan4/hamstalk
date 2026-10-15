export function StepHeading({ title, lede }: { title: string; lede: string }) {
  return (
    <>
      <h1 className="font-display text-h1 font-bold text-balance">{title}</h1>
      <p className="mt-3 max-w-[56ch] text-body-lg text-secondary-text">
        {lede}
      </p>
    </>
  )
}
