<template>
  <div class="container max-w-lg mx-auto mt-8 p-6 shadow rounded bg-white">
    <h2 class="text-2xl font-semibold mb-6">Create Drug</h2>

    <form @submit.prevent="handleSubmit">
      <!-- ── Name (required) ───────────────────────────────────── -->
      <label class="block mb-4">
        <span class="text-gray-700"> Name <span class="text-red-500">*</span> </span>
        <input
          v-model.trim="form.name"
          type="text"
          :class="inputClass(errors.name)"
          placeholder="e.g. Paracetamol"
        />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">
          {{ errors.name }}
        </p>
      </label>

      <!-- ── Unit (optional) ──────────────────────────────────── -->
      <label class="block mb-4">
        <span class="text-gray-700"> Unit <span class="text-xs">(e.g. tablet, mL)</span> </span>
        <input
          v-model.trim="form.unit"
          type="text"
          class="mt-1 block w-full rounded border px-3 py-2"
          placeholder="tablet / mg / mL …"
        />
      </label>

      <!-- ── Default size (optional & numeric) ────────────────── -->
      <label class="block mb-4">
        <span class="text-gray-700">Default Size</span>
        <input
          v-model.number="form.default_size"
          type="number"
          min="1"
          class="mt-1 block w-full rounded border px-3 py-2"
          placeholder="e.g. 500"
        />
      </label>

      <!-- ── Notes (optional) ─────────────────────────────────── -->
      <label class="block mb-6">
        <span class="text-gray-700">Notes</span>
        <textarea v-model.trim="form.notes" class="mt-1 block w-full rounded border px-3 py-2" />
      </label>

      <!-- ── Save button ──────────────────────────────────────── -->
      <button
        type="submit"
        :disabled="submitting || !isValid"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {{ submitting ? 'Saving…' : 'Save' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import axios, { AxiosError } from 'axios'
import { BaseURL } from '@/main'
import type { Drug } from '@/types/Drug'

/* ── toast helper ───────────────────────────────────────────── */
const toast = useToast()

/* ── emit to parent (so parent can update list) ─────────────── */
const emit = defineEmits<{
  (e: 'created', newDrug: Drug): void
}>()

/* ── reactive form model ────────────────────────────────────── */
const form = ref<Partial<Drug>>({
  name: '',
  unit: '',
  default_size: undefined,
  notes: ''
})
const submitting = ref(false)

/* ── validation helpers ────────────────────────────────────── */
const errors = computed(() => {
  const e: Record<string, string> = {}
  if (!form.value.name?.trim()) e.name = 'Name is required.'
  return e
})
const isValid = computed(() => Object.keys(errors.value).length === 0)

const inputClass = (err?: string) =>
  `mt-1 block w-full rounded border px-3 py-2 ${err ? 'border-red-500' : 'border-gray-300'}`

/* ── submit handler ────────────────────────────────────────── */
const handleSubmit = async () => {
  if (!isValid.value) return

  submitting.value = true
  try {
    const { data } = await axios.post<Drug>(`${BaseURL}/pharmacy/drugs`, form.value)
    toast.success(`Drug “${data.name}” created`)
    emit('created', data)

    /* reset for next entry */
    form.value = { name: '', unit: '', default_size: undefined, notes: '' }
  } catch (e) {
    const err = e as AxiosError<{ error: string }>
    toast.error(err.response?.data?.error || 'Unexpected error — please try again.') // ❌ error toast
  } finally {
    submitting.value = false
  }
}
</script>
