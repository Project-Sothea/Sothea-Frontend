<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Height & Weight</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- Height -->
          <div class="w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Height (cm) <span class="req">*</span></label
            >
            <input
              v-model="height"
              type="number"
              step="1"
              placeholder="cm"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              max="9999"
            />
          </div>

          <!-- Weight -->
          <div class="ml-3 w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Weight (kg) <span class="req">*</span></label
            >
            <input
              v-model="weight"
              type="number"
              step="0.1"
              placeholder="kg"
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
          <!-- Paeds: Height % -->
          <div class="w-1/2">
            <div class="flex flex-row content-center">
              <button
                @click="showHeightModal = true"
                class="mr-1.5 mb-1.5"
                title="Paeds Height Charts"
              >
                <img src="@/assets/info.svg" alt="chart" class="w-6 h-6" />
              </button>
              <label for="" class="mb-1 pt-0.5 block text-sm font-medium text-dark">
                Paeds: Height % <span class="req">*</span></label
              >
            </div>
            <input
              v-model="paedsHeight"
              type="number"
              placeholder=""
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>

          <!-- Paeds: Weight % -->
          <div class="ml-3 w-1/2">
            <div class="flex flex-row">
              <button
                @click="showWeightModal = true"
                class="mr-1.5 mb-1.5"
                title="Paeds Weight Charts"
              >
                <img src="@/assets/info.svg" alt="chart" class="w-6 h-6" />
              </button>
              <label for="" class="mb-1 pt-0.5 block text-sm font-medium text-dark">
                Paeds: Weight % <span class="req">*</span></label
              >
            </div>
            <input
              v-model="paedsWeight"
              type="number"
              placeholder=""
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-row mb-2">
          <!-- BMI -->
          <div class="w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              BMI <span class="req">*</span></label
            >
            <input
              :value="bmi"
              disabled
              type="number"
              step="0.1"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-row mb-2">
          <!-- BMI Analysis-->
          <div class="w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              BMI Analysis <span class="req">*</span></label
            >
            <input
              :value="bmianalysis"
              disabled
              type="text"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <div class="mb-2" v-if="showIcope">
          <!-- Row 1 -->
          <div class="text-sm font-medium text-dark">
            ICOPE (60 yo and above):
          </div>

          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span>Have you lost weight (>3kg) in the last 3 months?</span>
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="lost-weight-3-months" class="w-4 h-4"
                      v-model="icopeLostWeightPastMonths" :value="true" :disabled="!isEditing" />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="lost-weight-3-months" class="w-4 h-4"
                      v-model="icopeLostWeightPastMonths" :value="false" :disabled="!isEditing" />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span>In the last 3 months, have you felt that you have no desire to eat?</span>
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="no-desire-to-eat" class="w-4 h-4"
                      v-model="icopeNoDesireToEat" :value="true" :disabled="!isEditing" />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" name="no-desire-to-eat" class="w-4 h-4"
                      v-model="icopeNoDesireToEat" :value="false" :disabled="!isEditing" />
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

  <!-- Height Percentile Modal -->
  <div
    v-if="showHeightModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
  >
    <div
      class="bg-white rounded-lg p-5 max-w-full overflow-y-auto"
      style="max-height: 95%; max-width: 60%"
    >
      <div class="flex justify-end">
        <button @click="showHeightModal = false" class="text-gray-700 hover:text-gray-900">
          Close
        </button>
      </div>
      <img
        src="@/assets/height-percentile-boys.jpg"
        alt="height percentile boys"
        class="w-full mb-4"
      />
      <img
        src="@/assets/height-percentile-girls.jpg"
        alt="height percentile girls"
        class="w-full"
      />
    </div>
  </div>

  <!-- Weight Percentile Modal -->
  <div
    v-if="showWeightModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
  >
    <div
      class="bg-white rounded-lg p-5 max-w-full overflow-y-auto"
      style="max-height: 95%; max-width: 60%"
    >
      <div class="flex justify-end">
        <button @click="showWeightModal = false" class="text-gray-700 hover:text-gray-900">
          Close
        </button>
      </div>
      <img
        src="@/assets/weight-percentile-boys.jpg"
        alt="weight percentile boys"
        class="w-full mb-4"
      />
      <img
        src="@/assets/weight-percentile-girls.jpg"
        alt="weight percentile girls"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type HeightAndWeight from '@patient-record/types/HeightAndWeight'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  age: number | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const height = ref<number | null>(null)
const weight = ref<number | null>(null)
const paedsHeight = ref<number | null>(null)
const paedsWeight = ref<number | null>(null)

const showIcope = computed<boolean>(() => 
  props.age != null ? props.age >= 60 : true
);

const icopeLostWeightPastMonths = ref<boolean | null> (null)
const icopeNoDesireToEat = ref<boolean | null> (null)

