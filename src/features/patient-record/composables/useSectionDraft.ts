import { computed, isRef, onBeforeUnmount, watch, type Ref, type ComputedRef } from 'vue'

export interface UseSectionDraftOptions<TState> {
  storageKey: Ref<string | null> | (() => string | null)
  collectState: () => TState
  applyState: (draft: Partial<TState>) => void
  persistWhen?: Ref<boolean> | (() => boolean)
  onRestore?: (draft: Partial<TState>) => void
  debounceMs?: number
  autoRestore?: boolean
}

export interface UseSectionDraftReturn {
  restoreDraft: () => boolean
  clearDraft: () => void
  storageKey: ComputedRef<string | null>
}

function resolveSource<T>(source: Ref<T> | (() => T)): T {
  if (isRef(source)) {
    return source.value
  }
  return source()
}

export function useSectionDraft<TState>(options: UseSectionDraftOptions<TState>): UseSectionDraftReturn {
  const storageKey = computed(() => resolveSource(options.storageKey))

  const persistEnabled = computed(() => {
    if (!options.persistWhen) return true
    return !!resolveSource(options.persistWhen)
  })

  const state = computed(() => options.collectState())
  let saveTimer: ReturnType<typeof window.setTimeout> | undefined

  watch(
    () => ({ key: storageKey.value, state: state.value, persist: persistEnabled.value }),
    ({ key, state: currentState, persist }) => {
      if (!key || !persist) return
      if (typeof window === 'undefined') return
      if (saveTimer) {
        window.clearTimeout(saveTimer)
      }

      const payload = JSON.stringify({
        data: currentState,
        savedAt: Date.now()
      })

      saveTimer = window.setTimeout(() => {
        try {
          localStorage.setItem(key, payload)
        } catch (err) {
          console.warn('[useSectionDraft] Failed to persist draft', err)
        }
      }, options.debounceMs ?? 400)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (saveTimer) {
      window.clearTimeout(saveTimer)
    }
  })

  const shouldAutoRestore = options.autoRestore ?? true
  let hasRestored = false

  function restoreDraft(): boolean {
    const key = storageKey.value
    if (!key || typeof window === 'undefined') return false
    const raw = localStorage.getItem(key)
    if (!raw) return false
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        options.applyState(parsed.data as Partial<TState>)
        options.onRestore?.(parsed.data as Partial<TState>)
        return true
      }
    } catch (err) {
      console.warn('[useSectionDraft] Failed to parse draft data', err)
    }
    return false
  }

  function clearDraft() {
    const key = storageKey.value
    if (!key || typeof window === 'undefined') return
    // Cancel any pending debounced save to prevent it from restoring the draft
    if (saveTimer) {
      window.clearTimeout(saveTimer)
      saveTimer = undefined
    }
    localStorage.removeItem(key)
  }

  watch(
    storageKey,
    () => {
      if (!shouldAutoRestore || hasRestored) return
      hasRestored = restoreDraft()
    },
    { immediate: true }
  )

  return {
    restoreDraft,
    clearDraft,
    storageKey
  }
}

