<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Social History</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">History</div>
          <div class="font-medium text-md pr-5">Yes</div>
          <div class="font-medium text-md">No</div>
          <div class="font-medium text-md w-1/3 pl-10">Remarks</div>
        </div>
      </div>

      <!-- Past Smoking History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Past Smoking History <span class="req">*</span>
          </div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="smoking-hist"
                  class="w-4 h-4"
                  v-model="pastSmokingHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="smoking-hist"
                  class="w-4 h-4"
                  v-model="pastSmokingHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea
              rows="1"
              placeholder="If Y, no. of years"
              type="number"
              v-model="numberOfYears"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Current Smoking History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Current Smoking History <span class="req">*</span>
          </div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="curr-smoking-hist"
                  class="w-4 h-4"
                  v-model="currentSmokingHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="curr-smoking-hist"
                  class="w-4 h-4"
                  v-model="currentSmokingHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea
              rows="1"
              placeholder="If Y, how many cigarettes/day?"
              type="number"
              v-model="cigarettesPerDay"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Alcohol History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Alcohol History <span class="req">*</span>
          </div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="alc-hist"
                  class="w-4 h-4"
                  v-model="alcoholHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="alc-hist"
                  class="w-4 h-4"
                  v-model="alcoholHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <select
              v-model="howRegular"
              placeholder="If Y, how regularly?"
              :disabled="!isEditing"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'A'">A</option>
              <option :value="'B'">B</option>
              <option :value="'C'">C</option>
              <option :value="'D'">D</option>
            </select>
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type SocialHistory from '@patient-record/types/SocialHistory'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const pastSmokingHistory = ref<boolean | null>(null)
const numberOfYears = ref<number | null>(null)
const currentSmokingHistory = ref<boolean | null>(null)
const cigarettesPerDay = ref<number | null>(null)
const alcoholHistory = ref<boolean | null>(null)
const howRegular = ref<string | null>('')
const { isEditing, toggleEdit, save, runChecks } = useEditableSection<SocialHistory>()

const toast = useToast()

let initialized = false
watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (initialized || props.isAdd || !newVal) return
    const socialHistory = newVal.socialhistory
    if (socialHistory) {
      pastSmokingHistory.value = socialHistory.pastSmokingHistory
      numberOfYears.value = socialHistory.numberOfYears
      currentSmokingHistory.value = socialHistory.currentSmokingHistory
      cigarettesPerDay.value = socialHistory.cigarettesPerDay
      alcoholHistory.value = socialHistory.alcoholHistory
      howRegular.value = socialHistory.howRegular
    }
    initialized = true
  },
  { immediate: true }
)

function buildPayload(): SocialHistory | null {
  if (
    !runChecks([
      [pastSmokingHistory.value !== null, 'Indicate past smoking history'],
      [currentSmokingHistory.value !== null, 'Indicate current smoking history'],
      [alcoholHistory.value !== null, 'Indicate alcohol history']
    ])
  )
    return null
  if (numberOfYears.value && isNaN(numberOfYears.value)) {
    toast.error('Number of years must be a valid number')
    return null
  }
  if (cigarettesPerDay.value && isNaN(cigarettesPerDay.value)) {
    toast.error('Cigarettes per day must be a valid number')
    return null
  }
  return {
    pastSmokingHistory: pastSmokingHistory.value!,
    numberOfYears: numberOfYears.value || null,
    currentSmokingHistory: currentSmokingHistory.value!,
    cigarettesPerDay: cigarettesPerDay.value || null,
    alcoholHistory: alcoholHistory.value!,
    howRegular: howRegular.value || null
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
      updateSection(props.patientId, props.patientVid!, 'socialHistory', buildPayload()!),
    onSuccess: () => toast.success('Social history saved successfully!')
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
