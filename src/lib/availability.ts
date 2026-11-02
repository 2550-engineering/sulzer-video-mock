import type { Availability } from '../types'

/* Availability values for data files, so every lead time reads the same way. */

export const shipsIn = (days: number): Availability => ({
  status: 'in-stock',
  leadTime: `In stock – ships in ${days} days`,
  leadTimeDays: days,
})

/** Up to 3 weeks is a normal lead time; longer means built or made to order. */
export const weeks = (from: number, to: number): Availability => ({
  status: to <= 3 ? 'lead-time' : 'made-to-order',
  leadTime: `${from}–${to} weeks`,
  leadTimeDays: to * 5,
})

export const discontinued: Availability = {
  status: 'discontinued',
  leadTime: 'No longer available',
  leadTimeDays: 0,
}
