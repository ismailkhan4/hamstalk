/**
 * Whether `zone` is a time zone this runtime knows. Browsers report IANA names, and the server must
 * understand the same name to work out the learner's "today".
 */
export function isKnownTimeZone(zone: unknown): zone is string {
  if (typeof zone !== "string" || zone.length === 0 || zone.length > 64)
    return false
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone })
    return true
  } catch {
    return false
  }
}
