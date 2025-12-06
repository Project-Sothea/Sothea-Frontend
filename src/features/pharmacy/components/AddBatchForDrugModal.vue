<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative z-10 w-full max-w-3xl mx-4 rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">Add Batch</h3>
            <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100" @click="emit('close')">✕</button>
          </div>

          <!-- Body (scrollable) -->
          <div class="px-5 py-4 space-y-6 overflow-y-auto flex-1">
            <!-- Batch Information -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-gray-700">Batch Information</h4>
              <div class="grid grid-cols-12 gap-3">
                <!-- Batch Number -->
                <div class="col-span-12 sm:col-span-4">
                  <label class="block mb-1 text-gray-700">Batch No. <span class="text-red-600">*</span></label>
                  <input
                    v-model.trim="form.batch.batchNumber"
                    :class="inputClass(errors.batchNumber)"
                    placeholder="e.g., BATCH001"
                    autocomplete="off"
                  />
                  <p v-if="errors.batchNumber" class="err">{{ errors.batchNumber }}</p>
                </div>

                <!-- Expiry Date -->
                <div class="col-span-12 sm:col-span-4">
                  <label class="block mb-1 text-gray-700">Expiry Date <span class="text-red-600">*</span></label>
                  <input
                    v-model="form.batch.expiryDate"
                    type="date"
                    :class="inputClass(errors.expiryDate)"
                  />
                  <p v-if="errors.expiryDate" class="err">{{ errors.expiryDate }}</p>
                </div>

                <!-- Supplier -->
                <div class="col-span-12 sm:col-span-4">
                  <label class="block mb-1 text-gray-700">Supplier</label>
                  <input
                    v-model.trim="form.batch.supplier"
                    :class="inputClass(errors.supplier)"
                    placeholder="e.g., Supplier Name"
                    autocomplete="off"
                  />
                  <p v-if="errors.supplier" class="err">{{ errors.supplier }}</p>
                </div>
              </div>
            </div>

            <!-- Locations -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-gray-700">Locations <span class="text-red-600">*</span></h4>
                <button
                  type="button"
                  class="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  @click="addLocation"
                >
                  + Add Location
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(loc, idx) in form.locations"
                  :key="idx"
                  class="grid grid-cols-12 gap-2 items-start p-3 border rounded"
                >
                  <div class="col-span-12 sm:col-span-8">
                    <label class="sr-only">Location</label>
                    <input
                      v-model.trim="loc.location"
                      :class="inputClass(locationErrors[idx]?.location)"
                      placeholder="e.g., Cupboard A / Drawer 3"
                      autocomplete="off"
                    />
                    <p v-if="locationErrors[idx]?.location" class="err">{{ locationErrors[idx].location }}</p>
                  </div>

                  <div class="col-span-9 sm:col-span-3">
                    <label class="sr-only">Quantity</label>
                    <input
                      v-model.number="loc.quantity"
                      type="number"
                      min="0"
                      step="1"
                      :class="inputClass(locationErrors[idx]?.quantity)"
                      placeholder="Qty"
                    />
                    <p v-if="locationErrors[idx]?.quantity" class="err">{{ locationErrors[idx].quantity }}</p>
                  </div>

                  <div class="col-span-3 sm:col-span-1">
                    <button
                      type="button"
                      v-if="form.locations.length > 1"
                      class="w-full h-[42px] mt-1 px-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors flex items-center justify-center text-sm"
                      @click="removeLocation(idx)"
                      title="Remove location"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t bg-gray-50">
            <button class="btn-gray" @click="emit('close')" :disabled="saving">Cancel</button>
            <button class="btn-indigo" :disabled="saving" @click="handleSubmit">
              {{ saving ? 'Saving…' : 'Create' }}
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
import type { BatchPostData, DrugBatchLocation } from '../types/Batch'
import { createBatch } from '../api/batch'

