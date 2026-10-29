import { FolderOpen, Info, Ruler } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ContextChip } from '../components/ContextChip'
import { LoadParametersDialog } from '../components/sizing/LoadParametersDialog'
import { OptionalParameters } from '../components/sizing/OptionalParameters'
import { RangeChart } from '../components/sizing/RangeChart'
import { SaveParametersDialog } from '../components/sizing/SaveParametersDialog'
import { SizeProductPanel, type SizeBy } from '../components/sizing/SizeProductPanel'
import { SizingParameterForm } from '../components/sizing/SizingParameterForm'
import { sizingDemo } from '../config/demo'
import { applications } from '../data/applications'
import { getLiquid } from '../data/liquids'
import { formCopy, parameterDefs } from '../data/sizingParameters'
import { sizingParametersPage as copy } from '../data/sizingPages'
import { useUrlParams } from '../hooks/useUrlParams'
import { getApplication, getModel, getProduct, productsForApplication } from '../lib/catalog'
import { areaKey } from '../lib/rangeChart'
import { sizableProductIds, temperatureRange } from '../lib/sizing'
import { configurationGroups, matchingConfigurations } from '../lib/sizingFilters'
import {
  allSizingParamIds,
  readSizingInput,
  sizingLinkIds,
  sizingParamEntries,
} from '../lib/sizingParams'
import {
  flowFromDisplay,
  flowToDisplay,
  formatInput,
  headFromDisplay,
  headToDisplay,
  isFlowUnit,
  isHeadUnit,
  type FlowUnit,
  type HeadUnit,
} from '../lib/units'
import { configurationsForProduct } from '../lib/variants'
import { useProjects } from '../projects/useProjects'
import { useToast } from '../toast/useToast'
import type { DutyPoint } from '../types'

/** Applications that at least one sizable product is suitable for. */
const sizableApplications = applications.filter(
  (app) =>
    app.parentId !== null &&
    app.children.length === 0 &&
    productsForApplication(app).some((p) => sizableProductIds.includes(p.id)),
)

const round2 = (value: number) => Math.round(value * 100) / 100

/**
 * Size Product: /sizing, steps 1 and 2. The dark "Size Product" panel and the
 * action row, then the dense "Select parameters" form beside a sticky range
 * chart. Every row is a URL param (see data/sizingParameters.ts); filter rows
 * count down the "Number of hits" and fade out sizes on the chart. "Start
 * sizing" opens /sizing/results with all of it. Entry points pass ?product,
 * ?product&model or ?application; "Open sizing" from a project also passes
 * ?project&sizing, which makes the results page offer "Update project".
 */
