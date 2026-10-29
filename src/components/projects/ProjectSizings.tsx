import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { applications } from '../../data/applications'
import { myProjectsPage } from '../../data/projectPages'
import { getProduct } from '../../lib/catalog'
import { groupThousands } from '../../lib/format'
import type { Project } from '../../types'

const copy = myProjectsPage.sizings

type ProjectSizingsProps = {
  project: Project
  onDuplicate: (sizingId: string) => void
  onDelete: (sizingId: string) => void
}

const head = 'border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold'
const cell = 'border-b border-border px-3 py-2.5 align-top'
const iconButton =
  'inline-flex h-8 items-center gap-1.5 rounded-pill px-2.5 text-[13px] font-semibold transition-colors'

/**
 * "Sizings" in a project: one row per saved sizing with its duty point,
 * application, product family, products and date. "Open sizing" restores every
 * parameter and filter on /sizing, linked back to this record for "Update project".
 */
export function ProjectSizings({ project, onDuplicate, onDelete }: ProjectSizingsProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[44rem] border-separate border-spacing-0 text-sm">
        <thead className="text-navy-900">
          <tr>
            <th scope="col" className={head}>
              {copy.columns.sizing}
            </th>
            <th scope="col" className={head}>
              {copy.columns.dutyPoint}
            </th>
            <th scope="col" className={head}>
              {copy.columns.application}
            </th>
            <th scope="col" className={head}>
              {copy.columns.family}
            </th>
            <th scope="col" className={`${head} text-center`}>
              {copy.columns.products}
            </th>
            <th scope="col" className={head}>
              {copy.columns.date}
            </th>
            <th scope="col" className={head}>
              <span className="sr-only">{copy.columns.actions}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {project.sizings.map((sizing) => {
            const products = project.items.filter((item) => item.sizingId === sizing.id)
            const query = new URLSearchParams(sizing.params)
            query.set('project', project.id)
            query.set('sizing', sizing.id)
            return (
              <tr
                key={sizing.id}
                id={`sizing-${sizing.id}`}
                className="scroll-mt-[calc(var(--sz-header-height)+1rem)] target:bg-primary-tint"
              >
                <td className={cell}>
                  <p className="font-semibold text-navy-900">{sizing.name}</p>
                  <p className="text-xs text-text-muted">{copy.hits(sizing.hits)}</p>
                </td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>
                  {copy.dutyPoint(
                    groupThousands(sizing.dutyPoint.flow),
                    groupThousands(sizing.dutyPoint.head),
                  )}
                </td>
                <td className={cell}>
                  {applications.find((a) => a.id === sizing.applicationId)?.name ?? '–'}
                </td>
                <td className={cell}>{getProduct(sizing.productId)?.name ?? sizing.productId}</td>
                <td className={`${cell} text-center tabular-nums`}>{products.length}</td>
                <td className={`${cell} whitespace-nowrap text-text-muted`}>{sizing.created}</td>
                <td className={`${cell} whitespace-nowrap`}>
                  <div className="flex justify-end gap-1">
                    {sizing.params.length > 0 ? (
                      <Link
                        to={`/sizing?${query}`}
                        className={`${iconButton} bg-primary text-white hover:bg-primary-hover`}
                      >
                        <ExternalLink className="size-3.5" />
                        {copy.open}
                      </Link>
                    ) : (
                      <span
                        title={copy.noParams}
                        className={`${iconButton} cursor-not-allowed text-text-subtle`}
                      >
                        <ExternalLink className="size-3.5" />
                        {copy.open}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onDuplicate(sizing.id)}
                      className={`${iconButton} text-primary hover:bg-primary-tint`}
                    >
                      <Copy className="size-3.5" />
                      {copy.duplicate}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(sizing.id)}
                      className={`${iconButton} text-danger hover:bg-surface-muted`}
                    >
                      <Trash2 className="size-3.5" />
                      {copy.delete}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
