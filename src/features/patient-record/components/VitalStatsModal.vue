<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Vital Statistics</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- Temperature -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Temperature <span class="req">*</span></label
            >
            <input
              v-model="temperature"
              type="number"
              step="0.01"
              placeholder="Degree Celsius"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>

          <!-- SpO2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              SpO2 <span class="req">*</span></label
            >
            <input
              v-model="spo2"
              type="number"
              step="0.01"
              placeholder="%"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-row mb-2">
          <!-- Systolic BP1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Systolic BP1</label>
            <input
              v-model="systolicBp1"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>
          <!-- Systolic BP2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Systolic BP2</label>
            <input
              v-model="systolicBp2"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>

          <!-- Avg Systolic BP -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Avg Systolic BP</label>
            <input
              :value="avgSystolicBP"
              disabled
              type="number"
              step="0.01"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-row mb-2">
          <!-- Diastolic BP1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Diastolic BP1</label>
            <input
              v-model="diastolicBp1"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>
          <!-- Diastolic BP2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Diastolic BP2</label>
            <input
              v-model="diastolicBp2"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>

          <!-- Avg Diastolic BP -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Avg Diastolic BP
            </label>
            <input
              :value="avgDiastolicBP"
              disabled
              type="number"
              step="0.01"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-row mb-2">
          <!-- HR1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              HR1 <span class="req">*</span></label
            >
            <input
              v-model="hr1"
              type="number"
              step="1"
              placeholder="BPM"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>
          <!-- HR2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              HR2 <span class="req">*</span></label
            >
            <input
              v-model="hr2"
              type="number"
              step="1"
              placeholder="BPM"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>

          <!-- Avg HR -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Avg HR <span class="req">*</span></label
            >
            <input
              :value="avgHR"
              disabled
              type="number"
              step="1"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-row mb-2">
          <!-- Random Blood Glucose (mmol/L) -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Random Blood Glucose (mmol/L)
            </label>
            <input
              v-model="randBloodGlucoseMmolL"
              type="number"
              step="0.01"
              placeholder="mmol/L"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>
        </div>

        <!-- ICOPE: High blood pressure? -->
        <div class="mb-2" v-if="showIcope">
          <!-- Row 1 -->
          <div class="text-sm font-medium text-dark">ICOPE (60 yo and above):</div>

          <!-- Row 2: text + radios side by side -->
          <div class="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div class="text-sm text-dark">
              <span>High blood pressure?</span>
              <span class="text-xs text-gray-600"> (BP ≥ 140/90 for 2 readings)</span>
              <span class="req">*</span>
            </div>

            <!-- Y / N (sits just to the right of the text, not far right) -->
            <div class="flex items-center gap-6">
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="icope-high-bp"
                  class="w-4 h-4"
                  v-model="icopeHighBp"
                  :value="true"
                  :disabled="!isEditing"
                />
                <span class="text-sm">Y</span>
              </label>

              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="icope-high-bp"
                  class="w-4 h-4"
                  v-model="icopeHighBp"
                  :value="false"
                  :disabled="!isEditing"
                />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="flex flex-row-reverse w-full mt-5">
          <button
            v-if="!isEditing && !isAdd"
            @click="toggleEdit"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
          >
            Edit
          </button>
        </div>

        <!-- Save Edits Button -->
        <div class="flex flex-row-reverse w-full mt-5 gap-3" v-if="isEditing && !isAdd">
          <button
            @click="submitData"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
          >
            Save Edits
          </button>
          <button
            type="button"
            @click="discardEdit"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 focus:outline-none"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type VitalStatistics from '@patient-record/types/VitalStatistics'
import type Patient from '@patient-record/types/Patient'
import { updateSection } from '@features/patient-record/api/visit'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import { calculateAge } from '@shared/utils/age'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  age: number | null
  isAdd?: boolean
  patientVid?: string
}>()

const temperature = ref<number | null>(null)
const spo2 = ref<number | null>(null)
const systolicBp1 = ref<number | null>(null)
const systolicBp2 = ref<number | null>(null)
const diastolicBp1 = ref<number | null>(null)
const diastolicBp2 = ref<number | null>(null)
const hr1 = ref<number | null>(null)
const hr2 = ref<number | null>(null)
const randBloodGlucoseMmolL = ref<number | null>(null)

