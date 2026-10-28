import { Gauge } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ContextChip } from '../components/ContextChip'
import { FeatureComingSoon } from '../components/FeatureComingSoon'
import { comingSoon } from '../data/catalogPages'
import { assetsCard, signedOutRedirect } from '../data/myPages'

const parents = [
  { label: 'mySulzer', to: '/my-sulzer' },
  { label: 'My Pages', to: '/my-pages' },
]

/** My assets: /assets. Signed-in only. Not built yet. */
export function AssetsPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  return (
    <FeatureComingSoon
      content={comingSoon.assets}
      parents={parents}
      back={{ label: 'Back to My Pages', to: '/my-pages' }}
    >
      <ContextChip icon={Gauge}>{assetsCard.source}</ContextChip>
    </FeatureComingSoon>
  )
}
