import { useContext } from 'react'
import { ConnectContext } from './ConnectContext'

export function useConnect() {
  const connect = useContext(ConnectContext)
  if (!connect) throw new Error('useConnect must be used inside <ConnectProvider>')
  return connect
}
