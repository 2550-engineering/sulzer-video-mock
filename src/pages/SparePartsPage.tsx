import { ArrowRight, Search } from 'lucide-react'
import { useId, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { PartResultRow } from '../components/search/PartResultRow'
import { SmartImage } from '../components/SmartImage'
import { serviceProviderDemo } from '../config/demo'
import { sparePartsLanding as copy } from '../data/sparePartsPage'
import {
  findSparePartOwners,
  getProduct,
  ownerProductNumber,
  partHits,
  partOwner,
  partPath,
  sparePartsFor,
  sparePartsPath,
} from '../lib/catalog'

/** Results shown at once; more typing narrows them. */
const shown = 12

/**
 * /spare-parts: "Find spare parts for your pump". Searches pumps by product
 * number or model code (each leads to its Spare parts tab) and parts by
 * number or name (each opens with the part selected), results as you type
 * (?q=). Enter on an exact number goes straight there. Below: shortcuts to
 * the pumps that have parts lists.
 */
export function SparePartsPage() {
  const id = useId()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ')
  const matches = q
    ? partHits.filter(
        ({ part }) =>
          part.partNumber.includes(q.replace(/\s/g, '')) ||
          part.name.toLowerCase().includes(q) ||
          part.position === q,
      )
    : []
  const pumps = findSparePartOwners(query)
  const owners = [serviceProviderDemo.variantId, serviceProviderDemo.ahlstarModelId]
    .map(partOwner)
    .filter((owner) => owner !== undefined)

  /** Enter: an exact product number opens its Spare parts tab, an exact part number the part. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const number = q.replace(/\s/g, '')
    const pump =
      pumps.find((owner) => ownerProductNumber(owner) === number) ??
      (pumps.length === 1 ? pumps[0] : undefined)
    if (pump) return navigate(sparePartsPath(pump))
    const part =
      matches.find((hit) => hit.part.partNumber === number) ??
      (matches.length === 1 ? matches[0] : undefined)
    if (part) navigate(partPath(part))
  }

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>
      <PageHeaderBand
        breadcrumb={[...copy.breadcrumb, { label: copy.crumb }]}
        title={copy.title}
        description={copy.description}
      >
        <form role="search" onSubmit={handleSubmit} className="mt-7 max-w-2xl">
          <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-900">
            {copy.search}
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-text-subtle"
            />
            <input
              id={id}
              type="search"
              value={query}
              onChange={(event) =>
                setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })
              }
              placeholder={copy.placeholder}
              autoComplete="off"
              className="h-14 w-full rounded-lg border border-border-strong bg-white pr-4 pl-12 text-lg text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
            />
          </div>
          <p className="mt-2 text-sm text-text-muted">{copy.hint}</p>
        </form>
      </PageHeaderBand>

      <section className="min-h-[480px] bg-surface-muted">
        <div className="site-container space-y-12 py-12">
          {q && (
            <div aria-live="polite" className="space-y-8">
              {pumps.length === 0 && matches.length === 0 && (
                <p className="font-semibold text-navy-900">{copy.none(query.trim())}</p>
              )}
              {pumps.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold tracking-tight text-navy-900">
                    {copy.pumps}{' '}
                    <span className="font-semibold text-text-subtle">({pumps.length})</span>
                  </h2>
                  <ul className="mt-3 grid gap-3 md:grid-cols-2">
                    {pumps.slice(0, shown).map((owner) => (
                      <li key={owner.id} className="animate-fade-in">
                        <Link
                          to={sparePartsPath(owner)}
                          className="group flex items-center gap-4 rounded-md border border-border bg-white px-5 py-4 transition-colors hover:border-primary"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-navy-900">{owner.name}</span>
                            <span className="block text-sm text-text-muted tabular-nums">
                              {copy.pumpNumber(ownerProductNumber(owner))} ·{' '}
                              {sparePartsFor(owner.id) ? copy.partsOnline : copy.partsNotOnline}
                            </span>
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {matches.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold tracking-tight text-navy-900">
                    {copy.parts}{' '}
                    <span className="font-semibold text-text-subtle">
                      ({copy.results(matches.length)})
                    </span>
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {matches.slice(0, shown).map((hit) => (
                      <li key={hit.part.id} className="animate-fade-in">
                        <PartResultRow hit={hit} query={query} />
                      </li>
                    ))}
                  </ul>
                  {matches.length > shown && (
                    <p className="mt-3 text-sm text-text-muted">{copy.more(shown)}</p>
                  )}
                </section>
              )}
            </div>
          )}

          <section>
            <h2 className="text-xl font-bold tracking-tight text-navy-900">
              {copy.products.title}
            </h2>
            <p className="mt-1 text-text-muted">{copy.products.text}</p>
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {owners.map((owner) => {
                const image = getProduct(owner.productId)?.images[0]
                return (
                  <li key={owner.id}>
                    <Link
                      to={sparePartsPath(owner)}
                      className="group flex items-center gap-5 rounded-lg border border-border bg-white px-6 py-5 transition-colors hover:border-primary"
                    >
                      {image && (
                        <span className="relative size-24 shrink-0">
                          <SmartImage src={image.src} alt="" fit="contain" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-bold text-navy-900">{owner.name}</span>
                        <span className="block text-sm text-text-muted tabular-nums">
                          {ownerProductNumber(owner)}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          {copy.products.open}
                          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1" />
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </section>
    </>
  )
}
