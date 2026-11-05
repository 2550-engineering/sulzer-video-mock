import { customers } from '../../data/assets'
import { issuers } from '../../data/quotations'
import { quotationPage } from '../../data/selfServicePages'
import { formatDate } from '../../lib/format'
import { formatMoney, netPrice, quotationTotals } from '../../lib/selfService'
import type { SalesQuotation } from '../../types'
import { PartnerLogo } from '../PartnerLogo'
import { SulzerLogo } from '../SulzerLogo'

const copy = quotationPage.document

const label = 'text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase'

/**
 * A sent quotation as a printed page: the issuer's letterhead (Sulzer, or the
 * partner's own logo with "Authorised Sulzer distributor"), the customer as
 * recipient, lines with discount and net amounts, totals, terms and a signature.
 */
export function QuotationDocument({ quotation }: { quotation: SalesQuotation }) {
  const issuer = issuers[quotation.issuer]
  const customer = customers.find((c) => c.id === quotation.customerId)
  const totals = quotationTotals(quotation)
  const partner = quotation.issuer === 'partner'

  const details: [string, string][] = [
    [copy.number, quotation.id],
    [copy.date, quotation.issuedOn ? formatDate(quotation.issuedOn) : ''],
    [copy.validUntil, quotation.validUntil ? formatDate(quotation.validUntil) : ''],
    [copy.customerNumber, customer?.customerNumber ?? ''],
    [copy.yourReference, quotation.yourReference],
    [copy.ourContact, quotation.contact.name],
  ]

  return (
    <article
      aria-label={`${copy.title} ${quotation.id}`}
      className="mx-auto w-full max-w-[52rem] bg-white px-14 py-12 text-[13px] leading-relaxed text-text shadow-raised ring-1 ring-navy-900/5"
    >
      <header className="flex items-start justify-between gap-8">
        <div>
          {partner ? <PartnerLogo className="h-10" /> : <SulzerLogo className="h-7" />}
          <address className="mt-4 text-xs leading-relaxed text-text-muted not-italic">
            {issuer.name}
            <br />
            {issuer.address.join(', ')}
          </address>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-[0.18em] text-navy-900 uppercase">
            {copy.title}
          </p>
          <p className="mt-1 text-base font-semibold text-navy-900 tabular-nums">{quotation.id}</p>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10">
        <div>
          <p className={label}>{copy.to}</p>
          <p className="mt-2 text-sm font-semibold text-navy-900">{customer?.name}</p>
          <p>{customer && copy.attn(customer.contact.name)}</p>
          <p>
            {customer?.city}, {issuer.address[issuer.address.length - 1]}
          </p>
        </div>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-1 self-start">
          {details.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="text-text-muted">{term}</dt>
              <dd className="font-medium text-navy-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 className="mt-10 text-base font-bold text-navy-900">{copy.subject(quotation.title)}</h2>
      <p className="mt-3">{customer && copy.greeting(customer.contact.name)}</p>
      <p className="mt-1">{copy.intro}</p>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-y-2 border-navy-900 text-left text-xs text-navy-900">
            <th scope="col" className="py-2 pr-3 font-semibold">
              {copy.columns.position}
            </th>
            <th scope="col" className="py-2 pr-3 font-semibold">
              {copy.columns.item}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              {copy.columns.quantity}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              {copy.columns.unitPrice}
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              {copy.columns.discount}
            </th>
            <th scope="col" className="py-2 text-right font-semibold whitespace-nowrap">
              {copy.columns.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {quotation.lines.map((line) => (
            <tr key={line.position} className="border-b border-border align-top">
              <td className="py-3 pr-3 text-text-muted tabular-nums">{line.position}</td>
              <td className="py-3 pr-3">
                <p className="font-semibold text-navy-900">{line.description}</p>
                {line.number && <p className="text-text-muted tabular-nums">{line.number}</p>}
                {line.detail && <p className="text-text-muted">{line.detail}</p>}
                <p className="text-text-muted">
                  {copy.delivery}: {line.delivery}
                </p>
              </td>
              <td className="py-3 pr-3 text-right whitespace-nowrap tabular-nums">
                {line.quantity} {copy.units[line.unit]}
              </td>
              <td className="py-3 pr-3 text-right whitespace-nowrap tabular-nums">
                {formatMoney(line.listPrice)}
              </td>
              <td className="py-3 pr-3 text-right tabular-nums">
                {quotation.discount > 0 ? `${quotation.discount}%` : '–'}
              </td>
              <td className="py-3 text-right font-semibold whitespace-nowrap text-navy-900 tabular-nums">
                {formatMoney(netPrice(line.listPrice, quotation.discount) * line.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 ml-auto w-72 space-y-1">
        {quotation.discount > 0 && (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">{copy.totalList}</dt>
              <dd className="tabular-nums">{formatMoney(totals.list)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">{copy.discount(quotation.discount)}</dt>
              <dd className="tabular-nums">−{formatMoney(totals.discount)}</dd>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4 border-t-2 border-navy-900 pt-2 text-sm font-bold text-navy-900">
          <dt>{copy.totalNet}</dt>
          <dd className="tabular-nums">{formatMoney(totals.net)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-right text-xs text-text-muted">{copy.vat}</p>

      <div className="mt-8 grid grid-cols-2 gap-10">
        <div>
          <p className={label}>{copy.terms}</p>
          <dl className="mt-2 space-y-1">
            <div>
              <dt className="inline text-text-muted">{copy.deliveryTerms}: </dt>
              <dd className="inline">{quotation.deliveryTerms}</dd>
            </div>
            <div>
              <dt className="inline text-text-muted">{copy.paymentTerms}: </dt>
              <dd className="inline">{quotation.paymentTerms}</dd>
            </div>
            {quotation.validUntil && (
              <div>
                <dt className="inline text-text-muted">{copy.validity}: </dt>
                <dd className="inline">{copy.validityText(formatDate(quotation.validUntil))}</dd>
              </div>
            )}
          </dl>
        </div>
        {quotation.notes.length > 0 && (
          <div>
            <p className={label}>{copy.notes}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {quotation.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-10">
        <p>{copy.closing}</p>
        <p className="mt-6 font-semibold text-navy-900">{quotation.contact.name}</p>
        <p className="text-text-muted">{quotation.contact.role}</p>
        <p className="text-text-muted">
          {quotation.contact.email} · {quotation.contact.phone}
        </p>
      </div>

      <footer className="mt-12 flex items-end justify-between gap-6 border-t border-border pt-4 text-[11px] leading-relaxed text-text-muted">
        <p>
          {issuer.name} · {issuer.address.join(', ')} · {issuer.phone} · {issuer.web}
          <br />
          {issuer.registration}
        </p>
        {partner && (
          <p className="flex shrink-0 items-center gap-2 font-semibold text-navy-900">
            {copy.partnerBadge}
            <SulzerLogo className="h-3.5" />
          </p>
        )}
      </footer>
    </article>
  )
}
