import { Download, FileCheck2, Sparkles } from 'lucide-react'
import type { useFileGeneration } from '../../hooks/useFileGeneration'
import { ProgressBar } from '../ProgressBar'

type FileGeneratorProps = {
  generation: ReturnType<typeof useFileGeneration>
  copy: {
    generate: string
    generating: (progress: number) => string
    ready: string
    download: string
  }
  fileName: string
  /** e.g. "Revit (RFA) · 4.6 MB". */
  detail: string
  onDownload: () => void
}

/**
 * "Generate file" button, then the 2 s progress bar, then the ready card with
 * the file and a Download button (BIM tab and the project Files drawer).
 */
export function FileGenerator({
  generation,
  copy,
  fileName,
  detail,
  onDownload,
}: FileGeneratorProps) {
  return (
    <div aria-live="polite">
      {generation.status === 'idle' && (
        <button
          type="button"
          onClick={generation.start}
          className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
        >
          <Sparkles className="size-[18px]" />
          {copy.generate}
        </button>
      )}

      {generation.status === 'generating' && (
        <div className="max-w-md animate-fade-in">
          <p className="mb-2 text-sm font-semibold text-navy-900 tabular-nums">
            {copy.generating(generation.progress)}
          </p>
          <ProgressBar value={generation.progress} />
        </div>
      )}

      {generation.status === 'ready' && (
        <div className="flex max-w-lg animate-fade-in items-center gap-4 rounded-lg border border-success/40 bg-success-tint px-5 py-4">
          <FileCheck2 className="size-8 shrink-0 text-success" strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-success-strong">{copy.ready}</p>
            <p className="truncate font-semibold text-navy-900">{fileName}</p>
            <p className="text-sm text-text-muted">{detail}</p>
          </div>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Download className="size-4" />
            {copy.download}
          </button>
        </div>
      )}
    </div>
  )
}
