import { demoClock } from '../config/demo'
import { assets, customers } from '../data/assets'
import { partnerAccounts, projectQuotation } from '../data/partner'
import { partnerContact, partnerTerms, projectItemLines } from '../data/quotations'
import type { Customer, Project, SalesQuotation, ServiceRequest } from '../types'
import { summarizeAssets } from './assetSummary'
import { isOpenRequest } from './selfService'

/* The channel partner's customer accounts and the quotations they make from projects. */

/** One customer account in numbers: installed base, alerts and open requests. */
export function customerSummary(customer: Customer, requests: ServiceRequest[]) {
  const own = assets.filter((asset) => asset.customerId === customer.id)
  return {
    customer,
    account: partnerAccounts[customer.id],
    assets: own,
    ...summarizeAssets(own),
    openRequests: requests.filter(
      (request) => request.customerId === customer.id && isOpenRequest(request),
    ).length,
  }
}

export type CustomerSummary = ReturnType<typeof customerSummary>

/** Every account, those that need attention first (alarms before warnings), then in data order. */
export function customerSummaries(requests: ServiceRequest[]) {
  const rank = (s: CustomerSummary) => (s.alarms ? 0 : s.warnings ? 1 : 2)
  return customers
    .map((customer) => customerSummary(customer, requests))
    .sort((a, b) => rank(a) - rank(b))
}

/** The ISO date `days` calendar days after `iso`. */
function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** The next free partner quotation number, e.g. "AQ-26-0419". */
export function nextPartnerQuotationId(all: SalesQuotation[]) {
  const numbers = all
    .filter((q) => q.issuer === 'partner')
    .map((q) => Number(q.id.split('-').at(-1)))
    .filter(Boolean)
  return `AQ-26-${String(Math.max(0, ...numbers) + 1).padStart(4, '0')}`
}

/**
 * The partner's quotation for a project's products, to its client account, as a Draft.
 * Creating it again replaces the project's draft, so the number stays the same.
 */
export function quotationFromProject(
  project: Project,
  all: SalesQuotation[],
): SalesQuotation | null {
  const account = project.clientAccount ? partnerAccounts[project.clientAccount] : undefined
  const lines = projectItemLines(project.items)
  if (!account || lines.length === 0) return null
  const draft = all.find(
    (q) => q.issuer === 'partner' && q.projectId === project.id && q.status === 'Draft',
  )
  const at = `${demoClock.today}T${projectQuotation.createdAt}`
  return {
    id: draft?.id ?? nextPartnerQuotationId(all),
    issuer: 'partner',
    customerId: account.customerId,
    title: project.name,
    status: 'Draft',
    requestedAt: at,
    issuedOn: demoClock.today,
    validUntil: addDays(demoClock.today, projectQuotation.validDays),
    updated: { at, text: projectQuotation.created(project.name) },
    yourReference: `Project ${project.refNo}`,
    projectId: project.id,
    contact: partnerContact,
    discount: account.quotationDiscount,
    lines,
    ...partnerTerms,
    notes: projectQuotation.notes(account.quotationDiscount),
  }
}

/** A draft, sent to the customer's contact. */
export function sentQuotation(quotation: SalesQuotation): SalesQuotation {
  const contact = customers.find((c) => c.id === quotation.customerId)?.contact.name ?? ''
  return {
    ...quotation,
    status: 'Sent',
    updated: {
      at: `${demoClock.today}T${projectQuotation.sentAt}`,
      text: projectQuotation.sent(contact),
    },
  }
}
