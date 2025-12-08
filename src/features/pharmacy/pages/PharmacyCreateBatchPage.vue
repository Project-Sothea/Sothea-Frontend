<template>
  <NavBar />
  <div class="mx-auto mt-10 p-6 shadow rounded bg-white max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Create Batches</h2>
      <router-link
        to="/pharmacy"
        class="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded shadow"
      >
        ← Back
      </router-link>
    </div>

    <!-- ─────────── DRUG PICKER ─────────── -->
    <div class="mb-6">
      <label class="block mb-2 text-gray-700"> Drug <span class="text-red-600">*</span> </label>

      <div class="relative" ref="drugComboRef">
        <input
          v-model.trim="drugQuery"
          @focus="showDrugDropdown = true"
          @input="onDrugQueryInput"
          placeholder="Search drug (e.g., 'amoxicillin 500 cap oral')…"
          :class="inputClass(errors.drug)"
          class="w-full"
          autocomplete="off"
        />
        <ul
          v-show="showDrugDropdown"
          class="absolute z-20 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-56 overflow-auto"
        >
          <li
            v-for="d in filteredDrugs"
            :key="d.id"
            @click="selectDrug(d)"
            class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
          >
            <!-- common display format you've been using -->
            <span class="font-medium"
              >{{ fmtDrugNameWithBrand(d) }} — {{ fmtStrength(d) }} ({{ d.displayRoute }})</span
            >
          </li>
          <li
            @click="openCreateDrugForm = true"
            class="px-3 py-2 cursor-pointer hover:bg-green-100 text-green-700 font-semibold border-t"
          >
            ➕ Create new drug…
          </li>

          <EditDrugForm
            :open="openCreateDrugForm"
            @created="onDrugCreated"
            @close="openCreateDrugForm = false"
          />
        </ul>
        <p v-if="errors.drug" class="err">{{ errors.drug }}</p>
      </div>
    </div>

    <!-- ─────────── BATCHES TABLE (MULTI) ─────────── -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Batches</h3>
      <div class="flex items-center gap-3">
        <span v-if="batches.length > 0" class="text-sm text-gray-600">
          Total: <strong>{{ grandTotal }}</strong>
        </span>
        <button type="button" class="btn-indigo !py-1.5 !px-3 text-sm" @click="addBatchRow">
          + Add Batch
        </button>
      </div>
    </div>
    <p v-if="errors.batches" class="err mb-3">{{ errors.batches }}</p>

    <div class="space-y-4">
      <div
        v-for="(b, bIdx) in batches"
        :key="bIdx"
        class="p-5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-600">Batch {{ bIdx + 1 }}</span>
            <span v-if="perBatchTotals[bIdx] !== undefined" class="text-sm text-gray-500">
              • {{ perBatchTotals[bIdx] }} total
            </span>
          </div>
          <button
            type="button"
            v-show="batches.length > 1"
            class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            :disabled="batches.length === 1"
            @click="removeBatchAt(bIdx)"
            title="Remove batch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-12 gap-3">
          <!-- batchNumber -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700"
              >Batch No. <span class="text-red-600">*</span></label
            >
            <input
              v-model.trim="b.batch.batchNumber"
              :class="inputClass(rowErr(bIdx, 'batchNumber'))"
              autocomplete="off"
            />
            <p class="err" v-if="rowErr(bIdx, 'batchNumber')">{{ rowErr(bIdx, 'batchNumber') }}</p>
          </div>

          <!-- expiryDate -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700"
              >Expiry Date <span class="text-red-600">*</span></label
            >
            <input
              v-model="b.batch.expiryDate"
              type="date"
              :class="inputClass(rowErr(bIdx, 'expiryDate'))"
            />
            <p class="err" v-if="rowErr(bIdx, 'expiryDate')">{{ rowErr(bIdx, 'expiryDate') }}</p>
          </div>

          <!-- supplier -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700">Supplier</label>
            <input
              v-model.trim="b.batch.supplier"
              :class="inputClass(rowErr(bIdx, 'supplier'))"
              autocomplete="off"
            />
            <p class="err" v-if="rowErr(bIdx, 'supplier')">{{ rowErr(bIdx, 'supplier') }}</p>
          </div>
        </div>

        <!-- LOCATIONS -->
        <div class="mt-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">Locations</span>
            <div class="flex gap-2">
              <button
                type="button"
                class="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                :disabled="bIdx === 0 || batches[bIdx - 1].locations.length === 0"
                @click="copyLocationsFromPrev(bIdx)"
                title="Copy locations from previous batch"
              >
                Copy above
              </button>
              <button
                type="button"
                class="text-sm btn-indigo !py-1.5 !px-3"
                @click="addLocationRow(bIdx)"
              >
                + Add location
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(loc, lIdx) in b.locations"
              :key="lIdx"
              class="grid grid-cols-12 gap-2 items-start"
            >
              <!-- Location name -->
              <div class="col-span-12 sm:col-span-8">
                <input
                  v-model.trim="loc.location"
                  :class="inputClass(rowLocErr(bIdx, lIdx, 'locationName'))"
                  placeholder="Location (e.g., Cupboard A)"
                  autocomplete="off"
                  class="text-sm"
                />
                <p class="err text-xs" v-if="rowLocErr(bIdx, lIdx, 'locationName')">
                  {{ rowLocErr(bIdx, lIdx, 'locationName') }}
                </p>
              </div>

              <!-- Quantity -->
              <div class="col-span-9 sm:col-span-3">
                <input
                  v-model.number="loc.quantity"
                  type="number"
                  min="1"
                  step="1"
                  :class="inputClass(rowLocErr(bIdx, lIdx, 'quantity'))"
                  placeholder="Qty"
                  class="text-sm"
                />
                <p class="err text-xs" v-if="rowLocErr(bIdx, lIdx, 'quantity')">
                  {{ rowLocErr(bIdx, lIdx, 'quantity') }}
                </p>
              </div>

              <div class="col-span-3 sm:col-span-1">
                <button
                  type="button"
                  @click="removeLocationAt(bIdx, lIdx)"
                  class="w-full h-[35px] mt-1 px-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors flex items-center justify-center disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed text-sm"
                  title="Remove location"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="flex justify-between items-center gap-3 mt-6 pt-6 border-t">
      <button type="button" class="btn-gray" @click="router.back()">Cancel</button>
      <div class="flex gap-3">
        <button
          type="button"
          :disabled="saving"
          class="btn-indigo"
          @click="handleSubmit(() => router.back())"
        >
          {{ saving ? 'Saving…' : 'Save & Go Back' }}
        </button>
        <button type="button" :disabled="saving" class="btn-green" @click="handleSubmit(resetForm)">
          {{ saving ? 'Saving…' : 'Save & Add Another' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import type { DrugView } from '../types/Drug'
import type { BatchPostData, DrugBatchLocation } from '../types/Batch'
import { listDrugs } from '../api/drug'
import { createBatch } from '../api/batch'
import { fmtDrugNameWithBrand, fmtStrength } from '../types/Util'
import EditDrugForm from '../components/EditDrugForm.vue'

// ─────────────────────────────────────────────────────────────────────────────
const router = useRouter()
const toast = useToast()

const drugs = ref<DrugView[]>([])
const selectedDrugId = ref<number | ''>('')
const drugQuery = ref('')
const showDrugDropdown = ref(false)
const drugComboRef = ref<HTMLElement | null>(null)

// Bulk batches state
const batches = ref<BatchPostData[]>([emptyBatch()])

function emptyBatchLocation(): Omit<DrugBatchLocation, 'id' | 'batchId'> {
  return {
    location: '',
    quantity: 0
  }
}

function emptyBatch(): BatchPostData {
  return {
    batch: {
      batchNumber: '',
      expiryDate: ''
    },
    locations: [emptyBatchLocation()]
  }
}

const saving = ref(false)
const errors = ref<Record<string, string>>({})
// Per-row errors: "b.<idx>.<field>" -> 'msg'  and "b.<idx>.loc.<lidx>.<field>" -> 'msg'
const rowErrors = ref<Record<string, string>>({})

const openCreateDrugForm = ref(false)

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────

async function fetchDrugs() {
  drugs.value = await listDrugs()
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const inputClass = (err?: string) =>
  [
    'mt-1 block w-full rounded border px-3 py-2',
    err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

const currentDrug = computed(() => drugs.value.find((d) => d.id === selectedDrugId.value) ?? null)

const filteredDrugs = computed(() => {
  const q = drugQuery.value.trim().toLowerCase()
  if (!q) return drugs.value.slice(0, 50) // small cap
  return drugs.value.filter((d) => {
    const searchText =
      `${d.drugCode != null ? d.drugCode : ''} ${d.genericName || ''} ${d.brandName || ''} ${d.displayLabel || ''}`.toLowerCase()
    return searchText.includes(q)
  })
})

function onDrugQueryInput() {
  showDrugDropdown.value = true
  selectedDrugId.value = ''
}

function selectDrug(d: DrugView) {
  selectedDrugId.value = d.id
  drugQuery.value = `${fmtDrugNameWithBrand(d)} — ${fmtStrength(d)} (${d.displayRoute})`
  showDrugDropdown.value = false
}

function onClickOutside(e: MouseEvent) {
  if (
    drugComboRef.value &&
    !drugComboRef.value.contains(e.target as Node) &&
    !openCreateDrugForm.value
  ) {
    showDrugDropdown.value = false
  }
}

onMounted(async () => {
  await fetchDrugs()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => document.removeEventListener('click', onClickOutside))

// ───────────── Batches ops
function addBatchRow() {
  batches.value.push(emptyBatch())
}

function removeBatchAt(idx: number) {
  if (batches.value.length > 1) batches.value.splice(idx, 1)
}

function addLocationRow(bIdx: number) {
  batches.value[bIdx].locations.push(emptyBatchLocation())
}

function removeLocationAt(bIdx: number, lIdx: number) {
  const arr = batches.value[bIdx].locations
  if (arr.length > 0) arr.splice(lIdx, 1)
}
function copyLocationsFromPrev(bIdx: number) {
  const prev = batches.value[bIdx - 1]
  batches.value[bIdx].locations = prev.locations.map((l) => ({ ...l }))
}

// Computed totals
const perBatchTotals = computed(() =>
  batches.value.map((b) => b.locations.reduce((s, l) => s + (Number(l.quantity) || 0), 0))
)
const grandTotal = computed(() => perBatchTotals.value.reduce((a, b) => a + b, 0))

// Error helpers
function keyB(bIdx: number, field: string) {
  return `b.${bIdx}.${field}`
}
function keyL(bIdx: number, lIdx: number, field: string) {
  return `b.${bIdx}.loc.${lIdx}.${field}`
}
const rowErr = (bIdx: number, field: string) => rowErrors.value[keyB(bIdx, field)]
const rowLocErr = (bIdx: number, lIdx: number, field: string) =>
  rowErrors.value[keyL(bIdx, lIdx, field)]

// ───────────── Validation
function validate(): boolean {
  const e: Record<string, string> = {}
  const re: Record<string, string> = {}

  // 1) drug
  if (!currentDrug.value) {
    e.drug = 'Choose a drug.'
  }

  // 2) at least one batch row
  if (!batches.value.length) {
    e.batches = 'Add at least one batch.'
  }

  // 3) each batch row
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // cross-row: duplicate batch numbers (client side)
  const seenBatchNos = new Map<string, number[]>()

  batches.value.forEach((b, bIdx) => {
    if (!b.batch.batchNumber) re[keyB(bIdx, 'batchNumber')] = 'Required.'
    else {
      const k = b.batch.batchNumber.trim().toLowerCase()
      if (!seenBatchNos.has(k)) seenBatchNos.set(k, [])
      seenBatchNos.get(k)!.push(bIdx)
    }

    if (!b.batch.expiryDate) re[keyB(bIdx, 'expiryDate')] = 'Choose a date.'
    else {
      const dt = new Date(b.batch.expiryDate)
      if (Number.isNaN(dt.getTime()) || dt <= today) {
        re[keyB(bIdx, 'expiryDate')] = 'Expiry must be after today.'
      }
    }

    // locations are optional; if provided, validate them
    if (b.locations.length > 0) {
      const seenLocs = new Map<string, number[]>()
      b.locations.forEach((l, lIdx) => {
        const name = (l.location ?? '').trim()
        if (!name) re[keyL(bIdx, lIdx, 'locationName')] = 'Enter a location name.'
        else {
          const lk = name.toLowerCase()
          if (!seenLocs.has(lk)) seenLocs.set(lk, [])
          seenLocs.get(lk)!.push(lIdx)
        }
        const q = Number(l.quantity)
        if (!Number.isFinite(q) || q <= 0)
          re[keyL(bIdx, lIdx, 'quantity')] = 'Enter a positive number.'
      })
      // mark duplicates
      for (const [, idxs] of seenLocs) {
        if (idxs.length > 1) {
          idxs.forEach((i) => {
            re[keyL(bIdx, i, 'locationName')] = 'Duplicate location in this batch.'
          })
        }
      }
    }
  })

  for (const [, idxs] of seenBatchNos) {
    if (idxs.length > 1) {
      idxs.forEach((i) => {
        re[keyB(i, 'batchNumber')] = 'Each batch number must be unique.'
      })
    }
  }

  errors.value = e
  rowErrors.value = re
  return Object.keys(e).length === 0 && Object.keys(re).length === 0
}

// ───────────── Submit
async function handleSubmit(onSuccess?: () => void) {
  if (!validate()) return

  const drug = currentDrug.value
  if (!drug) return

  saving.value = true

  try {
    await Promise.all(
      batches.value.map(async (b) => {
        b.batch.expiryDate = new Date(b.batch.expiryDate).toISOString()
        await createBatch(drug.id, b)
      })
    )

    toast.success('Batches created')
    onSuccess?.()
  } catch (err: any) {
    console.error(err)
    const human = err?.response?.data?.error
    toast.error(human || 'Failed to create batches')
  } finally {
    saving.value = false
  }
}

function onDrugCreated(newDrug: DrugView) {
  // add to local list (so it appears immediately in searches)
  drugs.value.unshift(newDrug)
  selectedDrugId.value = newDrug.id
  drugQuery.value = `${fmtDrugNameWithBrand(newDrug)} — ${fmtStrength(newDrug)} (${newDrug.displayRoute})`
  openCreateDrugForm.value = false
}

function resetForm() {
  batches.value = [emptyBatch()]
  // keep the selected drug so users can continue adding more for same item
}
</script>

<style scoped>
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
