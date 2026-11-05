import { ArrowLeft, CircleCheck, Printer } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ProjectStatusChip } from '../components/projects/ProjectStatusChip'
import { KeyFigures } from '../components/sizing/KeyFigures'
import { SizingCurveChart } from '../components/sizing/SizingCurveChart'
import { SulzerLogo } from '../components/SulzerLogo'
import { Switch } from '../components/Switch'
import { TenderDocumentView } from '../components/tender/TenderDocumentView'
import { signedOutRedirect } from '../data/myPages'
import { myProjectsPage } from '../data/projectPages'
import { tenderDialog } from '../data/tenderTexts'
import { articleById } from '../lib/articles'
import { getApplication } from '../lib/catalog'
import { groupThousands } from '../lib/format'
import { compareColors, formatPrice } from '../lib/modelSpecs'
import { chosenItems } from '../lib/projects'
import { evaluateVariant, resultSeries } from '../lib/sizing'
import { projectItemSubject } from '../lib/tenderSubjects'
import { tenderText } from '../lib/tenderText'
import { getVariant } from '../lib/variants'
import { useProjects } from '../projects/useProjects'
import { useToast } from '../toast/useToast'
import type { ProjectItem, SizingResult, TenderSubject } from '../types'
import { NotFoundPage } from './NotFoundPage'

const copy = myProjectsPage.report
const panel = myProjectsPage.panel

const sectionTitle =
  'border-b border-border pb-2 text-xs font-semibold tracking-[0.12em] text-primary uppercase'

/** A sized item at its duty point, as a ranked result for the chart and key figures. */
function sized(item: ProjectItem): SizingResult | undefined {
  const variant = getVariant(item.variantId)
  const result = variant && evaluateVariant(variant, item.dutyPoint)
  return result && { ...result, rank: 1 }
}

/**
 * Project report (/my-projects/:projectId/report): a clean A4 print view
 * without the site header and footer. Sulzer and the consultant firm, project
 * information and key requirements, every product with its alternatives, key
 * figures and curves, optionally the tender texts, and the members. "Print or
 * save as PDF" saves the report to the project documents and opens the
 * browser's print dialog.
 */
