import { useContext } from 'react'
import { PersonalContext } from './PersonalContext'

export function usePersonal() {
  const personal = useContext(PersonalContext)
  if (!personal) throw new Error('usePersonal must be used inside <PersonalProvider>')
  return personal
}
