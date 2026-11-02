import { useContext } from 'react'
import { SelfServiceContext } from './SelfServiceContext'

export function useSelfService() {
  const selfService = useContext(SelfServiceContext)
  if (!selfService) throw new Error('useSelfService must be used inside <SelfServiceProvider>')
  return selfService
}
