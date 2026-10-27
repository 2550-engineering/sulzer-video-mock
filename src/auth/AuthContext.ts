import { createContext } from 'react'
import type { User } from '../types'

export type AuthState = {
  user: User | null
  signIn: () => void
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
