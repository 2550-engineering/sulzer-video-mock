import { Download, FolderOpen, Upload } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import { formatFileSize } from '../../lib/format'
import { projectDocumentRows } from '../../lib/projectDocuments'
import { useProjects } from '../../projects/useProjects'
import { useToast } from '../../toast/useToast'
import type { Project } from '../../types'
import { FileTypeIcon } from '../product/FileTypeIcon'

const copy = myProjectsPage.documents

const cell = 'border-b border-border px-3 py-3'
const head = 'border-b border-border bg-surface-sunken px-3 py-3 text-left font-semibold'

/** "P&ID rev B.pdf" → "PDF"; files without a short extension show "FILE". */
const formatOf = (name: string) => {
  const extension = name.includes('.') ? name.split('.').pop()!.toUpperCase() : ''
  return extension && extension.length <= 4 ? extension : 'FILE'
}

/**
 * The project's Documents: files added by the team (uploads, generated CAD
 * and packages; newest first) and the files mySulzer keeps up to date (data
 * sheets, performance curves, summary). "Upload file" adds a local file's
 * name and size; the file itself is not read or stored.
 */
export function ProjectDocuments({ project }: { project: Project }) {
  const showToast = useToast()
  const { addDocument } = useProjects()
  const input = useRef<HTMLInputElement>(null)

  const rows = projectDocumentRows(project)

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    addDocument(project.id, {
      kind: 'upload',
      title: file.name,
      format: formatOf(file.name),
      size: formatFileSize(file.size),
    })
    showToast({ message: copy.uploaded(file.name) })
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-navy-900">
          {copy.title} <span className="font-normal text-text-muted">({rows.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
        >
          <Upload className="size-4" />
          {copy.upload}
        </button>
        <input ref={input} type="file" onChange={upload} className="hidden" tabIndex={-1} />
      </div>

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white max-xl:relative max-md:overflow-visible max-md:rounded-none max-md:border-0 max-md:bg-transparent">
          <table className="table-cards w-full min-w-[40rem] border-separate border-spacing-0 text-[15px] max-md:[&>tbody>tr]:bg-white max-md:[&>tfoot>tr]:bg-white">
            <thead className="text-sm text-navy-900">
              <tr>
                <th scope="col" className={head}>
                  {copy.columns.name}
                </th>
                <th scope="col" className={`${head} text-right`}>
                  {copy.columns.size}
                </th>
                <th scope="col" className={head}>
                  {copy.columns.by}
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
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${row.at === 'Just now' ? 'animate-highlight' : ''} ${
                    index % 2 ? 'bg-surface-subtle' : 'bg-white'
                  }`}
                >
                  <td className={`${cell} py-2.5`}>
                    <div className="flex items-center gap-3">
                      <FileTypeIcon format={row.format} />
                      <div className="min-w-0">
                        <p className="font-semibold break-words text-navy-900">{row.title}</p>
                        {(row.position !== undefined || row.generated) && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {row.generated ? copy.generated : copy.position(row.position!)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${cell} text-right whitespace-nowrap text-text-muted tabular-nums`}
                  >
                    {row.size}
                  </td>
                  <td className={`${cell} whitespace-nowrap text-text`}>{row.by}</td>
                  <td className={`${cell} whitespace-nowrap text-text-muted tabular-nums`}>
                    {row.at}
                  </td>
                  <td className={`${cell} w-12 text-right`}>
                    <button
                      type="button"
                      onClick={() =>
                        showToast({
                          message: myProjectsPage.toasts.document(row.title),
                          detail: `${row.format} · ${row.size}`,
                        })
                      }
                      aria-label={copy.download(row.title)}
                      className="inline-flex size-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-tint"
                    >
                      <Download className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-lg border border-border bg-white px-8 py-12 text-center">
          <FolderOpen aria-hidden className="size-10 text-text-subtle" strokeWidth={1.5} />
          <p className="mt-4 max-w-md text-text-muted">{copy.empty}</p>
        </div>
      )}
    </section>
  )
}
