import {
  Bookmark,
  ChartSpline,
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
 */
export function PersonalToolbar() {
  const [open, setOpen] = useState<ToolId | null>(null)
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

  return (
    <>
      <nav
        aria-label={copy.label}
        className="fixed top-[calc(var(--sz-header-height)+5.5rem)] right-0 z-[45] flex animate-fade-in flex-col divide-y divide-border overflow-visible rounded-l-lg bg-white shadow-card ring-1 ring-navy-900/10 max-xl:hidden max-lg:hidden"
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
