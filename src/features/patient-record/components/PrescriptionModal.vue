<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Pharmacy</h1>
      <br />

      <div
        v-for="(entry, index) in prescribedDrugs"
        :key="index"
        class="mb-6 border border-gray-200 p-4 rounded-md"
      >
        <!-- Drug Selector -->
        <div class="mb-2">
          <label class="block text-sm font-medium text-dark">Drug <span class="req">*</span></label>
          <select
            v-model.number="entry.drugId"
            @change="onDrugChange(index)"
            class="w-1/2 border p-1 rounded"
          >
            <option :value="null">Select a drug</option>
            <option v-for="drug in drugs" :key="drug.id" :value="drug.id">{{ drug.name }}</option>
          </select>
        </div>

        <!-- Mode Toggle -->
        <div class="flex space-x-4 mt-2">
          <label>
            <input
              type="radio"
              :name="'mode-' + index"
              value="auto"
              v-model="entry.mode"
              :disabled="!isEditing"
              @change="onModeChange(index, 'auto')"
            />

            <span class="ml-2 text-sm">Auto</span>
          </label>
          <label>
            <input
              type="radio"
              :name="'mode-' + index"
              value="manual"
              v-model="entry.mode"
              :disabled="!isEditing"
              @change="onModeChange(index, 'manual')"
            />
            <span class="ml-2 text-sm">Manual</span>
          </label>
        </div>

        <!-- Remarks -->
        <div class="mt-2">
          <label class="block text-sm">Remarks</label>
          <input v-model="entry.remarks" class="w-full border p-1 rounded" :disabled="!isEditing" />
        </div>

        <!-- Auto Mode -->
        <div v-if="entry.mode === 'auto'" class="mt-3">
          <label class="block text-sm">Quantity <span class="req">*</span></label>
          <!-- Quantity Input -->
          <input
            type="number"
            v-model.number="entry.quantity"
            min="0"
            class="w-1/4 border p-1 rounded"
            :disabled="!isEditing"
          />

          <!-- Generate Batches Button -->
          <button
            v-if="isEditing"
            class="ml-4 px-3 py-1 border text-sm rounded text-green-700 border-green-600 hover:bg-green-600 hover:text-white"
            @click="calculateAutoBatches(index)"
            :disabled="!entry.quantity || entry.quantity <= 0"
          >
            Generate Batches
          </button>

          <p v-if="autoModeErrors[index]" class="text-red-600 text-sm mt-1">
            {{ autoModeErrors[index] }}
          </p>

          <table v-if="entry.batches.length" class="w-full mt-2 text-sm border-collapse">
            <thead>
              <tr>
                <th class="text-left p-1 border-b">Batch</th>
                <th class="text-left p-1 border-b">Expiry</th>
                <th class="text-left p-1 border-b">Selected Qty</th>
                <th class="text-left p-1 border-b">Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in entry.batches" :key="b.batchId">
                <td class="p-1">
                  {{ findBatch(entry.drugId!, b.batchId)?.batchNo || 'Unknown' }}
                </td>
                <td class="p-1">
                  {{ formatDate(findBatch(entry.drugId!, b.batchId)?.expiryDate || '') }}
                </td>
                <td class="p-1">{{ b.quantity }}</td>
                <td class="p-1">{{ calculateRemaining(entry.drugId!, b.batchId, b.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Manual Mode -->
        <div v-if="entry.mode === 'manual'" class="mt-3">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th class="text-left p-1 border-b">Batch</th>
                <th class="text-left p-1 border-b">Expiry</th>
                <th class="text-left p-1 border-b">Available</th>
                <th class="text-left p-1 border-b">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(batch, bIndex) in availableBatches[entry.drugId ?? -1] || []"
                :key="batch.id"
              >
                <td class="p-1">{{ batch.batchNo }}</td>
                <td class="p-1">{{ formatDate(batch.expiryDate) }}</td>
                <td class="p-1">
                  {{
                    calculateRemaining(
                      entry.drugId!,
                      batch.id,
                      entry.batches[bIndex]?.quantity ?? 0
                    )
                  }}
                </td>
                <td class="p-1">
                  <input
                    type="number"
                    min="0"
                    :disabled="!isEditing"
                    v-model.number="entry.batches[bIndex].quantity"
                    class="w-20 border rounded px-1"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Remove Drug Button -->
        <button
          @click="removeDrugEntry(index)"
          class="mt-4 px-3 py-1 rounded-lg text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
          v-if="isEditing"
        >
          Remove Drug
        </button>
      </div>

      <!-- Add Drug Button -->
      <button
        v-if="isEditing"
        @click="addDrugEntry"
        class="mt-2 px-4 py-2 border rounded text-sm text-[#3f51b5]"
      >
        Add Drug
      </button>

      <!-- Edit & Save Buttons -->
      <div class="flex flex-row-reverse w-full mt-5 space-x-3 space-x-reverse">
        <button
          v-if="!isEditing && !isAdd"
          @click="toggleEdit"
          class="px-5 py-2 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5]"
        >
          Edit
        </button>

        <button
          v-if="isEditing && !isAdd"
          @click="submitData"
          class="px-5 py-2 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5]"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import {
  fetchPrescriptions,
  fetchPrescriptionDrugs,
  fetchBatchesByDrug,
  upsertPrescription,
  type PrescriptionDrugMeta,
  type DrugBatchMeta,
  type UpsertPrescriptionPayload
} from '@features/patient-record/api/prescription'
import type Patient from '@patient-record/types/Patient'
import type { DrugPrescription, Prescription } from '@features/pharmacy/types/Prescription'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

interface FormBatchSelection {
  batchId: number
  quantity: number
}
interface DrugPrescriptionFormEntry {
  drugId: number | null
  mode: 'auto' | 'manual'
  quantity?: number
  remarks?: string
  batches: FormBatchSelection[]
}

const props = defineProps<{
  patientId: string
  patientVid: string
  patientData: Patient
  isAdd?: boolean
}>()

const toast = useToast()
const { isEditing, toggleEdit, save } = useEditableSection<any>()

// Reactive state
const drugs = ref<PrescriptionDrugMeta[]>([])
const availableBatches = ref<Record<number, DrugBatchMeta[]>>({})
const prescribedDrugs = ref<DrugPrescriptionFormEntry[]>([])
const existingPrescriptionId = ref<number | null>(null)
const originalPrescriptionBatchQuantities = ref<Record<number, number>>({})
const autoModeErrors = ref<Record<number, string>>({})

onMounted(() => {
  fetchPrescription()
  fetchDrugs()
})

function calculateRemaining(drugId: number, batchId: number, currentQty: number): number {
  const available = availableBatches.value[drugId]?.find((b) => b.id === batchId)
  const availableQty = available?.quantity ?? 0
  const originalPrescribedQty = originalPrescriptionBatchQuantities.value[batchId] ?? 0
  return availableQty + originalPrescribedQty - currentQty
}

function onModeChange(index: number, newMode: 'auto' | 'manual') {
  const entry = prescribedDrugs.value[index]
  entry.mode = newMode
  if (newMode === 'auto') {
    entry.quantity = 0
    entry.batches = []
  } else {
    entry.quantity = undefined
    const drugId = entry.drugId
    const batches = availableBatches.value[drugId ?? -1] || []
    entry.batches = batches.map((b) => ({ batchId: b.id, quantity: 0 }))
  }
}

async function fetchPrescription() {
  const res = await fetchPrescriptions(props.patientId)
  const prescription = (res && res.length > 0 ? res[0] : null) as Prescription | null
  if (!prescription) return
  existingPrescriptionId.value = prescription.id ?? null
  prescribedDrugs.value = []
  for (const pd of prescription.prescribedDrugs as DrugPrescription[]) {
    const drugId = pd.drugId
    const batches = pd.batches || []
    const batchRes = await fetchBatchesByDrug(drugId)
    availableBatches.value[drugId] = batchRes
    const batchEntries: FormBatchSelection[] = batchRes.map((b) => {
      const existing = batches.find((e) => e.batchId === b.id)
      return { batchId: b.id, quantity: existing ? existing.quantity : 0 }
    })
    prescribedDrugs.value.push({
      drugId,
      mode: batches.length > 0 ? 'manual' : 'auto',
      quantity: pd.quantity,
      remarks: pd.remarks,
      batches: batchEntries
    })
    for (const be of batchEntries) {
      originalPrescriptionBatchQuantities.value[be.batchId] = be.quantity
    }
  }
}

function calculateAutoBatches(index: number) {
  const entry = prescribedDrugs.value[index]
  const batches = availableBatches.value[entry.drugId ?? -1] || []
  const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0)
  if (entry.quantity && entry.quantity > totalAvailable) {
    autoModeErrors.value[index] = `Only ${totalAvailable} available. Reduce quantity.`
    entry.batches = []
    return
  }
  autoModeErrors.value[index] = ''
  const sorted = [...batches].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  )
  const targetQty = entry.quantity ?? 0
  if (!targetQty || targetQty <= 0) {
    entry.batches = []
    return
  }
  let remaining = targetQty
  const result: FormBatchSelection[] = []
  for (const b of sorted) {
    if (remaining <= 0) break
    const taken = Math.min(b.quantity, remaining)
    result.push({ batchId: b.id, quantity: taken })
    remaining -= taken
  }
  entry.batches = result
}

function findBatch(drugId: number, batchId: number) {
  return availableBatches.value[drugId]?.find((b) => b.id === batchId)
}

async function fetchDrugs() {
  drugs.value = await fetchPrescriptionDrugs()
}

async function onDrugChange(index: number) {
  const entry = prescribedDrugs.value[index]
  if (!entry.drugId) return
  const response = await fetchBatchesByDrug(entry.drugId)
  availableBatches.value[entry.drugId] = response
  entry.batches = response.map((b) => ({ batchId: b.id, quantity: 0 }))
}

function addDrugEntry() {
  prescribedDrugs.value.push({
    drugId: null,
    mode: 'auto',
    quantity: undefined,
    remarks: '',
    batches: []
  })
}

function removeDrugEntry(index: number) {
  prescribedDrugs.value.splice(index, 1)
}

function buildPayload(): UpsertPrescriptionPayload | null {
  for (const [i, entry] of prescribedDrugs.value.entries()) {
    if (entry.mode === 'auto' && autoModeErrors.value[i]) {
      toast.error(`Drug #${i + 1}: ${autoModeErrors.value[i]}`)
      return null
    }
    if (!entry.drugId) {
      toast.error(`Drug #${i + 1}: Please select a drug.`)
      return null
    }
    if (entry.mode === 'auto' && (!entry.quantity || entry.quantity <= 0)) {
      toast.error(`Drug #${i + 1}: Please specify quantity.`)
      return null
    }
    if (entry.mode === 'manual' && !entry.batches.some((b) => b.quantity > 0)) {
      toast.error(`Drug #${i + 1}: At least one batch must have quantity.`)
      return null
    }
  }
  return {
    patientId: props.patientId,
    visitId: props.patientVid,
    entries: prescribedDrugs.value.map((entry) => ({
      drugId: entry.drugId!,
      dosage: '',
      frequency: '',
      quantity:
        entry.mode === 'auto'
          ? entry.quantity!
          : entry.batches.reduce((sum, b) => sum + b.quantity, 0),
      batchId: entry.batches.find((b) => b.quantity > 0)?.batchId ?? null
    }))
  }
}

async function submitData() {
  const payload = buildPayload()
  if (!payload) return
  await save({
    buildPayload: () => payload,
    update: async () => {
      await upsertPrescription(existingPrescriptionId.value, payload)
    },
    onSuccess: () => toast.success('Prescription saved successfully.')
  })
}

function formatDate(date: string): string {
  const d = new Date(date)
  return isNaN(d.getTime()) ? date : d.toLocaleDateString()
}
</script>

<style scoped>
.req {
  color: red;
}
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
