<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Social History</h1>
      <br />

      <div class="w-full overflow-x-auto">
        <table class="w-full min-w-[600px] table-fixed" aria-label="Social history">
          <colgroup>
            <col class="w-1/3" />
            <col class="w-12" />
            <col class="w-12" />
            <col />
          </colgroup>
          <thead>
            <tr class="border-b border-stroke">
              <th scope="col" class="pb-3 pr-4 text-left font-medium text-md">History</th>
              <th scope="col" class="pb-3 text-center font-medium text-md">Yes</th>
              <th scope="col" class="pb-3 text-center font-medium text-md">No</th>
              <th scope="col" class="pb-3 pl-4 text-left font-medium text-md">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="py-3 pr-4 text-left align-middle font-normal text-sm">
                Past Smoking History <span class="req">*</span>
              </th>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Past Smoking History: Yes"
                name="smoking-hist"
                class="w-4 h-4"
                v-model="pastSmokingHistory"
                :value="true"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Past Smoking History: No"
                name="smoking-hist"
                class="w-4 h-4"
                v-model="pastSmokingHistory"
                :value="false"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 pl-4 align-middle">
                <textarea
                rows="1"
                aria-label="Past Smoking History remarks"
                placeholder="If Y, no. of years"
                v-model="pastSmokingInformation"
                class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                :disabled="!isEditing"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-3 pr-4 text-left align-middle font-normal text-sm">
                Current Smoking History <span class="req">*</span>
              </th>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Current Smoking History: Yes"
                name="curr-smoking-hist"
                class="w-4 h-4"
                v-model="currentSmokingHistory"
                :value="true"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Current Smoking History: No"
                name="curr-smoking-hist"
                class="w-4 h-4"
                v-model="currentSmokingHistory"
                :value="false"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 pl-4 align-middle">
                <textarea
                rows="1"
                aria-label="Current Smoking History remarks"
                placeholder="If Y, how many cigarettes/day?"
                v-model="currentSmokingInformation"
                class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                :disabled="!isEditing"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th scope="row" class="py-3 pr-4 text-left align-middle font-normal text-sm">
                Alcohol History <span class="req">*</span>
              </th>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Alcohol History: Yes"
                name="alc-hist"
                class="w-4 h-4"
                v-model="alcoholHistory"
                :value="true"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 text-center align-middle">
                <input
                type="radio"
                aria-label="Alcohol History: No"
                name="alc-hist"
                class="w-4 h-4"
                v-model="alcoholHistory"
                :value="false"
                :disabled="!isEditing"
                />
              </td>
              <td class="py-3 pl-4 align-middle">
                <textarea
                rows="1"
                aria-label="Alcohol History remarks"
                placeholder="If Y, how regular and what type of alcohol?"
                v-model="alcoholInformation"
                class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                :disabled="!isEditing"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
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
import type SocialHistory from '@patient-record/types/SocialHistory'
import { updateSection } from '@features/patient-record/api/visit'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const pastSmokingHistory = ref<boolean | null>(null)
const pastSmokingInformation = ref<string | null>(null)
const currentSmokingHistory = ref<boolean | null>(null)
const currentSmokingInformation = ref<string | null>(null)
const alcoholHistory = ref<boolean | null>(null)
const alcoholInformation = ref<string | null>('')

const toast = useToast()

// Automatic draft management - handles everything
const formDraft = useAutoDraft<SocialHistory>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:socialHistory`
  }),
  fields: [
    { key: 'pastSmokingHistory', ref: pastSmokingHistory },
    { key: 'pastSmokingInformation', ref: pastSmokingInformation },
    { key: 'currentSmokingHistory', ref: currentSmokingHistory },
    { key: 'currentSmokingInformation', ref: currentSmokingInformation },
    { key: 'alcoholHistory', ref: alcoholHistory },
    { key: 'alcoholInformation', ref: alcoholInformation }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved social history draft from this device.'
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.socialHistory || null)
  },
  { immediate: true }
)

function buildPayload(): SocialHistory | null {
  if (
    !runChecks([
      [pastSmokingHistory.value !== null, 'Indicate past smoking history'],
      [currentSmokingHistory.value !== null, 'Indicate current smoking history'],
      [alcoholHistory.value !== null, 'Indicate alcohol history'],
      [
        pastSmokingHistory.value !== true || !!pastSmokingInformation.value?.trim(),
        'Enter past smoking remarks'
      ],
      [
        currentSmokingHistory.value !== true || !!currentSmokingInformation.value?.trim(),
        'Enter current smoking remarks'
      ],
      [
        alcoholHistory.value !== true || !!alcoholInformation.value?.trim(),
        'Enter alcohol remarks'
      ]
    ])
  )
    return null
  return {
    pastSmokingHistory: pastSmokingHistory.value!,
    pastSmokingInformation: pastSmokingInformation.value || null,
    currentSmokingHistory: currentSmokingHistory.value!,
    currentSmokingInformation: currentSmokingInformation.value || null,
    alcoholHistory: alcoholHistory.value!,
    alcoholInformation: alcoholHistory.value === false ? null : alcoholInformation.value || null
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
    onSuccess: () => {
      toast.success('Social history saved successfully!')
      // After saving, the form already has the correct values in memory
      // We don't need to reload from parent - the form state is the source of truth
      // The initialized flag prevents re-initialization from stale patientData
    },
    showToastOnSuccess: false
  })
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      // Reset to server data or defaults (force re-initialization)
      formDraft.initialize(props.patientData?.socialHistory || null, true)
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
  })
}

watch(alcoholHistory, (val) => {
  if (val === false) {
    alcoholInformation.value = null
  }
})
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
