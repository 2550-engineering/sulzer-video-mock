import { useMemo, useState, type ReactNode } from 'react'
import { defaultPersona, personas, type PersonaId } from '../config/demo'
import { AuthContext, type AuthState } from './AuthContext'

// Only the persona id is stored, so the user always reflects config/demo.ts.
const STORAGE_KEY = 'sz-demo-persona'

const isPersonaId = (value: string | null): value is PersonaId =>
  value !== null && Object.hasOwn(personas, value)

function readPersona() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isPersonaId(stored) ? stored : null
  } catch {
    return null
  }
}

function writePersona(persona: PersonaId | null) {
  try {
    if (persona) localStorage.setItem(STORAGE_KEY, persona)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable (private mode etc.) — keep the in-memory state only.
  }
}

/** Fake auth: signIn() logs a demo persona in instantly. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState(readPersona)

  const value = useMemo<AuthState>(
    () => ({
      user: persona ? personas[persona] : null,
      persona,
      signIn: (next = defaultPersona) => {
        writePersona(next)
        setPersona(next)
      },
      signOut: () => {
        writePersona(null)
        setPersona(null)
      },
    }),
    [persona],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
