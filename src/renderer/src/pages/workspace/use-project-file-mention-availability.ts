import { useNavigationStore } from '@/stores/navigation-store'
import { useSessionStore } from '@/stores/session-store'

// Mirrors the Global Search mention gate: the composer must be mounted in the workspace for the
// same project, with an active session in that project, and the draft below its mention cap.
export const useProjectFileMentionAvailability = (projectId: string): boolean => {
  const view = useNavigationStore((state) => state.view)
  const activeProjectId = useNavigationStore((state) => state.activeProjectId)
  const availability = useNavigationStore((state) => state.artifactMentionAvailability)
  const sessionProjectId = useSessionStore(
    (state) => state.sessions.find((item) => item.id === state.selectedSessionId)?.projectId
  )
  return (
    view === 'workspace' &&
    activeProjectId === projectId &&
    sessionProjectId === projectId &&
    availability?.projectId === projectId &&
    availability.canMention
  )
}
