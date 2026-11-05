import {
  Check,
  Copy,
  FilePlus2,
  FolderArchive,
  ShoppingCart,
  FolderOpen,
  Pencil,
  Printer,
  ScrollText,
  Settings2,
  Share2,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { Breadcrumb } from '../components/Breadcrumb'
import { CustomerLogo } from '../components/CustomerLogo'
import { IconButton } from '../components/IconButton'
import { InviteMemberDialog } from '../components/projects/InviteMemberDialog'
import { ItemFilesDrawer } from '../components/projects/ItemFilesDrawer'
import { ProjectDetailsPanel, type PanelTab } from '../components/projects/ProjectDetailsPanel'
import { ProjectDiscussion, type DiscussionFilter } from '../components/projects/ProjectDiscussion'
import { ProjectDocuments } from '../components/projects/ProjectDocuments'
import { ProjectHeader } from '../components/projects/ProjectHeader'
import { ProjectItemsTable } from '../components/projects/ProjectItemsTable'
import { OrderProjectDialog } from '../components/projects/OrderProjectDialog'
import { ProjectList } from '../components/projects/ProjectList'
import { ProjectPackageDialog } from '../components/projects/ProjectPackageDialog'
import { ProjectSizings } from '../components/projects/ProjectSizings'
import { ProjectTabs } from '../components/projects/ProjectTabs'
import { ShareProjectDialog } from '../components/projects/ShareProjectDialog'
import { Switch } from '../components/Switch'
import { personas } from '../config/demo'
import { customers } from '../data/assets'
import { signedOutRedirect } from '../data/myPages'
import { memberFor } from '../data/projects'
import { myProjectsPage as copy } from '../data/projectPages'
import { quotationPath } from '../data/selfServicePages'
import { tenderDialog } from '../data/tenderTexts'
import { tenderFileName, useTenderDialog } from '../hooks/useTenderDialog'
import { articleById } from '../lib/articles'
import { getApplication } from '../lib/catalog'
import { projectDocumentRows } from '../lib/projectDocuments'
import { quotationFromProject } from '../lib/partner'
import { chosenItems, commentParts, isSharedWithClient } from '../lib/projects'
import { projectItemSubject } from '../lib/tenderSubjects'
import { getVariant } from '../lib/variants'
import { useProjects } from '../projects/useProjects'
import { useSelfService } from '../selfService/useSelfService'
import { useToast } from '../toast/useToast'
import type { ProjectItem, TenderSubject } from '../types'
import { NotFoundPage } from './NotFoundPage'

const outlined =
  'inline-flex h-10 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint'

const mainTabs = ['products', 'discussion', 'documents'] as const
type MainTab = (typeof mainTabs)[number]

/** A dialog that remounts on every opening, so it starts empty. */
const closed = { open: false, session: 0 }
const reopen = (d: typeof closed) => ({ open: true, session: d.session + 1 })

/**
 * My Projects: /my-projects (opens the most recently modified project) and
 * /my-projects/:projectId. Signed-in only. The project's information and
 * collaboration space: header with status and sharing, tabs Products,
 * Discussion and Documents (in the URL hash), and the details panel with
 * Members and Activity. ?added=<item ids> highlights rows that were just added
 * from sizing. A partner's project for a customer can be shared with the
 * customer's contact and turned into a quotation.
 */
export function MyProjectsPage() {
  const { user, persona } = useAuth()
  const { projectId } = useParams()
  const [searchParams] = useSearchParams()
  const { hash, pathname, search } = useLocation()
  const navigate = useNavigate()
  const projectsState = useProjects()
  const { projects, updateItem, duplicateSizing, deleteSizing } = projectsState
  const showToast = useToast()
  const { quotations, saveQuotation } = useSelfService()
  const [advanced, setAdvanced] = useState(false)
  const { openTender, tenderDialog: tenderDialogElement } = useTenderDialog()
  // Kept after closing, so the drawer doesn't empty while it slides out.
  const [files, setFiles] = useState<{ item: ProjectItem | null; open: boolean }>({
    item: null,
    open: false,
  })
  const [packageDialog, setPackageDialog] = useState(closed)
  const [inviteDialog, setInviteDialog] = useState(closed)
  const [shareDialog, setShareDialog] = useState(closed)
  const [orderDialog, setOrderDialog] = useState(closed)
  const [panelTab, setPanelTab] = useState<PanelTab>('details')
  const [editing, setEditing] = useState(false)
  const [discussionFilter, setDiscussionFilter] = useState<DiscussionFilter>('all')
  // Another project opened: leave edit mode and show all comments.
  const [shownProjectId, setShownProjectId] = useState(projectId)
  if (shownProjectId !== projectId) {
    setShownProjectId(projectId)
    setEditing(false)
    setDiscussionFilter('all')
  }

  if (!user) return <Navigate to={signedOutRedirect} replace />

  if (!projectId) {
    const latest = [...projects].sort((a, b) => b.modifiedOrder - a.modifiedOrder)[0]
    return latest ? <Navigate to={`/my-projects/${latest.id}`} replace /> : <NotFoundPage />
  }

  const project = projects.find((p) => p.id === projectId)
  if (!project) return <NotFoundPage />

  const meId = memberFor(personas[persona]).id
  const requestedTab = hash.slice(1)
  const tab: MainTab = mainTabs.find((t) => t === requestedTab) ?? 'products'
  const selectTab = (next: MainTab) => navigate({ pathname, search, hash: next }, { replace: true })

  const added = (searchParams.get('added') ?? '').split(',').filter(Boolean)
  const productCount = project.items.reduce((n, item) => n + item.quantity, 0)
  const toast = (message: string, detail?: string) => showToast({ message, detail })
  const commentCounts = Object.fromEntries(
    project.items.map((item) => [
      item.id,
      project.comments.filter((c) => {
        const root = c.parentId ? project.comments.find((p) => p.id === c.parentId) : c
        return root?.itemId === item.id
      }).length,
    ]),
  )
  const productName = (item: ProjectItem) =>
    getVariant(item.variantId)?.name ?? articleById(item.variantId)?.code ?? item.variantId

  // Tender texts: one product, or every chosen product in the project, numbered by position.
  const application = project.applicationId && getApplication(project.applicationId)?.name
  const subjectOf = (item: ProjectItem) => projectItemSubject(item, application || undefined)
  function itemTenderText(item: ProjectItem) {
    const subject = subjectOf(item)
    if (!subject) return
    const label = `${project!.name}, pos. ${item.position}`
    openTender({
      label,
      documentTitle: tenderDialog.documentTitle(subject.model),
      subtitle: `${project!.refNo} · ${project!.client.company}`,
      subjects: [subject],
      fileName: tenderFileName(`${project!.refNo}_pos_${item.position}`),
    })
  }
  function projectTenderTexts() {
    const subjects = chosenItems(project!.items)
      .map(subjectOf)
      .filter((subject): subject is TenderSubject => subject !== undefined)
    openTender({
      label: project!.name,
      documentTitle: tenderDialog.projectTitle(project!.name),
      subtitle: `${project!.refNo} · ${project!.client.company} · ${project!.client.site}`,
      subjects,
      fileName: tenderFileName(`${project!.refNo}_${project!.name}`),
    })
  }

  // The partner's project for a customer account: share it and quote it.
  const forCustomer = user.kind === 'partner'
  const shared = isSharedWithClient(project)
  const quotation = forCustomer ? quotationFromProject(project, quotations) : null

  function shareWithClient() {
    projectsState.inviteMember(project!.id, {
      email: project!.client.email,
      access: 'viewer',
      message: '',
    })
    toast(
      copy.toasts.shared(project!.client.contact),
      copy.toasts.sharedDetail(project!.client.company),
    )
  }

  function createQuotation() {
    if (!quotation) return
    saveQuotation(quotation)
    toast(copy.toasts.quotation(quotation.id), copy.toasts.quotationDetail(project!.client.company))
    navigate(quotationPath(quotation.id))
  }

  function editDetails() {
    setPanelTab('details')
    setEditing(true)
  }

  const noProducts = project.items.length === 0
  const icons = (
    <>
      <IconButton
        icon={Printer}
        label={copy.toolbar.print}
        onClick={() => navigate(`/my-projects/${project.id}/report`)}
      />
      <IconButton
        icon={FolderArchive}
        label={copy.toolbar.download}
        onClick={() => setPackageDialog(reopen)}
        disabled={noProducts}
        disabledHint={copy.toolbar.noProducts}
      />
      <IconButton
        icon={ScrollText}
        label={tenderDialog.openAll}
        onClick={projectTenderTexts}
        disabled={noProducts}
        disabledHint={copy.toolbar.noProducts}
      />
      <IconButton icon={Pencil} label={copy.toolbar.edit} onClick={editDetails} />
      <IconButton
        icon={Copy}
        label={copy.toolbar.copy}
        onClick={() => toast(copy.toasts.copy(project.name))}
      />
      <IconButton
        icon={Trash2}
        label={copy.toolbar.delete}
        onClick={() => toast(copy.toasts.delete)}
      />
    </>
  )

  return (
    <>
      <title>{`${project.name} – ${copy.title} | Sulzer`}</title>

      <section className="bg-surface-muted">
        <div className="site-container pt-5 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Breadcrumb items={[...copy.breadcrumb, { label: copy.title }]} />
            {/* Visual only for now. */}
            <Switch label={copy.advanced} checked={advanced} onChange={setAdvanced} />
          </div>

          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)_19rem]">
            <ProjectList projects={projects} currentId={project.id} />

            <div key={project.id} className="min-w-0 animate-fade-in">
              <ProjectHeader
                project={project}
                onRename={(name) => {
                  projectsState.updateProject(project.id, { name })
                  toast(copy.header.renamed(name))
                }}
                onStatus={(status) => {
                  projectsState.setStatus(project.id, status)
                  toast(copy.header.statusChanged(status))
                }}
                onShare={() => setShareDialog(reopen)}
                icons={icons}
                badge={
                  forCustomer &&
                  project.clientAccount && (
                    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold text-navy-900">
                        <span className="flex size-7 items-center justify-center rounded-full border border-border bg-white">
                          <CustomerLogo
                            customerId={project.clientAccount}
                            variant="mark"
                            className="h-4"
                          />
                        </span>
                        {copy.actions.forClient(project.client.company)}
                      </span>
                      {shared && (
                        <span className="inline-flex animate-fade-in items-center gap-1.5 rounded-pill bg-success-tint px-2.5 py-0.5 text-xs font-semibold text-success-strong">
                          <Check className="size-3.5" strokeWidth={2.5} />
                          {copy.actions.shared(project.client.contact)}
                        </span>
                      )}
                    </p>
                  )
                }
              >
                <Link
                  to={copy.actions.addProductTo}
                  className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <FolderOpen className="size-4" />
                  {copy.actions.addProduct}
                </Link>
                {forCustomer && quotation && (
                  <button
                    type="button"
                    onClick={createQuotation}
                    className="inline-flex h-10 items-center gap-2 rounded-pill bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    <FilePlus2 className="size-4" />
                    {copy.actions.quotation}
                  </button>
                )}
                {forCustomer && project.clientAccount && !shared && (
                  <button type="button" onClick={shareWithClient} className={outlined}>
                    <Share2 className="size-4" />
                    {copy.actions.share}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOrderDialog(reopen)}
                  disabled={noProducts}
                  className={`${outlined} disabled:cursor-not-allowed disabled:border-border-strong disabled:text-text-subtle disabled:hover:bg-transparent`}
                >
                  <ShoppingCart className="size-4" />
                  {copy.order.action}
                </button>
                <button
                  type="button"
                  onClick={() => setPackageDialog(reopen)}
                  disabled={noProducts}
                  className={`${outlined} disabled:cursor-not-allowed disabled:border-border-strong disabled:text-text-subtle disabled:hover:bg-transparent`}
                >
                  <FolderArchive className="size-4" />
                  {copy.actions.package}
                </button>
                <button
                  type="button"
                  onClick={() => toast(copy.toasts.margins)}
                  className={outlined}
                >
                  <Wallet className="size-4" />
                  {copy.actions.margins}
                </button>
                <button
                  type="button"
                  onClick={() => toast(copy.toasts.columns)}
                  className={outlined}
                >
                  <Settings2 className="size-4" />
                  {copy.actions.columns}
                </button>
              </ProjectHeader>

              <ProjectTabs
                idPrefix={`project-${project.id}`}
                active={tab}
                onSelect={selectTab}
                tabs={[
                  { id: 'products', label: copy.tabs.products, count: productCount },
                  {
                    id: 'discussion',
                    label: copy.tabs.discussion,
                    count: project.comments.length,
                  },
                  {
                    id: 'documents',
                    label: copy.tabs.documents,
                    count: projectDocumentRows(project).length,
                  },
                ]}
              />

              <div
                key={tab}
                id={`project-${project.id}-panel`}
                role="tabpanel"
                aria-labelledby={`project-${project.id}-${tab}-tab`}
                className="mt-6 animate-fade-in"
              >
                {tab === 'products' && (
                  <>
                    {project.sizings.length > 0 && (
                      <>
                        <h2 className="mb-3 text-lg font-bold tracking-tight text-navy-900">
                          {copy.sizings.title}{' '}
                          <span className="font-normal text-text-muted">
                            ({project.sizings.length})
                          </span>
                        </h2>
                        <ProjectSizings
                          project={project}
                          onDuplicate={(sizingId) => {
                            duplicateSizing(project.id, sizingId)
                            toast(
                              copy.sizings.duplicated(
                                project.sizings.find((s) => s.id === sizingId)!.name,
                              ),
                            )
                          }}
                          onDelete={(sizingId) => {
                            const name = project.sizings.find((s) => s.id === sizingId)!.name
                            deleteSizing(project.id, sizingId)
                            toast(copy.sizings.deleted(name))
                          }}
                        />
                      </>
                    )}

                    <h2
                      className={`${project.sizings.length > 0 ? 'mt-6' : ''} mb-3 text-lg font-bold tracking-tight text-navy-900`}
                    >
                      {copy.items.title}{' '}
                      <span className="font-normal text-text-muted">({productCount})</span>
                    </h2>
                    {project.items.length > 0 ? (
                      <ProjectItemsTable
                        projectId={project.id}
                        items={project.items}
                        highlightIds={added}
                        signedIn
                        sizings={project.sizings}
                        commentCounts={commentCounts}
                        onChange={(itemId, patch) => {
                          updateItem(project.id, itemId, patch)
                          const item = project.items.find((i) => i.id === itemId)
                          if (patch.status && item)
                            toast(copy.header.itemStatus(item.position, patch.status))
                        }}
                        onTenderText={itemTenderText}
                        onFiles={(item) => setFiles({ item, open: true })}
                        onComments={(item) => {
                          setDiscussionFilter(item.id)
                          selectTab('discussion')
                        }}
                        onChoose={(item) => {
                          projectsState.chooseAlternative(project.id, item.id)
                          toast(
                            copy.header.alternativeChosen(
                              item.alternative ?? '',
                              productName(item),
                            ),
                          )
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center rounded-lg border border-border bg-white px-8 py-14 text-center">
                        <FolderOpen
                          aria-hidden
                          className="size-10 text-text-subtle"
                          strokeWidth={1.5}
                        />
                        <p className="mt-4 text-lg font-semibold text-navy-900">
                          {copy.items.empty.title}
                        </p>
                        <p className="mt-1 max-w-md text-text-muted">{copy.items.empty.text}</p>
                        <div className="mt-6 flex gap-3">
                          <Link
                            to="/sizing"
                            className="inline-flex h-10 items-center rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                          >
                            {copy.items.empty.size}
                          </Link>
                          <Link to="/products" className={outlined}>
                            {copy.items.empty.find}
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tab === 'discussion' && (
                  <ProjectDiscussion
                    project={project}
                    meId={meId}
                    filter={discussionFilter}
                    onFilter={setDiscussionFilter}
                    onPost={(comment) => {
                      projectsState.addComment(project.id, comment)
                      const mentioned = commentParts(comment.text, project.members).flatMap(
                        (part) => ('mention' in part && part.mention ? [part.mention.name] : []),
                      )
                      toast(
                        copy.discussion.posted,
                        mentioned.length
                          ? copy.discussion.mentioned([...new Set(mentioned)].join(', '))
                          : undefined,
                      )
                    }}
                    onResolve={(commentId, resolved) =>
                      projectsState.setCommentResolved(project.id, commentId, resolved)
                    }
                  />
                )}

                {tab === 'documents' && <ProjectDocuments project={project} />}
              </div>
            </div>

            <ProjectDetailsPanel
              key={`panel-${project.id}`}
              project={project}
              meId={meId}
              tab={panelTab}
              onTab={(next) => {
                setPanelTab(next)
                setEditing(false)
              }}
              editing={editing}
              onEditing={setEditing}
              onSave={(patch) => {
                projectsState.updateProject(project.id, patch)
                setEditing(false)
                toast(copy.panel.saved)
              }}
              onInvite={() => setInviteDialog(reopen)}
              onAccess={(memberId, access) => {
                projectsState.setMemberAccess(project.id, memberId, access)
                const member = project.members.find((m) => m.id === memberId)
                if (member)
                  toast(copy.members.accessChanged(member.name, copy.members.access[access]))
              }}
              {...(forCustomer
                ? {
                    onClientAccount: (customerId: string) => {
                      const customer = customers.find((c) => c.id === customerId)
                      if (!customer) return
                      projectsState.updateProject(project.id, {
                        clientAccount: customerId,
                        client: {
                          ...project.client,
                          company: customer.name,
                          contact: customer.contact.name,
                          email: customer.contact.email,
                        },
                      })
                      toast(copy.toasts.client(customer.name))
                    },
                  }
                : {})}
            />
          </div>
        </div>
      </section>
      {tenderDialogElement}
      <ItemFilesDrawer
        open={files.open}
        project={project}
        item={files.item}
        onClose={() => setFiles((current) => ({ ...current, open: false }))}
      />
      <ProjectPackageDialog
        key={`package-${packageDialog.session}`}
        open={packageDialog.open}
        project={project}
        onClose={() => setPackageDialog((d) => ({ ...d, open: false }))}
      />
      <InviteMemberDialog
        key={`invite-${inviteDialog.session}`}
        open={inviteDialog.open}
        projectName={project.name}
        onClose={() => setInviteDialog((d) => ({ ...d, open: false }))}
        onInvite={(invite) => {
          projectsState.inviteMember(project.id, invite)
          setInviteDialog((d) => ({ ...d, open: false }))
          setPanelTab('members')
          toast(copy.members.dialog.sent(invite.email), invite.message || undefined)
        }}
      />
      <OrderProjectDialog
        key={`order-${orderDialog.session}`}
        open={orderDialog.open}
        project={project}
        onClose={() => setOrderDialog((d) => ({ ...d, open: false }))}
      />
      <ShareProjectDialog
        key={`share-${shareDialog.session}`}
        open={shareDialog.open}
        project={project}
        onClose={() => setShareDialog((d) => ({ ...d, open: false }))}
        onSave={(share) => {
          projectsState.setShare(project.id, share)
          setShareDialog((d) => ({ ...d, open: false }))
          toast(copy.share.saved)
        }}
      />
    </>
  )
}
