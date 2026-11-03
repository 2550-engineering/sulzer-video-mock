import { ArrowRight, FileText, FolderPlus, Headset, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ApplicationPanelHero } from '../components/application/ApplicationPanelHero'
import { AddToProjectDialog } from '../components/projects/AddToProjectDialog'
import { EnergySavings } from '../components/replacement/EnergySavings'
import { ExistingPumpCard } from '../components/replacement/ExistingPumpCard'
import { ReplacementCurve } from '../components/replacement/ReplacementCurve'
import { ReplacementOptionCard } from '../components/replacement/ReplacementOptionCard'
import { ReplacementSearch } from '../components/replacement/ReplacementSearch'
import { TenderTextDialog } from '../components/tender/TenderTextDialog'
import { replacementPage as copy } from '../data/replacement'
import {
  existingCurve,
  existingFromInput,
  optionCurve,
  readReplacementInput,
  replacementOptions,
  replacementQuery,
  sizingLink,
  type ReplacementInput,
} from '../lib/replacement'
import { variantTenderText } from '../lib/tenderText'
import { useToast } from '../toast/useToast'

const outlined =
  'inline-flex h-11 items-center gap-2 rounded-pill border border-primary px-5 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-tint'

/**
 * /products/replacement: start from a serial number, a Sulzer type or another
 * brand (all in the URL, so the asset page links straight to a result). Shows the
 * pump today, up to two suggestions (drop-in first), a curve comparison and the
 * energy saving, with Size this pump, Add to project, Request quotation and Tender text.
 */
export function ReplacementPage() {
  const { user, signIn } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const query = params.toString()
  const input = readReplacementInput(params)

  const { existing, notFound, options } = useMemo(() => {
    const found = existingFromInput(readReplacementInput(new URLSearchParams(query)))
    const pump = found && 'existing' in found ? found.existing : undefined
    return {
      existing: pump,
      notFound: found && 'notFound' in found ? found.notFound : undefined,
      options: pump ? replacementOptions(pump) : [],
    }
  }, [query])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = options.find((o) => o.result.variant.id === selectedId) ?? options[0]
  const [dialog, setDialog] = useState<'project' | 'tender' | null>(null)
  const [projectKey, setProjectKey] = useState(0)

  // After "Find replacement", bring the result into view once it has rendered.
  const resultsRef = useRef<HTMLElement>(null)
  const scrollPending = useRef(false)
  useEffect(() => {
    if (!scrollPending.current) return
    scrollPending.current = false
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [query])

  function submit(next: ReplacementInput) {
    setSelectedId(null)
    scrollPending.current = true
    navigate({ search: replacementQuery(next) })
  }

  function requestQuotation(name: string) {
    if (!user) signIn()
    showToast({
      message: copy.actions.quoteSent,
      detail: copy.actions.quoteDetail(name),
      action: { label: copy.actions.viewQuotations, to: copy.quotationsPath },
    })
  }

  const duty = existing?.operation?.duty
  const today = existing && existingCurve(existing)

  return (
    <>
      <title>{`${copy.breadcrumbLabel} | Sulzer`}</title>

      <ApplicationPanelHero
        image={copy.hero}
        breadcrumb={[...copy.breadcrumb, { label: copy.breadcrumbLabel }]}
        title={copy.title}
        text={copy.text}
        panelSide="left"
        size="lg"
      />

      <section className="relative z-10 site-container -mt-14">
        <div className="rounded-lg border border-border bg-white shadow-raised">
          <div className="px-10 pt-8 pb-7">
            <h2 className="text-2xl font-bold tracking-tight text-brand">{copy.search.title}</h2>
            <div className="mt-5">
              <ReplacementSearch key={query} input={input} notFound={notFound} onSubmit={submit} />
            </div>
          </div>
          <ul className="grid gap-5 border-t border-border px-10 py-5 sm:grid-cols-3">
            {copy.benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{title}</span>
                  <span className="block text-sm text-text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {existing ? (
        <section
          ref={resultsRef}
          key={query}
          className="site-container animate-fade-in scroll-mt-24 pt-14 pb-20"
        >
          <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <ExistingPumpCard existing={existing} />

            {selected && duty && existing.productId ? (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold tracking-tight text-navy-900">
                  {options.length > 1 ? copy.options.titleMany : copy.options.title}
                </h2>
                <div role="radiogroup" aria-label={copy.options.title} className="mt-3 space-y-3">
                  {options.map((option) => (
                    <ReplacementOptionCard
                      key={option.result.variant.id}
                      option={option}
                      selected={option === selected}
                      signedIn={user !== null}
                      onSelect={() => setSelectedId(option.result.variant.id)}
                    />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-3 pt-5">
                  <Link
                    to={sizingLink(existing.productId, duty)}
                    className="group inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                  >
                    {copy.actions.size}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectKey((key) => key + 1)
                      setDialog('project')
                    }}
                    className={outlined}
                  >
                    <FolderPlus className="size-4" />
                    {copy.actions.addToProject}
                  </button>
                  <button
                    type="button"
                    onClick={() => requestQuotation(selected.result.variant.name)}
                    className={outlined}
                  >
                    <Send className="size-4" />
                    {copy.actions.quote}
                  </button>
                  <button type="button" onClick={() => setDialog('tender')} className={outlined}>
                    <FileText className="size-4" />
                    {copy.actions.tenderText}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-center rounded-lg border border-border bg-surface-muted px-8 py-10">
                <Headset aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
                <h2 className="mt-4 text-xl font-bold tracking-tight text-navy-900">
                  {copy.expert.title}
                </h2>
                <p className="mt-2 max-w-lg text-text-muted">{copy.expert.text(existing.name)}</p>
                <button
                  type="button"
                  onClick={() => requestQuotation(existing.name)}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
                >
                  <Send className="size-4" />
                  {copy.actions.quote}
                </button>
              </div>
            )}
          </div>

          {selected && duty && (
            <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <ReplacementCurve today={today} suggested={optionCurve(selected)} duty={duty} />
              <EnergySavings option={selected} />
            </div>
          )}

          {selected && duty && (
            <>
              <AddToProjectDialog
                key={projectKey}
                open={dialog === 'project'}
                results={[selected.result]}
                duty={duty}
                onClose={() => setDialog(null)}
              />
              <TenderTextDialog
                open={dialog === 'tender'}
                document={variantTenderText(selected.result.variant, duty)}
                onClose={() => setDialog(null)}
              />
            </>
          )}
        </section>
      ) : (
        <div className="pb-20" />
      )}
    </>
  )
}