export function ProjectReportPage() {
  const { user } = useAuth()
  const { projectId } = useParams()
  const { projects, addDocument } = useProjects()
  const showToast = useToast()
  const [includeTender, setIncludeTender] = useState(true)

  if (!user) return <Navigate to={signedOutRedirect} replace />
  const project = projects.find((p) => p.id === projectId)
  if (!project) return <NotFoundPage />

  // Products in table order; alternatives of one comparison form one unit.
  const units = project.items.reduce<ProjectItem[][]>((list, item) => {
    const unit = item.alternativeGroup
      ? list.find((u) => u[0].alternativeGroup === item.alternativeGroup)
      : undefined
    if (unit) unit.push(item)
    else list.push([item])
    return list
  }, [])

  const application = project.applicationId && getApplication(project.applicationId)?.name
  const subjects = chosenItems(project.items)
    .map((item) => projectItemSubject(item, application || undefined))
    .filter((subject): subject is TenderSubject => subject !== undefined)
  const tender = tenderText(
    subjects,
    { language: 'en', detail: 'full', includeDuty: true, orEqual: true },
    tenderDialog.projectTitle(project.name),
    `${project.refNo} · ${project.client.company}`,
  )

  function print() {
    const title = copy.savedTitle(project!.name)
    addDocument(project!.id, { kind: 'report', title, format: 'PDF', size: '2.1 MB' })
    showToast({ message: myProjectsPage.toasts.document(title) })
    window.print()
  }

  const info: [string, string][] = [
    [panel.company, project.client.company],
    [panel.contact, project.client.contact],
    [panel.address, project.client.address ?? ''],
    [panel.site, project.client.site],
    [panel.email, project.client.email],
    [panel.consultantFirm, project.consultantFirm ?? ''],
    [panel.deadline, project.deadline ?? ''],
    [panel.budget, project.budget ? formatPrice(project.budget) : ''],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <div className="min-h-screen bg-surface-muted py-8 max-md:py-4 print:bg-white print:py-0">
      <title>{`${copy.title} – ${project.name} | Sulzer`}</title>

      <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-4 px-4 print:hidden">
        <Link
          to={`/my-projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {copy.back}
        </Link>
        <div className="flex items-center gap-6">
          <Switch label={copy.includeTender} checked={includeTender} onChange={setIncludeTender} />
          <button
            type="button"
            onClick={print}
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <Printer className="size-4" />
            {copy.print}
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[210mm] bg-white px-[14mm] py-[12mm] shadow-card max-md:px-4 max-md:py-6 print:shadow-none">
        <header className="flex items-end justify-between gap-6 border-b-2 border-navy-900 pb-4 max-md:flex-wrap max-md:gap-3">
          <SulzerLogo className="h-7" />
          <div className="text-right max-md:min-w-0">
            <p className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
              {copy.title}
            </p>
            {project.consultantFirm && (
              <p className="mt-0.5 text-sm font-semibold text-navy-900">
                {copy.preparedBy(project.consultantFirm)}
              </p>
            )}
          </div>
        </header>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-brand max-md:min-w-0 max-md:text-2xl">
              {project.name}
            </h1>
            <ProjectStatusChip status={project.status} />
          </div>
          <p className="mt-1 text-sm text-text-muted tabular-nums">
            {panel.refNo} {project.refNo} · {panel.projectId} {project.projectNumber} ·{' '}
            {panel.lastModified} {project.lastModified}
          </p>
        </div>

        <section className="mt-8 break-inside-avoid">
          <h2 className={sectionTitle}>{copy.information}</h2>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_68mm] gap-8 max-md:grid-cols-1 max-md:gap-6">
            <div>
              {project.description && (
                <p className="text-sm leading-relaxed text-text">{project.description}</p>
              )}
              {(project.requirements ?? []).length > 0 && (
                <>
                  <h3 className="mt-5 text-sm font-semibold text-navy-900">{panel.requirements}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-text">
                    {project.requirements!.map((requirement) => (
                      <li key={requirement} className="flex gap-2">
                        <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <dl className="divide-y divide-border text-sm">
              {info.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-1.5">
                  <dt className="shrink-0 text-text-muted">{label}</dt>
                  <dd className="text-right font-semibold text-navy-900 max-xl:min-w-0 max-xl:[overflow-wrap:anywhere]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mt-10">
          <h2 className={sectionTitle}>{copy.products}</h2>
          {units.map((unit) => {
            const results = unit.map(sized)
            const curves = results.filter((r): r is SizingResult => r !== undefined)
            const first = unit[0]
            const isGroup = unit.length > 1 || first.alternativeGroup !== undefined
            return (
              <div key={first.id} className="mt-6 break-inside-avoid">
                <h3 className="font-semibold text-navy-900">
                  {isGroup
                    ? copy.alternativesOf(first.customerPosition)
                    : copy.position(first.position, first.customerPosition)}
                  <span className="ml-2 text-sm font-normal text-text-muted tabular-nums">
                    {copy.dutyPoint(
                      groupThousands(first.dutyPoint.flow),
                      groupThousands(first.dutyPoint.head),
                    )}
                  </span>
                </h3>
                {curves.length > 0 && (
                  <div className="mt-3 max-w-[150mm]">
                    <SizingCurveChart
                      curves={curves.map((r) => resultSeries(r, first.dutyPoint.frequency))}
                      colors={compareColors}
                      duty={first.dutyPoint}
                    />
                  </div>
                )}
                <div
                  className={`mt-3 grid gap-5 max-md:grid-cols-1 ${unit.length > 1 ? 'grid-cols-2' : 'max-w-[100mm] grid-cols-1'}`}
                >
                  {unit.map((item, i) => {
                    const result = results[i]
                    const name =
                      getVariant(item.variantId)?.name ??
                      articleById(item.variantId)?.code ??
                      item.variantId
                    const number =
                      getVariant(item.variantId)?.productNumber ??
                      articleById(item.variantId)?.productNumber ??
                      null
                    return (
                      <div
                        key={item.id}
                        className={`rounded-md border p-4 ${
                          item.preferred ? 'border-success/50 bg-success-tint/40' : 'border-border'
                        }`}
                      >
                        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-900">
                          {unit.length > 1 && (
                            <span
                              aria-hidden
                              className="size-2.5 rounded-full"
                              style={{ background: compareColors[i % compareColors.length] }}
                            />
                          )}
                          {name}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted tabular-nums">
                          {[
                            item.alternative &&
                              `${myProjectsPage.items.alternative(item.alternative)}${
                                item.preferred ? ` · ${copy.chosen}` : ''
                              }`,
                            copy.position(item.position, item.customerPosition),
                            copy.productNumber(number),
                            copy.quantity(item.quantity),
                            item.status ?? 'Proposed',
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                        {result && (
                          <div className="mt-2">
                            <KeyFigures result={result} compact={unit.length > 1} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        {includeTender && subjects.length > 0 && (
          <section className="mt-10 break-before-page">
            <h2 className={sectionTitle}>{copy.tenderTexts}</h2>
            <div className="mt-4">
              <TenderDocumentView document={tender} />
            </div>
          </section>
        )}

        <section className="mt-10 break-inside-avoid">
          <h2 className={sectionTitle}>{copy.members}</h2>
          <table className="mt-3 w-full text-sm max-md:[overflow-wrap:anywhere]">
            <tbody className="divide-y divide-border">
              {project.members.map((member) => (
                <tr key={member.id}>
                  <td className="py-2 pr-4 font-semibold text-navy-900">{member.name}</td>
                  <td className="py-2 pr-4 text-text">
                    {[member.company, member.role].filter(Boolean).join(' · ') || member.email}
                  </td>
                  <td className="py-2 text-right text-text-muted">
                    {myProjectsPage.members.access[member.access]}
                    {member.status === 'invited' && ` · ${myProjectsPage.members.invited}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="mt-8 border-t border-border pt-3 text-[11px] text-text-subtle">
          {copy.footer}
        </footer>
      </article>
    </div>
  )
}
