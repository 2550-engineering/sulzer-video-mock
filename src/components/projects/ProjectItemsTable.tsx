import {
  ChevronDown,
  CircleCheck,
  FolderOpen,
  GitCompareArrows,
  Link2,
  MessageSquare,
  Minus,
  Plus,
  ScrollText,
} from 'lucide-react'
import { Fragment, useState } from 'react'
import { Link } from 'react-router'
import { myProjectsPage } from '../../data/projectPages'
import { sizingResultsPage } from '../../data/sizingPages'
import { articleById } from '../../lib/articles'
import { groupThousands } from '../../lib/format'
import { formatPrice } from '../../lib/modelSpecs'
import { chosenItems, itemStatuses } from '../../lib/projects'
import { evaluateVariant } from '../../lib/sizing'
import { getVariant } from '../../lib/variants'
import type { ItemPatch } from '../../projects/ProjectsContext'
import type { ProjectItem, ProjectItemStatus, SizingRecord } from '../../types'
import { BuyAction } from '../eshop/BuyAction'
import { CurveThumbnail } from '../sizing/CurveThumbnail'

const copy = myProjectsPage.items

type ProjectItemsTableProps = {
  items: ProjectItem[]
  /** Item ids to highlight for a moment (just added). */
  highlightIds: string[]
  signedIn: boolean
  /** The project's sizings, to link products to the sizing they came from. */
  sizings: SizingRecord[]
  /** Comments per item id (with replies). */
  commentCounts: Record<string, number>
  /** Opens the tender text of one item. */
  onTenderText: (item: ProjectItem) => void
  /** Opens the Files drawer (CAD & BIM, drawings, documents) of one item. */
  onFiles: (item: ProjectItem) => void
  /** Opens the discussion about one item. */
  onComments: (item: ProjectItem) => void
  /** Marks an alternative as the chosen one of its group. */
  onChoose: (item: ProjectItem) => void
  onChange: (itemId: string, patch: ItemPatch) => void
}

const cell = 'border-b border-border px-2.5 py-3'
const head = 'border-b border-border bg-surface-sunken px-2.5 py-3 text-left font-semibold'
const link =
  'inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline'

const statusTones: Record<ProjectItemStatus, string> = {
  Proposed: 'bg-surface-sunken text-navy-700',
  'For review': 'bg-warning-tint text-warning-strong',
  Approved: 'bg-success-tint text-success-strong',
  Quoted: 'bg-primary-tint text-primary',
  Ordered: 'bg-navy-900 text-white',
}

/**
 * "Sulzer products" table: checkbox, position, editable "Your position",
 * curve thumbnail, product (name, number link, duty point, Tender text, Files,
 * Comments), quantity stepper, status and, signed in, the price. Alternatives
 * saved from one comparison sit together under a header row; the ones not
 * chosen are greyed and left out of the total. Each item is re-evaluated from
 * its variant id and duty point, so curve and price always match the sizing
 * data.
 */
