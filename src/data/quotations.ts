import { demoUser, personas, products } from '../config/demo'
import { getVariant } from '../lib/variants'
import type { Quotation, QuotationIssuer, QuotationLine, SparePart } from '../types'
import { projects } from './projects'
import { spareParts } from './spareParts'

/*
 * Quotations ("/self-service/quotations"). End users see Sulzer's quotations to their
 * company; the channel partner sees their own quotations to their customers, on their
 * own letterhead. Numbers, people, prices and terms are invented: see
 * docs/content-to-confirm.md.
 */

/** Letterhead and footer details per issuer. */
export const issuers: Record<
  QuotationIssuer,
  { name: string; address: string[]; phone: string; web: string; registration: string }
> = {
  sulzer: {
    name: 'Sulzer Pumps Sweden AB',
    address: ['Kopparlundsvägen 7', '721 30 Västerås', 'Sweden'],
    phone: '+46 21 400 18 00',
    web: 'www.sulzer.com',
    registration: 'Reg. no. 556000-1234 · VAT SE556000123401',
  },
  partner: {
    name: personas.channelPartner.company,
    address: ['Industrigatan 9', '632 29 Eskilstuna', 'Sweden'],
    phone: '+46 16 12 40 50',
    web: 'www.aquapumpteknik.example',
    registration: 'Reg. no. 556000-5678 · VAT SE556000567801',
  },
}

const sulzerContact = {
  name: 'Mikael Ahonen',
  role: 'Application engineer, Sulzer',
  email: 'mikael.ahonen@sulzer.example',
  phone: '+46 21 400 18 26',
}

const partnerContact = {
  name: personas.channelPartner.name,
  role: personas.channelPartner.role,
  email: personas.channelPartner.email,
  phone: '+46 16 12 40 57',
}

const part = (id: string) => spareParts.find((p) => p.id === id) as SparePart

function partLine(position: number, partId: string, quantity: number, delivery: string) {
  const { partNumber, name, listPrice } = part(partId)
  return {
    position,
    number: partNumber,
    description: name,
    quantity,
    unit: 'pcs',
    listPrice,
    kind: 'sulzer',
    delivery,
  } satisfies QuotationLine
}

/** Project items as quotation lines, priced like the project's own table (pump + motor). */
function projectLines(projectId: string, delivery: string): QuotationLine[] {
  const project = projects.find((p) => p.id === projectId)
  return (project?.items ?? []).flatMap((item) => {
    const variant = getVariant(item.variantId)
    if (!variant) return []
    const { flow, head } = item.dutyPoint
    return {
      position: item.position,
      number: variant.productNumber ?? undefined,
      description: variant.name,
      detail: `Duty point ${flow} m³/h at ${head} m · ${variant.motorPower} kW ${variant.motorClass} motor · your pos. ${item.customerPosition}`,
      quantity: item.quantity,
      unit: 'pcs',
      listPrice: variant.pumpPrice + variant.motorPrice,
      kind: 'sulzer',
      delivery,
    }
  })
}

const sulzerTerms = {
  deliveryTerms: 'FCA Sulzer distribution center, Norrköping (Incoterms 2020)',
  paymentTerms: '30 days net from invoice date',
}

const partnerTerms = {
  deliveryTerms: 'Delivered to site, freight included',
  paymentTerms: '30 days net from invoice date',
}

const nordvatten = demoUser.customerId

