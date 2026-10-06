import { useCallback, useState } from 'react'
import { mentionProjectFile, type ProjectFileMentionTarget } from './project-file-mention'
import { useProjectFileMentionAvailability } from './use-project-file-mention-availability'

// Shared action state for every mention entry point (card overlay, drag drop, open artifact
// header): resolves availability from the composer owner, tracks the in-flight inspection, and
// keeps repeated clicks from stacking requests. Returns whether the mention was accepted so
// surfaces that navigate away (the open header) can close only on success.
export const useProjectFileMentionAction = (
  file: ProjectFileMentionTarget | undefined
): { available: boolean; pending: boolean; mention: () => Promise<boolean> } => {
  const availableInComposer = useProjectFileMentionAvailability(file?.projectId ?? '')
  const [pending, setPending] = useState(false)
  const available = Boolean(file) && availableInComposer
  const mention = useCallback(async (): Promise<boolean> => {
    if (!file || pending || !availableInComposer) return false
    setPending(true)
    try {
      return (await mentionProjectFile(file)) === 'mentioned'
    } finally {
      setPending(false)
    }
  }, [availableInComposer, file, pending])
  return { available, pending, mention }
}
