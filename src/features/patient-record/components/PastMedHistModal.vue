<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Past Medical history</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3"></div>
          <div class="font-medium text-md w-1/6">Yes</div>
          <div class="font-medium text-md w-1/6">No</div>
        </div>
      </div>

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Current Symptoms</div>
        </div>
      </div>

      <!-- Cough -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Cough <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cough"
                class="w-4 h-4"
                v-model="cough"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cough"
                class="w-4 h-4"
                v-model="cough"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>
      
      <!-- Fever -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Fever <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="fever"
                class="w-4 h-4"
                v-model="fever"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="fever"
                class="w-4 h-4"
                v-model="fever"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Blocked Nose -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Blocked Nose <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="blockedNose"
                class="w-4 h-4"
                v-model="blockedNose"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="blockedNose"
                class="w-4 h-4"
                v-model="blockedNose"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Sore Throat -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Sore Throat <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="soreThroat"
                class="w-4 h-4"
                v-model="soreThroat"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="soreThroat"
                class="w-4 h-4"
                v-model="soreThroat"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Night Sweats -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Night Sweats <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="nightSweats"
                class="w-4 h-4"
                v-model="nightSweats"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="nightSweats"
                class="w-4 h-4"
                v-model="nightSweats"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Unintentional Weight Los -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Unintentional Weight Loss <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="unintentionalWeightLoss"
                class="w-4 h-4"
                v-model="unintentionalWeightLoss"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="unintentionalWeightLoss"
                class="w-4 h-4"
                v-model="unintentionalWeightLoss"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="flex flex-col mt-4">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Conditions</div>
        </div>
      </div>
      <!-- Tuberculosis -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Tuberculosis <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosis"
                class="w-4 h-4"
                v-model="tuberculosis"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosis"
                class="w-4 h-4"
                v-model="tuberculosis"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Has Tuberculosis been treated -->
      <div class="flex flex-col mt-4" v-if="tuberculosis">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">If Y to Tuberculosis, has it been treated? <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosisHasBeenTreated"
                class="w-4 h-4"
                v-model="tuberculosisHasBeenTreated"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosisHasBeenTreated"
                class="w-4 h-4"
                v-model="tuberculosisHasBeenTreated"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Diabetes -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Diabetes <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="diabetes"
                class="w-4 h-4"
                v-model="diabetes"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="diabetes"
                class="w-4 h-4"
                v-model="diabetes"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hypertension -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hypertension <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hypertension"
                class="w-4 h-4"
                v-model="hypertension"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hypertension"
                class="w-4 h-4"
                v-model="hypertension"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hyperlipidemia -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hyperlipidemia <span class="req">*</span></div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hyperlipidemia"
                class="w-4 h-4"
                v-model="hyperlipidemia"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hyperlipidemia"
                class="w-4 h-4"
                v-model="hyperlipidemia"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Chronic Joint Pains -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">
            Chronic Joint Pains <span class="req">*</span>
          </div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-joint-pains"
                class="w-4 h-4"
                v-model="chronicJointPains"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-joint-pains"
                class="w-4 h-4"
                v-model="chronicJointPains"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Chronic Muscle Aches -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">
            Chronic Muscle Aches <span class="req">*</span>
          </div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-muscle-aches"
                class="w-4 h-4"
                v-model="chronicMuscleAches"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-muscle-aches"
                class="w-4 h-4"
                v-model="chronicMuscleAches"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- STD -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">
            Sexually Transmitted Disease <span class="req">*</span>
          </div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="std"
                class="w-4 h-4"
                v-model="sexuallyTransmittedDisease"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="std"
                class="w-4 h-4"
                v-model="sexuallyTransmittedDisease"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div class="mt-4" v-if="sexuallyTransmittedDisease">
        <label>
          <label for="" class="mb-2 block text-sm font-normal text-dark"
            >If Y to STD, specify:
          </label>
          <textarea
            rows="2"
            placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            v-model="specifiedSTDs"
            :disabled="!isEditing"
          ></textarea>
        </label>
      </div>

      <!-- Others -->
      <div class="mt-2">
        <label>
          <label for="" class="mb-2 block text-sm font-normal text-dark">Others: </label>
          <textarea
            rows="2"
            placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            v-model="others"
            :disabled="!isEditing"
          ></textarea>
        </label>
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
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type PastMedicalHistory from '@patient-record/types/PastMedicalHistory'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const cough = ref<boolean | null>(null)
const fever = ref<boolean | null>(null)
const blockedNose = ref<boolean | null>(null)
const soreThroat = ref<boolean | null>(null)
const nightSweats = ref<boolean | null>(null)
const unintentionalWeightLoss = ref<boolean | null>(null) 

const tuberculosis = ref<boolean | null>(null)
const tuberculosisHasBeenTreated = ref<boolean | null>(null)

const diabetes = ref<boolean | null>(null)
const hypertension = ref<boolean | null>(null)
const hyperlipidemia = ref<boolean | null>(null)
const chronicJointPains = ref<boolean | null>(null)
const chronicMuscleAches = ref<boolean | null>(null)
const sexuallyTransmittedDisease = ref<boolean | null>(null)
const specifiedSTDs = ref<string | null>('')
const others = ref<string | null>('')