export function ProjectItemsTable({
  items,
  highlightIds,
  signedIn,
  sizings,
  commentCounts,
  onTenderText,
  onFiles,
  onComments,
  onChoose,
  onChange,
}: ProjectItemsTableProps) {
  const [selected, setSelected] = useState<string[]>([])
  const chosen = chosenItems(items)
  const rows = items.map((item) => {
    const variant = getVariant(item.variantId)
    const result = variant && evaluateVariant(variant, item.dutyPoint)
    // Not a sized variant: a catalogue article such as a configured XFP or an AHLSTAR model.
    const article = variant ? undefined : articleById(item.variantId)
    return {
      item,
      variant,
      result,
      article,
      price: result?.purchasePrice ?? article?.listPrice,
      counted: chosen.includes(item),
    }
  })
  const allSelected = items.length > 0 && items.every((item) => selected.includes(item.id))
  const total = rows.reduce(
    (sum, { item, price, counted }) => sum + (counted ? (price ?? 0) * item.quantity : 0),
    0,
  )
  const columns = signedIn ? 7 : 6

  // Alternatives of one group follow each other, at the place of the first.
  const ordered = rows.flatMap((row, i) => {
    const group = row.item.alternativeGroup
    if (!group) return [row]
    const first = rows.findIndex((r) => r.item.alternativeGroup === group)
    return first === i ? rows.filter((r) => r.item.alternativeGroup === group) : []
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[44rem] border-separate border-spacing-0 text-[15px]">
        <thead className="text-sm text-navy-900">
          <tr>
            <th scope="col" className={`${head} w-10`}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? [] : items.map((item) => item.id))}
                aria-label={copy.selectAll}
                className="size-[18px] cursor-pointer accent-primary"
              />
            </th>
            <th scope="col" className={head}>
              {copy.position}
              <span className="block text-xs font-normal text-text-muted">{copy.yourPosition}</span>
            </th>
            <th scope="col" className={head}>
              {copy.curve}
            </th>
            <th scope="col" className={head}>
              {copy.product}
            </th>
            <th scope="col" className={`${head} text-center`}>
              {copy.quantity}
              <span className="block text-xs font-normal text-text-muted">{copy.status}</span>
            </th>
            {signedIn && (
              <th scope="col" className={`${head} text-right`}>
                {copy.price}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ordered.map(({ item, variant, result, article, price, counted }, index) => {
            const name = variant?.name ?? article?.code ?? item.variantId
            const sizing = sizings.find((s) => s.id === item.sizingId)
            const checked = selected.includes(item.id)
            const group = item.alternativeGroup
            const groupItems = group ? items.filter((i) => i.alternativeGroup === group) : []
            const startsGroup = group !== undefined && groupItems[0]?.id === item.id
            const status = item.status ?? 'Proposed'
            const comments = commentCounts[item.id] ?? 0
            const muted = group !== undefined && !counted
            return (
              <Fragment key={item.id}>
                {startsGroup && (
                  <tr className="bg-primary-tint/60">
                    <td colSpan={columns} className="border-b border-border px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold text-navy-900">
                        <GitCompareArrows aria-hidden className="size-4 text-primary" />
                        {copy.alternatives(item.customerPosition, groupItems.length)}
                      </span>
                    </td>
                  </tr>
                )}
                <tr
                  className={`transition-colors duration-150 ${
                    highlightIds.includes(item.id) ? 'animate-highlight' : ''
                  } ${checked ? 'bg-primary-tint' : index % 2 ? 'bg-surface-subtle' : 'bg-white'} ${
                    group ? '[&>td:first-child]:border-l-4 [&>td:first-child]:border-l-primary' : ''
                  }`}
                >
                  <td className={cell}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelected((ids) =>
                          ids.includes(item.id)
                            ? ids.filter((id) => id !== item.id)
                            : [...ids, item.id],
                        )
                      }
                      aria-label={copy.select(name)}
                      className="size-[18px] cursor-pointer accent-primary"
                    />
                  </td>
                  <td className={cell}>
                    <span className="mb-1 block text-sm text-text-muted tabular-nums">
                      {item.position}
                    </span>
                    <input
                      value={item.customerPosition}
                      onChange={(e) => onChange(item.id, { customerPosition: e.target.value })}
                      aria-label={copy.yourPositionLabel(item.position)}
                      className="h-9 w-20 rounded-md border border-border-strong bg-white px-2.5 text-sm text-navy-900 transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_3px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none"
                    />
                  </td>
                  <td className={`${cell} px-1.5 py-2 ${muted ? 'opacity-50' : ''}`}>
                    {result && <CurveThumbnail result={result} duty={item.dutyPoint} />}
                  </td>
                  <td className={`${cell} min-w-[12rem]`}>
                    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-semibold text-navy-900">
                      <span className={muted ? 'text-text-muted' : ''}>{name}</span>
                      {item.alternative && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                            item.preferred
                              ? 'bg-success-tint text-success-strong'
                              : 'bg-surface-sunken text-navy-700'
                          }`}
                        >
                          {item.preferred && <CircleCheck aria-hidden className="size-3" />}
                          {copy.alternative(item.alternative)}
                          {item.preferred && ` · ${copy.preferred}`}
                        </span>
                      )}
                      {sizing && (
                        <a
                          href={`#sizing-${sizing.id}`}
                          title={myProjectsPage.sizings.fromSizing(sizing.name)}
                          aria-label={myProjectsPage.sizings.fromSizing(sizing.name)}
                          className="text-primary transition-colors hover:text-primary-hover"
                        >
                          <Link2 className="size-3.5" />
                        </a>
                      )}
                    </p>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 text-sm">
                      {article ? (
                        <Link
                          to={article.to}
                          className="font-semibold text-primary tabular-nums underline-offset-4 hover:underline"
                        >
                          {article.productNumber}
                        </Link>
                      ) : variant?.productNumber ? (
                        <Link
                          to={`/products/${variant.productId}#models`}
                          className="font-semibold text-primary tabular-nums underline-offset-4 hover:underline"
                        >
                          {variant.productNumber}
                        </Link>
                      ) : (
                        <Link
                          to={sizingResultsPage.quoteLink(item.variantId)}
                          className="font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {copy.onRequest}
                        </Link>
                      )}
                      <span className="text-text-muted tabular-nums">
                        {copy.dutyPoint(
                          groupThousands(item.dutyPoint.flow),
                          groupThousands(item.dutyPoint.head),
                        )}
                      </span>
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                      {group && !item.preferred && (
                        <button
                          type="button"
                          onClick={() => onChoose(item)}
                          className="inline-flex items-center gap-1 rounded-pill border border-primary px-2.5 py-0.5 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                        >
                          <CircleCheck aria-hidden className="size-3.5" />
                          {copy.choose}
                        </button>
                      )}
                      <BuyAction
                        id={item.variantId}
                        name={name}
                        quantity={item.quantity}
                        look="link"
                      />
                      <button
                        type="button"
                        onClick={() => onTenderText(item)}
                        aria-label={copy.tenderTextFor(name)}
                        className={link}
                      >
                        <ScrollText aria-hidden className="size-3.5" />
                        {copy.tenderText}
                      </button>
                      <button
                        type="button"
                        onClick={() => onFiles(item)}
                        aria-label={copy.filesFor(name)}
                        className={link}
                      >
                        <FolderOpen aria-hidden className="size-3.5" />
                        {copy.files}
                      </button>
                      <button
                        type="button"
                        onClick={() => onComments(item)}
                        aria-label={copy.commentsFor(name)}
                        className={link}
                      >
                        <MessageSquare aria-hidden className="size-3.5" />
                        {copy.comments(comments)}
                      </button>
                    </p>
                  </td>
                  <td className={cell}>
                    <div className="mx-auto flex w-fit items-center rounded-md border border-border-strong bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          onChange(item.id, { quantity: Math.max(1, item.quantity - 1) })
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`${copy.quantityLabel(name)} −1`}
                        className="flex size-8 items-center justify-center text-navy-900 transition-colors hover:text-primary disabled:text-text-subtle"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span
                        aria-label={copy.quantityLabel(name)}
                        className="w-8 text-center font-semibold tabular-nums"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChange(item.id, { quantity: item.quantity + 1 })}
                        aria-label={`${copy.quantityLabel(name)} +1`}
                        className="flex size-8 items-center justify-center text-navy-900 transition-colors hover:text-primary"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-center">
                      <span className="relative inline-flex">
                        <select
                          value={status}
                          aria-label={copy.statusFor(name)}
                          onChange={(e) =>
                            onChange(item.id, { status: e.target.value as ProjectItemStatus })
                          }
                          className={`h-7 cursor-pointer appearance-none rounded-sm pr-6 pl-2 text-xs font-semibold transition-shadow hover:shadow-[0_0_0_1px_var(--sz-color-border-strong)] focus-visible:shadow-[0_0_0_2px_var(--sz-color-primary)] focus-visible:outline-none ${statusTones[status]}`}
                        >
                          {itemStatuses.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 right-1.5 size-3 -translate-y-1/2 opacity-70"
                        />
                      </span>
                    </div>
                  </td>
                  {signedIn && (
                    <td
                      className={`${cell} text-right font-semibold whitespace-nowrap tabular-nums ${
                        muted ? 'text-text-subtle' : 'text-navy-900'
                      }`}
                    >
                      {price !== undefined ? formatPrice(price * item.quantity) : '–'}
                      {muted && (
                        <span className="block text-xs font-normal text-text-muted">
                          {copy.notChosen}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              </Fragment>
            )
          })}
        </tbody>
        {signedIn && (
          <tfoot>
            <tr>
              <td
                colSpan={columns - 1}
                className="px-3 py-3 text-right text-sm font-semibold text-text-muted"
              >
                {copy.total}
              </td>
              <td className="px-3 py-3 text-right text-lg font-bold whitespace-nowrap text-navy-900 tabular-nums">
                {formatPrice(total)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
