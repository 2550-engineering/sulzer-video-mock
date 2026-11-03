import { FileDown, FolderPlus, Printer, ScrollText } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { tenderDialog } from '../../data/tenderTexts'
import { variantPage } from '../../data/variantPages'
import { tenderFileName, useTenderDialog } from '../../hooks/useTenderDialog'
import { articleDutyPoint } from '../../lib/articles'
import { articleSubject } from '../../lib/tenderSubjects'
import { useToast } from '../../toast/useToast'
import type { ResultArticle } from '../../types'
import { AddToProjectDialog } from '../projects/AddToProjectDialog'
import { ExportMenu } from './ExportMenu'

const copy = variantPage.actions

const button =
  'flex h-12 w-full items-center justify-center gap-2 rounded-pill px-6 font-semibold transition-colors'
const outlined = `${button} border-2 border-primary text-primary hover:bg-primary-tint`

/** File name for exports: the model code without spaces and symbols. */
const fileName = (article: ResultArticle, extension: string) =>
  `${article.code.replace(/[^A-Za-z0-9.]+/g, '_').replace(/_+$/, '')}.${extension}`

/**
 * Right column actions: Print / PDF (print view), Add to project (signed in),
 * Tender text, Download documentation, Export as.
 */
export function VariantActions({ article }: { article: ResultArticle }) {
  const { user } = useAuth()
  const showToast = useToast()
  const { openTender, tenderDialog: tenderDialogElement } = useTenderDialog()
  const [projectDialog, setProjectDialog] = useState({ open: false, session: 0 })
  return (
    <div className="flex flex-col gap-3">
      <Link
        to={`${article.to}/print`}
        className={`${button} bg-primary text-white shadow-raised hover:bg-primary-hover`}
      >
        <Printer className="size-[18px]" strokeWidth={2} />
        {copy.print}
      </Link>
      {user && (
        <button
          type="button"
          onClick={() => setProjectDialog((d) => ({ open: true, session: d.session + 1 }))}
          className={outlined}
        >
          <FolderPlus className="size-[18px]" strokeWidth={2} />
          {variantPage.toolbar.addToProject}
        </button>
      )}
      <button
        type="button"
        onClick={() =>
          openTender({
            label: article.code,
            documentTitle: tenderDialog.documentTitle(article.code),
            subjects: [articleSubject(article)],
            fileName: tenderFileName(article.code),
          })
        }
        className={outlined}
      >
        <ScrollText className="size-[18px]" strokeWidth={2} />
        {tenderDialog.open}
      </button>
      <button
        type="button"
        onClick={() =>
          showToast({
            message: variantPage.toasts.documentation,
            detail: variantPage.toasts.documentationDetail(article.code),
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
          showToast({
            message: variantPage.toasts.exported(format.label),
            detail: fileName(article, id),
          })
        }}
      />
      {tenderDialogElement}
      <AddToProjectDialog
        key={`project-${projectDialog.session}`}
        open={projectDialog.open}
        entries={[{ variantId: article.id, dutyPoint: articleDutyPoint(article) }]}
        onClose={() => setProjectDialog((d) => ({ ...d, open: false }))}
      />
    </div>
  )
}
