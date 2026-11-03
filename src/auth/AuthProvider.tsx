import { useMemo, useState, type ReactNode } from 'react'
import { personas } from '../config/demo'
import type { PersonaId } from '../types'
import { AuthContext, type AuthState } from './AuthContext'

// Only the signed-in flag and the persona are stored, so the user always reflects config/demo.ts.
const SIGNED_IN_KEY = 'sz-demo-signed-in'
const PERSONA_KEY = 'sz-demo-persona'

const isPersona = (value: unknown): value is PersonaId =>
  typeof value === 'string' && value in personas

function read() {
  try {
    const persona = localStorage.getItem(PERSONA_KEY)
    return {
      signedIn: localStorage.getItem(SIGNED_IN_KEY) === 'true',
      persona: isPersona(persona) ? persona : ('endUser' as const),
    }
  } catch {
    return { signedIn: false, persona: 'endUser' as const }
  }
}

function write(signedIn: boolean, persona: PersonaId) {
  try {
    if (signedIn) localStorage.setItem(SIGNED_IN_KEY, 'true')
    else localStorage.removeItem(SIGNED_IN_KEY)
    localStorage.setItem(PERSONA_KEY, persona)
  } catch {
    // Storage unavailable (private mode etc.) — keep the in-memory state only.
  }
}

/** Fake auth: signIn(persona) logs that persona's demo user in instantly. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(read)

  const value = useMemo<AuthState>(
    () => ({
      user: state.signedIn ? personas[state.persona] : null,
      persona: state.persona,
      signIn: (persona = 'endUser') => {
        write(true, persona)
        setState({ signedIn: true, persona })
      },
      signOut: () => {
        write(false, state.persona)
        setState((current) => ({ ...current, signedIn: false }))
      },
    }),
    [state],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
