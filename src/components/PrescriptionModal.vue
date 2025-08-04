<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Pharmacy</h1>
      <br />

      <div v-for="(entry, index) in prescribedDrugs" :key="index" class="mb-6 border border-gray-200 p-4 rounded-md">
        <!-- Drug Selector -->
        <div class="mb-2">
          <label class="block text-sm font-medium text-dark">Drug <span class="req">*</span></label>
          <select v-model.number="entry.drugId" @change="onDrugChange(index)" class="w-1/2 border p-1 rounded">
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
            <input type="radio" :name="'mode-' + index" value="manual" v-model="entry.mode" :disabled="!isEditing" @change="onModeChange(index, 'manual')"/>
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
                    <td class="p-1">{{ findBatch(entry.drugId!, b.batchId)?.batch_no || 'Unknown' }}</td>
                    <td class="p-1">{{ formatDate(findBatch(entry.drugId!, b.batchId)?.expiry_date || '') }}</td>
                    <td class="p-1">{{ b.quantity }}</td>
                    <td class="p-1">{{
                        calculateRemaining(entry.drugId!, b.batchId, b.quantity)
                    }}
                    </td>
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
              <tr v-for="(batch, bIndex) in availableBatches[entry.drugId ?? -1] || []" :key="batch.id">
                <td class="p-1">{{ batch.batch_no }}</td>
                <td class="p-1">{{ formatDate(batch.expiry_date) }}</td>
                <td class="p-1">{{ calculateRemaining(entry.drugId!, batch.id, entry.batches[bIndex]?.quantity ?? 0) }}</td>
                <td class="p-1">
                  <input type="number" min="0" :disabled="!isEditing"
                         v-model.number="entry.batches[bIndex].quantity"
                         class="w-20 border rounded px-1" />
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
        <button v-if="!isEditing" @click="toggleEdit"
                class="px-5 py-2 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5]">
          Edit
        </button>

        <button v-if="isEditing" @click="submitData"
            class="px-5 py-2 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5]">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import { BaseURL } from '@/main'
import type Patient from '@/types/Patient'
import type { Drug } from '@/types/Drug'
import type { DrugBatch } from '@/types/DrugBatch'
import type { Prescription } from '@/types/Prescription'

interface PrescriptionBatchItem {
  batchId: number
  quantity: number
}

interface DrugPrescriptionFormEntry {
  drugId: number | null
  mode: 'auto' | 'manual'
  quantity?: number
  remarks?: string
  batches: PrescriptionBatchItem[]
}

