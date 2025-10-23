<template>
  <label class="block relative">
    <input
      :id="inputId"
      v-model="q"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="inputClass(error)"
      class="mt-1 w-full"
      autocomplete="off"
      @focus="open = true"
      @blur="handleBlur"
      @input="open = true"
    />

    <ul v-if="open" class="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-64 overflow-auto">
      <li
        v-for="d in results"
        :key="d.id"
        class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
        @mousedown.prevent="onPick(d)"
      >
        {{ d.name }} <span class="text-gray-500 text-xs">({{ d.unit }})</span>
      </li>
      <li v-if="!results.length" class="px-3 py-2 text-sm text-gray-500">No matches</li>
    </ul>

    <p v-if="error" class="err">{{ error }}</p>
  </label>

  <ConfirmationDialog
    :open="confirmOpen"
    :title="confirmTitle"
    :message="confirmMessage"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :close-on-backdrop="false"
    :close-on-esc="false"
    @confirm="confirmChange"
    @cancel="cancelConfirm"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ConfirmationDialog from './ConfirmationDialogue.vue'
import type { Drug } from '@/features/pharmacy/types/Drug'

const props = withDefaults(defineProps<{
  modelValue: number | null
  allDrugs: Drug[]
  excludeIds?: number[]
  error?: string
  disabled?: boolean
  placeholder?: string
  inputId?: string
  /* confirm options */
  confirmOnChange?: boolean
  confirmTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
}>(), {
  excludeIds: () => [],
  error: '',
  disabled: false,
  placeholder: 'Search drug…',
  confirmOnChange: true,
  confirmTitle: 'Change drug?',
  confirmMessage: 'Warning: This will erase all prescribed batches associated with this drug.',
  confirmText: 'Yes, change drug',
  cancelText: 'No, keep current',
})

const emit = defineEmits<{ 'update:modelValue': [number | null] }>()

const q = ref('')
const open = ref(false)

/* Confirm state */
const confirmOpen = ref(false)
const pendingNextId = ref<number | null>(null)
const pendingNextLabel = ref<string>('')

const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2', err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'].join(' ')

/* Committed selection from parent */
const selected = computed(() => props.allDrugs.find(d => d.id === props.modelValue) ?? null)
const selectedLabel = computed(() => selected.value ? selected.value.name : '')

/* Exclude already-chosen drugs, but keep current */
const baseList = computed(() => {
  const exclude = new Set(props.excludeIds ?? [])
  if (props.modelValue != null) exclude.delete(props.modelValue)
  return props.allDrugs.filter(d => !exclude.has(d.id))
})

/* Show all initially; filter by typing */
const results = computed(() => {
  const s = q.value.trim().toLowerCase()
  return s ? baseList.value.filter(d => d.name.toLowerCase().includes(s)) : baseList.value
})

/* Drive the input from committed selection unless confirm is open */
watch([() => props.modelValue, confirmOpen], () => {
  q.value = (confirmOpen.value && pendingNextLabel.value) ? pendingNextLabel.value : selectedLabel.value
}, { immediate: true })

function handleBlur() {
  open.value = false
  q.value = (confirmOpen.value && pendingNextLabel.value) ? pendingNextLabel.value : selectedLabel.value
}

function onPick(d: Drug) {
  const currentId = props.modelValue ?? null
  if (!props.confirmOnChange || currentId == null || currentId <= 0 || currentId === d.id) {
    emit('update:modelValue', d.id)
    open.value = false
    return
  }
  // Hold pending choice and show dialog
  pendingNextId.value = d.id
  pendingNextLabel.value = d.name
  confirmOpen.value = true
  open.value = false
}

function confirmChange() {
  if (pendingNextId.value == null) return
  emit('update:modelValue', pendingNextId.value)
  confirmOpen.value = false
  pendingNextId.value = null
  pendingNextLabel.value = ''
  // q will sync from modelValue via watcher
}

function cancelConfirm() {
  confirmOpen.value = false
  pendingNextId.value = null
  pendingNextLabel.value = ''
  // q will revert to committed label via watcher
}
</script>

<style scoped>
.err { color:#ef4444; font-size:0.875rem; margin-top:0.25rem; }
</style>
