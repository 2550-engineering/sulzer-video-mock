import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { applicationPage as copy } from '../../data/catalogPages'
import { applicationPath, childApplications } from '../../lib/catalog'
import type { Application } from '../../types'
import { SmartImage } from '../SmartImage'

/**
 * Overview card for an application area: 16:9 image and "Name (count)" linking to
 * the area page, then its sub-applications as text links, capped with "Show all".
 */
export function ApplicationCategoryCard({ category }: { category: Application }) {
  const children = childApplications(category)
  const shown = children.slice(0, copy.overview.maxLinks)
  const to = applicationPath(category)

  return (
    <article>
      <Link to={to} className="group block">
        <div className="overflow-hidden rounded-md bg-navy-900">
          <SmartImage
            src={category.cardImage.src}
            alt=""
            aspect="16 / 9"
            className="transition-transform duration-200 ease-sz group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-brand decoration-2 underline-offset-4 group-hover:underline">
          {category.name} ({children.length})
        </h3>
      </Link>

      <ul className="mt-3 space-y-1.5">
        {shown.map((child) => (
          <li key={child.id}>
            <Link
              to={applicationPath(child)}
              className="text-[15px] text-text transition-colors hover:text-primary hover:underline"
            >
              {child.name}
            </Link>
          </li>
        ))}
      </ul>

      {children.length > shown.length && (
        <Link
          to={to}
          className="group mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          {copy.overview.showAllLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </article>
  )
}
