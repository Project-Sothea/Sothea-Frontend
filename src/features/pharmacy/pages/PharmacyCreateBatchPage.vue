<template>
  <NavBar />
  <div class="mx-auto mt-10 p-6 shadow rounded bg-white max-w-3xl">
    <h2 class="text-2xl font-semibold mb-6">Create Batch</h2>

    <form @submit.prevent="handleSubmit(() => router.back())">
      <!-- ─────────── DRUG COMBOBOX ─────────── -->
      <label ref="comboRef" class="block mb-4 relative">
        <span class="text-gray-700">Drug <span class="text-red-600">*</span></span>

        <input
          v-model.trim="drugQuery"
          @focus="showDropdown = true"
          @input="onQueryInput"
          placeholder="Search drug…"
          :class="inputClass(errors.drug)"
          class="mt-1 w-full"
          autocomplete="off"
        />

        <ul
          v-if="showDropdown"
          class="absolute z-20 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-48 overflow-auto"
        >
          <li
            v-for="d in filteredDrugs"
            :key="d.id"
            @click="selectDrug(d)"
            class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
          >
            {{ d.name }}
            <span class="text-gray-500 text-xs">({{ d.unit }})</span>
          </li>

          <li
            @click="selectNewDrug"
            class="px-3 py-2 cursor-pointer hover:bg-green-100 text-green-700 font-semibold border-t"
          >
            ➕ Create new drug…
          </li>
        </ul>

        <p v-if="errors.drug" class="err">{{ errors.drug }}</p>
      </label>

      <p v-if="currentDrug" class="mb-4 text-sm text-gray-600">
        Unit: <strong>{{ currentDrug.unit }}</strong>
      </p>

      <CreateDrugForm
        v-if="selectedDrugId === NEW_DRUG_ID"
        :open="true"
        :drug-name="drugQuery"
        @created="onDrugCreated"
        @close="selectedDrugId = ''"
      />

      <!-- Batch No. -->
      <label class="block mb-4">
        <span class="text-gray-700">Batch&nbsp;No. <span class="text-red-600">*</span></span>
        <input
          v-model.trim="batch.batchNumber"
          :class="inputClass(errors.batchNumber)"
          @input="clearError('batch_no')"
          type="text"
          autocomplete="off"
          required
        />
        <p v-if="errors.batchNumber" class="err">{{ errors.batchNumber }}</p>
      </label>

      <!-- Expiry Date -->
      <label class="block mb-4">
        <span class="text-gray-700">Expiry&nbsp;Date <span class="text-red-600">*</span></span>
        <input
          v-model="batch.expiryDate"
          :class="inputClass(errors.expiryDate)"
          @input="clearError('expiry_date')"
          type="date"
          required
        />
        <p v-if="errors.expiryDate" class="err">{{ errors.expiryDate }}</p>
      </label>

      <!-- Supplier -->
      <label class="block mb-4">
        <span class="text-gray-700">Supplier <span class="text-red-600">*</span></span>
        <input
          v-model="batch.supplier"
          :class="inputClass(errors.supplier)"
          @input="clearError('supplier')"
          type="text"
          autocomplete="off"
          required
        />
        <p v-if="errors.expiryDate" class="err">{{ errors.expiryDate }}</p>
      </label>

      <!-- ─────────── LOCATIONS & QUANTITIES (free-text, repeatable) ─────────── -->
      <div class="mb-2 flex items-center justify-between">
        <span class="text-gray-700">Locations <span class="text-red-600">*</span></span>
        <button type="button" class="btn-indigo !py-1" @click="addLocationRow">Add row</button>
      </div>

      <div class="mb-2 text-sm text-gray-600">Total quantity: <strong>{{ totalQuantity }}</strong></div>
      <p v-if="errors.batchLocations" class="err mb-2">{{ errors.batchLocations }}</p>

      <div class="space-y-3 mb-6">
        <div
          v-for="(row, idx) in batchLocations"
          :key="idx"
          class="grid grid-cols-7 gap-2 items-center"
        >
          <!-- Location -->
          <div class="col-span-4">
            <label class="sr-only">Location</label>
            <input
              v-model.trim="row.location"
              type="text"
              placeholder="Location (e.g., Cupboard A, Drawer 3)"
              :class="inputClass(rowErrors(idx, 'location'))"
              @input="clearRowError(idx, 'location')"
              autocomplete="off"
            />
          <p
            :class="[
              'err text-xs leading-5 min-h-5',          // fixed vertical space
              rowErrors(idx, 'location') ? '' : 'invisible' // hide but keep space
            ]"
          >
            {{ rowErrors(idx, 'location') || 'placeholder' }}
          </p>
          </div>

          <!-- Quantity -->
          <div class="col-span-2">
            <label class="sr-only">Qty</label>
            <input
              v-model.number="row.quantity"
              type="number"
              min="1"
              step="1"
              placeholder="Qty"
              :class="inputClass(rowErrors(idx, 'quantity'))"
              @input="clearRowError(idx, 'quantity')"
            />
            <p
              :class="[
                'err text-xs leading-5 min-h-5',
                rowErrors(idx, 'quantity') ? '' : 'invisible'
              ]"
            >
              {{ rowErrors(idx, 'quantity') || 'placeholder' }}
            </p>
          </div>

          <!-- Remove (icon-only, red when enabled, grey when disabled) -->
          <div class="col-span-1" justify-center>
            <button
              type="button"
              @click="removeLocationRow(idx)"
              :disabled="batchLocations.length === 1"
              title="Remove row"
              aria-label="Remove row"
              class="p-2 rounded-md transition self-center
                    text-red-600 hover:text-red-700
                    focus:outline-none focus:ring-2 focus:ring-red-500/40
                    disabled:text-gray-300 disabled:hover:text-gray-300
                    disabled:cursor-not-allowed
                    ml-5"
            >
              <!-- Lucide 'trash-2' -->
              <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  class="h-5 w-5"
                  aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M14 11v6"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>

          <p
            :class="[
              'err text-xs leading-5 min-h-5',          // fixed vertical space
              'invisible' // hide but keep space
            ]"
          >
            Placeholder
          </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          :disabled="saving"
          class="btn-indigo"
          @click="handleSubmit(() => router.back())"
        >
          {{ saving ? 'Saving…' : 'Save & Go Back' }}
        </button>
        <button
          type="button"
          :disabled="saving"
          class="btn-green"
          @click="handleSubmit(() => router.push('/pharmacy/batches/new'))"
        >
          {{ saving ? 'Saving…' : 'Save & Add Another' }}
        </button>
        <button type="button" class="btn-gray" @click="router.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import { fetchDrugs, createBatch } from '@features/pharmacy/api/pharmacy'
