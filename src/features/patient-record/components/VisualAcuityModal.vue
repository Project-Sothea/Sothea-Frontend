<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Visual Acuity</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- L eye vision -->
          <div class="w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              L eye vision (6/) <span class="req">*</span>
            </label>

            <div class="relative z-20">
              <select
                v-model="lEyeVision"
                :disabled="!isEditing"
                class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              >
                <option :value="6">6</option>
                <option :value="9">9</option>
                <option :value="12">12</option>
                <option :value="18">18</option>
                <option :value="24">24</option>
                <option :value="36">36</option>
                <option :value="60">60</option>
                <option :value="-1">-1</option>
                <option :value="-2">-2</option>
              </select>
              <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <img src="@/assets/chevrondown.svg" height="20" width="20" />
              </span>
            </div>
          </div>

          <!-- R eye vision -->
          <div class="ml-3 w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              R eye vision (6/) <span class="req">*</span>
            </label>
            <div class="relative z-20">
              <select
                v-model="rEyeVision"
                :disabled="!isEditing"
                class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              >
                <option :value="6">6</option>
                <option :value="9">9</option>
                <option :value="12">12</option>
                <option :value="18">18</option>
                <option :value="24">24</option>
                <option :value="36">36</option>
                <option :value="60">60</option>
                <option :value="-1">-1</option>
                <option :value="-2">-2</option>
              </select>
              <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <img src="@/assets/chevrondown.svg" height="20" width="20" />
              </span>
            </div>
          </div>
        </div>

        <!-- Additional Intervention -->
        <div class="mt-4">
          <label for="" class="mb-2 block text-sm font-medium text-dark"
            >Additional Intervention:
          </label>
          <textarea
            v-model="additionalIntervention"
            rows="3"
            placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            :disabled="!isEditing"
          ></textarea>
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
import { ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type VisualAcuity from '@patient-record/types/VisualAcuity'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const lEyeVision = ref<number | null>(null)
const rEyeVision = ref<number | null>(null)
const additionalIntervention = ref<string | null>('')
const { isEditing, toggleEdit, save, runChecks } = useEditableSection<VisualAcuity>()

const toast = useToast()

watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (!props.isAdd && newVal) {
      const visualAcuity = newVal.visualacuity
      if (!visualAcuity) {
        lEyeVision.value = null
        rEyeVision.value = null
        additionalIntervention.value = ''
      } else {
        lEyeVision.value = visualAcuity.lEyeVision
        rEyeVision.value = visualAcuity.rEyeVision
        additionalIntervention.value = visualAcuity.additionalIntervention
      }
    }
  },
  { immediate: true }
)
function buildPayload(): VisualAcuity | null {
  if (
    !runChecks([
      [lEyeVision.value !== null, 'Please fill in L eye vision'],
      [rEyeVision.value !== null, 'Please fill in R eye vision']
    ])
  )
    return null
  return {
    lEyeVision: lEyeVision.value!,
    rEyeVision: rEyeVision.value!,
    additionalIntervention: additionalIntervention.value
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
      updateSection(props.patientId, props.patientVid!, 'visualAcuity', buildPayload()!),
    onSuccess: () => toast.success('Visual Acuity saved successfully!')
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