const draftFields = [
  bindRef('height', height),
  bindRef('weight', weight),
  bindRef('paedsHeight', paedsHeight),
  bindRef('paedsWeight', paedsWeight),
  bindRef('icopeLostWeightPastMonths', icopeLostWeightPastMonths),
  bindRef('icopeNoDesireToEat', icopeNoDesireToEat)
]

const heightWeightDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:heightAndWeight`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey, runChecks } = useEditableSection<HeightAndWeight>({
  draft: {
    key: heightWeightDraftStorageKey,
    fields: draftFields,
    autoRestore: false
  }
})

const showHeightModal = ref(false)
const showWeightModal = ref(false)

const initialized = ref(false)
const draftRestored = ref(false)

watch(
  () => draftStorageKey.value,
  () => {
    if (draftRestored.value) return
    if (props.isAdd) return
    // Try to restore draft when storage key becomes available
    // This happens before initialization completes
    draftRestored.value = restoreDraft() || draftRestored.value
  },
  { immediate: true }
)

function initialize(patientData: Patient | null) {
  // Don't re-initialize if already initialized, in add mode, or currently editing
  // This prevents overwriting form values with stale data after saving
  if (initialized.value || props.isAdd || isEditing.value) return
  
  // Wait for patientData to actually be loaded (not null/undefined)
  // This prevents initializing with null data on page refresh
  if (!patientData) return

  const heightAndWeight = patientData.heightandweight
  if (!heightAndWeight) {
    // No saved height and weight data - try to restore draft if available
    initialized.value = true
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  height.value = heightAndWeight.height
  weight.value = heightAndWeight.weight
  paedsHeight.value = heightAndWeight.paedsHeight
  paedsWeight.value = heightAndWeight.paedsWeight

  icopeLostWeightPastMonths.value = heightAndWeight.icopeLostWeightPastMonths
  icopeNoDesireToEat.value = heightAndWeight.icopeNoDesireToEat

  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.heightandweight) {
    height.value = null
    weight.value = null
    paedsHeight.value = null
    paedsWeight.value = null
    icopeLostWeightPastMonths.value = null
    icopeNoDesireToEat.value = null
    initialized.value = true
    // Try to restore draft if available
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }
  initialize(props.patientData)
}

// Initialize once
watch(
  () => props.patientData,
  (newVal) => initialize(newVal),
  { immediate: true }
)

const bmi = computed(() => {
  if (height.value && weight.value) {
    const heightInMeters = height.value / 100
    return +(weight.value / (heightInMeters * heightInMeters)).toFixed(2)
  }
  return null
})

const bmianalysis = computed(() => {
  if (bmi.value !== null) {
    const bmiValue = bmi.value
    if (bmiValue < 18.5) {
      return 'Underweight'
    } else if (bmiValue < 25) {
      return 'Normal'
    } else if (bmiValue < 30) {
      return 'Overweight'
    } else {
      return 'Obese'
    }
  }
  return null
})

function buildPayload(): HeightAndWeight | null {
  if (
    !runChecks([
      [height.value !== null, 'Enter height'],
      [weight.value !== null, 'Enter weight'],
      [!showIcope.value || icopeLostWeightPastMonths.value !== null, 'Answer ICOPE Questions'],
      [!showIcope.value || icopeNoDesireToEat.value !== null, 'Answer ICOPE Questions'],
    ])
  )
    return null
  if (height.value! < 0) return (toast.error('Height cannot be negative'), null)
  if (height.value! > 9999) return (toast.error('Height cannot be greater than 9999cm'), null)
  if (weight.value! < 0) return (toast.error('Weight cannot be negative'), null)
  if (weight.value! > 9999) return (toast.error('Weight cannot be greater than 9999kg'), null)
  if (paedsHeight.value && paedsHeight.value > 9999)
    return (toast.error('Paeds: Height % too large'), null)
  if (paedsWeight.value && paedsWeight.value > 9999)
    return (toast.error('Paeds: Weight % too large'), null)
  if (bmi.value === null) return (toast.error('Enter height & weight to calculate BMI'), null)
  if (bmianalysis.value === null)
    return (toast.error('Enter height & weight to calculate BMI Analysis'), null)
  return {
    height: height.value!,
    weight: weight.value!,
    bmi: bmi.value!,
    bmiAnalysis: bmianalysis.value!,
    paedsHeight: paedsHeight.value || null,
    paedsWeight: paedsWeight.value || null,

    icopeLostWeightPastMonths: icopeLostWeightPastMonths.value!,
    icopeNoDesireToEat: icopeNoDesireToEat.value!
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
      updateSection(props.patientId, props.patientVid!, 'heightAndWeight', buildPayload()!),
    onSuccess: () => {
      toast.success('Height and Weight saved successfully!')
      // After saving, the form already has the correct values in memory
      // We don't need to reload from parent - the form state is the source of truth
      // The initialized flag prevents re-initialization from stale patientData
    }
  })
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      resetData()
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
  })
}
function preventNegative(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e') {
    event.preventDefault()
  }
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
