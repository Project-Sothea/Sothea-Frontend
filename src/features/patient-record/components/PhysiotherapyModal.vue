<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Physiotherapy Assessment</h1>
      <br />

      <!-- Subjective Assessment -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Subjective Assessment</label>
        <textarea
          v-model="subjectiveAssessment"
          rows="3"
          placeholder="Enter subjective assessment"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Pain Scale -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">
          Pain Scale <span class="req">*</span>
        </label>
        <input
          v-model="painScale"
          type="number"
          step="1"
          placeholder="Enter pain scale (1-10)"
          class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
          :disabled="!isEditing"
          min="1"
          max="10"
        />
      </div>

      <!-- Objective Assessment -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Objective Assessment</label>
        <textarea
          v-model="objectiveAssessment"
          rows="3"
          placeholder="Enter objective assessment"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Intervention -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Intervention</label>
        <textarea
          v-model="intervention"
          rows="3"
          placeholder="Enter intervention"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Evaluation -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Evaluation</label>
        <textarea
          v-model="evaluation"
          rows="3"
          placeholder="Enter evaluation"
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
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type Physiotherapy from '@patient-record/types/Physiotherapy'

import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import { updateSection } from '../api/visit'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const subjectiveAssessment = ref<string>('')
const painScale = ref<number | null>(null)
const objectiveAssessment = ref<string>('')
const intervention = ref<string>('')
const evaluation = ref<string>('')

// Automatic draft management - handles everything
const formDraft = useAutoDraft<Physiotherapy>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:physiotherapy`
  }),
  fields: [
    { key: 'subjectiveAssessment', ref: subjectiveAssessment },
    { key: 'painScale', ref: painScale },
    { key: 'objectiveAssessment', ref: objectiveAssessment },
    { key: 'intervention', ref: intervention },
    { key: 'evaluation', ref: evaluation },
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved physiotherapy assessment draft from this device.',
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges, runChecks } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.physiotherapy || null)
  },
  { immediate: true }
)

function buildPayload(): Physiotherapy | null {
  if (
    !runChecks([
      [painScale.value !== null && painScale.value >= 1 && painScale.value <= 10, 'Enter pain scale (1-10)']
    ])
  )
    return null
  return {
    subjectiveAssessment: subjectiveAssessment.value,
    painScale: painScale.value!,
    objectiveAssessment: objectiveAssessment.value,
    intervention: intervention.value,
    evaluation: evaluation.value
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
      updateSection(props.patientId, props.patientVid!, 'physiotherapy', buildPayload()!),
    onSuccess: () => {
      toast.success('Physiotherapy assessment saved successfully')
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
      formDraft.initialize(props.patientData?.physiotherapy || null, true)
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
  })
}
</script>

<style scoped>
.req {
  color: red;
}
</style>
