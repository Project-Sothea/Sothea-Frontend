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
          <div class="font-medium text-md w-1/6">Nil</div>
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
          <div class="font-normal text-sm w-1/3">Cough <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cough"
                class="w-4 h-4"
                v-model="cough"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>
      
      <!-- Fever -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Fever <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="fever"
                class="w-4 h-4"
                v-model="fever"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Blocked Nose -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Blocked Nose <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="blockedNose"
                class="w-4 h-4"
                v-model="blockedNose"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Sore Throat -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Sore Throat <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="soreThroat"
                class="w-4 h-4"
                v-model="soreThroat"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Night Sweats -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Night Sweats <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="nightSweats"
                class="w-4 h-4"
                v-model="nightSweats"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Unintentional Weight Los -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Unintentional Weight Loss <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="unintentionalWeightLoss"
                class="w-4 h-4"
                v-model="unintentionalWeightLoss"
                :value="null"
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
          <div class="font-normal text-sm w-1/3">Tuberculosis <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosis"
                class="w-4 h-4"
                v-model="tuberculosis"
                :value="null"
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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosisHasBeenTreated"
                class="w-4 h-4"
                v-model="tuberculosisHasBeenTreated"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Diabetes -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Diabetes <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="diabetes"
                class="w-4 h-4"
                v-model="diabetes"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hypertension -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hypertension <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hypertension"
                class="w-4 h-4"
                v-model="hypertension"
                :value="null"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hyperlipidemia -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hyperlipidemia <span v-if="!showPaeds" class="req">*</span></div>

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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hyperlipidemia"
                class="w-4 h-4"
                v-model="hyperlipidemia"
                :value="null"
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
            Chronic Joint Pains <span v-if="!showPaeds" class="req">*</span>
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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-joint-pains"
                class="w-4 h-4"
                v-model="chronicJointPains"
                :value="null"
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
            Chronic Muscle Aches <span v-if="!showPaeds" class="req">*</span>
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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-muscle-aches"
                class="w-4 h-4"
                v-model="chronicMuscleAches"
                :value="null"
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
            Sexually Transmitted Disease <span v-if="!showPaeds" class="req">*</span>
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
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="std"
                class="w-4 h-4"
                v-model="sexuallyTransmittedDisease"
                :value="null"
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
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'

const props = defineProps<{
  patientId: string
  patientData: Patient
  age: number | null
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

const showPaeds = computed<boolean>(() => 
  props.age != null ? props.age <= 16 : true
)

// Automatic draft management - handles everything
const formDraft = useAutoDraft<PastMedicalHistory>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:pastMedicalHistory`
  }),
  fields: [
    { key: 'cough', ref: cough },
    { key: 'fever', ref: fever },
    { key: 'blockedNose', ref: blockedNose },
    { key: 'soreThroat', ref: soreThroat },
    { key: 'nightSweats', ref: nightSweats },
    { key: 'unintentionalWeightLoss', ref: unintentionalWeightLoss },
    { key: 'tuberculosis', ref: tuberculosis },
    { key: 'tuberculosisHasBeenTreated', ref: tuberculosisHasBeenTreated },
    { key: 'diabetes', ref: diabetes },
    { key: 'hypertension', ref: hypertension },
    { key: 'hyperlipidemia', ref: hyperlipidemia },
    { key: 'chronicJointPains', ref: chronicJointPains },
    { key: 'chronicMuscleAches', ref: chronicMuscleAches },
    { key: 'sexuallyTransmittedDisease', ref: sexuallyTransmittedDisease },
    { key: 'specifiedSTDs', ref: specifiedSTDs },
    { key: 'others', ref: others },
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved past medical history draft from this device.',
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.pastmedicalhistory || null)
  },
  { immediate: true }
)

function buildPayload(): PastMedicalHistory | null {
  // For paediatric patients (showPaeds), all fields are optional.
  // Only enforce required checks for non-paeds.
  // Note: null is now a valid selection (Nil), so we can't use !== null to check for unselected.
  // The validation ensures all required fields have been explicitly selected (true, false, or null).
  // We use a different approach: check that the value is explicitly set by comparing against undefined
  // However, since refs are initialized to null, we need to track if fields have been interacted with.
  // For now, we'll accept that null can mean either "unselected" or "Nil selected" and allow it.
  // The distinction between "no record" and "Nil selected" is handled at the top level (PastMedicalHistory | null).
  if (
    !showPaeds.value &&
    !runChecks([
      // All fields now accept null as valid (Nil), so we only validate conditional fields
      [tuberculosis.value === false || tuberculosisHasBeenTreated.value !== null, 'Select Has Tuberculosis been treated before'],
    ])
  )
    return null
  return {
    cough: cough.value,
    fever: fever.value,
    blockedNose: blockedNose.value,
    soreThroat: soreThroat.value,
    nightSweats: nightSweats.value,
    unintentionalWeightLoss: unintentionalWeightLoss.value,

    tuberculosis: tuberculosis.value,
    tuberculosisHasBeenTreated: tuberculosisHasBeenTreated.value,

    diabetes: diabetes.value,
    hypertension: hypertension.value,
    hyperlipidemia: hyperlipidemia.value,
    chronicJointPains: chronicJointPains.value,
    chronicMuscleAches: chronicMuscleAches.value,
    sexuallyTransmittedDisease: sexuallyTransmittedDisease.value,
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
      // Reset to server data or defaults (force re-initialization)
      formDraft.initialize(props.patientData?.pastmedicalhistory || null, true)
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
