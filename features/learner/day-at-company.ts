export function dayAtCompany(startedAt: string | null, now = new Date()) {
  if (!startedAt) return 1
  const start = new Date(startedAt)
  const days = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth(),
        start.getUTCDate()
      )) /
      86_400_000
  )
  return Math.max(1, days + 1)
}
