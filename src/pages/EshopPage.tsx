import { LogIn } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { useAddToCart } from '../cart/useAddToCart'
import { ApplicationPanelHero } from '../components/application/ApplicationPanelHero'
import { PartCard } from '../components/eshop/PartCard'
import { QuickOrderForm } from '../components/eshop/QuickOrderForm'
import { ShortcutCard } from '../components/eshop/ShortcutCard'
import { SectionHeading } from '../components/SectionHeading'
import { eshopPage as copy } from '../data/eshop'
import { findPartOfKind } from '../data/spareParts'
import { getModel } from '../lib/catalog'
import { assetsFor } from '../lib/connect'
import { formatDate } from '../lib/format'
import { partPrice } from '../lib/pricing'
import { ordersFor } from '../lib/selfService'
import { partByNumber } from '../lib/spareParts'
import { useSelfService } from '../selfService/useSelfService'
import type { Order, SparePart, User } from '../types'

/** Signed out, the kits shown are for the two most common sizes. */
const defaultKitModels = ['ahlstar-150-125-315', 'xfp-150-e']

/** The parts on the user's latest orders, newest first, once each. */
function recentlyOrdered(orders: Order[]) {
  const seen = new Set<string>()
  const recent: { part: SparePart; order: Order }[] = []
  for (const order of [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt))) {
    for (const line of order.lines) {
      const part = partByNumber(line.partNumber)
      if (part && !seen.has(part.id)) {
        seen.add(part.id)
        recent.push({ part, order })
      }
    }
  }
  return recent.slice(0, 4)
}

/** 2-year service kits for the user's most common installed models, with the units they fit. */
function kitsFor(user: User | null) {
  if (!user) {
    return defaultKitModels.flatMap((modelId) =>
      ['service-kit', 'overhaul-kit'].flatMap((kind) => {
        const part = findPartOfKind(modelId, kind)
        return part ? [{ part, units: [] as string[] }] : []
      }),
    )
  }
  const byModel = new Map<string, string[]>()
  for (const asset of assetsFor(user)) {
    if (asset.modelId)
      byModel.set(asset.modelId, [...(byModel.get(asset.modelId) ?? []), asset.tag])
  }
  return [...byModel]
    .sort((a, b) => b[1].length - a[1].length)
    .flatMap(([modelId, units]) => {
      const part = findPartOfKind(modelId, 'service-kit')
      return part ? [{ part, units }] : []
    })
    .slice(0, 4)
}

/**
 * /eshop: hero, quick order by part number, ways to find a part, the parts ordered
 * recently and service kits for the user's own pumps. Signed out, no prices.
 */
export function EshopPage() {
  const { user, signIn } = useAuth()
  const { orders } = useSelfService()
  const addToCart = useAddToCart()
  const recent = user ? recentlyOrdered(ordersFor(user, orders)) : []
  const kits = kitsFor(user)

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>

      <ApplicationPanelHero
        image={copy.hero}
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        title={copy.title}
        text={copy.text}
        panelSide="left"
        size="lg"
      />

      <section className="relative z-10 site-container -mt-14">
        <div className="grid gap-x-12 gap-y-8 rounded-lg border border-border bg-white px-10 py-8 shadow-raised lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-brand">
              {copy.quickOrder.title}
            </h2>
            {user ? (
              <>
                <p className="mt-1 text-text-muted">{copy.quickOrder.text}</p>
                <div className="mt-5">
                  <QuickOrderForm />
                </div>
              </>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
                <p className="max-w-md text-text-muted">{copy.signedOut.text}</p>
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <LogIn className="size-4" />
                  {copy.signedOut.action}
                </button>
              </div>
            )}
          </div>
          <ul className="grid content-center gap-5 border-border lg:border-l lg:pl-12">
            {copy.benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{title}</span>
                  <span className="block text-sm text-text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-container pt-20 pb-6">
        <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-brand">
          {copy.shortcuts.title}
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {copy.shortcuts.cards.map((card) => (
            <li key={card.title}>
              <ShortcutCard card={card} />
            </li>
          ))}
        </ul>
      </section>

      {recent.length > 0 && (
        <section className="site-container py-16">
          <SectionHeading title={copy.recent.title} subtitle={copy.recent.text} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {recent.map(({ part, order }) => (
              <li key={part.id}>
                <PartCard
                  part={part}
                  eyebrow={part.group}
                  meta={[
                    copy.recent.lastOrdered(formatDate(order.placedAt.slice(0, 10)), order.id),
                  ]}
                  price={partPrice(part, user)}
                  actionLabel={copy.recent.action}
                  onAdd={() => addToCart(part, 1)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-border bg-surface-muted">
        <div className="site-container py-20">
          <SectionHeading
            title={user ? copy.kits.title : copy.kits.titleSignedOut}
            subtitle={copy.kits.text}
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {kits.map(({ part, units }) => {
              const model = getModel(part.modelIds[0])
              return (
                <li key={part.id}>
                  <PartCard
                    part={part}
                    eyebrow={part.interval ?? part.group}
                    meta={[
                      units.length
                        ? copy.kits.forUnits(units.join(', '))
                        : copy.kits.fits(model?.name ?? ''),
                      copy.kits.parts(part.contains?.length ?? 0),
                    ]}
                    price={partPrice(part, user)}
                    actionLabel={copy.kits.action}
                    onAdd={() => addToCart(part, 1)}
                  />
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
