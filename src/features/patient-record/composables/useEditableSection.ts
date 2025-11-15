import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { handleApiError } from '@shared/api/handleApiError'
import { useSectionDraft, type UseSectionDraftReturn } from './useSectionDraft'
import { useRoute } from 'vue-router'

type DraftValue = any
export type DraftRecord = Record<string, DraftValue>

export interface SaveOptions<TPayload> {
  buildPayload: () => TPayload | null
  update: () => Promise<void>
  onSuccess?: () => void
}

export interface DiscardOptions {
  onDiscard: () => void
  onSuccess: () => void
}

export interface DraftFieldBinding {
  key: string
  read: () => DraftValue
  write: (value: DraftValue) => void
}

export function bindRef<T extends DraftValue>(key: string, refValue: Ref<T>): DraftFieldBinding {
  return {
    key,
    read: () => refValue.value,
    write: (value) => {
      refValue.value = value as T
    }
  }
}

export interface EditableSectionDraftOptions {
  key: Ref<string | null> | (() => string | null)
  fields?: DraftFieldBinding[]
  persistWhen?: Ref<boolean> | (() => boolean)
  debounceMs?: number
  autoRestore?: boolean
  clearOnSave?: boolean
  clearOnExit?: boolean
}

export interface UseEditableSectionOptions {
  draft?: EditableSectionDraftOptions
}

export interface UseEditableSectionReturn<TPayload> {
  isEditing: Ref<boolean>
  isSubmitting: Ref<boolean>
  toggleEdit: (event?: Event) => void
  setEditing: (value: boolean) => void
  save: (opts: SaveOptions<TPayload>) => Promise<void>
  discardChanges: (opts: DiscardOptions) => void
  runChecks: (checks: Array<[boolean, string]>) => boolean
  restoreDraft: () => boolean
  clearDraft: () => void
  draftStorageKey: ComputedRef<string | null>
}

const emptyStorageKey = computed<string | null>(() => null)

interface DraftEnvelope<TDraft extends DraftRecord> {
  data: TDraft
  isEditing: boolean
}

type DraftHandle = UseSectionDraftReturn | null

function collectFromFields(fields: DraftFieldBinding[]): DraftRecord {
  const out: DraftRecord = {}
  fields.forEach((binding) => {
    out[binding.key] = binding.read()
  })
  return out
}

function applyFields(fields: DraftFieldBinding[], draft: Partial<DraftRecord>): void {
  fields.forEach((binding) => {
    if (Object.prototype.hasOwnProperty.call(draft, binding.key)) {
      const value = draft[binding.key]
      if (value !== undefined) {
        binding.write(value)
      }
    }
  })
}

export function useEditableSection<TPayload, TDraft extends DraftRecord = DraftRecord>(
  options?: UseEditableSectionOptions
): UseEditableSectionReturn<TPayload> {
  const isEditing = ref(false)
  const isSubmitting = ref(false)
  const toast = useToast()

  let draftHandle: DraftHandle = null
  let draftClearOnSave = true
  let draftClearOnExit = true

  let effectiveCollect: () => TDraft
  let effectiveApply: (draft: Partial<TDraft>) => void

  if (options?.draft) {
    const {
      key,
      fields,
      persistWhen,
      debounceMs,
      autoRestore,
      clearOnSave = true,
      clearOnExit = true,
    } = options.draft

    const fieldBindings = fields ?? []

    effectiveCollect = () => collectFromFields(fieldBindings) as TDraft
    effectiveApply = (draft: Partial<TDraft>) => applyFields(fieldBindings, draft)

    if (fieldBindings.length === 0) {
      console.warn('[useEditableSection] Provide draft fields.')
    } else {
      draftClearOnSave = clearOnSave
      draftClearOnExit = clearOnExit

      draftHandle = useSectionDraft<DraftEnvelope<TDraft>>({
        storageKey: key,
        collectState: () => ({
          data: effectiveCollect(),
          isEditing: isEditing.value
        }),
        applyState: (payload) => {
          if (payload) {
            if (payload.data) {
              effectiveApply(payload.data)
            }
            if (typeof payload.isEditing === 'boolean') {
              isEditing.value = payload.isEditing
            }
          }
        },
        onRestore: (payload) => {
          if (payload?.data) {
            effectiveApply(payload.data)
            toast.info('Restored an unsaved dental draft from this device.')
          }
        },
        persistWhen: persistWhen ?? (() => isEditing.value),
        debounceMs,
        autoRestore
      })
    }
  }

  function setEditing(value: boolean) {
    const current = isEditing.value
    if (current === value) return

    isEditing.value = value

  }

  function toggleEdit(event?: Event) {
    if (event instanceof Event) {
      event.preventDefault?.()
    }
    setEditing(!isEditing.value)
  }

  async function save(opts: SaveOptions<TPayload>) {
    if (isSubmitting.value) return
    const payload = opts.buildPayload()
    if (!payload) return
    isSubmitting.value = true
    try {
      await opts.update()
      toast.success('Saved successfully!')
      setEditing(false)
      opts.onSuccess?.()
      if (draftClearOnSave) {
        draftHandle?.clearDraft()
      }
    } catch (error) {
      console.error(error)
      toast.error(handleApiError(error))
    } finally {
      isSubmitting.value = false
    }
  }

  function discardChanges(opts: DiscardOptions) {
    if (!isEditing.value) return
    setEditing(false)
    draftHandle?.clearDraft()
    opts.onDiscard()
    opts.onSuccess()
  }

  if (draftHandle && draftClearOnExit) {
    watch(
      isEditing,
      (value, previous) => {
        if (previous && !value) {
          draftHandle?.clearDraft()
        }
      }
    )
  }

  function runChecks(checks: Array<[boolean, string]>): boolean {
    const failed = checks.find(([ok]) => !ok)
    if (failed) {
      toast.error(failed[1])
      return false
    }
    return true
  }

  return {
    isEditing,
    isSubmitting,
    toggleEdit,
    setEditing,
    save,
    discardChanges,
    runChecks,
    restoreDraft: draftHandle ? draftHandle.restoreDraft : () => false,
    clearDraft: draftHandle ? draftHandle.clearDraft : () => {},
    draftStorageKey: draftHandle ? draftHandle.storageKey : emptyStorageKey
  }
}
