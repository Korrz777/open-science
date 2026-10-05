import { useNavigationStore } from '@/stores/navigation-store'
import type { ProjectFileItem } from '../../../../shared/project-files'

export type ProjectFileMentionOutcome = 'mentioned' | 'unavailable' | 'version-unresolved'

// Resolves the exact head Version through the public inspection surface (same flow the Global
// Search mention uses) and hands the complete immutable reference to the composer owner. The
// request store no-ops for a different active project, so callers only need to gate on
// availability before offering the action.
export const mentionProjectFile = async (
  file: ProjectFileItem
): Promise<ProjectFileMentionOutcome> => {
  try {
    const response = await window.api.managedFileVersions.inspect({
      source: file.source,
      projectId: file.projectId,
      fileId: file.sourceFileId
    })
    if (!response.ok) return 'unavailable'
    const head =
      response.value.headVersion ??
      response.value.versions.find((item) => item.id === response.value.headVersionId)
    if (!head) return 'version-unresolved'
    useNavigationStore.getState().requestArtifactMention({
      ...file,
      sourceVersionId: head.id,
      checksum: head.checksum,
      sessionId: response.value.sessionId,
      name: response.value.displayName,
      mimeType: head.contentType ?? file.mimeType,
      size: head.sizeBytes,
      sortAtMs: Date.parse(head.createdAt)
    })
    return 'mentioned'
  } catch {
    return 'unavailable'
  }
}
