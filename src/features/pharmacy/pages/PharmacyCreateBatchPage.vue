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

    <!-- ─────────── PRESENTATION PICKER ─────────── -->
    <div class="mb-6">
      <label class="block mb-2 text-gray-700">
        Presentation <span class="text-red-600">*</span>
      </label>

      <div class="relative" ref="presComboRef">
        <input
          v-model.trim="presentationQuery"
          @focus="showPresDropdown = true"
          @input="onPresentationQueryInput"
          placeholder="Search presentation (e.g., 'amoxicillin 500 cap oral')…"
          :class="inputClass(errors.presentation)"
          class="w-full"
          autocomplete="off"
        />
        <ul
          v-show="showPresDropdown"
          class="absolute z-20 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-56 overflow-auto"
        >
          <li
            v-for="p in filteredPresentations"
            :key="p.id"
            @click="selectPresentation(p)"
            class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
          >
            <!-- common display format you’ve been using -->
            <span class="font-medium">{{ p.displayLabel }}</span>
          </li>
          <li
            @click="openCreatePresentationForm = true"
            class="px-3 py-2 cursor-pointer hover:bg-green-100 text-green-700 font-semibold border-t"
          >
            ➕ Create new presentation…
          </li>

          <CreatePresentationForm
            :open="openCreatePresentationForm"
            @created="onPresentationCreated"
            @close="openCreatePresentationForm = false"
          />
        </ul>
        <p v-if="errors.presentation" class="err">{{ errors.presentation }}</p>
      </div>
    </div>

    <!-- ─────────── BATCHES TABLE (MULTI) ─────────── -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-gray-700">Batches</span>
      <div class="flex items-center gap-2">
        <button type="button" class="btn-indigo !py-1" @click="addBatchRow">+ Add Batch</button>
      </div>
    </div>
    <p v-if="errors.batches" class="err mb-2">{{ errors.batches }}</p>

    <div class="space-y-6">
      <div
        v-for="(b, bIdx) in batches"
        :key="bIdx"
        class="p-4 rounded border border-gray-200"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">
            Batch #{{ bIdx + 1 }}
            <span class="text-gray-500 font-normal" v-if="perBatchTotals[bIdx] !== undefined">
              (Total qty: {{ perBatchTotals[bIdx] }})
            </span>
          </h3>
          <button
            type="button"
            v-show="batches.length > 1"
            class="px-3 py-1 rounded-lg text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors"
            :disabled="batches.length === 1"
            @click="removeBatchAt(bIdx)"
          >
            Remove Batch
          </button>
        </div>

        <div class="grid grid-cols-12 gap-3">
          <!-- batchNumber -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700">Batch No. <span class="text-red-600">*</span></label>
            <input
              v-model.trim="b.batch.batchNumber"
              :class="inputClass(rowErr(bIdx, 'batchNumber'))"
              autocomplete="off"
            />
            <p class="err" v-if="rowErr(bIdx,'batchNumber')">{{ rowErr(bIdx,'batchNumber') }}</p>
          </div>

          <!-- expiryDate -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700">Expiry Date <span class="text-red-600">*</span></label>
            <input
              v-model="b.batch.expiryDate"
              type="date"
              :class="inputClass(rowErr(bIdx, 'expiryDate'))"
            />
            <p class="err" v-if="rowErr(bIdx,'expiryDate')">{{ rowErr(bIdx,'expiryDate') }}</p>
          </div>

          <!-- supplier -->
          <div class="col-span-12 sm:col-span-4">
            <label class="block mb-1 text-gray-700">Supplier <span class="text-red-600">*</span></label>
            <input
              v-model.trim="b.batch.supplier"
              :class="inputClass(rowErr(bIdx,'supplier'))"
              autocomplete="off"
            />
            <p class="err" v-if="rowErr(bIdx,'supplier')">{{ rowErr(bIdx,'supplier') }}</p>
          </div>
        </div>

        <!-- LOCATIONS -->
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-700">Locations <span class="text-red-600">*</span></span>
            <div class="flex gap-2">
              <button type="button" class="btn-indigo !py-1" @click="addLocationRow(bIdx)">Add row</button>
              <button
                type="button"
                class="btn-gray !py-1"
                :disabled="bIdx === 0 || batches[bIdx - 1].locations.length === 0"
                @click="copyLocationsFromPrev(bIdx)"
                title="Copy locations from previous batch"
              >
                Copy above
              </button>
            </div>
          </div>
          <p class="err mb-2" v-if="rowErr(bIdx,'locations')">{{ rowErr(bIdx,'locations') }}</p>

          <div class="space-y-3">
            <div
              v-for="(loc, lIdx) in b.locations"
              :key="lIdx"
              class="grid grid-cols-12 gap-2 items-start"
            >
              <!-- Location name (free text). If you have IDs, add an autocomplete here -->
              <div class="col-span-12 sm:col-span-8">
                <label class="sr-only">Location</label>
                <input
                  v-model.trim="loc.location"
                  :class="inputClass(rowLocErr(bIdx,lIdx,'locationName'))"
                  placeholder="e.g., Cupboard A / Drawer 3"
                  autocomplete="off"
                />
                <p class="err" v-if="rowLocErr(bIdx,lIdx,'locationName')">
                  {{ rowLocErr(bIdx,lIdx,'locationName') }}
                </p>
              </div>

              <!-- Quantity -->
              <div class="col-span-9 sm:col-span-3">
                <label class="sr-only">Quantity</label>
                <input
                  v-model.number="loc.quantity"
                  type="number"
                  min="1"
                  step="1"
                  :class="inputClass(rowLocErr(bIdx,lIdx,'quantity'))"
                  placeholder="Qty"
                />
                <p class="err" v-if="rowLocErr(bIdx,lIdx,'quantity')">
                  {{ rowLocErr(bIdx,lIdx,'quantity') }}
                </p>
              </div>

              <div class="col-span-3 sm:col-span-1">
                <button
                  type="button"
                  @click="removeLocationAt(bIdx,lIdx)"
                  :disabled="b.locations.length === 1"
                  class="p-2 rounded-md text-red-600 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="Remove row"
                >
                  <!-- icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="1.5"
                       class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M14 11v6"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- GRAND TOTAL -->
    <div class="mt-4 text-sm text-gray-600">
      Grand total quantity: <strong>{{ grandTotal }}</strong>
    </div>

    <!-- ACTIONS -->
    <div class="flex justify-end gap-3 mt-6">
      <button type="button" :disabled="saving" class="btn-indigo" @click="handleSubmit(() => router.back())">
        {{ saving ? 'Saving…' : 'Save & Go Back' }}
      </button>
      <button type="button" :disabled="saving" class="btn-green" @click="handleSubmit(resetForm)">
        {{ saving ? 'Saving…' : 'Save & Add Another' }}
      </button>
      <button type="button" class="btn-gray" @click="router.back()">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import type { Drug, DrugPresentationView } from '../types/Drug'
