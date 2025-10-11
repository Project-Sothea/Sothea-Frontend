<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Create Drug Form"
        @keydown.esc="onClose"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="onClose" />

        <!-- dialog panel -->
        <div class="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white shadow-xl" @click.stop>
          <!-- header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">Create Drug</h3>
            <button
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
              aria-label="Close"
              @click="onClose"
            >
              ✕
            </button>
          </div>

          <!-- body -->
          <div class="px-5 py-4">
            <form @submit.prevent="handleSubmit">
              <!-- Name (required) -->
              <label class="block mb-4">
                <span class="text-gray-700">Name <span class="text-red-500">*</span></span>
                <input
                  ref="nameInput"
                  v-model.trim="form.name"
                  type="text"
                  :class="inputClass(errors.name)"
                  @input="clearError('name')"
                  placeholder="e.g. Paracetamol"
                />
                <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
              </label>

              <!-- Unit (required) -->
              <label class="block mb-4">
                <span class="text-gray-700">Unit <span class="text-xs">(e.g. tablet, mL)</span></span>
                <input
                  v-model.trim="form.unit"
                  type="text"
                  :class="inputClass(errors.unit)"
                  @input="clearError('unit')"
                  placeholder="tablet / mg / mL …"
                />
                <p v-if="errors.unit" class="text-red-600 text-sm mt-1">{{ errors.unit }}</p>
              </label>

              <!-- Default size (required & numeric) -->
              <label class="block mb-4">
                <span class="text-gray-700">Default Size</span>
                <input
                  v-model.number="form.defaultSize"
                  type="number"
                  min="1"
                  :class="inputClass(errors.defaultSize)"
                  @input="clearError('defaultSize')"
                  placeholder="e.g. 500"
                />
                <p v-if="errors.defaultSize" class="text-red-600 text-sm mt-1">
                  {{ errors.defaultSize }}
                </p>
              </label>

              <!-- Notes (optional) -->
              <label class="block mb-1">
                <span class="text-gray-700">Notes</span>
                <textarea v-model.trim="form.notes" class="mt-1 block w-full rounded border px-3 py-2" />
              </label>

              <!-- footer -->
              <div class="flex items-center justify-end gap-2 mt-6 border-t pt-4">
                <button type="button" class="px-4 py-2 rounded border" :disabled="submitting" @click="onClose">
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {{ submitting ? 'Saving…' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { Drug } from '@features/pharmacy/types/Drug'
import { createDrug } from '@features/pharmacy/api/pharmacy'

const props = defineProps<{
  open: boolean
  drugName?: string
}>()

const emit = defineEmits<{
  (e: 'created', newDrug: Drug): void
  (e: 'close'): void
}>()

const toast = useToast()
const nameInput = ref<HTMLInputElement | null>(null)

/** FORM MODEL — matches API (snake_case) */
const form = ref<Partial<Drug>>({
  name: '',
  unit: '',
  defaultSize: undefined,
  notes: ''
})
const submitting = ref(false)

/* ── validation ── */
const errors = ref<Record<string, string>>({})
const validate = () => {
  const e: Record<string, string> = {}
  if (!form.value.name?.trim()) e.name = 'Name is required.'
  if (!form.value.unit?.trim()) e.unit = 'Unit is required.'
  if (form.value.defaultSize == null || Number(form.value.defaultSize) < 1) {
    e.defaultSize = 'Default size must be a positive number.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

const clearError = (k: string) => {
  delete errors.value[k]
}

const inputClass = (err?: string) =>
  `mt-1 block w-full rounded border px-3 py-2 ${err ? 'border-red-500' : 'border-gray-300'}`

function onClose() {
  emit('close')
}

/** SUBMIT — send the right keys to API */
const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  try {
    const payload = {
      name: form.value.name!.trim(),
      unit: form.value.unit!.trim(),
      defaultSize: Number(form.value.defaultSize),
      notes: form.value.notes?.trim() || undefined
    }
    const data = await createDrug(payload as Omit<Drug, 'id'>)
    toast.success(`Drug “${data.name}” created`)
    emit('created', data)
    form.value = { name: '', unit: '', defaultSize: undefined, notes: '' }
    onClose()
  } catch (e) {
    console.error(e)
    toast.error('Failed to create drug')
  } finally {
    submitting.value = false
  }
}

/** Prefill name from prop when opening */
watch(
  () => props.open,
  async (val) => {
    if (val) {
      document.body.classList.add('overflow-hidden')
      await nextTick()
      if (props.drugName && !form.value.name) form.value.name = props.drugName
      nameInput.value?.focus()
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.open) document.body.classList.add('overflow-hidden')
})
onBeforeUnmount(() => {
  document.body.classList.remove('overflow-hidden')
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
