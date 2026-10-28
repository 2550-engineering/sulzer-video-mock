import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Application, NavItem } from '../../types'
import type { BreadcrumbItem } from '../Breadcrumb'
import { PanelHero } from '../PanelHero'

type ApplicationHeroProps = {
  application: Application
  breadcrumb: BreadcrumbItem[]
  /** Primary button, e.g. "Size application". */
  action?: NavItem
}

/** Application image hero: breadcrumb, then title, intro and an optional primary button in a panel. */
export function ApplicationHero({ application, breadcrumb, action }: ApplicationHeroProps) {
  return (
    <PanelHero
      image={application.heroImage}
      breadcrumb={breadcrumb}
      title={application.name}
      text={application.intro}
      contentKey={application.id}
    >
      {action && (
        <Link
          to={action.to}
          className="group inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {action.label}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </PanelHero>
  )
}