import type { BatchPostData, DrugBatchLocation } from '../types/Batch'
import CreatePresentationForm from '../components/CreatePresentationForm.vue'
import { listAllPresentations } from '../api/drug'
import { createBatch } from '../api/batch'

// ─────────────────────────────────────────────────────────────────────────────
const router = useRouter()
const toast = useToast()

const drugs = ref<Drug[]>([])
const presentations = ref<DrugPresentationView[]>([])
const selectedPresentationId = ref<number | ''>('')
const presentationQuery = ref('')
const showPresDropdown = ref(false)
const presComboRef = ref<HTMLElement | null>(null)

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
    locations: [
      emptyBatchLocation()
    ]
  }
}

const saving = ref(false)
const errors = ref<Record<string, string>>({})
// Per-row errors: "b.<idx>.<field>" -> 'msg'  and "b.<idx>.loc.<lidx>.<field>" -> 'msg'
const rowErrors = ref<Record<string, string>>({})

const openCreatePresentationForm = ref(false)

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPresentations() {
  presentations.value = await listAllPresentations()
}


// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2',
   err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

const currentPresentation = computed(() =>
  presentations.value.find(p => p.id === selectedPresentationId.value) ?? null
)

const filteredPresentations = computed(() => {
  const q = presentationQuery.value.trim().toLowerCase()
  if (!q) return presentations.value.slice(0, 50) // small cap
  return presentations.value.filter(p =>
    p.displayLabel.toLowerCase().includes(q) ||
    p.drugName.toLowerCase().includes(q)
  )
})

function onPresentationQueryInput() {
  showPresDropdown.value = true
  selectedPresentationId.value = ''
}

function selectPresentation(p: DrugPresentationView) {
  selectedPresentationId.value = p.id
  presentationQuery.value = p.displayLabel
  showPresDropdown.value = false
}

