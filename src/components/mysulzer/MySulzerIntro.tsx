import { ArrowRight, Check, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { intro } from '../../data/mySulzer'
import { PortalPreview } from './PortalPreview'

const primaryButton =
  'inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-7 text-[15px] font-semibold text-white shadow-raised transition-colors hover:bg-primary-hover'

/** H1, benefits and the sign-in call to action. Switches to "Go to My Pages" when signed in. */
export function MySulzerIntro() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()

  function handleSignIn() {
    signIn()
    navigate(intro.myPagesPath)
  }

  return (
    <div className="grid items-center gap-20 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <h1 className="text-[3.25rem] leading-[1.08] font-bold tracking-tight text-balance text-brand">
          {intro.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">{intro.text}</p>

        <ul className="mt-8 grid max-w-xl grid-cols-2 gap-x-8 gap-y-3.5">
          {intro.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-3 text-[15px] font-medium text-navy-900"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {user ? (
            <Link to={intro.myPagesPath} className={`group ${primaryButton}`}>
              {intro.signedInLabel}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <button type="button" onClick={handleSignIn} className={primaryButton}>
                <LogIn className="size-[18px]" />
                {intro.signInLabel}
              </button>
              <a
                href="#create-account"
                onClick={(event) => {
                  event.preventDefault()
                  document
                    .getElementById('create-account')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="inline-flex h-12 items-center rounded-pill border border-border-strong px-7 text-[15px] font-semibold text-navy-900 transition-colors hover:border-primary hover:text-primary"
              >
                {intro.createAccountLabel}
              </a>
            </>
          )}
        </div>
        {user && (
          <p className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <span aria-hidden className="size-2 rounded-full bg-success" />
            {intro.signedInNote}
          </p>
        )}
      </div>

      <PortalPreview />
    </div>
  )
}
