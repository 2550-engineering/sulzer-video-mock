import { FileDown, Printer } from 'lucide-react'
import { Link } from 'react-router'
import { variantPage } from '../../data/variantPages'
import { useToast } from '../../toast/useToast'
import type { ResultArticle } from '../../types'
import { ExportMenu } from './ExportMenu'

const copy = variantPage.actions

const button =
  'flex h-12 w-full items-center justify-center gap-2 rounded-pill px-6 font-semibold transition-colors'
const outlined = `${button} border-2 border-primary text-primary hover:bg-primary-tint`

/** File name for exports: the model code without spaces and symbols. */
const fileName = (article: ResultArticle, extension: string) =>
  `${article.code.replace(/[^A-Za-z0-9.]+/g, '_').replace(/_+$/, '')}.${extension}`

/** Right column actions: Print / PDF (print view), Download documentation, Export as. */
export function VariantActions({ article }: { article: ResultArticle }) {
  const showToast = useToast()
  return (
    <div className="flex flex-col gap-3">
      <Link
        to={`${article.to}/print`}
        className={`${button} bg-primary text-white shadow-raised hover:bg-primary-hover`}
      >
        <Printer className="size-[18px]" strokeWidth={2} />
        {copy.print}
      </Link>
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
    </div>
  )
}
