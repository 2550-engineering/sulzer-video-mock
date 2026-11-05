import { describe, expect, it } from 'vitest'
import { personas } from '../config/demo'
import { customers } from '../data/assets'
import { partnerAccounts } from '../data/partner'
import { projectsSeed } from '../data/projects'
import { quotations } from '../data/quotations'
import { serviceRequestSeeds } from '../data/serviceRequests'
import { customerSummaries, quotationFromProject, sentQuotation } from './partner'
import { isSharedWithClient } from './projects'

const { endUser, channelPartner } = personas
const project = (id: string) => projectsSeed.channelPartner.find((p) => p.id === id)!

describe('partner customers', () => {
  it('has a partner account, logo and delivery address for every customer', () => {
    for (const customer of customers) {
      const account = partnerAccounts[customer.id]
      expect(account.customerId).toBe(customer.id)
      expect(account.contacts[0].name).toBe(customer.contact.name)
      expect(account.deliveryAddresses.length).toBeGreaterThan(0)
    }
  })

  it('lists Nordvatten first: the one customer that needs attention', () => {
    const summaries = customerSummaries(serviceRequestSeeds)
    expect(summaries[0].customer.id).toBe(endUser.customerId)
    expect(summaries.filter((s) => s.needsAttention > 0)).toHaveLength(1)
    expect(summaries[0]).toMatchObject({ total: 24, sites: 6, alarms: 1, warnings: 1 })
  })
})

describe('partner projects', () => {
  it('runs every partner project for a customer account', () => {
    expect(projectsSeed.channelPartner.every((p) => p.clientAccount)).toBe(true)
  })

  it('counts the project as shared once the client contact is a member', () => {
    const upgrade = project('riverside-intake-upgrade')
    expect(isSharedWithClient(upgrade)).toBe(false)
    const contact = { ...upgrade.members[0], id: 'emma', email: upgrade.client.email }
    expect(isSharedWithClient({ ...upgrade, members: [...upgrade.members, contact] })).toBe(true)
  })
})

describe('quotation from a project', () => {
  it('makes the next partner number as a draft to the client, at their discount', () => {
    const quotation = quotationFromProject(project('riverside-intake-upgrade'), quotations)!
    expect(quotation).toMatchObject({
      id: 'AQ-26-0419',
      issuer: 'partner',
      status: 'Draft',
      customerId: endUser.customerId,
      discount: partnerAccounts.nordvatten.quotationDiscount,
      contact: { name: channelPartner.name },
    })
    expect(quotation.lines).toHaveLength(1)
    expect(quotation.lines[0].quantity).toBe(2)
  })

  it('keeps the number when the draft is made again, and sends it to the contact', () => {
    const upgrade = project('riverside-intake-upgrade')
    const draft = quotationFromProject(upgrade, quotations)!
    expect(quotationFromProject(upgrade, [draft, ...quotations])!.id).toBe(draft.id)
    expect(sentQuotation(draft)).toMatchObject({
      status: 'Sent',
      updated: { text: `sent to ${endUser.name}` },
    })
  })

  it('needs a client account and products', () => {
    const blank = { ...project('riverside-intake-upgrade'), clientAccount: undefined }
    expect(quotationFromProject(blank, quotations)).toBeNull()
  })
})
