<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Fall Risk (For patients above 60)</h1>
      <br />

      <!-- How often patient worries about falling -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How often do you worry about falling? <span class="req">*</span>
          </div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="fallWorries"
              v-model="fallWorries"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">A: Never</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallWorries"
              v-model="fallWorries"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">B: 1x a week</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallWorries"
              v-model="fallWorries"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">C: >1x a week</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallWorries"
              v-model="fallWorries"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">D: Every day</span>
          </label>
        </div>
      </div>

      <!-- History of fall within past 12 months -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            History of fall within the past 12 months: <span class="req">*</span>
          </div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="fallHistory"
              v-model="fallHistory"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">A: No fall (Score 0)</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallHistory"
              v-model="fallHistory"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">B: 1 fall prior to admission (Score 1)</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallHistory"
              v-model="fallHistory"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">C: 2 or more falls prior to admission (Score 5)</span>
          </label>

          <label>
            <input
              type="radio"
              name="fallHistory"
              v-model="fallHistory"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">D: 1 or more falls during current admission (Score 5)</span>
          </label>
        </div>
      </div>

      <!-- Cognitive status -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Cognitive status: <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="cognitiveStatus"
              v-model="cognitiveStatus"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">A: Intact (Score 0)</span>
          </label>

          <label>
            <input
              type="radio"
              name="cognitiveStatus"
              v-model="cognitiveStatus"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">B: Minimally impaired (Score 1)</span>
          </label>

          <label>
            <input
              type="radio"
              name="cognitiveStatus"
              v-model="cognitiveStatus"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">C: Moderately impaired (Score 2)</span>
          </label>

          <label>
            <input
              type="radio"
              name="cognitiveStatus"
              v-model="cognitiveStatus"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">D: Severely impaired (Score 3)</span>
          </label>
        </div>
      </div>

      <!-- Continence problems -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Continence problems: <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="continenceProblems"
              v-model="continenceProblems"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">A: No continence problems or IDC in-situ (Score 0)</span>
          </label>

          <label>
            <input
              type="radio"
              name="continenceProblems"
              v-model="continenceProblems"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">B: Incontinence of urine and/or faeces (Score 1)</span>
          </label>

          <label>
            <input
              type="radio"
              name="continenceProblems"
              v-model="continenceProblems"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >C: Frequency (empties bladder > 6 times daily)/ Diarrhoea (Score 1)</span
            >
          </label>

          <label>
            <input
              type="radio"
              name="continenceProblems"
              v-model="continenceProblems"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">D: Urgency (Score 1)</span>
          </label>

          <label>
            <input
              type="radio"
              name="continenceProblems"
              v-model="continenceProblems"
              :value="'e'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >E: Needing nocturnal toileting more than 2 times daily (Score 1)</span
            >
          </label>
        </div>
      </div>

      <!-- Safety Awareness -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">Safety Awareness: <span class="req">*</span></div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="safetyAwareness"
              v-model="safetyAwareness"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >A: Good awareness and requests appropriate assistance (Score 0)</span
            >
          </label>

          <label>
            <input
              type="radio"
              name="safetyAwareness"
              v-model="safetyAwareness"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">B: Occasional risk-taking behaviours (Score 1)</span>
          </label>

          <label>
            <input
              type="radio"
              name="safetyAwareness"
              v-model="safetyAwareness"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">C: Inappropriate fear for activities (Score 2)</span>
          </label>

          <label>
            <input
              type="radio"
              name="safetyAwareness"
              v-model="safetyAwareness"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">D: Frequent risk-taking behaviours (Score 3)</span>
          </label>
        </div>
      </div>

      <!-- Unsteadiness when standing, transferring and/or walking -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            Unsteadiness when standing, transferring and/or walking: <span class="req">*</span>
          </div>
        </div>

        <!-- Options (displayed vertically) -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="unsteadiness"
              v-model="unsteadiness"
              :value="'a'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >A: Steady gait or complete dependent or on traction (Score 0)</span
            >
          </label>

          <label>
            <input
              type="radio"
              name="unsteadiness"
              v-model="unsteadiness"
              :value="'b'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >B: Minimally unsteadiness which needs supervision (Score 1)</span
            >
          </label>

          <label>
            <input
              type="radio"
              name="unsteadiness"
              v-model="unsteadiness"
              :value="'c'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >C: Moderately unsteadiness which require hands-on assist at times (Score 4)</span
            >
          </label>

          <label>
            <input
              type="radio"
              name="unsteadiness"
              v-model="unsteadiness"
              :value="'d'"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm"
              >D: Severely unsteadiness and need constant hands-on assist (Score 5)</span
            >
          </label>
        </div>
      </div>

      <!-- Current Score Display -->
      <div class="font-medium text-lg mt-4" :class="{ 'text-red-500': fallRiskScore >= 8 }">
        Current Score: {{ fallRiskScore }}
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
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type FallRisk from '@patient-record/types/FallRisk'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const fallWorries = ref<'a' | 'b' | 'c' | 'd' | ''>('')
const fallHistory = ref<'a' | 'b' | 'c' | 'd' | ''>('')
const cognitiveStatus = ref<'a' | 'b' | 'c' | 'd' | ''>('')
const continenceProblems = ref<'a' | 'b' | 'c' | 'd' | 'e' | ''>('')
const safetyAwareness = ref<'a' | 'b' | 'c' | 'd' | ''>('')
const unsteadiness = ref<'a' | 'b' | 'c' | 'd' | ''>('')
const { isEditing, toggleEdit, save, runChecks } = useEditableSection<FallRisk>()

