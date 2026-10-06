import { useCallback, useState } from 'react'
import { mentionProjectFile, type ProjectFileMentionTarget } from './project-file-mention'
import { useProjectFileMentionAvailability } from './use-project-file-mention-availability'

// Shared action state for every mention entry point (card overlay, drag drop, open artifact
// header): resolves availability from the composer owner, tracks the in-flight inspection, and
// keeps repeated clicks from stacking requests.
export const useProjectFileMentionAction = (
  file: ProjectFileMentionTarget | undefined
): { available: boolean; pending: boolean; mention: () => Promise<void> } => {
  const availableInComposer = useProjectFileMentionAvailability(file?.projectId ?? '')
  const [pending, setPending] = useState(false)
  const available = Boolean(file) && availableInComposer
  const mention = useCallback(async (): Promise<void> => {
    if (!file || pending || !availableInComposer) return
    setPending(true)
    try {
      await mentionProjectFile(file)
    } finally {
      setPending(false)
    }
  }, [availableInComposer, file, pending])
  return { available, pending, mention }
}
