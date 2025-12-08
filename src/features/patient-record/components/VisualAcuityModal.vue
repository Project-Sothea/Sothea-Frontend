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

        <div class="mb-4">
          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span>Sent to Khmer Optics Optometrist? (if score for any eye is > 6/24)</span>
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sent-to-opto"
                  class="w-4 h-4"
                  v-model="sentToOpto"
                  :value="true"
                  :disabled="!isEditing"
                />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sent-to-opto"
                  class="w-4 h-4"
                  v-model="sentToOpto"
                  :value="false"
                  :disabled="!isEditing"
                />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span>Referred for Prescription Glasses?</span>
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="referred-for-glasses"
                  class="w-4 h-4"
                  v-model="referredForGlasses"
                  :value="true"
                  :disabled="!isEditing"
                />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="referred-for-glasses"
                  class="w-4 h-4"
                  v-model="referredForGlasses"
                  :value="false"
                  :disabled="!isEditing"
                />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
        </div>

        <div class="mb-2" v-if="showIcope">
          <!-- Row 1 -->
          <div class="text-sm font-medium text-dark">ICOPE (60 yo and above):</div>

          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span
                >Do you have any eye problems (difficulty seeing far away, difficulty reading, eye
                disease?)</span
              >
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="eye-problem"
                  class="w-4 h-4"
                  v-model="icopeEyeProblem"
                  :value="true"
                  :disabled="!isEditing"
                />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="eye-problem"
                  class="w-4 h-4"
                  v-model="icopeEyeProblem"
                  :value="false"
                  :disabled="!isEditing"
                />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
          <div class="mt-1 flex flex-nowrap items-start gap-x-6">
            <div class="text-sm text-dark basis-[26rem] shrink-0">
              <span>Are you being treated for diabetes or high blood pressure?</span>
              <span class="req">*</span>
            </div>

            <div class="flex items-center gap-6 pt-0.5">
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="diabetes-or-bp"
                  class="w-4 h-4"
                  v-model="icopeTreatedForDiabetesOrBp"
                  :value="true"
                  :disabled="!isEditing"
                />
                <span class="text-sm">Y</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="diabetes-or-bp"
                  class="w-4 h-4"
                  v-model="icopeTreatedForDiabetesOrBp"
                  :value="false"
                  :disabled="!isEditing"
                />
                <span class="text-sm">N</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Additional Intervention -->
        <div class="mt-4">
          <label for="" class="mb-2 block text-sm font-medium text-dark">Remarks: </label>
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
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type VisualAcuity from '@patient-record/types/VisualAcuity'
import { updateSection } from '@features/patient-record/api/visit'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import { calculateAge } from '@shared/utils/age'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  age: number | null
  isAdd?: boolean
  patientVid?: string
}>()

const lEyeVision = ref<number | null>(null)
const rEyeVision = ref<number | null>(null)

const sentToOpto = ref<boolean | null>(null)
const referredForGlasses = ref<boolean | null>(null)

const calculatedAge = computed(
  () => props.age ?? calculateAge(props.patientData?.patientDetails?.dob)
)
const showIcope = computed<boolean>(() =>
  calculatedAge.value != null ? calculatedAge.value >= 60 : true
)

const icopeEyeProblem = ref<boolean | null>(null)
const icopeTreatedForDiabetesOrBp = ref<boolean | null>(null)

const additionalIntervention = ref<string | null>('')

const toast = useToast()

// Automatic draft management - handles everything
const formDraft = useAutoDraft<VisualAcuity>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:visualAcuity`
  }),
  fields: [
    { key: 'lEyeVision', ref: lEyeVision },
    { key: 'rEyeVision', ref: rEyeVision },
    { key: 'sentToOpto', ref: sentToOpto },
    { key: 'referredForGlasses', ref: referredForGlasses },
    { key: 'icopeEyeProblem', ref: icopeEyeProblem },
    { key: 'icopeTreatedForDiabetesOrBp', ref: icopeTreatedForDiabetesOrBp },
    { key: 'additionalIntervention', ref: additionalIntervention }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved visual acuity draft from this device.'
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.visualAcuity || null)
  },
  { immediate: true }
)

// Clear dependent fields when toggled to No/false
watch(sentToOpto, (val) => {
  if (val === null) return
  // nothing to clear yet; placeholder for future dependent fields
})
function buildPayload(): VisualAcuity | null {
  if (
    !runChecks([
      [lEyeVision.value !== null, 'Please fill in L eye vision'],
      [rEyeVision.value !== null, 'Please fill in R eye vision'],
      [sentToOpto.value !== null, 'Please answer whether sent to optometrist'],
      [
        referredForGlasses.value !== null,
        'Please answer whether the patient ws referred for prescription glasses'
      ],
      [!showIcope.value || icopeEyeProblem.value !== null, 'Please answer ICOPE question'],
      [
        !showIcope.value || icopeTreatedForDiabetesOrBp.value !== null,
        'Please answer ICOPE question'
      ]
    ])
  )
    return null
  return {
    lEyeVision: lEyeVision.value!,
    rEyeVision: rEyeVision.value!,
    sentToOpto: sentToOpto.value ?? false,
    referredForGlasses: referredForGlasses.value!,
    icopeEyeProblem: icopeEyeProblem.value!,
    icopeTreatedForDiabetesOrBp: icopeTreatedForDiabetesOrBp.value!,
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
    onSuccess: () => {
      toast.success('Visual Acuity saved successfully!')
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
      formDraft.initialize(props.patientData?.visualAcuity || null, true)
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
