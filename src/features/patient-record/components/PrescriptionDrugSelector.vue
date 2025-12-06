<template>
  <label class="block relative">
    <input
      ref="inputEl"
      :id="inputId"
      v-model="drugQuery"
      :disabled="disabled"
      placeholder="Search drug…"
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
      :aria-activedescendant="selectedDrugId ? String(selectedDrugId) : undefined"
    >
      <li
        v-if="loading"
        class="px-3 py-2 text-sm text-gray-500 flex items-center gap-2"
      >
        <span class="inline-block h-2 w-2 rounded-full animate-pulse bg-gray-400" />
        Loading…
      </li>

      <li
        v-for="d in filteredDrugs"
        :id="String(d.id)"
        :key="d.id"
        role="option"
        :aria-selected="d.id === selectedDrugId"
        class="px-3 py-2 cursor-pointer hover:bg-indigo-100 flex items-center gap-2"
        :class="d.id === selectedDrugId ? 'bg-indigo-50' : ''"
        @mousedown.prevent="onPick(d)"
      >
        <!-- Full option label (drug + dosage) -->
        <div class="flex-1 min-w-0">
          <div class="truncate">
            <span class="font-medium">{{ fmtDrugName(d) }}</span>
            <span class="text-gray-500"> — {{ fmtStrength(d) }}</span>
            <span class="text-gray-400"> ({{ d.displayRoute }})</span>
          </div>
        </div>
        <code v-if="d.dispenseUnit" class="text-xs bg-gray-100 border rounded px-1">
          {{ d.dispenseUnit }}
        </code>
      </li>

      <li
        v-if="!loading && !filteredDrugs.length"
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
import type { DrugView } from '@/features/pharmacy/types/Drug'
import { fmtDrugName, fmtStrength } from '@/features/pharmacy/types/Util'

const props = withDefaults(defineProps<{
  modelValue?: number
  allDrugs?: DrugView[]
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
const drugQuery = ref('')   // after selection, show FULL label (drug + dosage)
const open = ref(false)
const listboxId = computed(() => `drug-listbox-${props.inputId ?? 'default'}`)

// Base list reactively from props + excludeIds, keep current visible
const baseDrugs = computed<DrugView[]>(() => {
  const all = props.allDrugs ?? []
  const exclude = new Set(props.excludeIds ?? [])
  if (props.modelValue != null) exclude.delete(props.modelValue)
  return all.filter(d => !exclude.has(d.id))
})

const selectedDrugId = computed<number | ''>(() => props.modelValue ?? '')

function labelFor(d: DrugView) {
  return `${fmtDrugName(d)} — ${fmtStrength(d)} (${d.displayRoute})`
}
function labelForId(id?: number | null) {
  if (id == null) return ''
  const d = baseDrugs.value.find(x => x.id === id)
  return d ? labelFor(d) : ''
}


// ─── Search & Filter ────────────────────────

// SEARCH should use only the drug name portion.
const filteredDrugs = computed(() => {
  const raw = drugQuery.value.trim().toLowerCase()
  // Take only the piece before '—' (em dash). If not present, use the whole string.
  const qDrug = (raw.split('—')[0] || raw).trim()
  const src = baseDrugs.value
  if (!qDrug) return src.slice(0, 50)
  return src.filter(d => {
    const searchText = `${d.atcCode || ''} ${d.genericName || ''} ${d.brandName || ''}`.toLowerCase()
    return searchText.includes(qDrug)
  })
})

const inputClass = (err?: string) =>
  `mt-1 block w-full rounded border px-3 py-2 ${
    err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  }`

onMounted(() => {
  // Prime textbox with FULL label if selected
  if (props.modelValue != null) {
    drugQuery.value = labelForId(props.modelValue)
  }
})

// Sync textbox if parent changes modelValue
watch(() => props.modelValue, (nv) => {
  drugQuery.value = nv != null ? labelForId(nv) : ''
})

// Sync if list changes (async fetch/excludeIds)
watch(baseDrugs, () => {
  if (props.modelValue != null) {
    drugQuery.value = labelForId(props.modelValue)
  }
}, { flush: 'post' })

function onPick(p: DrugView) {
  emit('update:modelValue', p.id)
  drugQuery.value = labelFor(p)  // ← show FULL option text in the input
  open.value = false
  nextTick(() => inputEl.value?.blur()) // optional: remove focus after select
  return
}

function onBlur() {
  // Allow option mousedown to run first, then close & revert to current FULL label
  setTimeout(() => {
    open.value = false
    if (props.modelValue != null) {
      drugQuery.value = labelForId(props.modelValue)
    }
  }, 120)
}
</script>

<style scoped>
.err { color:#ef4444; font-size:0.875rem; margin-top:0.25rem; }
</style>
