import { Check, CircleCheck, ExternalLink, FolderPlus, ScrollText } from 'lucide-react'
import { Link } from 'react-router'
import { sizingComparePage as copy } from '../../data/sizingPages'
import { tenderDialog } from '../../data/tenderTexts'
import { BuyAction } from '../eshop/BuyAction'
import { alternativeLetter, type CompareRow } from '../../lib/compare'
import { getProduct, productPath } from '../../lib/catalog'
import type { SizingResult } from '../../types'
import { SmartImage } from '../SmartImage'

type CompareTableProps = {
  results: SizingResult[]
  rows: CompareRow[]
  /** Colour of each pump's curve, by column. */
  colors: string[]
  selectedId: string | null
  onSelect: (variantId: string) => void
  onAddToProject: (result: SizingResult) => void
  onTenderText: (result: SizingResult) => void
}

/**
 * The pumps side by side: a header per column (curve colour, alternative
 * letter, image, name, product number, Select / Add to project / View
 * product), then one aligned row per figure with the best value marked green.
 */
export function CompareTable({
  results,
  rows,
  colors,
  selectedId,
  onSelect,
  onAddToProject,
  onTenderText,
}: CompareTableProps) {
  const cell = 'border-b border-border px-5 py-3 align-top'
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[48rem] table-fixed border-separate border-spacing-0 text-[15px]">
        <caption className="sr-only">{copy.tableLabel}</caption>
        <colgroup>
          <col className="w-[15rem]" />
          {results.map((r) => (
            <col key={r.variant.id} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <td className={`${cell} bg-surface-subtle`} />
            {results.map((result, i) => {
              const { variant } = result
              const image = getProduct(variant.productId)?.images[0]
              const selected = variant.id === selectedId
              return (
                <th
                  key={variant.id}
                  scope="col"
                  className={`${cell} text-left font-normal transition-colors duration-200 ${
                    selected ? 'bg-success-tint/60' : 'bg-white'
                  }`}
                  style={{ boxShadow: `inset 0 4px 0 ${colors[i % colors.length]}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-pill bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {copy.alternative(alternativeLetter(i))}
                    </span>
                    {selected && (
                      <span className="inline-flex animate-fade-in items-center gap-1 text-xs font-semibold text-success-strong">
                        <CircleCheck className="size-4" />
                        {copy.selected}
                      </span>
                    )}
                  </div>
                  {image && (
                    <div className="relative mx-auto mt-3 h-28 w-full">
                      <SmartImage src={image.src} alt={image.alt} fit="contain" />
                    </div>
                  )}
                  <p className="mt-3 leading-snug font-bold text-navy-900">{variant.name}</p>
                  <p className="text-sm text-text-muted tabular-nums">
                    {variant.productNumber ?? copy.onRequest}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelect(variant.id)}
                      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-pill px-4 text-sm font-semibold transition-colors ${
                        selected
                          ? 'bg-success text-white hover:bg-success-strong'
                          : 'bg-primary text-white hover:bg-primary-hover'
                      }`}
                    >
                      {selected && <Check className="size-4" />}
                      {selected ? copy.selected : copy.select}
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToProject(result)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
                    >
                      <FolderPlus className="size-4" />
                      {copy.addToProject}
                    </button>
                    <BuyAction id={variant.id} name={variant.name} look="block" />
                    <button
                      type="button"
                      onClick={() => onTenderText(result)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
                    >
                      <ScrollText className="size-4" />
                      {tenderDialog.open}
                    </button>
                    <Link
                      to={productPath(getProduct(variant.productId)!)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-pill px-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {copy.viewProduct}
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="animate-fade-in">
              <th
                scope="row"
                className={`${cell} bg-surface-subtle text-left text-sm font-semibold text-navy-900`}
              >
                {row.label}
              </th>
              {row.values.map((value, i) => {
                const best = row.best.includes(i)
                return (
                  <td
                    key={results[i].variant.id}
                    className={`${cell} tabular-nums transition-colors duration-200 ${
                      best ? 'bg-success-tint font-semibold text-success-strong' : 'text-navy-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {best && <Check aria-hidden className="size-4 shrink-0" />}
                      {value}
                      {best && <span className="sr-only">({copy.best})</span>}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
