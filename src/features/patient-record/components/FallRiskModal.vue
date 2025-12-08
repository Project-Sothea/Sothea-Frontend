<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Fall Risk (For patients above 60)</h1>
      <br />

      <!-- Side To Side -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            Balance Test (Side to Side): <span class="req">*</span>
          </div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="sideToSideBalance"
              v-model="sideToSideBalance"
              :value="1"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Held For 10s (1 point)</span>
          </label>

          <label>
            <input
              type="radio"
              name="sideToSideBalance"
              v-model="sideToSideBalance"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Not held for 10s / Not attempted (0 points)</span>
          </label>
        </div>
      </div>

      <!-- Semi-Tandem -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            Balance Test (Semi-Tandem): <span class="req">*</span>
          </div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="semiTandemBalance"
              v-model="semiTandemBalance"
              :value="1"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Held For 10s (1 point)</span>
          </label>

          <label>
            <input
              type="radio"
              name="semiTandemBalance"
              v-model="semiTandemBalance"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Not held for 10s / Not attempted (0 points)</span>
          </label>
        </div>
      </div>

      <!-- Tandem -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Balance Test (Tandem): <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="tandemBalance"
              v-model="tandemBalance"
              :value="1"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Held for 3-9.99s (1 point)</span>
          </label>
          <label>
            <input
              type="radio"
              name="tandemBalance"
              v-model="tandemBalance"
              :value="2"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Held For 10s (2 points)</span>
          </label>
          <label>
            <input
              type="radio"
              name="tandemBalance"
              v-model="tandemBalance"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Held for &lt;3s / Not attempted (0 points)</span>
          </label>
        </div>
      </div>

      <!-- Gait Speed Test -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Gait Speed Test: <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="gaitSpeedTest"
              v-model="gaitSpeedTest"
              :value="1"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Time is more than 6.52 sec (1 point)</span>
          </label>

          <label>
            <input
              type="radio"
              name="gaitSpeedTest"
              v-model="gaitSpeedTest"
              :value="2"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Time is 4.66 to 6.52 sec (2 points)</span>
          </label>

          <label>
            <input
              type="radio"
              name="gaitSpeedTest"
              v-model="gaitSpeedTest"
              :value="3"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Time is 3.62 to 4.65 sec (3 points)</span>
          </label>

          <label>
            <input
              type="radio"
              name="gaitSpeedTest"
              v-model="gaitSpeedTest"
              :value="4"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Time is less than 3.62 sec (4 points)</span>
          </label>

          <label>
            <input
              type="radio"
              name="gaitSpeedTest"
              v-model="gaitSpeedTest"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Not attempted or failed (0 points)</span>
          </label>
        </div>
      </div>

      <!-- Chair Stand Test -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Chair Stand Test: <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">
              Can’t complete 5 chair stands / Can’t complete in &lt;60s (0 points)
            </span>
          </label>

          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="1"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"> >16.70s (1 point)</span>
          </label>

          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="2"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">13.70s - 16.69s (2 points)</span>
          </label>

          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="3"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">11.20s - 13.69s (3 points)</span>
          </label>

          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="4"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"> &lt;11.20 (4 points) </span>
          </label>
          <label>
            <input
              type="radio"
              name="chairStandTest"
              v-model="chairStandTest"
              :value="0"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">Not attempted or failed (0 points)</span>
          </label>
        </div>
      </div>

      <!-- Current Score Display -->
      <div class="font-medium text-lg mt-4" :class="{ 'text-red-500': fallRiskScore < 7 }">
        Current Score: {{ fallRiskScore }} / 12
      </div>
      <div v-if="fallRiskScore < 7" :class="{ 'text-red-500': fallRiskScore < 7 }">
        Refer to Physiotherapist
      </div>

      <div v-if="showIcope">
        <div class="font-medium text-lg mt-6">ICOPE (60 yo and above):</div>

        <div class="mt-4 flex flex-nowrap items-start gap-x-6">
          <div class="text-sm text-dark basis-[26rem] shrink-0">
            <span>Completed 5 chair stands?</span>
            <span class="req">*</span>
          </div>

          <div class="flex items-center gap-6 pt-0.5">
            <label class="inline-flex items-center gap-2">
              <input
                type="radio"
                name="icopeCompleteChairStands"
                class="w-4 h-4"
                v-model="icopeCompleteChairStands"
                :value="true"
                :disabled="!isEditing"
              />
              <span class="text-sm">Y</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                type="radio"
                name="icopeCompleteChairStands"
                class="w-4 h-4"
                v-model="icopeCompleteChairStands"
                :value="false"
                :disabled="!isEditing"
              />
              <span class="text-sm">N</span>
            </label>
          </div>
        </div>
        <div class="mt-4 flex flex-nowrap items-start gap-x-6">
          <div class="text-sm text-dark basis-[26rem] shrink-0">
            <span>Was it completed in 14 seconds?</span>
            <span class="req">*</span>
          </div>

          <div class="flex items-center gap-6 pt-0.5">
            <label class="inline-flex items-center gap-2">
              <input
                type="radio"
                name="icopeChairStandsTime"
                class="w-4 h-4"
                v-model="icopeChairStandsTime"
                :value="true"
                :disabled="!isEditing"
              />
              <span class="text-sm">Y</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input
                type="radio"
                name="icopeChairStandsTime"
                class="w-4 h-4"
                v-model="icopeChairStandsTime"
                :value="false"
                :disabled="!isEditing"
              />
              <span class="text-sm">N</span>
            </label>
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
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type FallRisk from '@patient-record/types/FallRisk'
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

