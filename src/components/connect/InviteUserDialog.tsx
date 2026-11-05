import { useId, useState, type FormEvent } from 'react'
import { connectTeams, usersPage } from '../../data/connect'
import { useToast } from '../../toast/useToast'
import { Modal } from '../Modal'

const copy = usersPage.invite

const field =
  'w-full rounded-md border border-border-strong bg-white px-3.5 text-[15px] text-text transition-[border-color,box-shadow] placeholder:text-text-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--sz-color-primary-tint-strong)] focus-visible:outline-none'

/** "Invite user" form in a dialog. Sending only shows a toast; nobody is invited. */
export function InviteUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ids = useId()
  const showToast = useToast()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>(usersPage.roles[1])
  const [team, setTeam] = useState(connectTeams[0].name)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    showToast({ message: copy.sent(email), detail: copy.sentDetail })
    setEmail('')
    onClose()
  }

  const label = (key: string, text: string) => (
    <label htmlFor={`${ids}-${key}`} className="mb-1.5 block text-sm font-semibold text-navy-900">
      {text}
    </label>
  )

  return (
    <Modal
      open={open}
      title={copy.title}
      closeLabel={copy.close}
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-7 py-6">
        <div>
          {label('email', copy.email)}
          <input
            id={`${ids}-email`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            className={`${field} h-11`}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {label('role', copy.role)}
            <select
              id={`${ids}-role`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`${field} h-11 cursor-pointer`}
            >
              {usersPage.roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            {label('team', copy.team)}
            <select
              id={`${ids}-team`}
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className={`${field} h-11 cursor-pointer`}
            >
              {connectTeams.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {label('message', copy.message)}
          <textarea id={`${ids}-message`} rows={3} className={`${field} resize-none py-2.5`} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-pill px-5 text-sm font-semibold text-navy-900 transition-colors hover:bg-surface-muted"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-pill bg-primary px-7 text-sm font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover"
          >
            {copy.send}
          </button>
        </div>
      </form>
    </Modal>
  )
}
