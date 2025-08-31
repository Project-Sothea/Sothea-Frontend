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
import type Patient from '../../types/Patient'
import type Physiotherapy from '../../types/Physiotherapy'
import { updateSection } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const isEditing = ref(false)
const painStiffnessDay = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const painStiffnessNight = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const symptomsInterfereTasks = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const symptomsChange = ref<'Improved' | 'Worsened' | 'Stayed the same' | ''>('')
const symptomsNeedHelp = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const troubleSleepSymptoms = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')
const howMuchFatigue = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const anxiousLowMood = ref<0 | 1 | 2 | 3 | 4 | 5 | null>(null)
const medicationManageSymptoms = ref<'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | ''>('')

watch(
  () => props.patientData,
  (newVal: Patient | null) => {
    if (!props.isAdd && newVal) {
      const physiotherapy = newVal.physiotherapy
      if (!physiotherapy) {
        painStiffnessDay.value = null
        painStiffnessNight.value = null
        symptomsInterfereTasks.value = ''
        symptomsChange.value = ''
        symptomsNeedHelp.value = ''
        troubleSleepSymptoms.value = ''
        howMuchFatigue.value = null
        anxiousLowMood.value = null
        medicationManageSymptoms.value = ''
      } else {
        painStiffnessDay.value = physiotherapy.painStiffnessDay
        painStiffnessNight.value = physiotherapy.painStiffnessNight
        symptomsInterfereTasks.value = physiotherapy.symptomsInterfereTasks
        symptomsChange.value = physiotherapy.symptomsChange
        symptomsNeedHelp.value = physiotherapy.symptomsNeedHelp
        troubleSleepSymptoms.value = physiotherapy.troubleSleepSymptoms
        howMuchFatigue.value = physiotherapy.howMuchFatigue
        anxiousLowMood.value = physiotherapy.anxiousLowMood
        medicationManageSymptoms.value = physiotherapy.medicationManageSymptoms
      }
    }
  },
  { immediate: true }
)

async function submitData() {
  try {
    if (
      painStiffnessDay.value === null ||
      painStiffnessNight.value === null ||
      symptomsInterfereTasks.value === '' ||
      symptomsChange.value === '' ||
      symptomsNeedHelp.value === '' ||
      troubleSleepSymptoms.value === '' ||
      howMuchFatigue.value === null ||
      anxiousLowMood.value === null ||
      medicationManageSymptoms.value === ''
    ) {
      toast.error('Please fill in all required fields')
      return
    }
    const physiotherapy: Physiotherapy = {
      painStiffnessDay: painStiffnessDay.value,
      painStiffnessNight: painStiffnessNight.value,
      symptomsInterfereTasks: symptomsInterfereTasks.value,
      symptomsChange: symptomsChange.value,
      symptomsNeedHelp: symptomsNeedHelp.value,
      troubleSleepSymptoms: troubleSleepSymptoms.value,
      howMuchFatigue: howMuchFatigue.value,
      anxiousLowMood: anxiousLowMood.value,
      medicationManageSymptoms: medicationManageSymptoms.value
    }
    if (!props.patientVid) {
      toast.error('Missing visit id')
      return
    }
    await updateSection(props.patientId, props.patientVid, 'physiotherapy', physiotherapy)
    toggleEdit()
    toast.success('Physiotherapy assessment saved successfully')
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
  }
}

function toggleEdit() {
  isEditing.value = !isEditing.value
}
</script>

<style scoped>
.req {
  color: red;
}
</style>