function onClickOutside(e: MouseEvent) {
  if (presComboRef.value && !presComboRef.value.contains(e.target as Node) && !openCreatePresentationForm.value) {
    showPresDropdown.value = false
  }
}

onMounted(async () => {
 fetchPresentations()
 document.addEventListener('click', onClickOutside)
})

onUnmounted(() => document.removeEventListener('click', onClickOutside))

// ───────────── Batches ops
function addBatchRow() { batches.value.push(emptyBatch()) }

function removeBatchAt(idx: number) {
  if (batches.value.length > 1) batches.value.splice(idx, 1)
}

function addLocationRow(bIdx: number) {
  batches.value[bIdx].locations.push(emptyBatchLocation())
}

function removeLocationAt(bIdx: number, lIdx: number) {
  const arr = batches.value[bIdx].locations
  if (arr.length > 1) arr.splice(lIdx, 1)
}
function copyLocationsFromPrev(bIdx: number) {
  const prev = batches.value[bIdx - 1]
  batches.value[bIdx].locations = prev.locations.map(l => ({ ...l }))
}

// Computed totals
const perBatchTotals = computed(() =>
  batches.value.map(b => b.locations.reduce((s, l) => s + (Number(l.quantity) || 0), 0))
)
const grandTotal = computed(() => perBatchTotals.value.reduce((a, b) => a + b, 0))

// Error helpers
function keyB(bIdx: number, field: string) { return `b.${bIdx}.${field}` }
function keyL(bIdx: number, lIdx: number, field: string) { return `b.${bIdx}.loc.${lIdx}.${field}` }
const rowErr = (bIdx: number, field: string) => rowErrors.value[keyB(bIdx, field)]
const rowLocErr = (bIdx: number, lIdx: number, field: string) => rowErrors.value[keyL(bIdx, lIdx, field)]

// ───────────── Validation
function validate(): boolean {
  const e: Record<string, string> = {}
  const re: Record<string, string> = {}

  // 1) presentation
  if (!currentPresentation.value) {
    e.presentation = 'Choose a presentation.'
  }

  // 2) at least one batch row
  if (!batches.value.length) {
    e.batches = 'Add at least one batch.'
  }

  // 3) each batch row
  const today = new Date(); today.setHours(0,0,0,0)

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

    // locations
    if (!b.locations.length) re[keyB(bIdx, 'locations')] = 'Add at least one location.'
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
      if (!Number.isFinite(q) || q <= 0) re[keyL(bIdx, lIdx, 'quantity')] = 'Enter a positive number.'
    })
    // mark duplicates
    for (const [, idxs] of seenLocs) {
      if (idxs.length > 1) {
        idxs.forEach(i => { re[keyL(bIdx, i, 'locationName')] = 'Duplicate location in this batch.' })
      }
    }
  })

  for (const [, idxs] of seenBatchNos) {
    if (idxs.length > 1) {
      idxs.forEach(i => { re[keyB(i, 'batchNumber')] = 'Each batch number must be unique.' })
    }
  }

  errors.value = e
  rowErrors.value = re
  return Object.keys(e).length === 0 && Object.keys(re).length === 0
}

// ───────────── Submit
async function handleSubmit(onSuccess?: () => void) {
  if (!validate()) return
  
  const pres = currentPresentation.value;
  if (!pres) return;

  saving.value = true

  try {
    await Promise.all(
      batches.value.map(async b => {
        b.batch.expiryDate = new Date(b.batch.expiryDate).toISOString()
        await createBatch(pres.id, b)
      })
    )

    toast.success('Batches created')
    onSuccess?.()
  } catch (err: any) {
    console.error(err)
    toast.error('Failed to create batches')
  } finally {
    saving.value = false
  }
}

function onPresentationCreated(newPres: DrugPresentationView) {
  // add to local list (so it appears immediately in searches)
  presentations.value.unshift(newPres)
  selectedPresentationId.value = newPres.id
  presentationQuery.value = newPres.displayLabel
  openCreatePresentationForm.value = false
}

function resetForm() {
  batches.value = [emptyBatch()]
  // keep the selected presentation so users can continue adding more for same item
}
</script>

<style scoped>
.err { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
.btn-indigo { background: #4f46e5; color: #fff; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-indigo:hover { background: #4338ca; }
.btn-green { background: #16a34a; color: #fff; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-green:hover { background: #15803d; }
.btn-gray { background: #d1d5db; color: #000; padding: 0.5rem 1rem; border-radius: 0.25rem; }
.btn-gray:hover { background: #9ca3af; }
</style>
