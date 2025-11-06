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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type PastMedicalHistory from '@patient-record/types/PastMedicalHistory'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

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
const { isEditing, save, toggleEdit, runChecks } = useEditableSection<PastMedicalHistory>()

let initialized = false
watch(
  () => props.patientData,
  (newVal: Patient | undefined) => {
    if (initialized || props.isAdd || !newVal) return
    const pastMedHist = newVal.pastmedicalhistory
    if (pastMedHist) {

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
    }
    initialized = true
  },
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
    onSuccess: () => toast.success('Past medical history saved successfully!')
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
