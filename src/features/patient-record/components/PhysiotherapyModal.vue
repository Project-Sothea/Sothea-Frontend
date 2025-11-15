<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Physiotherapy Assessment</h1>
      <br />

      <!-- Pain/Stiffness During the Day -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-col">
          <div class="font-medium text-sm">Pain/stiffness during the day:</div>
          <div class="text-xs mt-1">
            How severe was your usual joint or muscle pain and/or stiffness overall during the day
            in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Pain levels (0-5) -->
        <div class="flex flex-row mt-2 space-x-4">
          <label v-for="level in [0, 1, 2, 3, 4, 5]" :key="'day' + level">
            <input
              type="radio"
              :name="'painStiffnessDay'"
              v-model="painStiffnessDay"
              :value="level"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- Pain/Stiffness During the Night -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-col">
          <div class="font-medium text-sm">Pain/stiffness during the night:</div>
          <div class="text-xs mt-1">
            How severe was your usual joint or muscle pain and/or stiffness overall during the night
            in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Pain levels (0-5) -->
        <div class="flex flex-row mt-2 space-x-4">
          <label v-for="level in [0, 1, 2, 3, 4, 5]" :key="'night' + level">
            <input
              type="radio"
              :name="'painStiffnessNight'"
              v-model="painStiffnessNight"
              :value="level"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- Symptoms Interfere with Tasks -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How much has your symptoms interfered with your ability to walk or do everyday tasks
            like cooking, cleaning or dressing in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Interference levels -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label
            v-for="option in ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']"
            :key="'tasks' + option"
          >
            <input
              type="radio"
              :name="'symptomsInterfereTasks'"
              v-model="symptomsInterfereTasks"
              :value="option"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ option }}</span>
          </label>
        </div>
      </div>

      <!-- Symptoms Change -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            Have your symptoms improved, worsened, or stayed the same over the last 2 weeks?
            <span class="req">*</span>
          </div>
        </div>

        <!-- Symptoms change options -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label
            v-for="option in ['Improved', 'Worsened', 'Stayed the same']"
            :key="'symptomsChange' + option"
          >
            <input
              type="radio"
              :name="'symptomsChange'"
              v-model="symptomsChange"
              :value="option"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ option }}</span>
          </label>
        </div>
      </div>

      <!-- Need Help Because of Symptoms -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How often have you needed help from others (including family, friends, or carers)
            because of your joint or muscle symptoms in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Help needed options -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label
            v-for="option in ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']"
            :key="'needHelp' + option"
          >
            <input
              type="radio"
              :name="'symptomsNeedHelp'"
              v-model="symptomsNeedHelp"
              :value="option"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ option }}</span>
          </label>
        </div>
      </div>

      <!-- Trouble Sleeping Due to Symptoms -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How often have you had trouble with either falling asleep or staying asleep because of
            your joint or muscle symptoms in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Trouble sleeping options -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label
            v-for="option in ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']"
            :key="'troubleSleep' + option"
          >
            <input
              type="radio"
              :name="'troubleSleepSymptoms'"
              v-model="troubleSleepSymptoms"
              :value="option"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ option }}</span>
          </label>
        </div>
      </div>

      <!-- Fatigue -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How much fatigue or low energy have you felt in the last 2 weeks?
            <span class="req">*</span>
          </div>
        </div>

        <!-- Fatigue levels (0-5) -->
        <div class="flex flex-row mt-2 space-x-4">
          <label v-for="level in [0, 1, 2, 3, 4, 5]" :key="'fatigue' + level">
            <input
              type="radio"
              :name="'howMuchFatigue'"
              v-model="howMuchFatigue"
              :value="level"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- Anxiety/Low Mood -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            How much have you felt anxious or low in your mood because of your joint or muscle
            symptoms in the last 2 weeks? <span class="req">*</span>
          </div>
        </div>

        <!-- Anxiety/low mood levels (0-5) -->
        <div class="flex flex-row mt-2 space-x-4">
          <label v-for="level in [0, 1, 2, 3, 4, 5]" :key="'mood' + level">
            <input
              type="radio"
              :name="'anxiousLowMood'"
              v-model="anxiousLowMood"
              :value="level"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- Medication to Manage Symptoms -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-medium text-sm">
            Have you used any medication to manage your symptoms in the last 2 weeks? If yes, how
            often? <span class="req">*</span>
          </div>
        </div>

        <!-- Medication options -->
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label
            v-for="option in ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']"
            :key="'medication' + option"
          >
            <input
              type="radio"
              :name="'medicationManageSymptoms'"
              v-model="medicationManageSymptoms"
              :value="option"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">{{ option }}</span>
          </label>
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
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type Physiotherapy from '@patient-record/types/Physiotherapy'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const painStiffnessDay = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const painStiffnessNight = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const symptomsInterfereTasks = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const symptomsChange = ref<'Improved' | 'Worsened' | 'Stayed the same' | ''>('')
const symptomsNeedHelp = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const troubleSleepSymptoms = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const howMuchFatigue = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const anxiousLowMood = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const medicationManageSymptoms = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')

