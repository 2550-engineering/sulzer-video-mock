import { createContext } from 'react'
import type { PersonaId, User } from '../types'

export type AuthState = {
  user: User | null
  /** The persona signed in, or last signed in. */
  persona: PersonaId
  /** Signs in as a persona; the end user by default. */
  signIn: (persona?: PersonaId) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
