import { Check, Download, FolderArchive, LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cadFormats } from '../../data/cad'
import { myProjectsPage } from '../../data/projectPages'
import {
  defaultPackageSelection,
  projectPackage,
  type PackageSelection,
} from '../../lib/projectPackage'
import { mb } from '../../data/projectFiles'
import { useProjects } from '../../projects/useProjects'
import { useToast } from '../../toast/useToast'
import type { CadFormat, Project } from '../../types'
import { Modal } from '../Modal'
import { ProgressBar } from '../ProgressBar'
import { SelectField } from '../SelectField'

const copy = myProjectsPage.package

/** Each part (a product, the tender texts, the project files) takes 12 steps of 100 ms. */
const stepsPerPart = 12
const stepMs = 100

const bimFormats = cadFormats.filter((f) => f.kind === 'BIM object')
const cadOnlyFormats = cadFormats.filter((f) => f.kind !== 'BIM object')
const formatOptions = (formats: typeof cadFormats) =>
  formats.map((f) => ({ value: f.format, label: f.label }))

type Toggle = Exclude<keyof PackageSelection, 'cadFormat' | 'bimFormat'>

type ProjectPackageDialogProps = {
  open: boolean
  project: Project
  onClose: () => void
}

/**
 * "Download project package": tick what to include for all products, then a
 * progress bar per product (deterministic, about 1.2 s each) and the ZIP's
 * download card. Downloading only shows a toast and saves the package to the
 * project documents. Remount (via `key`) per opening to start over.
 */
export function ProjectPackageDialog({ open, project, onClose }: ProjectPackageDialogProps) {
  const showToast = useToast()
  const { addDocument } = useProjects()
  const [selection, setSelection] = useState(defaultPackageSelection)
  /** -1 while choosing; then 100 ms steps of the build. */
  const [tick, setTick] = useState(-1)
  /** What is being built, frozen when the build starts (the download adds to the project). */
  const [built, setBuilt] = useState<ReturnType<typeof projectPackage> | null>(null)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearInterval(timer.current), [])

  const contents = built ?? projectPackage(project, selection)
  const parts = [
    ...contents.items,
    ...contents.projectParts.map((part) => ({ ...part, label: copy.projectParts[part.id] })),
  ]
  const totalSteps = parts.length * stepsPerPart
  const phase = tick < 0 ? 'choose' : tick < totalSteps ? 'building' : 'ready'

  const set = <K extends keyof PackageSelection>(key: K, value: PackageSelection[K]) =>
    setSelection((current) => ({ ...current, [key]: value }))

  function build() {
    window.clearInterval(timer.current)
    let step = 0
    setBuilt(contents)
    setTick(0)
    timer.current = window.setInterval(() => {
      step += 1
      setTick(step)
      if (step >= totalSteps) window.clearInterval(timer.current)
    }, stepMs)
  }

  function download() {
    showToast({
      message: copy.downloadStarted(contents.fileName),
      detail: copy.savedToProject,
    })
    addDocument(project.id, {
      kind: 'package',
      title: contents.fileName,
      format: 'ZIP',
      size: contents.size,
    })
  }

  const progressOf = (index: number) =>
    Math.round(Math.min(1, Math.max(0, (tick - index * stepsPerPart) / stepsPerPart)) * 100)

  const option = (
    key: Toggle,
    label: string,
    hint?: string,
    format?: { key: 'cadFormat' | 'bimFormat'; formats: typeof cadFormats },
  ) => (
    <li key={key} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5">
      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={selection[key]}
          onChange={(e) => set(key, e.target.checked)}
          className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-primary"
        />
        <span>
          <span className="block font-semibold text-navy-900">{label}</span>
          {hint && <span className="block text-sm text-text-muted">{hint}</span>}
        </span>
      </label>
      {format && (
        <div className={selection[key] ? '' : 'pointer-events-none opacity-50'}>
          <SelectField
            label={copy.format}
            value={selection[format.key]}
            options={formatOptions(format.formats)}
            onChange={(value: CadFormat) => set(format.key, value)}
          />
        </div>
      )}
    </li>
  )

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-2xl"
    >
      <div className="overflow-y-auto px-7 py-6">
        {phase === 'choose' && (
          <>
            <p className="text-text-muted">{copy.intro(contents.items.length)}</p>
            <p className="mt-5 mb-2 text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
              {copy.include}
            </p>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {option('tender', copy.options.tender, copy.options.tenderHint)}
              {option('datasheets', copy.options.datasheets)}
              {option('curves', copy.options.curves)}
              {option('cad', copy.options.cad, undefined, {
                key: 'cadFormat',
                formats: cadOnlyFormats,
              })}
              {option('bim', copy.options.bim, undefined, {
                key: 'bimFormat',
                formats: bimFormats,
              })}
              {option('documents', copy.options.documents, copy.options.documentsHint)}
              {contents.projectFiles > 0 &&
                option(
                  'projectFiles',
                  copy.options.projectFiles(contents.projectFiles),
                  copy.options.projectFilesHint,
                )}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold text-navy-900 tabular-nums" aria-live="polite">
                {contents.files > 0 ? copy.summary(contents.files, contents.size) : copy.nothing}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
                >
                  {copy.cancel}
                </button>
                <button
                  type="button"
                  onClick={build}
                  disabled={contents.files === 0}
                  className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:shadow-none"
                >
                  <FolderArchive className="size-[18px]" />
                  {copy.create}
                </button>
              </div>
            </div>
          </>
        )}

        {phase !== 'choose' && (
          <div className="animate-fade-in">
            <p className="flex items-center gap-2 font-semibold text-navy-900" aria-live="polite">
              {phase === 'building' ? (
                <LoaderCircle className="size-[18px] animate-spin text-primary" />
              ) : (
                <Check className="size-[18px] text-success" strokeWidth={2.5} />
              )}
              {phase === 'building' ? copy.building : copy.ready}
            </p>
            <ul className="mt-4 space-y-4">
              {parts.map((part, index) => {
                const progress = progressOf(index)
                return (
                  <li key={part.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                      <span className="truncate font-semibold text-navy-900">{part.label}</span>
                      <span className="shrink-0 text-text-muted tabular-nums">
                        {progress === 100
                          ? copy.partFiles(part.files, mb(part.mb))
                          : `${progress} %`}
                      </span>
                    </div>
                    <ProgressBar value={progress} label={part.label} />
                  </li>
                )
              })}
            </ul>

            {phase === 'ready' && (
              <div className="mt-6 flex animate-fade-in items-center gap-4 rounded-lg border border-success/40 bg-success-tint px-5 py-4">
                <FolderArchive className="size-8 shrink-0 text-success" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-success-strong">{copy.ready}</p>
                  <p className="truncate font-semibold text-navy-900">{contents.fileName}</p>
                  <p className="text-sm text-text-muted tabular-nums">
                    {copy.fileDetail(contents.files, contents.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={download}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <Download className="size-4" />
                  {copy.download}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