const scoresMap = {
  fallHistory: { a: 0, b: 1, c: 5, d: 5 },
  cognitiveStatus: { a: 0, b: 1, c: 2, d: 3 },
  continenceProblems: { a: 0, b: 1, c: 1, d: 1, e: 1 },
  safetyAwareness: { a: 0, b: 1, c: 2, d: 3 },
  unsteadiness: { a: 0, b: 1, c: 4, d: 5 }
}

const fallRiskScore = computed(() => {
  let totalScore = 0
  totalScore += fallHistory.value ? scoresMap.fallHistory[fallHistory.value] : 0
  totalScore += cognitiveStatus.value ? scoresMap.cognitiveStatus[cognitiveStatus.value] : 0
  totalScore += continenceProblems.value
    ? scoresMap.continenceProblems[continenceProblems.value]
    : 0
  totalScore += safetyAwareness.value ? scoresMap.safetyAwareness[safetyAwareness.value] : 0
  totalScore += unsteadiness.value ? scoresMap.unsteadiness[unsteadiness.value] : 0
  return totalScore
})

// Watch for patientData changes
watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (!props.isAdd && newVal) {
      const fallRisk = newVal.fallrisk
      if (!fallRisk) {
        fallWorries.value = ''
        fallHistory.value = ''
        cognitiveStatus.value = ''
        continenceProblems.value = ''
        safetyAwareness.value = ''
        unsteadiness.value = ''
      } else {
        fallWorries.value = fallRisk.fallWorries as 'a' | 'b' | 'c' | 'd'
        fallHistory.value = fallRisk.fallHistory as 'a' | 'b' | 'c' | 'd'
        cognitiveStatus.value = fallRisk.cognitiveStatus as 'a' | 'b' | 'c' | 'd'
        continenceProblems.value = fallRisk.continenceProblems as 'a' | 'b' | 'c' | 'd' | 'e'
        safetyAwareness.value = fallRisk.safetyAwareness as 'a' | 'b' | 'c' | 'd'
        unsteadiness.value = fallRisk.unsteadiness as 'a' | 'b' | 'c' | 'd'
      }
    }
  },
  { immediate: true }
)

function buildPayload(): FallRisk | null {
  if (
    !runChecks([
      [fallWorries.value !== '', 'Select fall worries'],
      [fallHistory.value !== '', 'Select fall history'],
      [cognitiveStatus.value !== '', 'Select cognitive status'],
      [continenceProblems.value !== '', 'Select continence problems'],
      [safetyAwareness.value !== '', 'Select safety awareness'],
      [unsteadiness.value !== '', 'Select unsteadiness']
    ])
  )
    return null
  return {
    fallWorries: fallWorries.value as any,
    fallHistory: fallHistory.value as any,
    cognitiveStatus: cognitiveStatus.value as any,
    continenceProblems: continenceProblems.value as any,
    safetyAwareness: safetyAwareness.value as any,
    unsteadiness: unsteadiness.value as any,
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
    onSuccess: () => toast.success('Fall Risk saved successfully!')
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
