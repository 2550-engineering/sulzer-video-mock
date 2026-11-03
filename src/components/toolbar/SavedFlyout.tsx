import { Bookmark } from 'lucide-react'
import { personalToolbar, savedPage } from '../../data/personal'
import { resolveSavedItem } from '../../lib/catalog'
import { usePersonal } from '../../personal/usePersonal'
import { FileTypeIcon } from '../product/FileTypeIcon'
import { ProductThumb } from '../ProductThumb'
import { FlyoutEmpty } from './FlyoutEmpty'
import { FlyoutLink } from './FlyoutLink'
import { FlyoutRow } from './FlyoutRow'

const copy = personalToolbar.saved

/** Saved products and documents, newest first, each with a filled bookmark that removes it. */
export function SavedFlyout({ onNavigate }: { onNavigate: () => void }) {
  const { saved, toggleSaved } = usePersonal()
  const items = saved.map(resolveSavedItem).filter((item) => item !== undefined)

  if (items.length === 0) {
    return <FlyoutEmpty icon={Bookmark} title={copy.empty.title} text={copy.empty.text} />
  }

  return (
    <>
      <ul className="-mx-3 space-y-1">
        {items.map(({ item, title, meta, to, product, document }) => (
          <FlyoutRow
            key={`${item.kind}-${item.id}`}
            to={to}
            title={title}
            meta={meta}
            leading={
              document ? (
                <FileTypeIcon format={document.format} />
              ) : (
                product && <ProductThumb product={product} />
              )
            }
            trailing={
              <button
                type="button"
                onClick={() => toggleSaved(item)}
                aria-label={savedPage.remove(title)}
                className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-white"
              >
                <Bookmark className="size-4" fill="currentColor" strokeWidth={1.75} />
              </button>
            }
            onNavigate={onNavigate}
          />
        ))}
      </ul>
      <div className="mt-8">
        <FlyoutLink to={copy.to} label={copy.viewAll} onNavigate={onNavigate} />
      </div>
    </>
  )
}
