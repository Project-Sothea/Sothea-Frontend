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
              v-model="spO2"
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
              v-model="systolicBP1"
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
              v-model="systolicBP2"
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
              v-model="diastolicBP1"
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
              v-model="diastolicBP2"
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
              Random Blood Glucose (mmol/L) <span class="req">*</span>
            </label>
            <input
              v-model="randomBloodGlucoseMmolL"
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
        <div class="mb-2">
          <!-- Row 1 -->
          <div class="text-sm font-medium text-dark">
            ICOPE (60 yo and above):
          </div>

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
        <div class="flex flex-row-reverse w-full mt-5">
          <button
            v-if="isEditing && !isAdd"
            @click="submitData"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
          >
            Save Edits
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
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const temperature = ref<number | null>(null)
const spO2 = ref<number | null>(null)
const systolicBP1 = ref<number | null>(null)
const systolicBP2 = ref<number | null>(null)
const diastolicBP1 = ref<number | null>(null)
const diastolicBP2 = ref<number | null>(null)
const hr1 = ref<number | null>(null)
const hr2 = ref<number | null>(null)
const randomBloodGlucoseMmolL = ref<number | null>(null)
const icopeHighBp = ref<boolean | null> (null)
const { isEditing, toggleEdit, save, runChecks } = useEditableSection<VitalStatistics>()

const toast = useToast()

watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (!props.isAdd && newVal) {
      const vitalStatistics = newVal.vitalstatistics
      if (!vitalStatistics) {
        temperature.value = null
        spO2.value = null
        systolicBP1.value = null
        systolicBP2.value = null
        diastolicBP1.value = null
        diastolicBP2.value = null
        hr1.value = null
        hr2.value = null
        randomBloodGlucoseMmolL.value = null
        icopeHighBp.value = null
      } else {
        temperature.value = vitalStatistics.temperature
        spO2.value = vitalStatistics.spO2
        systolicBP1.value = vitalStatistics.systolicBP1
        systolicBP2.value = vitalStatistics.systolicBP2
        diastolicBP1.value = vitalStatistics.diastolicBP1
        diastolicBP2.value = vitalStatistics.diastolicBP2
        hr1.value = vitalStatistics.hr1
        hr2.value = vitalStatistics.hr2
        randomBloodGlucoseMmolL.value = vitalStatistics.randomBloodGlucoseMmolL
        icopeHighBp.value = vitalStatistics.icopeHighBp
      }
    }
  },
  { immediate: true }
)
const avgSystolicBP = computed(() => {
  if (systolicBP1.value && systolicBP2.value) {
    return (Number(systolicBP1.value) + Number(systolicBP2.value)) / 2
  }
  return null
})

const avgDiastolicBP = computed(() => {
  if (diastolicBP1.value && diastolicBP2.value) {
    return (Number(diastolicBP1.value) + Number(diastolicBP2.value)) / 2
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
      [spO2.value !== null, 'Please enter SpO2'],
      [hr1.value !== null, 'Please enter HR1'],
      [hr2.value !== null, 'Please enter HR2'],
      [randomBloodGlucoseMmolL.value !== null, 'Please enter Random Blood Glucose (mmol/L)'],
      [avgHR.value !== null, 'Average HR cannot be empty'],
      [icopeHighBp.value !== null, 'Please answer whether the patient has high BP']
    ])
  )
    return null
  if (
    temperature.value! > 9999 ||
    spO2.value! > 9999 ||
    (systolicBP1.value && systolicBP1.value > 9999) ||
    (systolicBP2.value && systolicBP2.value > 9999) ||
    (diastolicBP1.value && diastolicBP1.value > 9999) ||
    (diastolicBP2.value && diastolicBP2.value > 9999) ||
    hr1.value! > 9999 ||
    hr2.value! > 9999 ||
    randomBloodGlucoseMmolL.value! > 9999
  ) {
    toast.error('Values cannot be greater than 9999')
    return null
  }
  return {
    temperature: temperature.value!,
    spO2: spO2.value!,
    systolicBP1: systolicBP1.value || null,
    systolicBP2: systolicBP2.value || null,
    diastolicBP1: diastolicBP1.value || null,
    diastolicBP2: diastolicBP2.value || null,
    averageSystolicBP: avgSystolicBP.value,
    averageDiastolicBP: avgDiastolicBP.value,
    hr1: hr1.value!,
    hr2: hr2.value!,
    averageHR: avgHR.value!,
    randomBloodGlucoseMmolL: randomBloodGlucoseMmolL.value!,
    icopeHighBp: icopeHighBp.value!
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
    onSuccess: () => toast.success('Vital Statistics saved successfully!')
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
