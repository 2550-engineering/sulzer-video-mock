import { History, Trash2 } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { PersonalItemCard } from '../components/mypages/PersonalItemCard'
import { PersonalPageEmpty } from '../components/mypages/PersonalPageEmpty'
import { PageHeaderBand } from '../components/PageHeaderBand'
import { SmartImage } from '../components/SmartImage'
import { signedOutRedirect } from '../data/myPages'
import { recentPage as copy } from '../data/personal'
import { getProduct, productPath } from '../lib/catalog'
import { usePersonal } from '../personal/usePersonal'
import { useToast } from '../toast/useToast'

/**
 * Recently viewed products: /my-pages/recently-viewed. Signed-in only. Every
 * product page visit while signed in moves that product to the front.
 */
export function RecentlyViewedPage() {
  const { user } = useAuth()
  const { recent, clearRecent } = usePersonal()
  const showToast = useToast()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  const products = recent.map(getProduct).filter((product) => product !== undefined)

  function clear() {
    clearRecent()
    showToast({ message: copy.cleared })
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
        {products.length === 0 ? (
          <PersonalPageEmpty icon={History} {...copy.empty} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-text-muted tabular-nums">{copy.count(products.length)}</p>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
                {copy.clear}
              </button>
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <li key={product.id} className="animate-fade-in">
                  <PersonalItemCard
                    media={
                      <SmartImage
                        src={product.images[0].src}
                        alt=""
                        fit="contain"
                        className="p-8 transition-transform duration-250 ease-sz group-hover:scale-[1.03]"
                      />
                    }
                    badge={product.family}
                    flag={i === 0 ? copy.latest : undefined}
                    title={product.name}
                    meta={product.summary}
                    to={productPath(product)}
                    actionLabel={copy.view}
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
