/*
 * Delivery dates from working days. Dates are ISO strings handled in UTC, so
 * they come out the same in every time zone.
 */

export function addWorkingDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`)
  let left = Math.max(0, Math.round(days))
  while (left > 0) {
    date.setUTCDate(date.getUTCDate() + 1)
    const day = date.getUTCDay()
    if (day !== 0 && day !== 6) left--
  }
  return date.toISOString().slice(0, 10)
}

const longFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "Thu 5 Nov 2026". */
export const formatDate = (iso: string) => longFormat.format(new Date(`${iso}T00:00:00Z`))
