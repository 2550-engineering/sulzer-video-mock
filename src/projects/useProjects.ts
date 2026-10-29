import { useContext } from 'react'
import { ProjectsContext } from './ProjectsContext'

export function useProjects() {
  const projects = useContext(ProjectsContext)
  if (!projects) throw new Error('useProjects must be used inside <ProjectsProvider>')
  return projects
}
