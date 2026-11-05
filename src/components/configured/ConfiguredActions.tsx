import { FileDown, Printer, ScrollText } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { tenderDialog } from '../../data/tenderTexts'
import { variantPage } from '../../data/variantPages'
import { useToast } from '../../toast/useToast'
import { ExportMenu } from '../variant/ExportMenu'

const copy = variantPage.actions

const button =
  'flex h-12 w-full items-center justify-center gap-2 rounded-pill px-6 font-semibold transition-colors'
const outlined = `${button} border-2 border-primary text-primary hover:bg-primary-tint`

type ConfiguredActionsProps = {
  /** Full variant name, for file names and toasts. */
  name: string
  /** Opens the Tender text tab. */
  onTenderText: () => void
}

/**
 * Right column actions of a configured pump: Tender text (prominent), Print /
 * PDF (print view, keeping the project context), Download documentation and
 * Export as.
 */
export function ConfiguredActions({ name, onTenderText }: ConfiguredActionsProps) {
  const showToast = useToast()
  const { pathname, search } = useLocation()
  const fileName = (extension: string) =>
    `${name.replace(/[^A-Za-z0-9.-]+/g, '_').replace(/_+$/, '')}.${extension}`

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onTenderText}
        className={`${button} bg-primary text-white shadow-raised hover:bg-primary-hover`}
      >
        <ScrollText className="size-[18px]" strokeWidth={2} />
        {tenderDialog.open}
      </button>
      <Link to={`${pathname}/print${search}`} className={outlined}>
        <Printer className="size-[18px]" strokeWidth={2} />
        {copy.print}
      </Link>
      <button
        type="button"
        onClick={() =>
          showToast({
            message: variantPage.toasts.documentation,
            detail: variantPage.toasts.documentationDetail(name),
          })
        }
        className={outlined}
      >
        <FileDown className="size-[18px]" strokeWidth={2} />
        {copy.download}
      </button>
      <ExportMenu
        label={copy.exportAs}
        options={copy.formats}
        className={outlined}
        onSelect={(id) => {
          const format = copy.formats.find((f) => f.id === id)!
          showToast({ message: variantPage.toasts.exported(format.label), detail: fileName(id) })
        }}
      />
    </div>
  )
}