const props = defineProps<{
  open: boolean
  drugId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()

// Form state
const form = ref<BatchPostData>({
  batch: {
    batchNumber: '',
    expiryDate: '',
    supplier: ''
  },
  locations: [{
    location: '',
    quantity: 0
  }]
})

const errors = ref<Record<string, string>>({})
const locationErrors = ref<Record<number, Record<string, string>>>({})
const saving = ref(false)

const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2',
   err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

// Initialize form when modal opens
watch(() => props.open, () => {
  if (props.open) {
    // Reset to empty
    form.value = {
      batch: {
        batchNumber: '',
        expiryDate: '',
        supplier: ''
      },
      locations: [{
        location: '',
        quantity: 0
      }]
    }
    errors.value = {}
    locationErrors.value = {}
  }
}, { immediate: true })

function addLocation() {
  form.value.locations.push({ location: '', quantity: 0 })
}

function removeLocation(idx: number) {
  if (form.value.locations.length > 1) {
    form.value.locations.splice(idx, 1)
    // Remove errors for this location
    const newErrors: Record<number, Record<string, string>> = {}
    Object.keys(locationErrors.value).forEach(key => {
      const k = Number(key)
      if (k < idx) newErrors[k] = locationErrors.value[k]
      else if (k > idx) newErrors[k - 1] = locationErrors.value[k]
    })
    locationErrors.value = newErrors
  }
}

function validate(): boolean {
  errors.value = {}
  locationErrors.value = {}

  let valid = true

  // Validate batch fields
  if (!form.value.batch.batchNumber?.trim()) {
    errors.value.batchNumber = 'Batch number is required.'
    valid = false
  }

  if (!form.value.batch.expiryDate) {
    errors.value.expiryDate = 'Expiry date is required.'
    valid = false
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiryDate = new Date(form.value.batch.expiryDate)
    if (expiryDate <= today) {
      errors.value.expiryDate = 'Expiry must be after today.'
      valid = false
    }
  }

  // Validate locations
  if (form.value.locations.length === 0) {
    errors.value.locations = 'Add at least one location.'
    valid = false
  }

  const seenLocs = new Map<string, number[]>()
  form.value.locations.forEach((loc, idx) => {
    const locErrors: Record<string, string> = {}
    const name = (loc.location ?? '').trim()
    
    if (!name) {
      locErrors.location = 'Location is required.'
      valid = false
    } else {
      const lk = name.toLowerCase()
      if (!seenLocs.has(lk)) seenLocs.set(lk, [])
      seenLocs.get(lk)!.push(idx)
    }
    
    const q = Number(loc.quantity)
    if (!Number.isFinite(q) || q <= 0) {
      locErrors.quantity = 'Quantity must be greater than 0.'
      valid = false
    }
    
    if (Object.keys(locErrors).length > 0) {
      locationErrors.value[idx] = locErrors
    }
  })

  // Check for duplicate locations
  for (const [, idxs] of seenLocs) {
    if (idxs.length > 1) {
      idxs.forEach(i => {
        if (!locationErrors.value[i]) locationErrors.value[i] = {}
        locationErrors.value[i].location = 'Duplicate location in this batch.'
      })
      valid = false
    }
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  saving.value = true
  try {
    const batchData: BatchPostData = {
      batch: {
        batchNumber: form.value.batch.batchNumber,
        expiryDate: new Date(form.value.batch.expiryDate).toISOString(),
        supplier: form.value.batch.supplier || undefined
      },
      locations: form.value.locations.map(loc => ({
        location: loc.location,
        quantity: loc.quantity
      }))
    }

    await createBatch(props.drugId, batchData)
    toast.success('Batch created successfully')
    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.error ?? 'Failed to create batch')
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
.btn-gray { background: #d1d5db; color: #000; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-gray:hover { background: #9ca3af; }
.btn-gray:disabled { opacity: 0.5; cursor: not-allowed; }
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