const draftFields = [
  bindRef('painStiffnessDay', painStiffnessDay),
  bindRef('painStiffnessNight', painStiffnessNight),
  bindRef('symptomsInterfereTasks', symptomsInterfereTasks),
  bindRef('symptomsChange', symptomsChange),
  bindRef('symptomsNeedHelp', symptomsNeedHelp),
  bindRef('troubleSleepSymptoms', troubleSleepSymptoms),
  bindRef('howMuchFatigue', howMuchFatigue),
  bindRef('anxiousLowMood', anxiousLowMood),
  bindRef('medicationManageSymptoms', medicationManageSymptoms)
]

const physiotherapyDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:physiotherapy`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey, runChecks } = useEditableSection<Physiotherapy>({
  draft: {
    key: physiotherapyDraftStorageKey,
    fields: draftFields,
    autoRestore: false
  }
})

const initialized = ref(false)
const draftRestored = ref(false)

watch(
  () => draftStorageKey.value,
  () => {
    if (draftRestored.value) return
    if (props.isAdd) return
    // Try to restore draft when storage key becomes available
    // This happens before initialization completes
    draftRestored.value = restoreDraft() || draftRestored.value
  },
  { immediate: true }
)

function initialize(patientData: Patient | null) {
  // Don't re-initialize if already initialized, in add mode, or currently editing
  // This prevents overwriting form values with stale data after saving
  if (initialized.value || props.isAdd || isEditing.value) return
  
  // Wait for patientData to actually be loaded (not null/undefined)
  // This prevents initializing with null data on page refresh
  if (!patientData) return

  const p = patientData.physiotherapy
  if (!p) {
    // No saved physiotherapy data - try to restore draft if available
    initialized.value = true
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  painStiffnessDay.value = p.painStiffnessDay
  painStiffnessNight.value = p.painStiffnessNight
  symptomsInterfereTasks.value = p.symptomsInterfereTasks
  symptomsChange.value = p.symptomsChange
  symptomsNeedHelp.value = p.symptomsNeedHelp
  troubleSleepSymptoms.value = p.troubleSleepSymptoms
  howMuchFatigue.value = p.howMuchFatigue
  anxiousLowMood.value = p.anxiousLowMood
  medicationManageSymptoms.value = p.medicationManageSymptoms

  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.physiotherapy) {
    painStiffnessDay.value = null
    painStiffnessNight.value = null
    symptomsInterfereTasks.value = ''
    symptomsChange.value = ''
    symptomsNeedHelp.value = ''
    troubleSleepSymptoms.value = ''
    howMuchFatigue.value = null
    anxiousLowMood.value = null
    medicationManageSymptoms.value = ''
    initialized.value = true
    // Try to restore draft if available
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }
  initialize(props.patientData)
}

// Initialize once
watch(
  () => props.patientData,
  (newVal) => initialize(newVal),
  { immediate: true }
)

function buildPayload(): Physiotherapy | null {
  if (
    !runChecks([
      [painStiffnessDay.value !== null, 'Select pain stiffness (day)'],
      [painStiffnessNight.value !== null, 'Select pain stiffness (night)'],
      [symptomsInterfereTasks.value !== '', 'Select tasks interference'],
      [symptomsChange.value !== '', 'Select symptoms change'],
      [symptomsNeedHelp.value !== '', 'Select need help'],
      [troubleSleepSymptoms.value !== '', 'Select sleep trouble'],
      [howMuchFatigue.value !== null, 'Select fatigue'],
      [anxiousLowMood.value !== null, 'Select mood'],
      [medicationManageSymptoms.value !== '', 'Select medication management']
    ])
  )
    return null
  return {
    painStiffnessDay: painStiffnessDay.value!,
    painStiffnessNight: painStiffnessNight.value!,
    symptomsInterfereTasks: symptomsInterfereTasks.value as
      | 'Never'
      | 'Rarely'
      | 'Sometimes'
      | 'Often'
      | 'Always',
    symptomsChange: symptomsChange.value as 'Improved' | 'Worsened' | 'Stayed the same',
    symptomsNeedHelp: symptomsNeedHelp.value as
      | 'Never'
      | 'Rarely'
      | 'Sometimes'
      | 'Often'
      | 'Always',
    troubleSleepSymptoms: troubleSleepSymptoms.value as
      | 'Never'
      | 'Rarely'
      | 'Sometimes'
      | 'Often'
      | 'Always',
    howMuchFatigue: howMuchFatigue.value!,
    anxiousLowMood: anxiousLowMood.value!,
    medicationManageSymptoms: medicationManageSymptoms.value as
      | 'Never'
      | 'Rarely'
      | 'Sometimes'
      | 'Often'
      | 'Always'
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
      resetData()
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
