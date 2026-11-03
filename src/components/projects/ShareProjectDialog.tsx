import { Copy, Link2 } from 'lucide-react'
import { useState } from 'react'
import { shareLinkBase } from '../../config/demo'
import { myProjectsPage } from '../../data/projectPages'
import { useToast } from '../../toast/useToast'
import type { Project, ProjectShare } from '../../types'
import { Avatar } from '../Avatar'
import { Modal } from '../Modal'
import { Switch } from '../Switch'

const copy = myProjectsPage.share

type ShareProjectDialogProps = {
  open: boolean
  project: Project
  onSave: (share: ProjectShare) => void
  onClose: () => void
}

const defaultShare: ProjectShare = { access: 'project', memberIds: [], clientReadOnly: false }

/**
 * Share: the project link with Copy, who can open it (everyone in the project
 * or specific members) and a read-only link for the client. Remount (via
 * `key`) per opening.
 */
export function ShareProjectDialog({ open, project, onSave, onClose }: ShareProjectDialogProps) {
  const showToast = useToast()
  const [share, setShare] = useState(project.share ?? defaultShare)
  const link = `${shareLinkBase}${project.projectNumber}`

  function copyLink() {
    navigator.clipboard?.writeText(link).catch(() => {})
    showToast({ message: copy.copied, detail: link })
  }

  const toggleMember = (id: string) =>
    setShare((current) => ({
      ...current,
      memberIds: current.memberIds.includes(id)
        ? current.memberIds.filter((m) => m !== id)
        : [...current.memberIds, id],
    }))

  const option = (access: ProjectShare['access'], label: string, hint: string) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
        share.access === access
          ? 'border-primary bg-primary-tint'
          : 'border-border hover:border-primary-border'
      }`}
    >
      <input
        type="radio"
        name="share-access"
        checked={share.access === access}
        onChange={() => setShare((current) => ({ ...current, access }))}
        className="mt-0.5 size-4 accent-primary"
      />
      <span>
        <span className="block font-semibold text-navy-900">{label}</span>
        <span className="block text-sm text-text-muted">{hint}</span>
      </span>
    </label>
  )

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-lg"
    >
      <div className="space-y-6 overflow-y-auto px-7 py-6">
        <div>
          <p className="mb-1.5 text-sm font-semibold text-navy-900">{copy.link}</p>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-border-strong bg-surface-subtle px-3">
              <Link2 aria-hidden className="size-4 shrink-0 text-text-muted" />
              <input
                readOnly
                value={link}
                aria-label={copy.link}
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 bg-transparent text-sm text-navy-900 focus-visible:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              <Copy className="size-4" />
              {copy.copy}
            </button>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-semibold text-navy-900">{copy.who}</legend>
          {option('project', copy.project, copy.projectHint(project.members.length))}
          {option('specific', copy.specific, copy.specificHint)}
          {share.access === 'specific' && (
            <ul className="ml-7 animate-fade-in divide-y divide-border rounded-md border border-border">
              {project.members.map((member) => (
                <li key={member.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={share.memberIds.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="size-4 accent-primary"
                    />
                    <Avatar initials={member.initials} />
                    <span className="text-sm font-semibold text-navy-900">{member.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <div className="rounded-md border border-border px-4 py-3">
          <Switch
            label={copy.client}
            checked={share.clientReadOnly}
            onChange={(clientReadOnly) => setShare((current) => ({ ...current, clientReadOnly }))}
          />
          <p className="mt-1 text-sm text-text-muted">
            {copy.clientHint(project.client.contact, project.client.email)}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={() => onSave(share)}
            className="inline-flex h-11 items-center rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.save}
          </button>
        </div>
      </div>
    </Modal>
  )
}
