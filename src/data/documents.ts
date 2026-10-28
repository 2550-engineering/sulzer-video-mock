import { products } from '../config/demo'
import type { Document, DocumentType } from '../types'

/*
 * Documentation and service videos. One document can cover several products.
 * BIM and CAD files are in cad.ts. Titles, numbers and dates are invented:
 * see docs/content-to-confirm.md.
 */

/**
 * File behind every download button. There is no sample PDF yet, so downloads
 * only show their button states. Put a file in public/docs and set this to
 * '/docs/sample-datasheet.pdf' to download it from every button.
 */
const sampleFile: string | null = null

/** Order of the type groups on the Documentation tab. */
export const documentTypeOrder: DocumentType[] = [
  'Installation & operating instructions',
  'Quick guide',
  'Data sheet',
  'Performance curves',
  'Spare parts list',
  'Brochure',
  'Declaration of conformity',
  'Certificate',
  'Service video',
]

const allLanguages = ['English', 'German', 'French', 'Spanish', 'Finnish', 'Swedish']

export const documents: Document[] = [
  {
    id: 'doc-ahlstar-iom',
    title: 'Installation, operating and maintenance instructions',
    type: 'Installation & operating instructions',
    number: 'E10318',
    productIds: ['ahlstar'],
    languages: allLanguages,
    format: 'PDF',
    size: '4.8 MB',
    date: '2026-03-12',
    revision: 'F',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-quick-guide',
    title: 'Quick guide: installation and start-up',
    type: 'Quick guide',
    number: 'E10319',
    productIds: ['ahlstar'],
    languages: allLanguages,
    format: 'PDF',
    size: '0.9 MB',
    date: '2026-03-12',
    revision: 'C',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-datasheet',
    title: 'Product data sheet, 50 Hz',
    type: 'Data sheet',
    number: 'E10322',
    productIds: ['ahlstar'],
    languages: ['English', 'German', 'Swedish'],
    format: 'PDF',
    size: '1.2 MB',
    date: '2026-01-27',
    revision: 'D',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-datasheet-60hz',
    title: 'Product data sheet, 60 Hz',
    type: 'Data sheet',
    number: 'E10323',
    productIds: ['ahlstar'],
    languages: ['English', 'Spanish'],
    format: 'PDF',
    size: '1.1 MB',
    date: '2026-01-27',
    revision: 'B',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-curves',
    title: 'Performance curves, 50 Hz and 60 Hz',
    type: 'Performance curves',
    number: 'E10325',
    productIds: ['ahlstar'],
    languages: ['English'],
    format: 'PDF',
    size: '6.7 MB',
    date: '2025-12-09',
    revision: 'E',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-parts',
    title: 'Spare parts list and sectional drawing',
    type: 'Spare parts list',
    number: 'E10330',
    productIds: ['ahlstar'],
    languages: ['English', 'German', 'Finnish'],
    format: 'PDF',
    size: '2.1 MB',
    date: '2025-11-04',
    revision: 'C',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-conformity',
    title: 'EU declaration of conformity',
    type: 'Declaration of conformity',
    number: 'E10340',
    productIds: ['ahlstar'],
    languages: allLanguages,
    format: 'PDF',
    size: '0.3 MB',
    date: '2026-02-16',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-atex',
    title: 'ATEX certificate for pumps in potentially explosive atmospheres',
    type: 'Certificate',
    number: 'E10342',
    productIds: ['ahlstar'],
    languages: ['English', 'German'],
    format: 'PDF',
    size: '0.4 MB',
    date: '2025-10-21',
    href: sampleFile,
  },
  {
    id: 'doc-ahlstar-brochure',
    title: `${products.ahlstar} end-suction process pumps`,
    type: 'Brochure',
    number: 'E00318',
    productIds: ['ahlstar'],
    languages: allLanguages,
    format: 'PDF',
    size: '5.2 MB',
    date: '2026-04-08',
    href: sampleFile,
  },
  {
    id: 'doc-water-brochure',
    title: 'Pumping solutions for water and wastewater',
    type: 'Brochure',
    number: 'E00412',
    productIds: ['ahlstar', 'xfp'],
    languages: ['English', 'German', 'French', 'Spanish'],
    format: 'PDF',
    size: '6.3 MB',
    date: '2026-05-06',
    href: sampleFile,
  },
  {
    id: 'doc-xfp-iom',
    title: 'Installation, operating and maintenance instructions',
    type: 'Installation & operating instructions',
    number: 'E20541',
    productIds: ['xfp'],
    languages: allLanguages,
    format: 'PDF',
    size: '3.9 MB',
    date: '2025-09-18',
    revision: 'D',
    href: sampleFile,
  },
]

/** Service videos, shown in their own row at the top of the Documentation tab. */
export const serviceVideos: Document[] = [
  {
    id: 'video-ahlstar-seal-replacement',
    title: 'Replacing the mechanical seal',
    type: 'Service video',
    number: 'V10351',
    productIds: ['ahlstar'],
    languages: ['English'],
    format: 'MP4',
    size: '182 MB',
    date: '2026-02-24',
    href: null,
    video: {
      duration: '14:20',
      thumbnail: {
        src: '/images/videos/ahlstar-video-seal-replacement.jpg',
        alt: 'Technician fitting a mechanical seal on an end-suction pump in a workshop',
      },
    },
  },
  {
    id: 'video-ahlstar-back-pull-out',
    title: 'Removing the rotating unit with the back pull-out design',
    type: 'Service video',
    number: 'V10352',
    productIds: ['ahlstar'],
    languages: ['English'],
    format: 'MP4',
    size: '214 MB',
    date: '2026-02-24',
    href: null,
    video: {
      duration: '16:41',
      thumbnail: {
        src: '/images/videos/ahlstar-video-back-pull-out.jpg',
        alt: 'Bearing unit and impeller being pulled out of a pump casing',
      },
    },
  },
  {
    id: 'video-ahlstar-shaft-alignment',
    title: 'Aligning pump and motor shafts',
    type: 'Service video',
    number: 'V10353',
    productIds: ['ahlstar'],
    languages: ['English'],
    format: 'MP4',
    size: '131 MB',
    date: '2025-12-02',
    href: null,
    video: {
      duration: '10:54',
      thumbnail: {
        src: '/images/videos/ahlstar-video-shaft-alignment.jpg',
        alt: 'Laser alignment tool mounted on a pump-motor coupling',
      },
    },
  },
  {
    id: 'video-ahlstar-impeller-clearance',
    title: 'Checking and adjusting impeller clearance',
    type: 'Service video',
    number: 'V10354',
    productIds: ['ahlstar'],
    languages: ['English'],
    format: 'MP4',
    size: '97 MB',
    date: '2025-12-02',
    href: null,
    video: {
      duration: '8:05',
      thumbnail: {
        src: '/images/videos/ahlstar-video-impeller-clearance.jpg',
        alt: 'Close-up of a feeler gauge measuring impeller clearance',
      },
    },
  },
]
