import { Send } from 'lucide-react'
import { useState } from 'react'
import { myProjectsPage } from '../../data/projectPages'
import type { MemberInvite } from '../../projects/ProjectsContext'
import { Modal } from '../Modal'
import { TextField } from '../TextField'

const copy = myProjectsPage.members.dialog

type InviteMemberDialogProps = {
  open: boolean
  projectName: string
  onInvite: (invite: MemberInvite) => void
  onClose: () => void
}

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

/** "Invite member": email, role (Editor or Viewer) and an optional message. Remount (via `key`) per opening. */
export function InviteMemberDialog({
  open,
  projectName,
  onInvite,
  onClose,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('')
  const [access, setAccess] = useState<MemberInvite['access']>('editor')
  const [message, setMessage] = useState('')
  const [tried, setTried] = useState(false)
  const error = tried && !validEmail(email) ? copy.emailError : undefined

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-lg"
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTried(true)
          if (validEmail(email)) onInvite({ email: email.trim(), access, message: message.trim() })
        }}
        className="space-y-5 px-7 py-6"
      >
        <p className="-mt-1 text-sm text-text-muted">{projectName}</p>
        <TextField
          label={copy.email}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={copy.emailPlaceholder}
          error={error}
          autoFocus
        />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy-900">{copy.role}</legend>
          <div className="space-y-2">
            {(['editor', 'viewer'] as const).map((role) => (
              <label
                key={role}
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-3.5 py-2.5 text-sm transition-colors ${
                  access === role
                    ? 'border-primary bg-primary-tint'
                    : 'border-border hover:border-primary-border'
                }`}
              >
                <input
                  type="radio"
                  name="invite-role"
                  checked={access === role}
                  onChange={() => setAccess(role)}
                  className="mt-0.5 size-4 accent-primary"
                />
                <span className="text-navy-900">{copy.roles[role]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <TextField
          label={copy.message}
          value={message}
          onChange={setMessage}
          placeholder={copy.messagePlaceholder}
          rows={3}
        />
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill border border-border-strong px-5 font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-primary px-6 font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            <Send className="size-4" />
            {copy.send}
          </button>
        </div>
      </form>
    </Modal>
  )
}
