import { ArrowRight } from 'lucide-react'
import { SulzerLogo } from '../components/SulzerLogo'
import { demoUser } from '../config/demo'

// Temporary home route — replaced by the real home page in Phase 1.
export function HomePage() {
  return (
    <section className="bg-surface">
      <div className="site-container py-24">
        <SulzerLogo variant="blue" className="h-10" />
        <h1 className="mt-10 max-w-3xl text-5xl leading-tight font-bold tracking-tight text-brand">
          Welcome to mySulzer
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-brand">
          Your products, projects and service in one place, {demoUser.name.split(' ')[0]}.
        </p>
        <button
          type="button"
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Get started
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  )
}
