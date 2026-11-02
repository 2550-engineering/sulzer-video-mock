/** "555 706": thousands grouped with spaces, like the key specs. */
export const groupThousands = (value: number, decimals = 0) =>
  value
    .toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replaceAll(',', ' ')

const DAY = 24 * 60 * 60 * 1000

/** "12 Nov 2026" from an ISO date, the same on every machine. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** "03:12" from a wall-clock time stored as Date.UTC milliseconds. */
export const formatClock = (time: number) =>
  new Date(time).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })

/** Whole days from `fromIso` to `iso`; negative when `iso` is earlier. */
export const daysBetween = (fromIso: string, iso: string) =>
  Math.round((Date.parse(iso) - Date.parse(fromIso)) / DAY)
