<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Past Medical history</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Condition:</div>
          <div class="font-medium text-md w-1/6">Yes</div>
          <div class="font-medium text-md w-1/6">No</div>
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
      <div class="mt-4">
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

import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import type PastMedicalHistory from '@/types/PastMedicalHistory'
import { BaseURL } from '@/main'

const props = defineProps<{
  patientId: string
  patientData: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const tuberculosis = ref<boolean | null>(null)
const diabetes = ref<boolean | null>(null)
const hypertension = ref<boolean | null>(null)
const hyperlipidemia = ref<boolean | null>(null)
const chronicJointPains = ref<boolean | null>(null)
const chronicMuscleAches = ref<boolean | null>(null)
const sexuallyTransmittedDisease = ref<boolean | null>(null)
const specifiedSTDs = ref<string | null>('')
const others = ref<string | null>('')
const isEditing = ref(false)

watch(
  () => props.patientData,
  (newVal: Patient | undefined) => {
    if (!props.isAdd && newVal) {
      const pastMedHist = newVal.pastmedicalhistory
      if (!pastMedHist) {
        tuberculosis.value = null
        diabetes.value = null
        hypertension.value = null
        hyperlipidemia.value = null
        chronicJointPains.value = null
        chronicMuscleAches.value = null
        sexuallyTransmittedDisease.value = null
        specifiedSTDs.value = ''
        others.value = ''
      } else {
        tuberculosis.value = pastMedHist.tuberculosis
        diabetes.value = pastMedHist.diabetes
        hypertension.value = pastMedHist.hypertension
        hyperlipidemia.value = pastMedHist.hyperlipidemia
        chronicJointPains.value = pastMedHist.chronicJointPains
        chronicMuscleAches.value = pastMedHist.chronicMuscleAches
        sexuallyTransmittedDisease.value = pastMedHist.sexuallyTransmittedDisease
        specifiedSTDs.value = pastMedHist.specifiedSTDs
        others.value = pastMedHist.others
      }
    }
  },
  { immediate: true }
)
async function submitData() {
  try {
    if (
      tuberculosis.value === null ||
      diabetes.value === null ||
      hypertension.value === null ||
      hyperlipidemia.value === null ||
      chronicJointPains.value === null ||
      chronicMuscleAches.value === null ||
      sexuallyTransmittedDisease.value === null
    ) {
      toast.error('Please select yes/no for all fields')
      return
    }
    const pastMedicalHistory: PastMedicalHistory = {
      // need to define outside to catch missing fields
      tuberculosis: tuberculosis.value,
      diabetes: diabetes.value,
      hypertension: hypertension.value,
      hyperlipidemia: hyperlipidemia.value,
      chronicJointPains: chronicJointPains.value,
      chronicMuscleAches: chronicMuscleAches.value,
      sexuallyTransmittedDisease: sexuallyTransmittedDisease.value,
      specifiedSTDs: specifiedSTDs.value,
      others: others.value
    }
    await axios
      .patch(`${BaseURL}/patient/${props.patientId}/${props.patientVid}`, {
        pastMedicalHistory: pastMedicalHistory
      })
      .then((response) => {
        console.log(response)
        console.log('Past medical history posted successfully!')
        toggleEdit() // to switch back to read-only mode
        toast.success('Past medical history saved successfully!')
      })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError // Safe casting
      if (axiosError.response) {
        // The request was made and server responded with a status code out of range 2xx
        console.log(axiosError.response.data)
        toast.error(axiosError.message)
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request)
        toast.error('No server response received, check your connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', axiosError.message)
        toast.error('An internal server error occurred.')
      }
    } else {
      // No response received at all
      console.log(error)
      toast.error('An internal server error occurred.')
    }
  }
}

function toggleEdit() {
  console.log('toggleEdit')
  isEditing.value = !isEditing.value
  console.log(isEditing.value)
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
