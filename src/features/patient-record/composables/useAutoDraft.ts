import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import { useToast } from 'vue-toast-notification'
import { handleApiError } from '@shared/api/handleApiError'

/**
 * Field binding for form state
 */
export interface DraftField<T = unknown> {
  key: string
  ref: Ref<T>
}

/**
 * Draft envelope with expiration timestamp
 */
interface DraftEnvelope<T> {
  data: T
  savedAt: number
}

/**
 * Options for automatic draft management
 */
export interface UseAutoDraftOptions<TFormData> {
  /** Storage key - can be a ref, computed, or function returning string | null */
  storageKey: Ref<string | null> | ComputedRef<string | null> | (() => string | null)
  /** Form fields to track */
  fields: DraftField[]
  /** Whether to persist drafts (defaults to isEditing.value) */
  persistWhen?: Ref<boolean> | (() => boolean) | ((isEditing: Ref<boolean>) => boolean)
  /** Draft expiration time in milliseconds (default: 30 minutes) */
  expirationMs?: number
  /** Whether to show toast when restoring draft */
  showRestoreToast?: boolean
  /** Custom restore message */
  restoreMessage?: string
}

/**
 * Return type for useAutoDraft
 */
export interface UseAutoDraftReturn<TFormData> {
  /** Initialize form: automatically uses server data if available, otherwise restores draft */
  initialize: (serverData: TFormData | null | undefined, force?: boolean) => void
  /** Clear the draft */
  clearDraft: () => void
  /** Whether draft was restored */
  draftRestored: Ref<boolean>
  /** Whether form is initialized */
  initialized: Ref<boolean>
  /** Save function that clears draft on success */
  save: (opts: {
    buildPayload: () => TFormData | null
    update: () => Promise<void>
    onSuccess?: () => void
  }) => Promise<void>
  /** Discard changes and restore to server data */
  discardChanges: (opts: {
    onDiscard: () => void
    onSuccess?: () => void
  }) => void
  /** Edit mode state */
  isEditing: Ref<boolean>
  /** Toggle edit mode */
  toggleEdit: () => void
  /** Set edit mode */
  setEditing: (value: boolean) => void
  /** Validation helper */
  runChecks: (checks: Array<[boolean, string]>) => boolean
  /** Whether currently submitting */
  isSubmitting: Ref<boolean>
}

function resolveSource<T>(source: Ref<T> | ComputedRef<T> | (() => T)): T {
  if (typeof source === 'function') {
    return source()
  }
  return source.value
}

/**
 * Comprehensive composable for automatic form draft management.
 * 
 * Features:
 * - Automatic persistence to localStorage when editing
 * - Automatic expiration handling (default: 30 minutes)
 * - Smart initialization: server data > draft data
 * - Type-safe with full TypeScript support
 * - Minimal boilerplate in modals
 */
