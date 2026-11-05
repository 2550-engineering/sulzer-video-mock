import { demoClock, demoUser, serviceRequestReference } from '../config/demo'
import type { ServiceRequest } from '../types'
import { assetPage } from './assetPages'

/*
 * Service requests ("/self-service/requests"). The seeds are Nordvatten's earlier
 * requests; SR-2026-0142 is added when "Request service" is sent (self-service
 * context). Visits, technicians and work orders match lib/serviceHistory.ts.
 * Invented: see docs/content-to-confirm.md.
 */

/** Every Nordvatten site is in Västerås, so one service center handles them all. */
export const serviceCenter = {
  name: assetPage.overview.serviceBy,
  address: 'Kopparlundsvägen 7, 721 30 Västerås',
  phone: '+46 21 400 18 00',
  email: 'service.vasteras@sulzer.example',
}

/** When a request sent in the demo is received: today, a few minutes after the alert is opened. */
export const newRequestReceivedAt = `${demoClock.today}T09:26`

/** What a newly sent request looks like before Sulzer plans it. */
export const newRequestDefaults = {
  id: serviceRequestReference,
  status: 'Received',
  serviceCenter: serviceCenter.name,
} as const satisfies Partial<ServiceRequest>

const nordvatten = demoUser.customerId

export const serviceRequestSeeds: ServiceRequest[] = [
  {
    id: 'SR-2026-0129',
    customerId: nordvatten,
    assetId: 'bw-01',
    service: 'Annual service',
    message: 'BW-01, serial no. AH-1745-02217: annual service is due on 12 Nov.',
    preferredDate: '2026-11-12',
    requestedBy: demoUser.name,
    fromAlert: false,
    status: 'Technician assigned',
    steps: {
      Received: '2026-10-14T10:22',
      Planned: '2026-10-15T08:40',
      'Technician assigned': '2026-10-22T13:05',
    },
    serviceCenter: serviceCenter.name,
    visitDate: '2026-11-12',
    technician: 'Anna Forsell',
  },
  {
    id: 'SR-2026-0108',
    customerId: nordvatten,
    assetId: 'tw-01',
    service: 'Annual service',
    message: 'TW-01, serial no. AH-2133-07820: annual service, together with TW-02 if possible.',
    preferredDate: '2026-06-03',
    requestedBy: demoUser.name,
    fromAlert: false,
    status: 'Done',
    steps: {
      Received: '2026-05-12T14:10',
      Planned: '2026-05-13T09:02',
      'Technician assigned': '2026-05-27T11:45',
      Done: '2026-06-03T15:30',
    },
    serviceCenter: serviceCenter.name,
    visitDate: '2026-06-03',
    technician: 'Mikael Sjöberg',
    workOrder: 'WO-260603-TW01',
  },
  {
    id: 'SR-2026-0097',
    customerId: nordvatten,
    assetId: 'p-102',
    service: 'Annual service',
    message: 'P-102, serial no. XF-2215-31876: annual service for the Södra lift pumps.',
    preferredDate: '2026-05-19',
    requestedBy: demoUser.name,
    fromAlert: false,
    status: 'Done',
    steps: {
      Received: '2026-04-28T08:55',
      Planned: '2026-04-29T10:20',
      'Technician assigned': '2026-05-12T16:05',
      Done: '2026-05-19T14:10',
    },
    serviceCenter: serviceCenter.name,
    visitDate: '2026-05-19',
    technician: 'Mikael Sjöberg',
    workOrder: 'WO-260519-P102',
  },
  {
    id: 'SR-2026-0071',
    customerId: nordvatten,
    assetId: 'rw-02',
    service: 'Annual service',
    message: 'RW-02, serial no. AH-1918-04512: annual service.',
    preferredDate: '2026-03-17',
    requestedBy: demoUser.name,
    fromAlert: false,
    status: 'Done',
    steps: {
      Received: '2026-02-24T13:40',
      Planned: '2026-02-25T09:15',
      'Technician assigned': '2026-03-10T10:30',
      Done: '2026-03-17T13:55',
    },
    serviceCenter: serviceCenter.name,
    visitDate: '2026-03-17',
    technician: 'Mikael Sjöberg',
    workOrder: 'WO-260317-RW02',
  },
]
