import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { handleApiError } from '@shared/api/handleApiError'

export interface SaveOptions<TPayload> {
  buildPayload: () => TPayload | null
  update: () => Promise<void>
  onSuccess?: () => void
}

export function useEditableSection<TPayload>() {
  const isEditing = ref(false)
  const isSubmitting = ref(false)
  const toast = useToast()

  function toggleEdit() {
    isEditing.value = !isEditing.value
  }

  async function save(opts: SaveOptions<TPayload>) {
    if (isSubmitting.value) return
    const payload = opts.buildPayload()
    if (!payload) return
    isSubmitting.value = true
    try {
      await opts.update()
      toast.success('Saved successfully!')
      isEditing.value = false
      opts.onSuccess?.()
    } catch (e) {
      console.error(e)
      toast.error(handleApiError(e))
    } finally {
      isSubmitting.value = false
    }
  }

  function runChecks(checks: Array<[boolean, string]>): boolean {
    const failed = checks.find(([ok]) => !ok)
    if (failed) {
      toast.error(failed[1])
      return false
    }
    return true
  }

  return { isEditing, isSubmitting, toggleEdit, save, runChecks }
}
