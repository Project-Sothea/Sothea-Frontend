<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Doctor's Consult</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Condition<span class="req">*</span></div>
          <div class="font-medium text-md w-1/6">Yes</div>
          <div class="font-medium text-md w-1/6">No</div>
        </div>
      </div>

      <!-- Well -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">WELL</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="well"
                class="w-4 h-4"
                v-model="well"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="well"
                class="w-4 h-4"
                v-model="well"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- MSK -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">MSK</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="msk"
                class="w-4 h-4"
                v-model="msk"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="msk"
                class="w-4 h-4"
                v-model="msk"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- CVS -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">CVS</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cvs"
                class="w-4 h-4"
                v-model="cvs"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cvs"
                class="w-4 h-4"
                v-model="cvs"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Respi -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Respi</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="respi"
                class="w-4 h-4"
                v-model="respi"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="respi"
                class="w-4 h-4"
                v-model="respi"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- GU -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">GU</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="gu"
                class="w-4 h-4"
                v-model="gu"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="gu"
                class="w-4 h-4"
                v-model="gu"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- GIT -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">GIT</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="git"
                class="w-4 h-4"
                v-model="git"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="git"
                class="w-4 h-4"
                v-model="git"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- EYE -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">EYE</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="eye"
                class="w-4 h-4"
                v-model="eye"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="eye"
                class="w-4 h-4"
                v-model="eye"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- DERM -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">DERM</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="derm"
                class="w-4 h-4"
                v-model="derm"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="derm"
                class="w-4 h-4"
                v-model="derm"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>
      <!-- Others -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row items-center">
          <div class="font-normal text-sm w-1/3">Others:</div>

          <div class="flex w-1/3">
            <input
              v-model="others"
              type="text"
              placeholder="Specify"
              class="w-full bg-transparent rounded-md border border-stroke py-2 px-2 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Consultation Notes -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Consultation Notes</label>
        <textarea
          v-model="consultationNotes"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Diagnosis -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Diagnosis</label>
        <textarea
          v-model="diagnosis"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Treatment -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Treatment</label>
        <textarea
          v-model="treatment"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <div class="flex flex-col mt-2">
        <!-- Referral Header -->
        <div class="flex flex-row">
          <div class="w-1/3"></div>
          <div class="font-medium text-sm pr-5">Yes</div>
          <div class="font-medium text-sm">No</div>
          <div class="font-medium text-sm w-1/3 pl-11">Location</div>
        </div>
      </div>

      <!-- Referral Needed? -->
      <div class="flex flex-col mt-2">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Referral Needed? <span class="req">*</span>
          </div>

          <div class="flex">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="ref-needed"
                  class="w-4 h-4"
                  v-model="referralNeeded"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="ref-needed"
                  class="w-4 h-4"
                  v-model="referralNeeded"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 pl-11 grow">
            <textarea
              v-model="referralLoc"
              rows="1"
              placeholder="Enter Location"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div class="flex flex-col mt-2">
        <div class="flex flex-row">
          <div class="font-medium text-sm pl-13">Remarks</div>
        </div>
        <div class="flex flex-row">
          <div class="flex pl-13 grow">
            <textarea
              v-model="remarks"
              rows="1"
              placeholder="Enter Remarks for Referral"
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
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type DoctorsConsultation from '@patient-record/types/DoctorsConsultation'
import { updateSection } from '@features/patient-record/api/visit'
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId: string
  patientData: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const well = ref<boolean | null>(null)
const msk = ref<boolean | null>(null)
const cvs = ref<boolean | null>(null)
const respi = ref<boolean | null>(null)
const gu = ref<boolean | null>(null)
const git = ref<boolean | null>(null)
const eye = ref<boolean | null>(null)
const derm = ref<boolean | null>(null)
const others = ref<string | null>('')
const consultationNotes = ref<string | null>('')
const diagnosis = ref<string | null>('')
const treatment = ref<string | null>('')
const referralNeeded = ref<boolean | null>(null)
const referralLoc = ref<string | null>('')
const remarks = ref<string | null>('')

const draftFields = [
  bindRef('well', well),
  bindRef('msk', msk),
  bindRef('cvs', cvs),
  bindRef('respi', respi),
  bindRef('gu', gu),
  bindRef('git', git),
  bindRef('eye', eye),
  bindRef('derm', derm),
  bindRef('others', others),
  bindRef('consultationNotes', consultationNotes),
  bindRef('diagnosis', diagnosis),
  bindRef('treatment', treatment),
  bindRef('referralNeeded', referralNeeded),
  bindRef('referralLoc', referralLoc),
  bindRef('remarks', remarks)
]

const drConsultDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:doctorsConsultation`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey, runChecks } = useEditableSection<DoctorsConsultation>({
  draft: {
    key: drConsultDraftStorageKey,
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

  const d = patientData.doctorsconsultation
  if (!d) {
    // No saved doctors consultation data - try to restore draft if available
    initialized.value = true
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  well.value = d.well
  msk.value = d.msk
  cvs.value = d.cvs
  respi.value = d.respi
  gu.value = d.gu
  git.value = d.git
  eye.value = d.eye
  derm.value = d.derm
  others.value = d.others
  consultationNotes.value = d.consultationNotes
  diagnosis.value = d.diagnosis
  treatment.value = d.treatment
  referralNeeded.value = d.referralNeeded
  referralLoc.value = d.referralLoc
  remarks.value = d.remarks

  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.doctorsconsultation) {
    well.value = null
    msk.value = null
    cvs.value = null
    respi.value = null
    gu.value = null
    git.value = null
    eye.value = null
    derm.value = null
    others.value = null
    consultationNotes.value = null
    diagnosis.value = null
    treatment.value = null
    referralNeeded.value = null
    referralLoc.value = null
    remarks.value = null
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

function buildPayload(): DoctorsConsultation | null {
  if (
    !runChecks([
      [well.value !== null ||
      msk.value !== null ||
      cvs.value !== null ||
      respi.value !== null ||
      gu.value !== null ||
      git.value !== null ||
      eye.value !== null ||
      derm.value !== null ||
      (others.value !== null && others.value.trim() !== ''), 'Please indicate at least one condition status'],
      [referralNeeded.value !== null, 'Indicate referral need']
    ])
  )
    return null
  return {
    well: well.value!,
    msk: msk.value!,
    cvs: cvs.value!,
    respi: respi.value!,
    gu: gu.value!,
    git: git.value!,
    eye: eye.value!,
    derm: derm.value!,
    others: others.value ? others.value.trim() : others.value,
    consultationNotes: consultationNotes.value || '',
    diagnosis: diagnosis.value || '',
    treatment: treatment.value || '',
    referralNeeded: referralNeeded.value!,
    referralLoc: referralLoc.value || '',
    remarks: remarks.value || ''
  }
}

async function submitData() {
  if (!props.patientVid) return toast.error('Missing visit id')
  await save({
    buildPayload,
    update: () =>
      updateSection(props.patientId, props.patientVid!, 'doctorsConsultation', buildPayload()!),
    onSuccess: () => {
      toast.success('Doctors Consultation saved successfully!')
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
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
.req {
  color: red;
}
</style>
