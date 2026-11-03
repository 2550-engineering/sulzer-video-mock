import { cadFormats } from '../../data/cad'
import { productPage } from '../../data/catalogPages'
import { useFileGeneration } from '../../hooks/useFileGeneration'
import { useUrlParams } from '../../hooks/useUrlParams'
import { cadFilesFor, cadPreviewFor } from '../../lib/catalog'
import { useToast } from '../../toast/useToast'
import type { Product, ProductModel } from '../../types'
import { SelectField } from '../SelectField'
import { TabHeading } from '../TabHeading'
import { BimPreview } from './BimPreview'
import { CadFormatCard } from './CadFormatCard'
import { FileGenerator } from './FileGenerator'
import { NumberedStep } from './NumberedStep'

const copy = productPage.bim

type BimTabProps = {
  product: Product
  models: ProductModel[]
}

/**
 * BIM tab: choose a model and a format, generate the file (2 s progress), then
 * download it. Model and format are in the URL (?model, ?format); ?model is
 * shared with the Models tab, so a model opened there is preselected here.
 */
export function BimTab({ product, models }: BimTabProps) {
  const [params, update] = useUrlParams()
  const showToast = useToast()

  const model = models.find((m) => m.id === params.get('model')) ?? models[0]
  const spec = cadFormats.find((f) => f.format === params.get('format')) ?? cadFormats[0]
  const file = cadFilesFor(product.id).find(
    (f) => f.modelId === model.id && f.format === spec.format,
  )
  const generation = useFileGeneration(`${model.id}:${spec.format}`)
  const preview = cadPreviewFor(product.id) ?? product.images[0]

  const info = [
    [copy.info.productNumber, model.productNumber],
    [copy.info.frequency, `${model.frequency} Hz`],
    [
      copy.info.connection,
      model.connection.suction
        ? `DN ${model.connection.suction} × DN ${model.connection.discharge}`
        : `DN ${model.connection.discharge}`,
    ],
    [copy.info.impeller, `${model.impeller} mm`],
    [copy.info.weight, `${model.weight} kg`],
    [copy.info.format, `${spec.label} · ${spec.version}`],
    ...(spec.lod ? [[copy.info.lod, spec.lod]] : []),
    ...(file ? [[copy.info.size, file.size]] : []),
  ]

  return (
    <>
      <TabHeading title={copy.title} />
      <p className="mt-3 max-w-2xl text-lg text-text-muted">{copy.intro}</p>

      <div className="mt-10 grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-9">
          <NumberedStep number={1} title={copy.chooseModel}>
            <div className="max-w-sm">
              <SelectField
                layout="stacked"
                label={copy.model}
                value={model.id}
                onChange={(id) => update((next) => next.set('model', id))}
                options={models.map((m) => ({
                  value: m.id,
                  label: copy.modelOption(m.name, m.frequency),
                }))}
              />
            </div>
          </NumberedStep>

          <NumberedStep number={2} title={copy.chooseFormat}>
            <div
              role="radiogroup"
              aria-label={copy.chooseFormat}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {cadFormats.map((f) => (
                <CadFormatCard
                  key={f.format}
                  spec={f}
                  selected={f.format === spec.format}
                  onSelect={() => update((next) => next.set('format', f.format))}
                />
              ))}
            </div>
          </NumberedStep>

          <NumberedStep number={3} title={copy.generateStep}>
            {file && (
              <FileGenerator
                generation={generation}
                copy={copy}
                fileName={file.fileName}
                detail={`${spec.label} · ${file.size}`}
                onDownload={() =>
                  showToast({
                    message: copy.downloadStarted(file.fileName),
                    detail: `${spec.label} · ${file.size}`,
                  })
                }
              />
            )}
          </NumberedStep>
        </div>

        <div className="lg:sticky lg:top-[calc(var(--sz-header-height)+65px+24px)]">
          <BimPreview image={preview} />
          <div className="mt-6 rounded-lg border border-border bg-white px-6 py-5">
            <h3 className="font-semibold text-navy-900">
              {copy.info.title}: <span className="text-primary">{model.name}</span>
            </h3>
            <dl className="mt-3 grid gap-x-8 text-[15px] sm:grid-cols-2">
              {info.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-border py-2">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-right font-semibold text-navy-900 tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
