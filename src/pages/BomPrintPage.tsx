import { ArrowLeft, Printer } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { SulzerLogo } from '../components/SulzerLogo'
import { sparePartsTab } from '../data/sparePartsPage'
import { kitsOf, sortBom } from '../lib/bom'
import {
  getDrawing,
  getProduct,
  ownerProductNumber,
  partOwner,
  partsInVersion,
  sparePartsFor,
  sparePartsPath,
} from '../lib/catalog'
import { formatPartPrice } from '../lib/modelSpecs'
import { NotFoundPage } from './NotFoundPage'

const copy = sparePartsTab.bom

/**
 * Print view of a bill of material (/products/:id/<variant or model id>/bom
 * ?version=…): no site header or footer, A4 width, prices only when signed
 * in. The toolbar is hidden when printing.
 */
export function BomPrintPage() {
  const { id = '', variantId: ownerId = '' } = useParams()
  const [params] = useSearchParams()
  const { user } = useAuth()
  const owner = partOwner(ownerId)
  const product = owner && getProduct(owner.productId)
  const catalogue = owner && sparePartsFor(owner.id)
  if (!owner || !product || product.id !== id || !catalogue) return <NotFoundPage />

  const version =
    catalogue.versions.find((v) => v.id === params.get('version')) ?? catalogue.versions[0]
  const parts = sortBom(partsInVersion(catalogue, version.id), {
    key: 'position',
    direction: 'asc',
  })
  const drawing = getDrawing(catalogue.drawingId)
  const back = sparePartsPath(owner, {
    view: 'bom',
    ...(version === catalogue.versions[0] ? {} : { version: version.id }),
  })
  const c = copy.columns
  const th = 'border-b-2 border-navy-900 px-2 py-2 text-left font-semibold'
  const td = 'border-b border-border px-2 py-1.5 align-top'

  return (
    <div className="min-h-screen bg-surface-muted py-8 print:bg-white print:py-0">
      <title>{`${owner.name} – ${copy.printTitle} | Sulzer`}</title>

      <div className="mx-auto mb-6 flex max-w-[210mm] items-center justify-between gap-4 px-4 print:hidden">
        <Link
          to={back}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {copy.printBack}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          <Printer className="size-4" />
          {copy.printButton}
        </button>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white px-[12mm] py-[12mm] shadow-card print:shadow-none">
        <header className="flex items-end justify-between border-b-2 border-navy-900 pb-4">
          <SulzerLogo className="h-7" />
          <p className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
            {copy.printTitle}
          </p>
        </header>

        <div className="mt-6">
          <h1 className="text-xl leading-tight font-bold tracking-tight text-brand">
            {owner.name}
          </h1>
          <dl className="mt-2 grid grid-cols-[9rem_minmax(0,1fr)] gap-y-0.5 text-sm">
            <dt className="text-text-muted">{copy.printProductNumber}</dt>
            <dd className="font-semibold tabular-nums">{ownerProductNumber(owner)}</dd>
            <dt className="text-text-muted">{copy.printVersion}</dt>
            <dd>{version.label}</dd>
            {drawing && (
              <>
                <dt className="text-text-muted">{copy.printDrawing}</dt>
                <dd className="tabular-nums">{drawing.number}</dd>
              </>
            )}
          </dl>
        </div>

        <table className="mt-6 w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className={th}>{c.position}</th>
              <th className={th}>{c.name}</th>
              <th className={th}>{c.partNumber}</th>
              <th className={`${th} text-right`}>{c.quantity}</th>
              <th className={th}>{c.material}</th>
              <th className={th}>{c.kits}</th>
              {user && <th className={`${th} text-right`}>{c.price}</th>}
              {user && <th className={th}>{c.leadTime}</th>}
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="break-inside-avoid">
                <td className={`${td} font-semibold tabular-nums`}>{part.position}</td>
                <td className={td}>{part.name}</td>
                <td className={`${td} whitespace-nowrap tabular-nums`}>{part.partNumber}</td>
                <td className={`${td} text-right tabular-nums`}>{part.quantity}</td>
                <td className={td}>{part.material}</td>
                <td className={`${td} whitespace-nowrap`}>
                  {kitsOf(part, catalogue.kits).join(', ')}
                </td>
                {user && (
                  <td className={`${td} text-right whitespace-nowrap tabular-nums`}>
                    {formatPartPrice(part.listPrice)}
                  </td>
                )}
                {user && (
                  <td className={`${td} whitespace-nowrap`}>{part.availability.leadTime}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="mt-6 border-t border-border pt-3 text-[10px] text-text-subtle">
          {copy.printFooter}
        </footer>
      </article>
    </div>
  )
}
