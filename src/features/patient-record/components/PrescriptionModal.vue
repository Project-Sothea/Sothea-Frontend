 <!-- Add button for mark  -->

<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 border border-gray-300 p-10">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-medium">
          {{ existingId ? 'Update Prescription' : 'Create Prescription' }}
        </h1>
      </div>

      <!-- Read-only banner when dispensed -->
      <div
        v-if="isReadOnly"
        class="mt-4 p-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-sm"
      >
        This prescription has already been <strong>dispensed</strong> and can’t be edited.
      </div>

      <!-- Lines editor (shown when there is at least one line or an existing Rx) -->
      <div>
        <div
          v-for="(drug, idx) in prescription.prescribedDrugs"
          :key="idx"
          class="mt-6 border border-gray-200 p-4 rounded-md"
        >
          <div class="flex items-start gap-6">
            <!-- Drug selector -->
            <div class="w-2/5">
              <label
                class="block text-sm font-medium text-dark"
                :for="`drug-${idx}`"
                :input-id="`drug-${idx}`"
              >
                Drug <span class="text-red-600" v-if="!isReadOnly">*</span>
              </label>
              <DrugSearchSelect
                v-model="drug.drugId"
                :all-drugs="drugs"
                :exclude-ids="selectedDrugIds"
                :error="drugErrors[idx]?.drug"
                :disabled="isReadOnly"
                :input-id="`drug-${idx}`"
                @update:modelValue="onDrugCommitted(idx, $event)"
              />

              <!-- isPacked badge -->
              <div class="mt-2">
                <span
                  v-if="drug.isPacked"
                  class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
                  title="This line is packed"
                >
                  <!-- tiny dot -->
                  <span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>
                  Packed
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
                  title="This line is not packed"
                >
                  <span class="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
                  Not packed
                </span>
              </div>

              <p v-if="drugErrors[idx]?.drug" class="text-xs text-red-600 mt-1">
                {{ drugErrors[idx].drug }}
              </p>
            </div>

            <!-- Requested Qty -->
            <div class="w-1/5">
              <label class="block text-sm font-medium text-dark">
                Required Qty <span class="text-red-600" v-if="!isReadOnly">*</span>
              </label>
              <input
                type="number"
                min="1"
                v-model.number="drug.requestedQty"
                class="mt-1 w-full border p-2 rounded text-right disabled:bg-gray-50"
                placeholder="e.g. 30"
                :disabled="isReadOnly"
              />
              <p v-if="drugErrors[idx]?.qty" class="text-xs text-red-600 mt-1">
                {{ drugErrors[idx].qty }}
              </p>
            </div>

            <!-- Remarks (optional) -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-dark" :for="`remarks-${idx}`">Remarks</label>
              <textarea
                :id="`remarks-${idx}`"
                v-model="drug.remarks"
                rows="2"
                class="mt-1 w-full border p-2 rounded disabled:bg-gray-50
                      resize-y overflow-y-auto overflow-x-hidden
                      min-h-[2.5rem] max-h-40"
                placeholder="Optional notes"
                :disabled="isReadOnly"
              />
            </div>
          </div>
          <!-- Delete line -->
          <div class="mt-4" v-if="!isReadOnly">
            <button
              class="px-3 py-1 rounded-lg text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              @click="removeDrug(idx)"
            >
              Delete
            </button>
          </div>
          <div class="my-4 border-t border-gray-200">
            <!-- Summary bar: sits under the row, shows status + toggle -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-sm">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 text-[#3f51b5] hover:underline disabled:opacity-60"
                  @click="toggleBatches(idx)"
                  :disabled="!drug.drugId || drug.drugId <= 0 || !drug.requestedQty"
                  :aria-expanded="expandedRows[idx] ? 'true' : 'false'"
                  :aria-controls="`alloc-panel-${idx}`"
                >
                  <svg viewBox="0 0 20 20" class="h-4 w-4 transition-transform"
                      :class="expandedRows[idx] ? 'rotate-90' : ''" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 4l8 6-8 6V4z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ expandedRows[idx] ? 'Hide allocation' : 'View allocation' }}</span>
                </button>

                <div class="text-gray-700">
                  Allocated:
                  <span :class="lineAllocated(drug) === Number(drug.requestedQty) ? 'text-green-700 font-medium' : 
                    lineAllocated(drug) < Number(drug.requestedQty) ?  'text-amber-700 font-medium' : 'text-red-700 font-medium'">
                    {{ lineAllocated(drug) }} / {{ Number(drug.requestedQty) || 0 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Dropdown panel BELOW the row -->
            <transition name="fade">
              <div
                v-if="expandedRows[idx] && drug.drugId > 0"
                :id="`alloc-panel-${idx}`"
                class="mt-3 -mx-4 px-4 pb-4"
                role="region"
              >
                <div>
                  <BatchAllocator
                    :key="`alloc-${idx}-${drug.drugId}`"
                    :drug-id="drug.drugId"
                    :requested-qty="Number(drug.requestedQty) || 0"
                    v-model="drug.batches"
                    v-model:isPacked="drug.isPacked"
                    :disabled="isReadOnly"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Add another drug -->
        <div class="mt-4" v-if="!isReadOnly">
          <button
            class="px-4 py-2 border rounded text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white"
            @click="addDrug"
          >
            Add Drug
          </button>
        </div>
        <!-- Actions -->
        <div class="w-full mt-6 flex justify-end">
          <div class="grid grid-cols-[max-content,max-content] gap-3">
            <!-- Row 1 -->
            <button
              class="px-5 py-2 rounded-lg text-sm border"
              @click="resetForm"
              :disabled="submitting || isReadOnly || !isDirty"
            >
              Reset
            </button>
            <button
              class="px-5 py-2 rounded-lg text-sm text-white bg-[#3f51b5] hover:opacity-90 disabled:opacity-60"
              @click="submit"
              :disabled="submitting || !prescription.prescribedDrugs.length || isReadOnly"
            >
              {{ submitting ? 'Saving…' : (existingId ? 'Save' : 'Create') }}
            </button>

            <!-- Row 2: Dispense spans both -->
            <button
              class="col-span-2 px-5 py-2 rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
              @click="onDispenseClick"
              :disabled="submitting || isReadOnly || !canDispense"
              title="All drugs must be packed"
            >
              {{ submitting ? 'Saving…' : 'Mark Dispensed & Save' }}
            </button>
          </div>
        </div>

        <!-- Confirmation dialog -->
        <ConfirmationDialogue
          :open="confirmDispenseOpen"
          title="Dispense prescription?"
          message="Once dispensed, this prescription becomes read-only and can’t be edited. Continue?"
          confirm-text="Yes, dispense"
          cancel-text="No, go back"
          :close-on-backdrop="false"
          :close-on-esc="false"
          @confirm="confirmDispense"
          @cancel="cancelDispense"
        />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { fetchDrugs } from '@/features/pharmacy/api/pharmacy';
import type { Drug } from '@/features/pharmacy/types/Drug';
import type { Prescription } from '@/features/pharmacy/types/Prescription';
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useToast } from 'vue-toast-notification'
import { createPrescription, fetchPrescriptionByVisit, updatePrescription } from '../api/prescription';
import DrugSearchSelect from './DrugSearchSelect.vue';
import BatchAllocator from './BatchAllocator.vue' // <- the component I gave earlier
import ConfirmationDialogue from './ConfirmationDialogue.vue';


// --- Props ---
const props = defineProps<{ patientId: string | number; patientVid: string | number }>()

// --- State ---
const toast = useToast()
const drugs = ref<Drug[]>([])
const prescription = ref<Prescription>({
      patientId: Number(props.patientId),
      vid: Number(props.patientVid),
      prescribedDrugs: [],
      isDispensed: false,
    })
const pristine = ref<Prescription>({
      patientId: Number(props.patientId),
      vid: Number(props.patientVid),
      prescribedDrugs: [],
      isDispensed: false,
    })
const existingId = ref<number | null>(null)
const isReadOnly = ref<boolean>(false)
const confirmDispenseOpen = ref<boolean>(false)

const expandedRows = ref<Record<number, boolean>>({})

const drugErrors = ref<Record<number, { drug?: string; qty?: string }>>({})

const submitting = ref(false)

const isDirty = computed(() => {
  if (!pristine.value) return false
  return JSON.stringify(prescription.value) !== JSON.stringify(pristine.value)
})

// --- Load existing prescription (by visit) & drugs ---
onMounted(async () => {
  try {
    drugs.value = await fetchDrugs()
  } catch {
    drugs.value = []
  }

  await reloadExisting()
})

async function reloadExisting() {
  let fetchedPrescription;
  try {
    fetchedPrescription = await fetchPrescriptionByVisit(props.patientId, props.patientVid)
    if (fetchedPrescription?.isDispensed) {
      isReadOnly.value = true;
    }
  } catch {
    fetchedPrescription = null;
  }

  if (fetchedPrescription?.id) {
    existingId.value = fetchedPrescription.id
    prescription.value = fetchedPrescription
    pristine.value = structuredClone(fetchedPrescription)
  } else {
    existingId.value = null
  }
  drugErrors.value = {}
}

const canDispense = computed(() => {
  const rows = prescription.value.prescribedDrugs
  if (!rows.length) return false
  return rows.every(r => !!r.isPacked)
})

// Helper: get all selected drug ids
const selectedDrugIds = computed(() =>
  prescription.value.prescribedDrugs
    .map(d => d.drugId)
    .filter((id): id is number => typeof id === 'number' && id > 0)
)

function lineCanStayPacked(line: {
  requestedQty?: number
  batches?: Array<{ quantity: number }>
}) {
  const rq = Number(line.requestedQty) || 0
  return rq > 0 && lineAllocated(line) === rq
}

// One watcher to rule them all
watch(
  () => prescription.value.prescribedDrugs.map(d => ({
    rq: Number(d.requestedQty) || 0,
    alloc: lineAllocated(d),
    packed: !!d.isPacked,
  })),
  (rows) => {
    rows.forEach((row, i) => {
      const line = prescription.value.prescribedDrugs[i]
      if (row.packed && !lineCanStayPacked(line)) {
        line.isPacked = false
      }
    })
  },
  { deep: true, immediate: true }
)


// --- UI actions ---
function addDrug() {
  prescription.value.prescribedDrugs.push({
    drugId: -1,
    requestedQty: 0,
    remarks: '',
    batches: [],
    isPacked: false,
  })
}
function removeDrug(idx: number) {
  prescription.value.prescribedDrugs.splice(idx, 1)
  // clear errors for simplicity
  drugErrors.value = {}
}

function onDrugCommitted(idx: number, _newId: number | null) {
  const line = prescription.value.prescribedDrugs[idx]
  // wipe allocations linked to prior drug
  line.batches = []   // and any other per-drug fields (e.g., batchLocations)
  line.isPacked = false
  const e = { ...drugErrors.value }
  if (e[idx]?.drug) delete e[idx].drug
  drugErrors.value = e
}

function toggleBatches(idx: number) {
  expandedRows.value[idx] = !expandedRows.value[idx]
  if (expandedRows.value[idx]) {
    nextTick(() => document.getElementById(`alloc-panel-${idx}`)?.scrollIntoView({behavior:'smooth', block:'nearest'}))
  }
}

// tiny helpers for the summary line
function lineAllocated(line: { batches?: Array<{ quantity: number }>}) {
  const arr = Array.isArray(line.batches) ? line.batches : []
  return arr.reduce((s, b) => s + (Number(b.quantity) || 0), 0)
}

function resetForm() {
  expandedRows.value = {}
  if (existingId.value) {
    reloadExisting()
  } else {
    prescription.value = {
      patientId: Number(props.patientId),
      vid: Number(props.patientVid),
      prescribedDrugs: [],
      isDispensed: false,
    }
    drugErrors.value = {}
  }
}

// --- Validation ---
function validate(): boolean {
  if (isReadOnly.value) {
    toast.error('This prescription has been dispensed and cannot be edited.')
    return false
  }
  if (!prescription.value.prescribedDrugs.length) {
    toast.error('Add at least one drug before saving.')
    return false
  }

  let ok = true
  const errs: Record<number, { drug?: string; qty?: string }> = {}

  prescription.value.prescribedDrugs.forEach((d, idx) => {
    const e: { drug?: string; qty?: string } = {}
    if (!d.drugId || d.drugId <= 0) {
      e.drug = 'Please select a drug.'
      ok = false
    }

    const requested = Number(d.requestedQty) || 0
    if (requested <= 0) {
      e.qty = 'Quantity must be greater than 0.'
      ok = false
    }
    const allocated = lineAllocated(d)
    if (requested > 0 && allocated > requested) {
      e.qty = `Allocated (${allocated}) cannot exceed requested (${requested}).`
      toggleBatches(idx)
      ok = false
    }
    if (Object.keys(e).length) errs[idx] = e
  })

  drugErrors.value = errs
  return ok
}

// --- Save ---
async function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    if (existingId.value) {
      await updatePrescription(prescription.value)
      toast.success('Prescription saved.')
      await reloadExisting()
    } else {
      const created = await createPrescription(prescription.value)
      existingId.value = created.id ?? null
      toast.success('Prescription created.')
      await reloadExisting()
    }
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to save prescription.')
  } finally {
    submitting.value = false
  }
}

function onDispenseClick() {
  if (submitting.value) return
  if (!canDispense.value) {
    toast.error('All drugs must be packed before dispensing.')
    return
  }
  confirmDispenseOpen.value = true
}

async function confirmDispense() {
  if (submitting.value) return
  confirmDispenseOpen.value = false
  const prev = !!prescription.value.isDispensed
  try {
    prescription.value.isDispensed = true
    await submit()                    
  } catch (e) {
    prescription.value.isDispensed = prev
    throw e
  }
}

function cancelDispense() {
  confirmDispenseOpen.value = false
}

</script>