export const quotations: Quotation[] = [
  // ── Sulzer to Nordvatten (the end user) ─────────────────────────────────────
  {
    id: 'Q-10234',
    issuer: 'sulzer',
    customerId: nordvatten,
    title: 'North pump station upgrade',
    status: 'Sent',
    requestedAt: '2026-10-02T13:20',
    issuedOn: '2026-10-21',
    validUntil: '2026-11-30',
    updated: { at: '2026-10-28T09:14', text: 'updated with a new delivery date' },
    yourReference: 'Project P-2026-0291',
    projectId: 'north-ps-upgrade',
    contact: sulzerContact,
    discount: 12,
    lines: [
      ...projectLines('north-ps-upgrade', 'Week 49'),
      {
        position: 20,
        number: '86040120',
        description: `${products.connect} sensor kit`,
        detail:
          'Wireless vibration and temperature sensors with gateway, first year of data included',
        quantity: 2,
        unit: 'pcs',
        listPrice: 1450,
        kind: 'sulzer',
        delivery: 'Week 49',
      },
      {
        position: 30,
        description: 'Commissioning by Sulzer',
        detail: 'Start-up, laser alignment, baseline vibration measurement and handover',
        quantity: 1,
        unit: 'lot',
        listPrice: 2900,
        kind: 'service',
        delivery: 'Week 50',
      },
    ],
    ...sulzerTerms,
    notes: [
      'Delivery brought forward from week 51 to week 49 (updated 28 Oct 2026).',
      'Prices include your framework agreement discount of 12%.',
      'Pumps are tested to ISO 9906 grade 2B before dispatch.',
    ],
  },
  {
    id: 'Q-10241',
    issuer: 'sulzer',
    customerId: nordvatten,
    title: 'Service agreement 2027, all sites',
    status: 'Requested',
    requestedAt: '2026-10-26T15:05',
    expectedBy: '2026-11-02',
    updated: { at: '2026-10-26T15:05', text: 'requested, expected by 2 Nov' },
    yourReference: 'Maintenance budget 2027',
    contact: sulzerContact,
    discount: 0,
    lines: [],
    ...sulzerTerms,
    notes: [],
  },
  {
    id: 'Q-10198',
    issuer: 'sulzer',
    customerId: nordvatten,
    title: 'Spare parts, Hamnen pump station',
    status: 'Accepted',
    requestedAt: '2026-10-08T10:40',
    issuedOn: '2026-10-13',
    validUntil: '2026-11-12',
    updated: { at: '2026-10-21T10:05', text: 'accepted, ordered as SO-104382' },
    yourReference: 'WO 2026-311 Hamnen',
    orderId: 'SO-104382',
    contact: sulzerContact,
    discount: 12,
    lines: [partLine(10, 'sp-2002', 3, 'In stock'), partLine(20, 'sp-2001', 3, 'In stock')],
    ...sulzerTerms,
    notes: [
      'For P-210, P-211 and P-212.',
      'Prices include your framework agreement discount of 12%.',
    ],
  },
  {
    id: 'Q-10163',
    issuer: 'sulzer',
    customerId: nordvatten,
    title: 'Spare impeller, BW-01',
    status: 'Expired',
    requestedAt: '2026-08-18T09:10',
    issuedOn: '2026-08-20',
    validUntil: '2026-09-30',
    updated: { at: '2026-09-30', text: 'expired' },
    yourReference: 'BW-01 spares',
    contact: sulzerContact,
    discount: 12,
    lines: [partLine(10, 'sp-1001', 1, '3 weeks')],
    ...sulzerTerms,
    notes: ['Prices include your framework agreement discount of 12%.'],
  },

  // ── Aqua Pumpteknik (the channel partner) to their customers ────────────────
  {
    id: 'AQ-26-0418',
    issuer: 'partner',
    customerId: nordvatten,
    title: 'Bearing replacement, RW-02',
    status: 'Sent',
    requestedAt: '2026-10-28T08:05',
    issuedOn: '2026-10-28',
    validUntil: '2026-11-27',
    updated: { at: '2026-10-28T08:50', text: 'sent to Emma Lindqvist' },
    yourReference: 'RW-02 vibration alert',
    contact: partnerContact,
    discount: 8,
    lines: [
      partLine(10, 'sp-1003', 1, '1 week'),
      partLine(20, 'sp-1002', 1, '2 days'),
      {
        position: 30,
        description: 'Bearing replacement on site',
        detail: 'Two technicians, dismantling, new bearings and seal, laser alignment and test run',
        quantity: 12,
        unit: 'h',
        listPrice: 95,
        kind: 'service',
        delivery: 'Within 14 days',
      },
    ],
    ...partnerTerms,
    notes: [
      'Work planned within the 14 days recommended by Sulzer Connect.',
      'Genuine Sulzer parts. Old bearings are returned to Sulzer for analysis.',
    ],
  },
  {
    id: 'AQ-26-0409',
    issuer: 'partner',
    customerId: 'malarbruk',
    title: 'Mechanical seals for stock',
    status: 'Accepted',
    requestedAt: '2026-10-15T11:30',
    issuedOn: '2026-10-16',
    validUntil: '2026-11-15',
    updated: { at: '2026-10-22T09:12', text: 'accepted, ordered as SO-104393' },
    yourReference: 'PO 4500-2231',
    orderId: 'SO-104393',
    contact: partnerContact,
    discount: 6,
    lines: [partLine(10, 'sp-1002', 4, '2 days')],
    ...partnerTerms,
    notes: ['Delivered to the mill stores, gate 3.'],
  },
  {
    id: 'AQ-26-0402',
    issuer: 'partner',
    customerId: 'sorby-livsmedel',
    title: 'Impeller and wear parts, CIP pump',
    status: 'Sent',
    requestedAt: '2026-10-12T14:00',
    issuedOn: '2026-10-14',
    validUntil: '2026-11-13',
    updated: { at: '2026-10-14T16:20', text: 'sent to Sara Nyberg' },
    yourReference: 'Line 2 overhaul',
    contact: partnerContact,
    discount: 5,
    lines: [partLine(10, 'sp-1001', 1, '3 weeks'), partLine(20, 'sp-1002', 1, '2 days')],
    ...partnerTerms,
    notes: [],
  },
  {
    id: 'AQ-26-0385',
    issuer: 'partner',
    customerId: 'vastmalm-energi',
    title: 'Bearing kits, district heating pumps',
    status: 'Expired',
    requestedAt: '2026-08-25T10:15',
    issuedOn: '2026-08-26',
    validUntil: '2026-09-25',
    updated: { at: '2026-09-25', text: 'expired' },
    yourReference: 'Summer stop 2027',
    contact: partnerContact,
    discount: 5,
    lines: [partLine(10, 'sp-1003', 2, '1 week')],
    ...partnerTerms,
    notes: [],
  },
]