export default defineComponent({
  props: {
    patientId: { type: String, required: true },
    patientVid: { type: String, required: true },
    patientData: { type: Object as PropType<Patient>, required: true },
    isAdd: { type: Boolean, default: true },
  },
  data() {
    return {
      drugs: [] as Drug[],
      availableBatches: {} as Record<number, DrugBatch[]>,
      prescribedDrugs: [] as DrugPrescriptionFormEntry[],
      isEditing: false,
      existingPrescriptionId: null as number | null,
      originalPrescriptionBatchQuantities: {} as Record<number, number>, // maps batch id to its initial quanitty in the prescription
      autoModeErrors: {} as Record<number, string>, // maps index to error message
    }
  },
  created() {
    this.fetchPrescription()
    this.fetchDrugs()
  },
  methods: {
    calculateRemaining(drugId: number, batchId: number, currentQty: number): number {
        const available = this.availableBatches[drugId]?.find(b => b.id === batchId)

        const availableQty = available?.quantity ?? 0
        const originalPrescribedQty =  this.originalPrescriptionBatchQuantities[batchId] ?? 0

        return availableQty + originalPrescribedQty - currentQty
    },
    onModeChange(index: number, newMode: 'auto' | 'manual') {
        const entry = this.prescribedDrugs[index]
        entry.mode = newMode

        if (newMode === 'auto') {
            entry.quantity = 0
            entry.batches = []
        } else if (newMode === 'manual') {
            entry.quantity = undefined
            // Repopulate batches to match available batch structure
            const drugId = entry.drugId
            const batches = this.availableBatches[drugId ?? -1] || []
            entry.batches = batches.map(b => ({
            batchId: b.id,
            quantity: 0
            }))
        }
    },
    async fetchPrescription() {
        const res = await axios.get(`${BaseURL}/prescriptions?patient_id=${this.patientId}`)
        const prescription: Prescription = res.data[0] // assuming only one active prescription

        if (!prescription || !prescription.prescribedDrugs) return

        this.existingPrescriptionId = prescription.id ?? null
        this.prescribedDrugs = []

        for (const pd of prescription.prescribedDrugs) {
            const drugId = pd.drugId
            const batches = pd.batches || []

            // Preload batches
            const batchRes: DrugBatch[] = await (await axios.get(`${BaseURL}/pharmacy/batches?drug_id=${drugId}`)).data
            this.availableBatches[drugId] = batchRes

            // If manual, map existing batch quantities
            let batchEntries: PrescriptionBatchItem[] = []
            if (batches.length > 0) {

            batchEntries = batchRes.map((b: DrugBatch) => {
                const existing = batches.find((e) => e.batchId === b.id)
                return {
                batchId: b.id,
                quantity: existing ? existing.quantity : 0
                }
            })
            }

            this.prescribedDrugs.push({
            drugId,
            mode: batches.length > 0 ? 'manual' : 'auto',
            quantity: pd.quantity,
            remarks: pd.remarks,
            batches: batchEntries.length > 0
                ? batchEntries
                : batchRes.map((b: DrugBatch) => ({
                    batchId: b.id,
                    quantity: b.quantity,
                    }))
            })
        }

        for (const drug of this.prescribedDrugs) {
            for (const batch of drug.batches) {
                this.originalPrescriptionBatchQuantities[batch.batchId] = batch.quantity
            }
        }
    },
    calculateAutoBatches(index: number) {
        
        const entry = this.prescribedDrugs[index]
        const batches = this.availableBatches[entry.drugId ?? -1] || []

        // Calculate total available quantity
        const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0)

        if (entry.quantity && entry.quantity > totalAvailable) {
            this.autoModeErrors[index] = `Only ${totalAvailable} available. Reduce quantity.`
            entry.batches = [] // clear to prevent partial save
            return
        }

        // No error
        this.autoModeErrors[index] = ''

        const sorted = [...batches].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())

        const targetQty = entry.quantity ?? 0
        if (!targetQty || targetQty <= 0) {
            entry.batches = []
            return
        }

        let remaining = targetQty
        const result: PrescriptionBatchItem[] = []

        for (const b of sorted) {
            if (remaining <= 0) break
            const taken = Math.min(b.quantity, remaining)
            result.push({ batchId: b.id, quantity: taken })
            remaining -= taken
        }

        entry.batches = result
    },
    findBatch(drugId: number, batchId: number): DrugBatch | undefined {
        return this.availableBatches[drugId]?.find(b => b.id === batchId)
    },
    async fetchDrugs() {
      const res = await axios.get(`${BaseURL}/pharmacy/drugs`)
      this.drugs = res.data
    },

    async onDrugChange(index: number) {
      const entry = this.prescribedDrugs[index]
      if (!entry.drugId) return

      const response = await axios.get(`${BaseURL}/pharmacy/batches?drug_id=${entry.drugId}`)
      this.availableBatches[entry.drugId] = response.data
      entry.batches = response.data.map((b: DrugBatch) => ({
        batchId: b.id,
        quantity: 0
      }))
    },

    addDrugEntry() {
      this.prescribedDrugs.push({
        drugId: null,
        mode: 'auto',
        quantity: undefined,
        remarks: '',
        batches: []
      })
    },

    removeDrugEntry(index: number) {
      this.prescribedDrugs.splice(index, 1)
    },

    toggleEdit() {
      this.isEditing = !this.isEditing
    },

    async submitData() {
      const toast = useToast()

      for (const [i, entry] of this.prescribedDrugs.entries()) {
        if (entry.mode === 'auto' && this.autoModeErrors[i]) {
            toast.error(`Drug #${i + 1}: ${this.autoModeErrors[i]}`)
            return
        }
        if (!entry.drugId) {
          toast.error(`Drug #${i + 1}: Please select a drug.`)
          return
        }
        if (entry.mode === 'auto' && (!entry.quantity || entry.quantity <= 0)) {
          toast.error(`Drug #${i + 1}: Please specify quantity.`)
          return
        }
        if (entry.mode === 'manual' && !entry.batches.some(b => b.quantity > 0)) {
          toast.error(`Drug #${i + 1}: At least one batch must have quantity.`)
          return
        }
      }

      const payload = {
        patientId: Number(this.patientId),
        vid: Number(this.patientVid),
        prescribedDrugs: this.prescribedDrugs.map(entry => ({
          drugId: entry.drugId!,
          quantity: entry.mode === 'auto'
            ? entry.quantity!
            : entry.batches.reduce((sum, b) => sum + b.quantity, 0),
          remarks: entry.remarks ?? '',
          batches: entry.batches.filter(b => b.quantity > 0)
        }))
      }

      try {
        if (this.existingPrescriptionId) {
            await axios.patch(`${BaseURL}/prescriptions/${this.existingPrescriptionId}`, payload)
        } else {
            await axios.post(`${BaseURL}/prescriptions`, payload)
        }
        toast.success('Prescription saved successfully.')
        this.toggleEdit()
      } catch (error: unknown) {
        const err = error as AxiosError
        console.error(err)
        toast.error(err.message || 'Failed to save prescription.')
      }
    },

    formatDate(date: string): string {
      const d = new Date(date)
      return isNaN(d.getTime()) ? date : d.toLocaleDateString()
    }
  }
})
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