const calculatedAge = computed(() => props.age ?? calculateAge(props.patientData?.admin?.dob))
const showIcope = computed<boolean>(() =>
  calculatedAge.value != null ? calculatedAge.value >= 60 : true
)

const icopeHighBp = ref<boolean | null>(null)

const toast = useToast()

// Automatic draft management - handles everything
const formDraft = useAutoDraft<VitalStatistics>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:vitalStatistics`
  }),
  fields: [
    { key: 'temperature', ref: temperature },
    { key: 'spo2', ref: spo2 },
    { key: 'systolicBp1', ref: systolicBp1 },
    { key: 'systolicBp2', ref: systolicBp2 },
    { key: 'diastolicBp1', ref: diastolicBp1 },
    { key: 'diastolicBp2', ref: diastolicBp2 },
    { key: 'hr1', ref: hr1 },
    { key: 'hr2', ref: hr2 },
    { key: 'randBloodGlucoseMmolL', ref: randBloodGlucoseMmolL },
    { key: 'icopeHighBp', ref: icopeHighBp }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved vital statistics draft from this device.'
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.vitalStatistics || null)
  },
  { immediate: true }
)
const avgSystolicBP = computed(() => {
  if (systolicBp1.value && systolicBp2.value) {
    return (Number(systolicBp1.value) + Number(systolicBp2.value)) / 2
  }
  return null
})

const avgDiastolicBP = computed(() => {
  if (diastolicBp1.value && diastolicBp2.value) {
    return (Number(diastolicBp1.value) + Number(diastolicBp2.value)) / 2
  }
  return null
})

const avgHR = computed(() => {
  if (hr1.value && hr2.value) {
    return (Number(hr1.value) + Number(hr2.value)) / 2
  }
  return null
})

function buildPayload(): VitalStatistics | null {
  if (
    !runChecks([
      [temperature.value !== null, 'Please enter temperature'],
      [spo2.value !== null, 'Please enter SpO2'],
      [hr1.value !== null, 'Please enter HR1'],
      [hr2.value !== null, 'Please enter HR2'],
      [avgHR.value !== null, 'Average HR cannot be empty'],
      [!showIcope.value || icopeHighBp.value !== null, 'Please answer ICOPE question']
    ])
  )
    return null
  if (
    temperature.value! > 9999 ||
    spo2.value! > 9999 ||
    (systolicBp1.value && systolicBp1.value > 9999) ||
    (systolicBp2.value && systolicBp2.value > 9999) ||
    (diastolicBp1.value && diastolicBp1.value > 9999) ||
    (diastolicBp2.value && diastolicBp2.value > 9999) ||
    hr1.value! > 9999 ||
    hr2.value! > 9999 ||
    randBloodGlucoseMmolL.value! > 9999
  ) {
    toast.error('Values cannot be greater than 9999')
    return null
  }
  return {
    temperature: temperature.value!,
    spo2: spo2.value!,
    systolicBp1: systolicBp1.value || null,
    systolicBp2: systolicBp2.value || null,
    diastolicBp1: diastolicBp1.value || null,
    diastolicBp2: diastolicBp2.value || null,
    averageSystolicBP: avgSystolicBP.value,
    averageDiastolicBP: avgDiastolicBP.value,
    hr1: hr1.value!,
    hr2: hr2.value!,
    averageHR: avgHR.value!,
    randBloodGlucoseMmolL: randBloodGlucoseMmolL.value || null,
    icopeHighBp: icopeHighBp.value || null
  }
}

async function submitData() {
  if (!props.patientVid) {
    toast.error('Missing visit id')
    return
  }
  await save({
    buildPayload,
    update: () =>
      updateSection(props.patientId, props.patientVid!, 'vitalStatistics', buildPayload()!),
    onSuccess: () => {
      toast.success('Vital Statistics saved successfully!')
      // After saving, the form already has the correct values in memory
      // We don't need to reload from parent - the form state is the source of truth
      // The initialized flag prevents re-initialization from stale patientData
    }
  })
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      // Reset to server data or defaults (force re-initialization)
      formDraft.initialize(props.patientData?.vitalStatistics || null, true)
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
  })
}
function preventNegative(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e') event.preventDefault()
}
</script>
<style>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
.req {
  color: red;
}
</style>
