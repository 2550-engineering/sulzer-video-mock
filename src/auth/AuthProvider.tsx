import { useMemo, useState, type ReactNode } from 'react'
import { demoUser } from '../config/demo'
import { AuthContext, type AuthState } from './AuthContext'

// Only the signed-in flag is stored, so the user always reflects config/demo.ts.
const STORAGE_KEY = 'sz-demo-signed-in'

function readSignedIn() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function writeSignedIn(signedIn: boolean) {
  try {
    if (signedIn) localStorage.setItem(STORAGE_KEY, 'true')
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable (private mode etc.) — keep the in-memory state only.
  }
}

/** Fake auth: signIn() logs the demo user in instantly. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(readSignedIn)

  const value = useMemo<AuthState>(
    () => ({
      user: signedIn ? demoUser : null,
      signIn: () => {
        writeSignedIn(true)
        setSignedIn(true)
      },
      signOut: () => {
        writeSignedIn(false)
        setSignedIn(false)
      },
    }),
    [signedIn],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
