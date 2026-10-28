import type { Asset } from '../types'

/* The demo company's installed base ("/assets"). Deterministic — no live values. */

export const assets: Asset[] = [
  {
    id: 'p-104',
    name: 'Lift station P-104',
    location: 'Södra pump station, Västerås',
    productId: 'xfp',
    status: 'ok',
    lastReading: { metric: 'Bearing vibration', value: '2.1 mm/s', time: 'Today, 08:42' },
  },
  {
    id: 'rw-02',
    name: 'Raw water pump RW-02',
    location: 'Riverside intake, Västerås',
    productId: 'ahlstar',
    status: 'warning',
    lastReading: { metric: 'Bearing vibration', value: '7.4 mm/s', time: 'Today, 08:40' },
  },
  {
    id: 'p-211',
    name: 'Lift station P-211',
    location: 'Hamnen pump station, Västerås',
    productId: 'xfp',
    status: 'alarm',
    lastReading: { metric: 'Motor temperature', value: '118 °C', time: 'Today, 08:37' },
  },
]
