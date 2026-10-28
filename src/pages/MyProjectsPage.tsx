import { FolderKanban } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { ContextChip } from '../components/ContextChip'
import { FeatureComingSoon } from '../components/FeatureComingSoon'
import { comingSoon } from '../data/catalogPages'
import { signedOutRedirect } from '../data/myPages'
import { projects } from '../data/projects'

const parents = [
  { label: 'mySulzer', to: '/my-sulzer' },
  { label: 'My Pages', to: '/my-pages' },
]

/** My projects: /my-projects. Signed-in only. Not built yet. */
export function MyProjectsPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to={signedOutRedirect} replace />

  return (
    <FeatureComingSoon
      content={comingSoon.myProjects}
      parents={parents}
      back={{ label: 'Back to My Pages', to: '/my-pages' }}
    >
      <ContextChip icon={FolderKanban}>
        <span className="font-semibold text-navy-900">{projects.length} projects</span>
        for {user.company}
      </ContextChip>
    </FeatureComingSoon>
  )
}