export function SizingPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const { projects } = useProjects()
  const [params, update] = useUrlParams()
  const [dialog, setDialog] = useState<{ kind: 'save' | 'load' | null; session: number }>({
    kind: null,
    session: 0,
  })
  const [fullWidth, setFullWidth] = useState(false)

  const model = getModel(params.get('model') ?? '')
  const applicationParam = params.get('application') ?? ''
  const application =
    applications.find((app) => app.slug === applicationParam) ?? getApplication(applicationParam)
  const requestedBy = params.get('by')
  const sizeBy: SizeBy =
    requestedBy === 'application' ||
    (requestedBy !== 'product' && application && !params.has('product'))
      ? 'application'
      : 'product'
  const selectedApplication =
    sizableApplications.find((app) => app.id === application?.id) ?? sizableApplications[0]
  const applicationProducts = productsForApplication(selectedApplication)
    .map((p) => p.id)
    .filter((id) => sizableProductIds.includes(id))
  const requestedProduct = params.get('product') ?? model?.productId ?? ''
  const productId =
    sizeBy === 'application'
      ? (applicationProducts.find((id) => id === requestedProduct) ?? applicationProducts[0])
      : sizableProductIds.includes(requestedProduct)
        ? requestedProduct
        : sizingDemo.productId
  const productName = getProduct(productId ?? '')?.name ?? ''

  // A model from "Size this model" provides the duty point until the user changes it.
  const input = readSizingInput(params)
  const duty: DutyPoint = {
    ...input.duty,
    flow: params.has('q') || !model ? input.duty.flow : model.flow,
    head: params.has('h') || !model ? input.duty.head : model.head,
    frequency: params.has('hz') || !model ? input.duty.frequency : model.frequency,
  }
  const qu = params.get('qu')
  const flowUnit: FlowUnit = isFlowUnit(qu) ? qu : 'm3h'
  const hu = params.get('hu')
  const headUnit: HeadUnit = isHeadUnit(hu) ? hu : 'm'
  const density = getLiquid(duty.liquid).density
  const range = temperatureRange(productId ?? sizingDemo.productId, duty.liquid)

  // Hits: configurations that match every selected parameter.
  const all = configurationsForProduct(productId ?? sizingDemo.productId)
  const groups = new Map(
    configurationGroups(all, input.selection, duty.temperature).map((group) => [group.id, group]),
  )
  const matching = matchingConfigurations(all, input.selection, duty.temperature)
  const activeKeys = new Set(matching.map((c) => areaKey(c.hydraulicId, c.poles)))

  const vsd = input.selection.vsd?.[0]
  const errors = {
    temp:
      duty.temperature < range.min || duty.temperature > range.max
        ? formCopy.temperatureError(range.min, range.max)
        : undefined,
    maxfreq:
      input.maxFrequency < 50 ||
      input.maxFrequency > 120 ||
      (input.maxFrequency > 100 && vsd === 'no')
        ? formCopy.maxFrequencyError
        : undefined,
  }
  const canStart = productId !== undefined && matching.length > 0 && !errors.temp && !errors.maxfreq

  const linked = projects
    .find((p) => p.id === params.get('project'))
    ?.sizings.find((s) => s.id === params.get('sizing'))

  function valueOf(id: string) {
    const def = parameterDefs.find((d) => d.id === id)
    const selected = input.selection[id]
    if (selected) return selected[0] ?? ''
    return params.get(id) ?? (def && def.kind === 'select' ? (def.default ?? '') : '')
  }

  function setDuty(patch: Partial<DutyPoint>) {
    update((next) => {
      if (patch.flow !== undefined) next.set('q', String(round2(patch.flow)))
      if (patch.head !== undefined) next.set('h', String(round2(patch.head)))
      if (patch.temperature !== undefined) next.set('temp', String(patch.temperature))
    })
  }

  /** The URL with the duty point and product written out, as stored and sent to the results. */
  function explicitParams() {
    const next = new URLSearchParams(params)
    next.set('product', productId ?? sizingDemo.productId)
    next.set('q', String(round2(duty.flow)))
    next.set('h', String(round2(duty.head)))
    next.set('temp', String(duty.temperature))
    if (duty.frequency === 60) next.set('hz', '60')
    next.delete('model')
    next.delete('by')
    return next
  }

  function start() {
    if (canStart) navigate(`/sizing/results?${explicitParams()}`)
  }

  function reset() {
    update((next) =>
      allSizingParamIds
        .filter((id) => id !== 'product' && !sizingLinkIds.includes(id))
        .forEach((id) => next.delete(id)),
    )
  }

  const openDialog = (kind: 'save' | 'load') => setDialog((d) => ({ kind, session: d.session + 1 }))
  const closeDialog = () => setDialog((d) => ({ ...d, kind: null }))

  const note =
    sizeBy === 'application' && !productId ? (
      <p className="flex items-center gap-2 text-accent-yellow">
        <Info className="size-4" />
        {copy.noSizableProduct}
      </p>
    ) : linked ? (
      <ContextChip icon={FolderOpen}>{copy.actions.updating(linked.name)}</ContextChip>
    ) : model && model.productId === productId ? (
      <ContextChip icon={Ruler}>
        {copy.forModel(`${model.name}, ${model.frequency} Hz`)}
      </ContextChip>
    ) : undefined

  const optional = (
    <OptionalParameters
      valueOf={(id) => params.get(id)}
      onChange={(id, value) => update((next) => next.set(id, value))}
      fullWidth={fullWidth}
      onFullWidth={setFullWidth}
    />
  )

  return (
    <>
      <title>{`${copy.title} | Sulzer`}</title>

      <SizeProductPanel
        breadcrumb={[...copy.breadcrumb, { label: copy.crumb }]}
        sizeBy={sizeBy}
        onSizeBy={(by) =>
          update((next) => {
            next.set('by', by)
            if (by === 'application') {
              next.set('application', selectedApplication.slug)
              next.delete('product')
            }
          })
        }
        productId={productId ?? sizingDemo.productId}
        productOptions={sizableProductIds.map((id) => ({
          value: id,
          label: getProduct(id)?.name ?? id,
        }))}
        onProduct={(id) =>
          update((next) => {
            next.set('product', id)
            next.delete('model')
          })
        }
        applicationId={selectedApplication.slug}
        applicationOptions={sizableApplications.map((app) => ({
          value: app.slug,
          label: app.name,
        }))}
        onApplication={(slug) => update((next) => next.set('application', slug))}
        note={note}
        onLoad={() => openDialog('load')}
        onSave={() => openDialog('save')}
        onReset={reset}
        onStart={start}
        startDisabled={!canStart}
      />

      <section className="bg-surface-muted">
        <div className="site-container grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,44rem)_minmax(0,1fr)]">
          <div className="rounded-lg border border-border bg-white px-5 py-5">
            <h2 className="mb-3 text-xl font-bold tracking-tight text-brand">
              {copy.parameters.title}
            </h2>
            <SizingParameterForm
              groups={groups}
              valueOf={valueOf}
              onSelect={(id, value) =>
                update((next) => (value ? next.set(id, value) : next.delete(id)))
              }
              onToggle={(id, value) =>
                update((next) => {
                  const values = next.getAll(id)
                  next.delete(id)
                  const updated = values.includes(value)
                    ? values.filter((v) => v !== value)
                    : [...values, value]
                  for (const v of updated) next.append(id, v)
                })
              }
              numbers={{
                temp: duty.temperature,
                q: Number(formatInput(flowToDisplay(duty.flow, flowUnit))),
                h: Number(formatInput(headToDisplay(duty.head, headUnit, density))),
                maxfreq: input.maxFrequency,
              }}
              units={{ qu: flowUnit, hu: headUnit }}
              onNumber={(id, value) => {
                if (id === 'q') setDuty({ flow: flowFromDisplay(value, flowUnit) })
                else if (id === 'h') setDuty({ head: headFromDisplay(value, headUnit, density) })
                else if (id === 'temp') setDuty({ temperature: value })
                else update((next) => next.set('maxfreq', String(value)))
              }}
              onUnit={(param, unit) => update((next) => next.set(param, unit))}
              errors={errors}
              readOnly={{
                mechanicalSeal:
                  input.selection.seal?.length === 1 && input.selection.seal[0] === 'DD'
                    ? 'Double'
                    : 'Single',
              }}
              hits={matching.length}
            />
            <p className="mt-3 text-[13px] text-text-muted">{formCopy.helper}</p>
            {!fullWidth && optional}
          </div>

          <div className="rounded-lg border border-border bg-white px-4 py-4 lg:sticky lg:top-[calc(var(--sz-header-height)+1rem)]">
            {productId && (
              <RangeChart
                productId={productId}
                productName={productName}
                frequency={duty.frequency}
                duty={duty}
                activeKeys={activeKeys}
                onPick={(point) => setDuty({ flow: point.flow, head: point.head })}
              />
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-sm">
              <p className="font-bold text-navy-900 tabular-nums" aria-live="polite">
                {copy.hits(matching.length)}
              </p>
              <p className="text-text-muted">{copy.chart.hint}</p>
            </div>
          </div>
        </div>
        {fullWidth && (
          <div className="site-container pb-10">
            <div className="rounded-lg border border-border bg-white px-5 py-1">{optional}</div>
          </div>
        )}
      </section>

      <SaveParametersDialog
        key={`save-${dialog.session}`}
        open={dialog.kind === 'save'}
        defaultName={copy.saveSet.defaultName(formatInput(duty.flow), formatInput(duty.head))}
        params={sizingParamEntries(explicitParams())}
        onClose={closeDialog}
      />
      <LoadParametersDialog
        key={`load-${dialog.session}`}
        open={dialog.kind === 'load'}
        onClose={closeDialog}
        onLoad={(name, entries, link) => {
          const next = new URLSearchParams(entries)
          if (link) {
            next.set('project', link.projectId)
            next.set('sizing', link.sizingId)
          }
          closeDialog()
          navigate(`/sizing?${next}`)
          showToast({ message: copy.actions.loaded(name) })
        }}
      />
    </>
  )
}
