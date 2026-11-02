import { Hash, Search, SearchX } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { useAddToCart } from '../cart/useAddToCart'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { ModelPicker } from '../components/spareparts/ModelPicker'
import { PartSearchResult } from '../components/spareparts/PartSearchResult'
import { ProductChoiceCard } from '../components/spareparts/ProductChoiceCard'
import { SparePartsExplorer } from '../components/spareparts/SparePartsExplorer'
import { UnitCard } from '../components/spareparts/UnitCard'
import { bom, sparePartsPage as copy, sparePartsPath } from '../data/eshop'
import { useUrlParams } from '../hooks/useUrlParams'
import { getModel, getProduct } from '../lib/catalog'
import { assetsFor } from '../lib/connect'
import { partPrice } from '../lib/pricing'
import { assetBySerial, modelsWithParts, productIdsWithParts, searchParts } from '../lib/spareParts'
import type { SparePart } from '../types'

const modes = ['product', 'part', 'serial'] as const
type Mode = (typeof modes)[number]

const input =
  'h-12 w-full rounded-pill border border-border-strong bg-white pr-4 pl-11 text-[17px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'
const submit =
  'inline-flex h-12 items-center rounded-pill bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover'

/** The product parts list with a part selected: "Show on drawing". */
const drawingLink = (part: SparePart) =>
  `${sparePartsPath}?${new URLSearchParams({
    product: part.productId,
    model: part.modelIds[0],
    ...(part.position !== undefined ? { pos: String(part.position) } : {}),
  })}`

/** Grey "nothing here yet" panel with an icon. */
function EmptyState({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode
  title: string
  text: string
  children?: ReactNode
}) {
  return (
    <div className="flex animate-fade-in flex-col items-center rounded-lg border border-border bg-surface-muted px-8 py-16 text-center">
      {icon}
      <p className="mt-4 text-lg font-semibold text-navy-900">{title}</p>
      <p className="mt-1 max-w-lg text-text-muted">{text}</p>
      {children}
    </div>
  )
}

/**
 * /spare-parts: find genuine parts by product (sectional drawing and parts list per
 * model), by part number or name, or by the serial number of an installed unit, which
 * opens that unit's parts list. State is in the URL (?by, ?product, ?model, ?pos, ?q,
 * ?serial), so "Show on drawing" and asset links can deep-link.
 */
