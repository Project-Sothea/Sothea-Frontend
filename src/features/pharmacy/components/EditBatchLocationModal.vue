<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">{{ location ? 'Edit Location' : 'Add Location' }}</h3>
            <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100" @click="emit('close')">✕</button>
          </div>

          <!-- Body -->
          <div class="px-5 py-4 space-y-4">
            <!-- Location -->
            <div>
              <label class="block mb-1 text-gray-700">Location <span class="text-red-600">*</span></label>
              <input
                v-model.trim="form.location"
                :class="inputClass(errors.location)"
                placeholder="e.g., Cupboard A / Drawer 3"
                autocomplete="off"
              />
              <p v-if="errors.location" class="err">{{ errors.location }}</p>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block mb-1 text-gray-700">Quantity <span class="text-red-600">*</span></label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="0"
                step="1"
                :class="inputClass(errors.quantity)"
                placeholder="0"
              />
              <p v-if="errors.quantity" class="err">{{ errors.quantity }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t">
            <button class="btn-gray" @click="emit('close')" :disabled="saving">Cancel</button>
            <button
              v-if="location"
              class="btn-red"
              @click="handleDelete"
              :disabled="saving"
            >
              Delete
            </button>
            <button class="btn-indigo" :disabled="saving" @click="handleSubmit">
              {{ saving ? 'Saving…' : (location ? 'Update' : 'Create') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { DrugBatchLocation } from '../types/Batch'
import { createBatchLocation, updateBatchLocation, deleteBatchLocation } from '../api/batch'

const props = defineProps<{
  open: boolean
  location?: DrugBatchLocation
  batchId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
  (e: 'deleted'): void
}>()

const toast = useToast()

// Form state
const form = ref<{ location: string; quantity: number }>({
  location: '',
  quantity: 0
})

const errors = ref<Record<string, string>>({})
const saving = ref(false)

const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2',
   err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

// Initialize form when modal opens or location changes
watch([() => props.open, () => props.location], () => {
  if (props.open) {
    if (props.location) {
      // Edit mode: populate with existing location data
      form.value = {
        location: props.location.location,
        quantity: props.location.quantity
      }
    } else {
      // Create mode: reset to empty
      form.value = {
        location: '',
        quantity: 0
      }
    }
    errors.value = {}
  }
}, { immediate: true })

function validate(): boolean {
  errors.value = {}
  let valid = true

  if (!form.value.location?.trim()) {
    errors.value.location = 'Location is required.'
    valid = false
  }

  const q = Number(form.value.quantity)
  if (!Number.isFinite(q) || q <= 0) {
    errors.value.quantity = 'Quantity must be greater than 0.'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  saving.value = true
  try {
    if (props.location) {
      // Update existing location
      await updateBatchLocation(props.location.id, {
        location: form.value.location,
        quantity: form.value.quantity
      })
      toast.success('Location updated successfully')
    } else {
      // Create new location
      await createBatchLocation(props.batchId, {
        id: 0, // Will be ignored by API
        batchId: props.batchId,
        location: form.value.location,
        quantity: form.value.quantity
      })
      toast.success('Location created successfully')
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.error ?? (props.location ? 'Failed to update location' : 'Failed to create location'))
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.location) return

  saving.value = true
  try {
    await deleteBatchLocation(props.location.id)
    toast.success('Location deleted successfully')
    emit('deleted')
    emit('close')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.error ?? 'Failed to delete location')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.err { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
.btn-indigo { background: #4f46e5; color: #fff; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-indigo:hover { background: #4338ca; }
.btn-indigo:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-red { background: #dc2626; color: #fff; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-red:hover { background: #b91c1c; }
.btn-red:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-gray { background: #d1d5db; color: #000; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-gray:hover { background: #9ca3af; }
.btn-gray:disabled { opacity: 0.5; cursor: not-allowed; }
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

