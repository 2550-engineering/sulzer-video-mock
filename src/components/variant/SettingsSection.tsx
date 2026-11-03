import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

type SettingsSectionProps = {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

/** A collapsible section of the curve settings column. */
export function SettingsSection({ title, defaultOpen = false, children }: SettingsSectionProps) {
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-t border-border">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-3.5 text-left font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          {title}
          <ChevronDown
            className={`size-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h4>
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-sz ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
