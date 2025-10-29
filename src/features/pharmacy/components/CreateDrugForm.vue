<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" />
        <div class="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white shadow-xl" @click.stop>
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">Create Drug</h3>
            <button class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100" @click="$emit('close')">✕</button>
          </div>

          <div class="px-5 py-4">
            <label class="block mb-3">
              <span class="text-gray-700">Generic name <span class="text-red-600">*</span></span>
              <input v-model.trim="drug.genericName" :class="inputClass(errors.genericName)" placeholder="e.g. Paracetamol" />
              <p v-if="errors.genericName" class="err">{{ errors.genericName }}</p>
            </label>

            <label class="block mb-3">
              <span class="text-gray-700">Brand name</span>
              <input v-model.trim="drug.brandName" :class="inputClass()" placeholder="e.g. Panadol" />
            </label>

            <label class="block mb-3">
              <span class="text-gray-700">ATC code</span>
              <input v-model.trim="drug.atcCode" :class="inputClass()" placeholder="e.g. N02BE01" />
            </label>

            <label class="block mb-3">
              <span class="text-gray-700">Notes</span>
              <textarea v-model.trim="drug.notes" class="mt-1 block w-full rounded border px-3 py-2" />
            </label>

            <div class="flex items-center justify-end gap-2 mt-4">
              <button class="btn-gray" :disabled="submitting" @click="$emit('close')">Cancel</button>
              <button class="btn-indigo" :disabled="submitting" @click="submit">{{ submitting ? 'Saving…' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { Drug } from '../types/Drug';
import { createDrug } from '../api/drug';

// ─── Props & Emits ────────────────────────

const props = defineProps<{ open: boolean; presetName?: string }>()
const emit = defineEmits<{ (e:'close'): void; (e:'created', d:Drug): void }>()

// ─── UI & State ────────────────────────
const toast = useToast()
const submitting = ref(false)
const drug = ref<Omit<Drug, 'id'>>({
    genericName: '',
    brandName: '',
    atcCode: '',
    isActive: true,
    notes: ''
})
const errors = ref<Record<string,string>>({})

watch(() => props.open, (v) => {
  if (v && props.presetName && !drug.value.genericName) drug.value.genericName = props.presetName
})

const inputClass = (err?: string) => ['mt-1 block w-full rounded border px-3 py-2', err ? 'border-red-500':'border-gray-300'].join(' ')

// ─── Submission & Validation ────────────────────────

function validate() {
  const e: Record<string,string> = {}
  if (!drug.value.genericName?.trim()) e.genericName = 'Required.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    const d = await createDrug(drug.value)
    toast.success(`Drug “${d.genericName}” created`)
    emit('created', d)
    drug.value = {
        genericName: '',
        brandName: '',
        atcCode: '',
        isActive: true,
        notes: ''
    }
  } catch (e) {
    console.error(e)
    toast.error('Failed to create drug')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.err{ color:#ef4444; font-size:.875rem; margin-top:.25rem; }
.fade-enter-active,.fade-leave-active{ transition: opacity 150ms ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
.btn-indigo{ background:#4f46e5;color:#fff;padding:.5rem 1rem;border-radius:.25rem }
.btn-indigo:hover{ background:#4338ca }
.btn-gray{ background:#d1d5db;color:#000;padding:.5rem 1rem;border-radius:.25rem }
.btn-gray:hover{ background:#9ca3af }
</style>
