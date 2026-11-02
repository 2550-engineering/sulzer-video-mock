import { createContext } from 'react'
import type { PersonaId } from '../config/demo'
import type { User } from '../types'

export type AuthState = {
  user: User | null
  /** Which persona is signed in, or null when signed out. */
  persona: PersonaId | null
  /** Signs in as `persona` (the end user by default). Also switches persona while signed in. */
  signIn: (persona?: PersonaId) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
