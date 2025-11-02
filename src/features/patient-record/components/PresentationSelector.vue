<template>
  <label class="block relative">
    <input
      ref="inputEl"
      :id="inputId"
      v-model="presQuery"
      :disabled="disabled"
      placeholder="Search drug presentation…"
      :class="inputClass(error)"
      autocomplete="off"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="open"
      :aria-controls="listboxId"
      @focus="open = true"
      @blur="onBlur"
    />

    <ul
      v-if="open"
      :id="listboxId"
      class="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-64 overflow-auto"
      role="listbox"
      :aria-activedescendant="selectedPresId ? String(selectedPresId) : undefined"
    >
      <li
        v-if="loading"
        class="px-3 py-2 text-sm text-gray-500 flex items-center gap-2"
      >
        <span class="inline-block h-2 w-2 rounded-full animate-pulse bg-gray-400" />
        Loading…
      </li>

      <li
        v-for="p in filteredPresentations"
        :id="String(p.id)"
        :key="p.id"
        role="option"
        :aria-selected="p.id === selectedPresId"
        class="px-3 py-2 cursor-pointer hover:bg-indigo-100 flex items-center gap-2"
        :class="p.id === selectedPresId ? 'bg-indigo-50' : ''"
        @mousedown.prevent="onPick(p)"
      >
        <!-- Full option label (drug + dosage) -->
        <div class="flex-1 min-w-0">
          <div class="truncate">
            <span class="font-medium">{{ p.drugName }}</span>
            <span class="text-gray-500"> — {{ p.displayStrength }}</span>
            <span class="text-gray-400"> ({{ p.displayRoute }})</span>
          </div>
        </div>
        <code v-if="p.dispenseUnit" class="text-xs bg-gray-100 border rounded px-1">
          {{ p.dispenseUnit }}
        </code>
      </li>

      <li
        v-if="!loading && !filteredPresentations.length"
        class="px-3 py-2 text-sm text-gray-500"
      >
        No matches
      </li>
    </ul>

    <p v-if="error" class="err">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { DrugPresentationView } from '@/features/pharmacy/types/Drug'

const props = withDefaults(defineProps<{
  modelValue?: number
  allPresentations?: DrugPresentationView[]
  excludeIds?: number[]
  error?: string
  disabled?: boolean
  inputId?: string
  loading?: boolean
}>(), {
  excludeIds: () => [],
  error: '',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{ 'update:modelValue': [number | null] }>()

// ── UI state ─────────────────────────────────────────────────────────────
const inputEl = ref<HTMLInputElement | null>(null)
const presQuery = ref('')   // after selection, show FULL label (drug + dosage)
const open = ref(false)
const listboxId = computed(() => `pres-listbox-${props.inputId ?? 'default'}`)

// Base list reactively from props + excludeIds, keep current visible
const basePresentations = computed<DrugPresentationView[]>(() => {
  const all = props.allPresentations ?? []
  const exclude = new Set(props.excludeIds ?? [])
  if (props.modelValue != null) exclude.delete(props.modelValue)
  return all.filter(p => !exclude.has(p.id))
})

const selectedPresId = computed<number | ''>(() => props.modelValue ?? '')

function labelFor(p: DrugPresentationView) {
  return `${p.drugName} — ${p.displayStrength} (${p.displayRoute})`
}
function labelForId(id?: number | null) {
  if (id == null) return ''
  const p = basePresentations.value.find(x => x.id === id)
  return p ? labelFor(p) : ''
}


// ─── Search & Filter ────────────────────────

// SEARCH should use only the drug name portion.
const filteredPresentations = computed(() => {
  const raw = presQuery.value.trim().toLowerCase()
  // Take only the piece before '—' (em dash). If not present, use the whole string.
  const qDrug = (raw.split('—')[0] || raw).trim()
  const src = basePresentations.value
  if (!qDrug) return src.slice(0, 50)
  return src.filter(p => p.drugName.toLowerCase().includes(qDrug))
})

const inputClass = (err?: string) =>
  `mt-1 block w-full rounded border px-3 py-2 ${
    err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  }`

onMounted(() => {
  // Prime textbox with FULL label if selected
  if (props.modelValue != null) {
    presQuery.value = labelForId(props.modelValue)
  }
})

// Sync textbox if parent changes modelValue
watch(() => props.modelValue, (nv) => {
  presQuery.value = nv != null ? labelForId(nv) : ''
})

// Sync if list changes (async fetch/excludeIds)
watch(basePresentations, () => {
  if (props.modelValue != null) {
    presQuery.value = labelForId(props.modelValue)
  }
}, { flush: 'post' })

function onPick(p: DrugPresentationView) {
  emit('update:modelValue', p.id)
  presQuery.value = labelFor(p)  // ← show FULL option text in the input
  open.value = false
  nextTick(() => inputEl.value?.blur()) // optional: remove focus after select
  return
}

function onBlur() {
  // Allow option mousedown to run first, then close & revert to current FULL label
  setTimeout(() => {
    open.value = false
    if (props.modelValue != null) {
      presQuery.value = labelForId(props.modelValue)
    }
  }, 120)
}
</script>

<style scoped>
.err { color:#ef4444; font-size:0.875rem; margin-top:0.25rem; }
</style>
