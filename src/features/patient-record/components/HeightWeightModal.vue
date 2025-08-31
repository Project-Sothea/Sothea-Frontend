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
import type Patient from '../../types/Patient'
import type HeightAndWeight from '../../types/HeightAndWeight'
import { updateSection } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const height = ref<number | null>(null)
const weight = ref<number | null>(null)
const paedsHeight = ref<number | null>(null)
const paedsWeight = ref<number | null>(null)
const isEditing = ref(false)
const showHeightModal = ref(false)
const showWeightModal = ref(false)

watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (!props.isAdd && newVal) {
      const heightAndWeight = newVal.heightandweight
      if (!heightAndWeight) {
        height.value = null
        weight.value = null
        paedsHeight.value = null
        paedsWeight.value = null
      } else {
        height.value = heightAndWeight.height
        weight.value = heightAndWeight.weight
        paedsHeight.value = heightAndWeight.paedsHeight
        paedsWeight.value = heightAndWeight.paedsWeight
      }
    }
  },
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

async function submitData() {
  try {
    if (height.value === null) {
      toast.error('Please enter height')
      return
    } else if (height.value < 0) {
      toast.error('Height cannot be negative')
      return
    } else if (height.value > 9999) {
      toast.error('Height cannot be greater than 9999cm')
      return
    }
    if (weight.value === null) {
      toast.error('Please enter weight')
      return
    } else if (weight.value < 0) {
      toast.error('Weight cannot be negative')
      return
    } else if (weight.value > 9999) {
      toast.error('Weight cannot be greater than 9999kg')
      return
    }
    if (paedsHeight.value && paedsHeight.value > 9999) {
      toast.error('Paeds: Height % cannot be greater than 9999')
      return
    }
    if (paedsWeight.value && paedsWeight.value > 9999) {
      toast.error('Paeds: Weight % cannot be greater than 9999')
      return
    }
    if (bmi.value === null) {
      toast.error('Please enter height and weight to calculate BMI')
      return
    }
    if (bmianalysis.value === null) {
      toast.error('Please enter height and weight to calculate BMI Analysis')
      return
    }
    const heightAndWeight: HeightAndWeight = {
      // need to define outside to catch missing fields
      height: height.value,
      weight: weight.value,
      bmi: bmi.value,
      bmiAnalysis: bmianalysis.value,
      paedsHeight: paedsHeight.value || null,
      paedsWeight: paedsWeight.value || null
    }
    if (!props.patientVid) {
      toast.error('Missing visit id')
      return
    }
    await updateSection(props.patientId, props.patientVid, 'heightAndWeight', heightAndWeight)
    if (isEditing.value) toggleEdit()
    toast.success('Height and Weight saved successfully!')
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
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
