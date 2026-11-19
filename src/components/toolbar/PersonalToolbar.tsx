import {
  Bookmark,
  ChartSpline,
  ChevronsLeft,
  ChevronsRight,
  FolderClosed,
  GitCompareArrows,
  History,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useMatch } from 'react-router'
import { personalToolbar as copy } from '../../data/personal'
import { maxCompare } from '../../lib/personal'
import { usePersonal } from '../../personal/usePersonal'
import { useProjects } from '../../projects/useProjects'
import { Drawer } from '../Drawer'
import { CompareFlyout } from './CompareFlyout'
import { ProjectsFlyout } from './ProjectsFlyout'
import { RecentFlyout } from './RecentFlyout'
import { SavedFlyout } from './SavedFlyout'
import { SizingFlyout } from './SizingFlyout'
import { ToolbarButton } from './ToolbarButton'
import { UnitsFlyout } from './UnitsFlyout'

type ToolId = 'compare' | 'saved' | 'sizing' | 'projects' | 'recent' | 'units'

type Tool = {
  id: ToolId
  icon: LucideIcon
  count?: number
  caption?: string[]
  subtitle: string
  panel: ReactNode
}

/**
 * Slim toolbar stuck to the right edge of product, application and search
 * pages (signed in; SiteLayout decides where). Each button opens a small
 * Drawer: Compare, Saved items, Sizing, My projects, Recently viewed, Units &
 * market. Hidden below 1024 px.
 *
 * `collapsible` (the Replacement Guide): starts slid out past the right edge, with only a
 * small tab showing; the tab slides it in, and its own last button slides it out again.
 */
export function PersonalToolbar({ collapsible = false }: { collapsible?: boolean }) {
  const [open, setOpen] = useState<ToolId | null>(null)
  const [expanded, setExpanded] = useState(!collapsible)
  const hidden = collapsible && !expanded
  const [shown, setShown] = useState<ToolId>('compare')
  const personal = usePersonal()
  const { projects } = useProjects()
  const productId = useMatch('/products/:id')?.params.id
  const close = () => setOpen(null)

  const tools: Tool[] = [
    {
      id: 'compare',
      icon: GitCompareArrows,
      count: personal.compareIds.length,
      subtitle: copy.compare.subtitle(personal.compareIds.length, maxCompare),
      panel: <CompareFlyout onNavigate={close} />,
    },
    {
      id: 'saved',
      icon: Bookmark,
      subtitle: copy.saved.subtitle(personal.saved.length),
      panel: <SavedFlyout onNavigate={close} />,
    },
    {
      id: 'sizing',
      icon: ChartSpline,
      subtitle: copy.sizing.subtitle,
      panel: <SizingFlyout productId={productId} onNavigate={close} />,
    },
    {
      id: 'projects',
      icon: FolderClosed,
      subtitle: copy.projects.subtitle(projects.length),
      panel: <ProjectsFlyout onNavigate={close} />,
    },
    {
      id: 'recent',
      icon: History,
      subtitle: copy.recent.subtitle,
      panel: <RecentFlyout onNavigate={close} />,
    },
    {
      id: 'units',
      icon: Settings,
      caption: copy.units.caption(personal.preferences.frequency),
      subtitle: copy.units.subtitle,
      panel: <UnitsFlyout />,
    },
  ]
  // The last panel stays in the drawer while it slides out.
  const current = tools.find((tool) => tool.id === shown)!

  function hide() {
    setOpen(null)
    setExpanded(false)
  }

  return (
    <>
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={copy.show}
          aria-expanded={expanded}
          inert={expanded}
          className={`group fixed top-[calc(var(--sz-header-height)+5.5rem)] right-0 z-[45] flex h-14 w-7 items-center justify-center rounded-l-lg bg-white text-primary shadow-card ring-1 ring-navy-900/10 transition-[translate,background-color] duration-200 ease-sz hover:bg-primary-tint max-lg:hidden ${
            expanded ? 'translate-x-[calc(100%+1rem)]' : ''
          }`}
        >
          <ChevronsLeft aria-hidden className="size-[18px]" strokeWidth={1.75} />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-[calc(100%+12px)] translate-x-1 -translate-y-1/2 rounded-md bg-navy-900 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-card transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            {copy.label}
          </span>
        </button>
      )}

      <nav
        aria-label={copy.label}
        inert={hidden}
        className={
          collapsible
            ? // No fade-in here: its translate would show the toolbar for a moment on load.
              `fixed top-[calc(var(--sz-header-height)+5.5rem)] right-0 z-[45] flex flex-col divide-y divide-border overflow-visible rounded-l-lg bg-white shadow-card ring-1 ring-navy-900/10 transition-[translate] duration-200 ease-sz max-xl:hidden max-lg:hidden ${
                hidden ? 'translate-x-[calc(100%+1rem)]' : ''
              }`
            : 'fixed top-[calc(var(--sz-header-height)+5.5rem)] right-0 z-[45] flex animate-fade-in flex-col divide-y divide-border overflow-visible rounded-l-lg bg-white shadow-card ring-1 ring-navy-900/10 max-xl:hidden max-lg:hidden'
        }
      >
        {tools.map((tool) => (
          <ToolbarButton
            key={tool.id}
            label={copy[tool.id].label}
            icon={tool.icon}
            count={tool.count}
            caption={tool.caption}
            active={open === tool.id}
            onClick={() => {
              setShown(tool.id)
              setOpen((id) => (id === tool.id ? null : tool.id))
            }}
          />
        ))}
        {collapsible && (
          <ToolbarButton label={copy.hide} icon={ChevronsRight} active={false} onClick={hide} />
        )}
      </nav>

      <Drawer
        open={open !== null}
        size="sm"
        title={copy[current.id].title}
        subtitle={current.subtitle}
        closeLabel={copy.close}
        onClose={close}
      >
        {current.panel}
      </Drawer>
    </>
  )
}
