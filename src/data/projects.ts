import { demoUser } from '../config/demo'
import type { Project } from '../types'

/* The demo user's projects ("/my-projects"). Deterministic — no live values. */

export const projects: Project[] = [
  {
    id: 'riverside-intake',
    name: 'Riverside intake',
    applicationId: 'surface-water-intake',
    productIds: ['ahlstar'],
    status: 'In progress',
    owner: 'Johan Berg',
    updated: 'Today, 07:58',
    sharedWith: 3,
  },
  {
    id: 'north-ps-upgrade',
    name: 'North pump station upgrade',
    applicationId: 'wastewater',
    productIds: ['xfp'],
    status: 'Quoted',
    owner: demoUser.name,
    updated: '21 Oct',
    sharedWith: 1,
  },
  {
    id: 'harbour-booster',
    name: 'Harbour district booster station',
    applicationId: 'water-distribution',
    productIds: ['ahlstar'],
    status: 'Draft',
    owner: demoUser.name,
    updated: '14 Oct',
    sharedWith: 0,
  },
]