const toast = useToast()

const sideToSideBalance = ref<number | null>(null)
const semiTandemBalance = ref<number | null>(null)
const tandemBalance = ref<number | null>(null)
const gaitSpeedTest = ref<number | null>(null)
const chairStandTest = ref<number | null>(null)

const calculatedAge = computed(
  () => props.age ?? calculateAge(props.patientData?.patientdetails?.dob)
)
const showIcope = computed<boolean>(() =>
  calculatedAge.value != null ? calculatedAge.value >= 60 : true
)

const icopeCompleteChairStands = ref<boolean | null>(null)
const icopeChairStandsTime = ref<boolean | null>(null)

const fallRiskScore = computed(() => {
  return (
    (sideToSideBalance.value ?? 0) +
    (semiTandemBalance.value ?? 0) +
    (tandemBalance.value ?? 0) +
    (gaitSpeedTest.value ?? 0) +
    (chairStandTest.value ?? 0)
  )
})

// Automatic draft management - handles everything
const formDraft = useAutoDraft<FallRisk>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:fallRisk`
  }),
  fields: [
    { key: 'sideToSideBalance', ref: sideToSideBalance },
    { key: 'semiTandemBalance', ref: semiTandemBalance },
    { key: 'tandemBalance', ref: tandemBalance },
    { key: 'gaitSpeedTest', ref: gaitSpeedTest },
    { key: 'chairStandTest', ref: chairStandTest },
    { key: 'icopeCompleteChairStands', ref: icopeCompleteChairStands },
    { key: 'icopeChairStandsTime', ref: icopeChairStandsTime }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved fall risk draft from this device.'
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.fallRisk || null)
  },
  { immediate: true }
)

function buildPayload(): FallRisk | null {
  if (
    !runChecks([
      [sideToSideBalance.value !== null, 'Select side to side balance'],
      [semiTandemBalance.value !== null, 'Select semi tandem balance'],
      [tandemBalance.value !== null, 'Select tandem balance'],
      [gaitSpeedTest.value !== null, 'Select gait balance'],
      [chairStandTest.value !== null, 'Select chair stand test'],
      [!showIcope.value || icopeCompleteChairStands.value !== null, 'Answer ICOPE Questions'],
      [!showIcope.value || icopeChairStandsTime.value !== null, 'Answer ICOPE Questions']
    ])
  )
    return null
  return {
    sideToSideBalance: sideToSideBalance.value!,
    semiTandemBalance: semiTandemBalance.value!,
    tandemBalance: tandemBalance.value!,
    gaitSpeedTest: gaitSpeedTest.value!,
    chairStandTest: chairStandTest.value!,
    icopeCompleteChairStands: icopeCompleteChairStands.value!,
    icopeChairStandsTime: icopeChairStandsTime.value!,
    fallRiskScore: fallRiskScore.value
  }
}

async function submitData() {
  if (!props.patientVid) {
    toast.error('Missing visit id')
    return
  }
  await save({
    buildPayload,
    update: () => updateSection(props.patientId, props.patientVid!, 'fallRisk', buildPayload()!),
    onSuccess: () => {
      toast.success('Fall Risk saved successfully!')
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
      formDraft.initialize(props.patientData?.fallRisk || null, true)
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
