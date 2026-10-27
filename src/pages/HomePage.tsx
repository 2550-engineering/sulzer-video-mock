import { ArrowRight } from 'lucide-react'
import { SulzerLogo } from '../components/SulzerLogo'
import { demoUser } from '../config/demo'

// Temporary home route — replaced by the real home page in Phase 1.
export function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-8">
          <SulzerLogo variant="blue" className="h-7" />
        </div>
      </header>

      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-8 py-24">
          <SulzerLogo variant="white" className="h-10" />
          <h1 className="mt-10 max-w-3xl text-5xl leading-tight font-bold tracking-tight text-white">
            Welcome to mySulzer
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-text-on-dark">
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
    </div>
  )
}