const draftFields = [
  bindRef('cough', cough),
  bindRef('fever', fever),
  bindRef('blockedNose', blockedNose),
  bindRef('soreThroat', soreThroat),
  bindRef('nightSweats', nightSweats),
  bindRef('unintentionalWeightLoss', unintentionalWeightLoss),
  bindRef('tuberculosis', tuberculosis),
  bindRef('tuberculosisHasBeenTreated', tuberculosisHasBeenTreated),
  bindRef('diabetes', diabetes),
  bindRef('hypertension', hypertension),
  bindRef('hyperlipidemia', hyperlipidemia),
  bindRef('chronicJointPains', chronicJointPains),
  bindRef('chronicMuscleAches', chronicMuscleAches),
  bindRef('sexuallyTransmittedDisease', sexuallyTransmittedDisease),
  bindRef('specifiedSTDs', specifiedSTDs),
  bindRef('others', others)
]

const pastMedHistDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:pastMedicalHistory`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey, runChecks } = useEditableSection<PastMedicalHistory>({
  draft: {
    key: pastMedHistDraftStorageKey,
    fields: draftFields,
    autoRestore: false
  }
})

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

function initialize(patientData: Patient | undefined) {
  // Don't re-initialize if already initialized, in add mode, or currently editing
  // This prevents overwriting form values with stale data after saving
  if (initialized.value || props.isAdd || isEditing.value) return
  
  // Wait for patientData to actually be loaded (not null/undefined)
  // This prevents initializing with null data on page refresh
  if (!patientData) return

  const pastMedHist = patientData.pastmedicalhistory
  if (!pastMedHist) {
    // No saved past medical history data - try to restore draft if available
    initialized.value = true
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  cough.value = pastMedHist.cough
  fever.value = pastMedHist.fever
  blockedNose.value = pastMedHist.blockedNose
  soreThroat.value = pastMedHist.soreThroat
  nightSweats.value = pastMedHist.nightSweats
  unintentionalWeightLoss.value = pastMedHist.unintentionalWeightLoss

  tuberculosis.value = pastMedHist.tuberculosis
  tuberculosisHasBeenTreated.value = pastMedHist.tuberculosisHasBeenTreated

  diabetes.value = pastMedHist.diabetes
  hypertension.value = pastMedHist.hypertension
  hyperlipidemia.value = pastMedHist.hyperlipidemia
  chronicJointPains.value = pastMedHist.chronicJointPains
  chronicMuscleAches.value = pastMedHist.chronicMuscleAches
  sexuallyTransmittedDisease.value = pastMedHist.sexuallyTransmittedDisease
  specifiedSTDs.value = pastMedHist.specifiedSTDs
  others.value = pastMedHist.others

  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.pastmedicalhistory) {
    cough.value = null
    fever.value = null
    blockedNose.value = null
    soreThroat.value = null
    nightSweats.value = null
    unintentionalWeightLoss.value = null
    tuberculosis.value = null
    tuberculosisHasBeenTreated.value = null
    diabetes.value = null
    hypertension.value = null
    hyperlipidemia.value = null
    chronicJointPains.value = null
    chronicMuscleAches.value = null
    sexuallyTransmittedDisease.value = null
    specifiedSTDs.value = null
    others.value = null
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

function buildPayload(): PastMedicalHistory | null {
  if (
    !runChecks([
      [cough.value !== null, 'Select Cough'],
      [fever.value !== null, 'Select Fever'],
      [blockedNose.value !== null, 'Select Blocked Nose'],
      [soreThroat.value !== null, 'Select Sore Throat'],
      [nightSweats.value !== null, 'Select Night Sweats'],
      [unintentionalWeightLoss.value !== null, 'Select Unintentional Weight Loss'],
      
      [tuberculosis.value !== null, 'Select Tuberculosis'],
      [tuberculosis.value === false || tuberculosisHasBeenTreated.value !== null, 'Select Has Tuberculosis been treated before'],
      [diabetes.value !== null, 'Select Diabetes'],
      [hypertension.value !== null, 'Select Hypertension'],
      [hyperlipidemia.value !== null, 'Select Hyperlipidemia'],
      [chronicJointPains.value !== null, 'Select Chronic Joint Pains'],
      [chronicMuscleAches.value !== null, 'Select Chronic Muscle Aches'],
      [sexuallyTransmittedDisease.value !== null, 'Select STD history']
    ])
  )
    return null
  return {
    cough: cough.value!,
    fever: fever.value!,
    blockedNose: blockedNose.value!,
    soreThroat: soreThroat.value!,
    nightSweats: nightSweats.value!,
    unintentionalWeightLoss: unintentionalWeightLoss.value!,

    tuberculosis: tuberculosis.value!,
    tuberculosisHasBeenTreated:tuberculosisHasBeenTreated.value!,

    diabetes: diabetes.value!,
    hypertension: hypertension.value!,
    hyperlipidemia: hyperlipidemia.value!,
    chronicJointPains: chronicJointPains.value!,
    chronicMuscleAches: chronicMuscleAches.value!,
    sexuallyTransmittedDisease: sexuallyTransmittedDisease.value!,
    specifiedSTDs: specifiedSTDs.value,
    others: others.value
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
      updateSection(props.patientId, props.patientVid!, 'pastMedicalHistory', buildPayload()!),
    onSuccess: () => {
      toast.success('Past medical history saved successfully!')
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
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
.req {
  color: red;
}
</style>
