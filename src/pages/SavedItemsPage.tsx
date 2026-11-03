import { Bookmark } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ChipGroup } from '../components/ChipGroup'
import { PersonalItemCard } from '../components/mypages/PersonalItemCard'
import { PersonalPageEmpty } from '../components/mypages/PersonalPageEmpty'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { DocumentThumb } from '../components/product/DocumentThumb'
import { SmartImage } from '../components/SmartImage'
import { signedOutRedirect } from '../data/myPages'
import { savedPage as copy } from '../data/personal'
import { useUrlParams } from '../hooks/useUrlParams'
import { resolveSavedItem } from '../lib/catalog'
import { usePersonal } from '../personal/usePersonal'
import { useToast } from '../toast/useToast'
import type { SavedItem } from '../types'

const kinds: SavedItem['kind'][] = ['product', 'document']

/**
 * My saved items: /my-pages/saved. Signed-in only. The products and documents
 * bookmarked with the personal toolbar state, filtered by kind (?kind=…).
 */
export function SavedItemsPage() {
  const { user } = useAuth()
  const { saved, toggleSaved } = usePersonal()
  const [params, update] = useUrlParams()
  const showToast = useToast()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const items = saved.map(resolveSavedItem).filter((item) => item !== undefined)
  const selected = params.getAll('kind').filter((kind) => kinds.includes(kind as SavedItem['kind']))
  const shown = selected.length ? items.filter(({ item }) => selected.includes(item.kind)) : items

  function setKinds(values: string[]) {
    update((next) => {
      next.delete('kind')
      for (const value of values) next.append('kind', value)
    })
  }

  function remove(item: SavedItem, title: string) {
    toggleSaved(item)
    showToast({ message: copy.removed, detail: title })
  }

  return (
    <>
      <title>{`${copy.title} | mySulzer | Sulzer`}</title>
      <PageHeaderBand
        breadcrumb={[...copy.breadcrumb, { label: copy.title }]}
        title={copy.title}
        description={copy.description}
      />

      <section className="site-container py-12 lg:py-16">
        {items.length === 0 ? (
          <PersonalPageEmpty icon={Bookmark} {...copy.empty} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ChipGroup
                label={copy.filters.all}
                allLabel={`${copy.filters.all} (${items.length})`}
                options={kinds.map((kind) => ({
                  value: kind,
                  label: copy.filters[kind],
                  count: items.filter(({ item }) => item.kind === kind).length,
                }))}
                selected={selected}
                onToggle={(kind) =>
                  setKinds(
                    selected.includes(kind)
                      ? selected.filter((k) => k !== kind)
                      : [...selected, kind],
                  )
                }
                onClear={() => setKinds([])}
              />
              <p className="text-sm text-text-muted tabular-nums">{copy.count(shown.length)}</p>
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map(({ item, title, meta, to, product, document }) => (
                <li key={`${item.kind}-${item.id}`} className="animate-fade-in">
                  <PersonalItemCard
                    media={
                      document ? (
                        <div className="absolute inset-0 flex items-start justify-center pt-8">
                          <div className="w-[44%] transition-transform duration-250 ease-sz group-hover:-translate-y-1">
                            <DocumentThumb document={document} />
                          </div>
                        </div>
                      ) : (
                        product && (
                          <SmartImage
                            src={product.images[0].src}
                            alt=""
                            fit="contain"
                            className="p-8 transition-transform duration-250 ease-sz group-hover:scale-[1.03]"
                          />
                        )
                      )
                    }
                    badge={copy.kind[item.kind]}
                    title={title}
                    meta={meta}
                    to={to}
                    actionLabel={copy.open}
                    remove={{ label: copy.remove(title), onClick: () => remove(item, title) }}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}
