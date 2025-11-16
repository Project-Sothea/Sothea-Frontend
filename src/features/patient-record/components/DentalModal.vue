<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Dental</h1>
      <br />

      <!-- Fluoride exposure -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="fluorideExposure" class="mb-1 block text-sm font-medium text-dark">
            Fluoride Exposure:
            How many days per week do you brush your teeth with fluoride toothpaste twice a day?
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="fluorideExposure"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'6, 7'">6, 7</option>
              <option :value="'5, 4, 3'">5, 4, 3</option>
              <option :value="'2, 1, 0'">2, 1, 0</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Diet -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="diet" class="mb-1 block text-sm font-medium text-dark">
            Diet: On average, how many times daily do you consume starch or sugar (food or drinks) between meals?
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="diet"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'≤1'">≤1</option>
              <option :value="'2-3'">2-3</option>
              <option :value="'>=4'">≥4</option>

            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Bacterial exposure -->
      <div class="flex flex-col mt-4">
        <div class="font-medium text-sm">
          Bacterial exposure: Has anyone in the family (including a caregiver)
          had tooth decay or lost a tooth from tooth decay?<span class="req">*</span>
        </div>

        <!-- Three risk categories matching Dental type -->
        <div class="mt-3 flex flex-col gap-2 text-sm">
          <label class="inline-flex items-center gap-2">
            <input
              class="h-4 w-4"
              type="radio"
              name="bacterialExposure"
              v-model="bacterialExposure"
              :value="'None in last 2 years'"
              :disabled="!isEditing"
            />
            <span>None in last 2 years</span>
          </label>

          <label class="inline-flex items-center gap-2">
            <input
              class="h-4 w-4"
              type="radio"
              name="bacterialExposure"
              v-model="bacterialExposure"
              :value="'Yes in last 7 - 23 months'"
              :disabled="!isEditing"
            />
            <span>Yes in last 7–23 months</span>
          </label>

          <label class="inline-flex items-center gap-2">
            <input
              class="h-4 w-4"
              type="radio"
              name="bacterialExposure"
              v-model="bacterialExposure"
              :value="'Yes in last 6 months'"
              :disabled="!isEditing"
            />
            <span>Yes in last 6 months</span>
          </label>
        </div>
      </div>


      <!-- oralSymptoms -->
      <div class="flex flex-col mt-5">
        <div class="font-medium text-sm">
          Oral symptoms: Do you have tooth pain or bleeding gums when you brush your teeth? <span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="oralSymptoms"
              v-model="oralSymptoms"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="oralSymptoms"
              v-model="oralSymptoms"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- drinkOtherWater -->
      <div class="flex flex-col mt-5">
        <div class="font-medium text-sm">
          Do you wake up to drink anything other than water throughout the night? <span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- riskForDentalCarries -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="riskForDentalCarries" class="mb-1 block text-sm font-medium text-dark">
            Risk for Dental Carries
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="riskForDentalCarries"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'Low Risk'">Low Risk</option>
              <option :value="'Middle Risk'">Middle Risk</option>
              <option :value="'High Risk'">High Risk</option>
            </select>

            <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- icopeDifficultyChewing -->
      <div class="flex flex-col mt-5" v-if="showIcope">
        <div class="font-medium text-sm">
          (ICOPE: 60 yo and above) Do you have difficulty chewing food? <span class="req">*</span>
        </div>

        <!-- each column: label on top, radio below -->
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopeDifficultyChewing"
              v-model="icopeDifficultyChewing"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopeDifficultyChewing"
              v-model="icopeDifficultyChewing"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- icopePainInMouth -->
      <div class="flex flex-col mt-5" v-if="showIcope">
        <div class="font-medium text-sm">
          (ICOPE: 60 yo and above) Do you have pain in your mouth?<span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopePainInMouth"
              v-model="icopePainInMouth"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopePainInMouth"
              v-model="icopePainInMouth"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- Dental Notes -->
      <div class="flex flex-col mt-5">
        <div class="flex flex-row">
          <div class="font-medium text-sm pl-13">Dental Notes</div>
        </div>
        <div class="flex flex-row">
          <div class="flex pl-13 grow">
            <textarea
              v-model="dentalNotes"
              rows="1"
              placeholder="Enter dental notes"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
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
</template>

<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@features/patient-record/types/Patient'
import { updateSection } from '@features/patient-record/api/visit'
import type Dental from '@features/patient-record/types/Dental'
import { ref, watch, computed, type Ref } from 'vue'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  age: number | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const fluorideExposure = ref<'6, 7' | '5, 4, 3' | '2, 1, 0' | null>(null)
const diet = ref<'≤1' | '2-3' | '≥4' | null> (null)
const bacterialExposure = ref<'None in last 2 years' | 'Yes in last 7 - 23 months' | 'Yes in last 6 months' | null>(null)
const oralSymptoms = ref<boolean | null>(null)
const drinkOtherWater = ref<boolean | null>(null)

const riskForDentalCarries = ref<'Low Risk' | 'Middle Risk' | 'High Risk' | null>(null)

const showIcope = computed<boolean>(() => 
  props.age != null ? props.age >= 60 : true
);

const icopeDifficultyChewing = ref<boolean | null>(null)
const icopePainInMouth = ref<boolean | null>(null)

const dentalNotes = ref<string | null>('')

// Build fields array
const draftFields = [
  { key: 'fluorideExposure', ref: fluorideExposure },
  { key: 'diet', ref: diet },
  { key: 'bacterialExposure', ref: bacterialExposure },
  { key: 'oralSymptoms', ref: oralSymptoms },
  { key: 'drinkOtherWater', ref: drinkOtherWater },
  { key: 'riskForDentalCarries', ref: riskForDentalCarries },
  { key: 'icopeDifficultyChewing', ref: icopeDifficultyChewing },
  { key: 'icopePainInMouth', ref: icopePainInMouth },
  { key: 'dentalNotes', ref: dentalNotes },
]



// Automatic draft management - handles everything
const formDraft = useAutoDraft<Dental>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:dental`
  }),
  fields: draftFields,
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved dental draft from this device.',
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.dental || null)
  },
  { immediate: true }
)

const requiredFlags = computed(() => [
  fluorideExposure.value,
  diet.value,
  bacterialExposure.value,
  oralSymptoms.value,
  drinkOtherWater.value,
  riskForDentalCarries.value,
])

function buildPayload(): Dental | null {
  if (
    requiredFlags.value.some((v) => v === null) ||
    showIcope.value && (icopeDifficultyChewing.value === null || icopePainInMouth.value === null)
  ) {
    toast.error('Please fill in all required fields.')
    return null
  }
  return {

    fluorideExposure: fluorideExposure.value!,
    diet: diet.value!,
    bacterialExposure: bacterialExposure.value!,
    oralSymptoms: oralSymptoms.value!,
    drinkOtherWater: drinkOtherWater.value!,

    riskForDentalCarries: riskForDentalCarries.value!,

    icopeDifficultyChewing: icopeDifficultyChewing.value!,
    icopePainInMouth: icopePainInMouth.value!,

    dentalNotes: dentalNotes.value,
  }
}

async function submitData() {
  if (!props.patientVid) {
    toast.error('Missing visit id')
    return
  }
  await save({
    buildPayload,
    update: () => updateSection(props.patientId!, props.patientVid!, 'dental', buildPayload()!),
    onSuccess: () => {
      toast.success('Dental saved successfully!')
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
      formDraft.initialize(props.patientData?.dental || null, true)
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