export function SparePartsPage() {
  const { user } = useAuth()
  const addToCart = useAddToCart()
  const [params, update] = useUrlParams()
  const [serialDraft, setSerialDraft] = useState(params.get('serial') ?? '')

  const requested = params.get('by')
  const mode: Mode = modes.find((m) => m === requested) ?? 'product'

  const setMode = (next: Mode) =>
    update((p) => {
      for (const key of [...p.keys()]) p.delete(key)
      if (next !== 'product') p.set('by', next)
    })

  // By product
  const productId =
    productIdsWithParts.find((id) => id === params.get('product')) ?? productIdsWithParts[0]
  const models = modelsWithParts(productId)
  const model = models.find((m) => m.id === params.get('model')) ?? models[0]
  const position = Number(params.get('pos')) || undefined

  // By part number
  const query = params.get('q') ?? ''
  const found = searchParts(query)

  // By serial number
  const serial = params.get('serial') ?? ''
  const unit = serial ? assetBySerial(serial) : undefined
  const unitProduct = unit && getProduct(unit.productId)
  const unitModel = unit?.modelId ? getModel(unit.modelId) : undefined
  const myUnits = user ? assetsFor(user).filter((asset) => asset.modelId) : []

  function findSerial(event: FormEvent) {
    event.preventDefault()
    update((p) => (serialDraft.trim() ? p.set('serial', serialDraft.trim()) : p.delete('serial')))
  }

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>
      <PageHeaderBand
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        title={copy.title}
        description={copy.description}
      >
        <div className="mt-8 max-w-xl">
          <SegmentedToggle
            label={copy.modes.label}
            value={mode}
            options={modes.map((m) => ({ value: m, label: copy.modes[m] }))}
            onChange={setMode}
          />
        </div>
      </PageHeaderBand>

      <div key={mode} className="site-container animate-fade-in pt-12 pb-24">
        {mode === 'product' && model && (
          <>
            <h2 className="text-xl font-bold tracking-tight text-navy-900">
              {copy.product.choose}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:max-w-5xl">
              {productIdsWithParts.map((id) => {
                const product = getProduct(id)
                return (
                  product && (
                    <ProductChoiceCard
                      key={id}
                      product={product}
                      detail={copy.product.models(modelsWithParts(id).length)}
                      selected={id === productId}
                      onSelect={() =>
                        update((p) => {
                          p.set('product', id)
                          p.delete('model')
                          p.delete('pos')
                        })
                      }
                    />
                  )
                )
              })}
            </div>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-10">
              <div>
                <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
                  {model.name}
                </h2>
                <p className="mt-2 max-w-3xl text-lg text-text-muted">{bom.intro(model.name)}</p>
              </div>
              <ModelPicker
                models={models}
                value={model.id}
                label={copy.product.model}
                onChange={(id) =>
                  update((p) => {
                    p.set('product', productId)
                    p.set('model', id)
                    p.delete('pos')
                  })
                }
              />
            </div>
            <div className="mt-10">
              <SparePartsExplorer
                key={`${model.id}-${position ?? ''}`}
                model={model}
                initialPosition={position}
              />
            </div>
          </>
        )}

        {mode === 'part' && (
          <>
            <div className="relative max-w-2xl">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-navy-900">{copy.part.label}</span>
                <span className="relative">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-text-subtle"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) =>
                      update((p) => (e.target.value ? p.set('q', e.target.value) : p.delete('q')))
                    }
                    placeholder={copy.part.placeholder}
                    className={input}
                  />
                </span>
              </label>
            </div>

            <div className="mt-10">
              {!query.trim() ? (
                <EmptyState
                  icon={
                    <Search aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
                  }
                  title={copy.part.start.title}
                  text={copy.part.start.text}
                />
              ) : found.length === 0 ? (
                <EmptyState
                  icon={
                    <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
                  }
                  title={copy.part.none.title}
                  text={copy.part.none.text}
                >
                  <button
                    type="button"
                    onClick={() => setMode('product')}
                    className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    {copy.part.none.action}
                  </button>
                </EmptyState>
              ) : (
                <>
                  <p className="mb-4 text-sm font-semibold text-navy-900" aria-live="polite">
                    {copy.part.results(found.length)}
                  </p>
                  <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
                    {found.slice(0, 20).map((part) => (
                      <li key={part.id}>
                        <PartSearchResult
                          part={part}
                          price={partPrice(part, user)}
                          drawingTo={drawingLink(part)}
                          onAdd={(quantity) => addToCart(part, quantity)}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </>
        )}

        {mode === 'serial' && (
          <>
            <form onSubmit={findSerial} className="flex max-w-2xl flex-wrap items-end gap-3">
              <label className="flex min-w-72 flex-1 flex-col gap-2 text-sm">
                <span className="font-semibold text-navy-900">{copy.serial.label}</span>
                <span className="relative">
                  <Hash
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-text-subtle"
                  />
                  <input
                    type="search"
                    value={serialDraft}
                    onChange={(e) => setSerialDraft(e.target.value)}
                    placeholder={copy.serial.placeholder}
                    className={`${input} uppercase placeholder:normal-case`}
                  />
                </span>
              </label>
              <button type="submit" className={submit}>
                {copy.serial.find}
              </button>
            </form>
            <p className="mt-2 text-sm text-text-muted">{copy.serial.typePlate}</p>

            {myUnits.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-navy-900">{copy.serial.yourUnits}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {myUnits.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setSerialDraft(asset.serialNumber)
                        update((p) => p.set('serial', asset.serialNumber))
                      }}
                      aria-pressed={unit?.id === asset.id}
                      className={`inline-flex h-9 items-center gap-2 rounded-pill border px-4 text-sm font-medium transition-colors ${
                        unit?.id === asset.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-border-strong bg-white text-navy-900 hover:border-primary hover:text-primary'
                      }`}
                    >
                      <span className="font-semibold">{asset.tag}</span>
                      <span
                        className={`tabular-nums ${unit?.id === asset.id ? 'text-white/80' : 'text-text-muted'}`}
                      >
                        {asset.serialNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              {serial && !unit && (
                <EmptyState
                  icon={
                    <SearchX aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
                  }
                  title={copy.serial.notFound.title}
                  text={copy.serial.notFound.text}
                >
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    {copy.serial.notFound.action}
                  </Link>
                </EmptyState>
              )}
              {unit && unitProduct && (
                <div className="animate-fade-in">
                  <UnitCard
                    asset={unit}
                    product={unitProduct}
                    model={unitModel}
                    canOpen={myUnits.some((asset) => asset.id === unit.id)}
                  />
                  {unitModel && (
                    <p className="mt-8 max-w-3xl text-lg text-text-muted">
                      {bom.introForUnit(unitModel.name, unit.serialNumber)}
                    </p>
                  )}
                  <div className="mt-8">
                    {unitModel ? (
                      <SparePartsExplorer key={unit.id} model={unitModel} asset={unit} />
                    ) : (
                      <EmptyState
                        icon={
                          <SearchX
                            aria-hidden
                            className="size-10 text-text-subtle"
                            strokeWidth={1.5}
                          />
                        }
                        title={bom.noParts.title}
                        text={bom.noParts.text}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