export function useAutoDraft<TFormData>(
  options: UseAutoDraftOptions<TFormData>
): UseAutoDraftReturn<TFormData> {
  const toast = useToast()
  const initialized = ref(false)
  const draftRestored = ref(false)
  const isEditing = ref(false)
  const isSubmitting = ref(false)

  const expirationMs = options.expirationMs ?? 30 * 60 * 1000 // Default: 30 minutes

  // Compute storage key
  const storageKey = computed(() => {
    const key = resolveSource(options.storageKey)
    return key
  })

  // Internal ref for draft storage
  const draftStorage = ref<DraftEnvelope<Partial<TFormData>> | null>(null)

  // Helper to read from localStorage with expiration check
  function readDraftFromStorage(): DraftEnvelope<Partial<TFormData>> | null {
    const key = storageKey.value
    if (!key || typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as DraftEnvelope<Partial<TFormData>>
      // Check expiration
      if (parsed?.savedAt && Date.now() - parsed.savedAt > expirationMs) {
        localStorage.removeItem(key)
        return null
      }
      return parsed
    } catch {
      return null
    }
  }

  // Helper to write to localStorage
  function writeDraftToStorage(value: DraftEnvelope<Partial<TFormData>> | null): void {
    const key = storageKey.value
    if (!key || typeof window === 'undefined') return
    if (value) {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.removeItem(key)
    }
  }

  // Sync draftStorage ref with localStorage when key changes
  // Also try to restore draft early if not already initialized
  // This ensures draft is restored before patientData loads, preserving unsaved work
  watch(
    storageKey,
    (key) => {
      if (key) {
        draftStorage.value = readDraftFromStorage()
        // Early restoration: if not initialized yet and we have a draft, restore it
        // This happens before patientData loads, ensuring draft takes priority on refresh
        if (!initialized.value && draftStorage.value?.data) {
          applyFormState(draftStorage.value.data)
          draftRestored.value = true
          initialized.value = true
          // If draft was restored, user was editing - enter edit mode
          isEditing.value = true
          if (options.showRestoreToast !== false) {
            toast.info(
              options.restoreMessage ?? 'Restored unsaved draft from this device.'
            )
          }
        }
      } else {
        draftStorage.value = null
      }
    },
    { immediate: true }
  )

  // Track whether we should persist
  const shouldPersist = computed(() => {
    if (!storageKey.value) return false
    if (options.persistWhen) {
      if (typeof options.persistWhen === 'function' && options.persistWhen.length === 1) {
        // Function that takes isEditing as parameter
        return options.persistWhen(isEditing)
      }
      return !!resolveSource(options.persistWhen as Ref<boolean> | (() => boolean))
    }
    // Default: persist when editing
    return isEditing.value
  })

  // Collect current form state
  function collectFormState(): Partial<TFormData> {
    const state = {} as Partial<TFormData>
    options.fields.forEach((field) => {
      state[field.key as keyof TFormData] = field.ref.value as TFormData[keyof TFormData]
    })
    return state
  }

  // Apply form state to refs
  function applyFormState(state: Partial<TFormData>): void {
    options.fields.forEach((field) => {
      const key = field.key as keyof TFormData
      if (key in state && state[key] !== undefined) {
        field.ref.value = state[key] as typeof field.ref.value
      }
    })
  }

  // Watch form changes and persist to draft (when enabled)
  // Only watch when initialized to prevent interfering during initialization
  watch(
    () => ({
      initialized: initialized.value,
      key: storageKey.value,
      persist: shouldPersist.value,
      state: collectFormState(),
    }),
    ({ initialized: isInit, key, persist, state }) => {
      // Don't persist if we're not initialized yet
      // This prevents clearing drafts when restoring form state
      if (!isInit) return
      
      // Only persist if we have a key, should persist, and window is available
      // Don't clear drafts when persist is false - drafts should only be cleared explicitly
      if (!key || !persist || typeof window === 'undefined') {
        return
      }

      // Persist current form state with timestamp
      const envelope: DraftEnvelope<Partial<TFormData>> = {
        data: state,
        savedAt: Date.now(),
      }
      writeDraftToStorage(envelope)
      draftStorage.value = envelope
    },
    { deep: true }
  )

  /**
   * Initialize form with server data or draft.
   * Priority: Draft > Server Data
   * This ensures unsaved work is preserved on page refresh.
   * 
   * @param serverData - Server data to use as fallback if no draft exists
   * @param force - Force re-initialization even if already initialized (use server data)
   */
  function initialize(serverData: TFormData | null | undefined, force = false): void {
    // If already initialized and not forcing, skip (unless draft was already restored)
    if (initialized.value && !force) {
      // If draft was restored, don't overwrite it with server data
      if (draftRestored.value) return
      // If not restored but no server data, nothing to do
      if (!serverData) return
    }

    // Priority 1: Check for draft first (draft takes priority over server data)
    // This preserves unsaved work on page refresh
    const draft = readDraftFromStorage()
    if (draft?.data && !force) {
      // Draft exists - use it (ignore server data)
      applyFormState(draft.data)
      draftStorage.value = draft // Sync the ref
      draftRestored.value = true
      initialized.value = true
      // If draft was restored, user was editing - enter edit mode
      isEditing.value = true

      if (options.showRestoreToast !== false) {
        toast.info(
          options.restoreMessage ?? 'Restored unsaved draft from this device.'
        )
      }
      return
    }

    // Priority 2: Use server data if no draft exists (or force is true)
    if (serverData) {
      applyFormState(serverData)
      initialized.value = true
      draftRestored.value = false
      // Only clear draft if explicitly forced (e.g., after successful save)
      if (force) {
        writeDraftToStorage(null)
        draftStorage.value = null
      }
      return
    }

    // No draft and no server data - form stays at current/default values
    initialized.value = true
    draftRestored.value = false
  }

  /**
   * Clear the draft
   */
  function clearDraft(): void {
    writeDraftToStorage(null)
    draftStorage.value = null
    draftRestored.value = false
  }

  /**
   * Toggle edit mode
   */
  function toggleEdit(): void {
    isEditing.value = !isEditing.value
  }

  /**
   * Set edit mode
   */
  function setEditing(value: boolean): void {
    isEditing.value = value
  }

  /**
   * Save function that clears draft on success
   */
  async function save(opts: {
    buildPayload: () => TFormData | null
    update: () => Promise<void>
    onSuccess?: () => void
  }): Promise<void> {
    if (isSubmitting.value) return
    const payload = opts.buildPayload()
    if (!payload) return
    isSubmitting.value = true
    try {
      await opts.update()
      toast.success('Saved successfully!')
      setEditing(false)
      clearDraft()
      opts.onSuccess?.()
    } catch (error) {
      console.error(error)
      toast.error(handleApiError(error))
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Discard changes
   */
  function discardChanges(opts: {
    onDiscard: () => void
    onSuccess?: () => void
  }): void {
    if (!isEditing.value) return
    setEditing(false)
    clearDraft()
    opts.onDiscard()
    opts.onSuccess?.()
  }

  /**
   * Validation helper
   */
  function runChecks(checks: Array<[boolean, string]>): boolean {
    const failed = checks.find(([ok]) => !ok)
    if (failed) {
      toast.error(failed[1])
      return false
    }
    return true
  }

  return {
    initialize,
    clearDraft,
    draftRestored,
    initialized,
    save,
    discardChanges,
    isEditing,
    toggleEdit,
    setEditing,
    runChecks,
    isSubmitting,
  }
}