import CreateDrugForm from '@features/pharmacy/components/CreateDrugForm.vue'
import type { Drug } from '@features/pharmacy/types/Drug'
import type { DrugBatch } from '../types/DrugBatch'
import type { BatchLocation } from '../types/BatchLocation'

/* ── constants ── */
const NEW_DRUG_ID = -1

/* ── refs / state ── */
const router = useRouter()
const toast = useToast()

const drugs = ref<Drug[]>([])

const selectedDrugId = ref<number | ''>('')
const drugQuery = ref('')
const showDropdown = ref(false)
const comboRef = ref<HTMLElement | null>(null)

const batch = ref<Partial<DrugBatch>>({
  batchNumber: '',
  expiryDate: '',
})

/** locations table rows (free text) */
const batchLocations = ref<Partial<BatchLocation>[]>([
  { location: '', quantity: 0 }
])

const saving = ref(false)
const errors = ref<Record<string, string>>({})
/** per-row field errors, mirror shape: { [rowIndex.field]: 'msg' } */
const rowFieldErrors = ref<Record<string, string>>({})

/* ── helpers ── */
const inputClass = (err?: string) =>
  [
    'mt-1 block w-full rounded border px-3 py-2',
    err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

const clearError = (k: string) => {
  delete errors.value[k]
}

const rowKey = (i: number, field: 'location' | 'quantity') => `${i}.${field}`
const rowErrors = (i: number, field: 'location' | 'quantity') => rowFieldErrors.value[rowKey(i, field)]
const clearRowError = (i: number, field: 'location' | 'quantity') => {
  delete rowFieldErrors.value[rowKey(i, field)]
}

const onQueryInput = () => {
  showDropdown.value = true
  selectedDrugId.value = ''
}

/* ── combo-box logic ── */
const filteredDrugs = computed(() =>
  drugs.value.filter((d) => d.name.toLowerCase().includes(drugQuery.value.toLowerCase()))
)

const currentDrug = computed(() => drugs.value.find((d) => d.id === selectedDrugId.value) ?? null)

const selectDrug = (d: Drug) => {
  selectedDrugId.value = d.id
  drugQuery.value = `${d.name} (${d.unit})`
  showDropdown.value = false
}

const selectNewDrug = () => {
  selectedDrugId.value = NEW_DRUG_ID
  showDropdown.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (comboRef.value && !comboRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}


const addLocationRow = () => {
  batchLocations.value.push({ location: '', quantity: 0 })
}

const removeLocationRow = (idx: number) => {
  if (batchLocations.value.length === 1) return
  batchLocations.value.splice(idx, 1)
}

/* ── computed ── */
const totalQuantity = computed(() =>
  batchLocations.value.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0)
)

/* ── fetch ── */
onMounted(async () => {
  drugs.value = await fetchDrugs()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => document.removeEventListener('click', onClickOutside))

/* ── new-drug callback ── */
const onDrugCreated = (d: Drug) => {
  drugs.value.push(d)
  selectedDrugId.value = d.id
  drugQuery.value = `${d.name} (${d.unit})`
}

/* ── validation ── */
const validate = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const e: Record<string, string> = {}
  const re: Record<string, string> = {}

  // drug
  if (!currentDrug.value && selectedDrugId.value !== NEW_DRUG_ID)
    e.drug = 'Please choose (or create) a drug.'

  // batch_no
  if (!batch.value.batchNumber) e.batchNumber = 'Batch number is required.'

  // expiry_date
  if (!batch.value.expiryDate) {
    e.expiryDate = 'Choose an expiry date.'
  } else {
    const picked = new Date(batch.value.expiryDate)
    if (picked <= today) e.expiryDate = 'Expiry date must be after today.'
  }

  // supplier
  if (!batch.value.supplier) e.supplier = 'Supplier is required.'

  // batch_locations rows: ≥1 row, each with non-empty location and positive quantity
  if (!batchLocations.value.length) {
    e.batchLocations = 'Add at least one location row.'
  } else {
    batchLocations.value.forEach((row, idx) => {
      if (!row.location?.trim()) re[rowKey(idx, 'location')] = 'Enter a location.'
      const q = Number(row.quantity)
      if (!Number.isFinite(q) || q <= 0) re[rowKey(idx, 'quantity')] = 'Enter a positive quantity.'
    })

    const seen = new Map<string, number[]>()
    batchLocations.value.forEach((row, idx) => {
      const key = (row.location ?? '').trim().toLowerCase()
      if (!key) return
      if (!seen.has(key)) seen.set(key, [])
      seen.get(key)!.push(idx)
    })
    for (const [, idxs] of seen) {
      if (idxs.length > 1) {
        idxs.forEach(i => { re[rowKey(i, 'location')] = 'Duplicate location. Use unique names.' })
      }
    }
  }

  errors.value = e
  rowFieldErrors.value = re
  return Object.keys(e).length === 0 && Object.keys(re).length === 0
}

/* ── submit ── */
const handleSubmit = async (onSuccess?: () => void) => {
  if (!validate()) return

  saving.value = true
  try {
    await createBatch({
      drugId: currentDrug.value!.id,
      batchNumber: batch.value.batchNumber!.trim(),
      expiryDate: new Date(batch.value.expiryDate!).toISOString(),
      supplier: batch.value.supplier!.trim(),
      batchLocations: batchLocations.value.map((r) => ({
        location: r.location!.trim(),
        quantity: Number(r.quantity)
      }))
    })

    toast.success('Batch saved')

    // reset
    batch.value = { batchNumber: '', expiryDate: '' }
    batchLocations.value = [{ location: '', quantity: 0 }]
    selectedDrugId.value = ''
    drugQuery.value = ''

    onSuccess?.()
  } catch (e) {
    console.error(e)
    toast.error('Failed to save batch')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  width: 100%;
  display: block;
}
.err {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.btn-indigo {
  background: #4f46e5;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
.btn-indigo:hover {
  background: #4338ca;
}
.btn-green {
  background: #16a34a;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
.btn-green:hover {
  background: #15803d;
}
.btn-gray {
  background: #d1d5db;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
.btn-gray:hover {
  background: #9ca3af;
}
</style>
