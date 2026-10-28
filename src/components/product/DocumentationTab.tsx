import { FileSearch, FolderDown, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { market } from '../../config/demo'
import { productPage } from '../../data/catalogPages'
import { documentTypeOrder } from '../../data/documents'
import { useDocumentDownload } from '../../hooks/useDocumentDownload'
import { useUrlParams } from '../../hooks/useUrlParams'
import { useToast } from '../../toast/useToast'
import type { Document, Product } from '../../types'
import { ChipGroup } from '../ChipGroup'
import { SelectField } from '../SelectField'
import { TabHeading } from '../TabHeading'
import { DocumentPreview } from './DocumentPreview'
import { DocumentRow } from './DocumentRow'

const copy = productPage.documentation
const allLanguages = 'all'
/** How long "Preparing ZIP…" shows. Fixed, so recordings match. */
const zipMs = 1000

type DocumentationTabProps = {
  product: Product
  documents: Document[]
}

/**
 * Documentation tab: type chips and a language select (in the URL as ?doctype
 * and ?lang, defaulting to the market language), documents grouped by type,
 * preview, download, and "Download selected" as one ZIP.
 */
export function DocumentationTab({ product, documents }: DocumentationTabProps) {
  const [params, update] = useUrlParams()
  const download = useDocumentDownload()
  const showToast = useToast()
  const [selected, setSelected] = useState<string[]>([])
  const [preparing, setPreparing] = useState(false)
  const [preview, setPreview] = useState<{ document: Document | null; open: boolean }>({
    document: null,
    open: false,
  })
  const zipTimer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(zipTimer.current), [])

  // Languages in order of first appearance; the market language is the default when offered.
  const languages = [...new Set(documents.flatMap((doc) => doc.languages))]
  const defaultLanguage = languages.includes(market.language) ? market.language : allLanguages
  const requested = params.get('lang')
  const language =
    requested === allLanguages || languages.includes(requested ?? '') ? requested! : defaultLanguage

  const inLanguage = documents.filter(
    (doc) => language === allLanguages || doc.languages.includes(language),
  )
  const types = documentTypeOrder.filter((type) => documents.some((doc) => doc.type === type))
  const selectedTypes = params.getAll('doctype').filter((type) => types.some((t) => t === type))
  const shown = inLanguage.filter(
    (doc) => selectedTypes.length === 0 || selectedTypes.includes(doc.type),
  )
  const groups = types
    .map((type) => ({ type, documents: shown.filter((doc) => doc.type === type) }))
    .filter((group) => group.documents.length > 0)

  // Only what is on screen counts as selected.
  const checked = shown.filter((doc) => selected.includes(doc.id))
  const allChecked = shown.length > 0 && checked.length === shown.length

  function setLanguage(value: string) {
    update((next) => (value === defaultLanguage ? next.delete('lang') : next.set('lang', value)))
  }

  function toggleType(type: string) {
    update((next) => {
      const current = next.getAll('doctype')
      next.delete('doctype')
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
      for (const t of updated) next.append('doctype', t)
    })
  }

  function showEverything() {
    update((next) => {
      next.delete('doctype')
      next.set('lang', allLanguages)
    })
  }

  function toggle(id: string) {
    setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  function toggleAll() {
    setSelected(allChecked ? [] : shown.map((doc) => doc.id))
  }

  function downloadSelected() {
    const count = checked.length
    setPreparing(true)
    zipTimer.current = window.setTimeout(() => {
      setPreparing(false)
      setSelected([])
      showToast({
        message: copy.downloadStarted(copy.zipName(product.name)),
        detail: copy.zipDetail(count),
      })
    }, zipMs)
  }

  return (
    <>
      <TabHeading title={productPage.documentationTitle} />

      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-navy-900">{copy.filters.type}</p>
          <ChipGroup
            label={copy.filters.type}
            allLabel={copy.filters.allTypes}
            options={types.map((type) => ({
              value: type,
              label: type,
              count: inLanguage.filter((doc) => doc.type === type).length,
            }))}
            selected={selectedTypes}
            onToggle={toggleType}
            onClear={() => update((next) => next.delete('doctype'))}
          />
        </div>
        <div className="w-52">
          <SelectField
            layout="stacked"
            label={copy.filters.language}
            value={language}
            onChange={setLanguage}
            options={[
              { value: allLanguages, label: copy.filters.allLanguages },
              ...languages.map((lang) => ({ value: lang, label: lang })),
            ]}
          />
        </div>
      </div>

      {/* Selection toolbar, sticky under the product tab bar (h-16 plus its 1 px border). */}
      <div className="sticky top-[calc(var(--sz-header-height)+65px)] z-10 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-t-lg border border-border bg-surface-sunken px-5 py-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            checked={allChecked}
            ref={(el) => {
              if (el) el.indeterminate = checked.length > 0 && !allChecked
            }}
            onChange={toggleAll}
            disabled={shown.length === 0}
            className="size-[18px] cursor-pointer accent-primary"
          />
          {copy.selectAll}
        </label>
        <p className="text-sm text-text-muted" aria-live="polite">
          {checked.length > 0 ? copy.selected(checked.length) : copy.count(shown.length)}
        </p>
        <button
          type="button"
          onClick={downloadSelected}
          disabled={checked.length === 0 || preparing}
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong"
        >
          {preparing ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <FolderDown className="size-4" />
          )}
          {preparing ? copy.preparingZip : copy.downloadSelected(checked.length)}
        </button>
      </div>

      <div className="rounded-b-lg border-x border-b border-border bg-white">
        {groups.length > 0 ? (
          groups.map((group) => (
            <section key={group.type} className="border-t border-border first:border-t-0">
              <h3 className="flex items-center gap-2 bg-surface-subtle px-5 pt-5 pb-2 text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
                {group.type}
                <span className="text-text-subtle">{group.documents.length}</span>
              </h3>
              <ul className="divide-y divide-border">
                {group.documents.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    language={language === allLanguages ? doc.languages[0] : language}
                    checked={selected.includes(doc.id)}
                    onCheck={() => toggle(doc.id)}
                    onPreview={() => setPreview({ document: doc, open: true })}
                    onDownload={() => download(doc)}
                  />
                ))}
              </ul>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center px-8 py-14 text-center">
            <FileSearch aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-navy-900">{copy.noMatches.title}</p>
            <button
              type="button"
              onClick={showEverything}
              className="mt-6 inline-flex h-10 items-center rounded-pill bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              {copy.noMatches.action}
            </button>
          </div>
        )}
      </div>

      <DocumentPreview
        open={preview.open}
        document={preview.document}
        product={product}
        onClose={() => setPreview((p) => ({ ...p, open: false }))}
        onDownload={download}
      />
    </>
  )
}
