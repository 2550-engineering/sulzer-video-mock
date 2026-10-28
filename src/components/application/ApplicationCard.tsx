import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { applicationPath } from '../../lib/catalog'
import type { Application } from '../../types'
import { SmartImage } from '../SmartImage'

/** Area page tile: 16:9 image, title and a round arrow button. The whole card links to the application. */
export function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link to={applicationPath(application)} className="group block">
      <div className="overflow-hidden rounded-md bg-navy-900">
        <SmartImage src={application.cardImage.src} alt="" aspect="16 / 9" />
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight text-brand transition-colors group-hover:text-primary">
        {application.name}
      </h3>
      <span
        aria-hidden
        className="mt-4 flex size-10 items-center justify-center rounded-full border-2 border-primary text-primary transition-transform duration-200 ease-sz group-hover:translate-x-1"
      >
        <ArrowRight className="size-[18px]" />
      </span>
    </Link>
  )
}
