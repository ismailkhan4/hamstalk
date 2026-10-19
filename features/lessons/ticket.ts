/**
 * Every lesson is a ticket on the team's board: `a1-u1-l2` is HAMS-102, a unit's review is HAMS-199.
 * Unknown ids fall back to the id itself, so a ticket always has a label.
 */
export function ticketId(lessonId: string) {
  const match = /^a1-u(\d+)-(?:l(\d+)|(review))$/.exec(lessonId)
  if (!match) return lessonId.toUpperCase()
  const [, unit, lesson, review] = match
  return `HAMS-${unit}${review ? "99" : lesson!.padStart(2, "0")}`
}
