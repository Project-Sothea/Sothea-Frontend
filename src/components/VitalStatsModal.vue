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
import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type VitalStatistics from '@/types/VitalStatistics'
import type Patient from '@/types/Patient'
import { BaseURL } from '@/main'

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
const isEditing = ref(false)

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

async function submitData() {
  try {
    if (temperature.value === null) {
      toast.error('Please enter temperature')
      return
    }
    if (spO2.value === null) {
      toast.error('Please enter SpO2')
      return
    }
    if (hr1.value === null) {
      toast.error('Please enter HR1')
      return
    }
    if (hr2.value === null) {
      toast.error('Please enter HR2')
      return
    }
    if (randomBloodGlucoseMmolL.value === null) {
      toast.error('Please enter Random Blood Glucose (mmol/L)')
      return
    }
    if (avgHR.value === null) {
      toast.error('Average HR cannot be empty')
      return
    }
    if (
      temperature.value > 9999 ||
      spO2.value > 9999 ||
      (systolicBP1.value && systolicBP1.value > 9999) ||
      (systolicBP2.value && systolicBP2.value > 9999) ||
      (diastolicBP1.value && diastolicBP1.value > 9999) ||
      (diastolicBP2.value && diastolicBP2.value > 9999) ||
      hr1.value > 9999 ||
      hr2.value > 9999 ||
      randomBloodGlucoseMmolL.value > 9999
    ) {
      toast.error('Values cannot be greater than 9999')
      return
    }
    const vitalStatistics: VitalStatistics = {
      // need to define outside to catch missing fields
      temperature: temperature.value,
      spO2: spO2.value,
      systolicBP1: systolicBP1.value || null,
      systolicBP2: systolicBP2.value || null,
      diastolicBP1: diastolicBP1.value || null,
      diastolicBP2: diastolicBP2.value || null,
      averageSystolicBP: avgSystolicBP.value, // pre-computed value
      averageDiastolicBP: avgDiastolicBP.value, // pre-computed value
      hr1: hr1.value,
      hr2: hr2.value,
      averageHR: avgHR.value, // pre-computed value
      randomBloodGlucoseMmolL: randomBloodGlucoseMmolL.value
    }
    console.log(vitalStatistics)
    await axios
      .patch(`${BaseURL}/patient/${props.patientId}/${props.patientVid}`, {
        vitalStatistics: vitalStatistics
      })
      .then((response) => {
        console.log(response.data)
        console.log('Vital Statistics posted successfully!')
        if (isEditing.value) {
          toggleEdit() // to switch back to read-only mode
        }
        toast.success('Vital Statistics saved successfully!')
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
