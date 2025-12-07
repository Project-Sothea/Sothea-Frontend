<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Patient Details</h1>
      <br />
      <PatientFormFields
        :form="formRef"
        :disabled="!isEditing && !isAdd"
        :maxDate="maxDate"
        @imageUpload="handleImageUpload"
      />

      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isAdd"
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save
        </button>
      </div>

      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="!isEditing && !isAdd"
          @click="toggleEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Edit
        </button>
      </div>

      <div class="flex flex-row-reverse w-full mt-5 gap-3" v-if="isEditing && !isAdd">
        <button
          @click="saveChanges"
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
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { formatDateISO } from '@shared/utils/date'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import type PatientDetails from '@patient-record/types/PatientDetails'
import { createPatient, updatePatient } from '@features/patient-record/api/patient'
import { usePatientForm } from '@patient-record/composables/usePatientForm'
import PatientFormFields from './PatientFormFields.vue'
import { handleApiError } from '@shared/api/handleApiError'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import type { PatientPayload } from '@features/patient-record/api/patient'
import { getPatientPhotoBlob } from '@patient-record/api/photo'

const props = defineProps<{
  patientId?: string
  patientData?: Patient | null
  isAdd?: boolean
  patientVid?: string
}>()

const emit = defineEmits<{
  patientCreated: [{ id: string; patientdetails: PatientDetails; age: number | null }]
  patientUpdated: [{ id?: string; patientdetails: PatientDetails; age: number | null }]
}>()

const toast = useToast()
const maxDate = ref(formatDateISO(new Date()))
const formRef = usePatientForm({
  initial:
    !props.isAdd && props.patientData?.patientdetails
      ? props.patientData.patientdetails
      : undefined,
  onError: (m) => toast.error(m)
})

const {
  name,
  khmerName,
  dob,
  gender,
  village,
  familyGroup,
  contactNo,
  drugAllergies,
  selectedPhoto,
  photoFile,
  ageComputed,
  buildPayload,
  validate,
  reset
} = formRef

const formDraft = useAutoDraft<PatientPayload>({
  storageKey: computed(() => {
    if (!props.patientId || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:patient`
  }),
  fields: [
    { key: 'name', ref: name },
    { key: 'khmerName', ref: khmerName },
    { key: 'dob', ref: dob },
    { key: 'gender', ref: gender },
    { key: 'village', ref: village },
    { key: 'familyGroup', ref: familyGroup },
    { key: 'contactNo', ref: contactNo },
    { key: 'drugAllergies', ref: drugAllergies }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000,
  restoreMessage: 'Restored unsaved patient details draft from this device.'
})

const { isEditing, toggleEdit, save, discardChanges } = formDraft

watch(
  () => props.isAdd,
  (isAdd) => {
    if (isAdd) {
      reset()
    }
  },
  { immediate: true }
)

watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.patientdetails || null)
  },
  { immediate: true }
)

watch(
  () => props.patientId,
  (pid) => {
    if (pid && !props.isAdd) {
      loadExistingPhoto(pid as string)
    }
  },
  { immediate: true }
)

async function submitData() {
  if (!validate()) return
  const payload = buildPayload()
  if (!payload) return
  try {
    const response = await createPatient(payload, photoFile.value)
    const created: PatientDetails = { ...payload, id: response.id } as PatientDetails
    toast.success('New patient created successfully!')
    emit('patientCreated', {
      id: String(response.id),
      patientdetails: created,
      age: ageComputed.value
    })
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
  }
}

async function saveChanges() {
  if (!props.patientId) {
    toast.error('Missing patient id')
    return
  }
  await save({
    buildPayload: () => {
      if (!validate()) return null
      return buildPayload()
    },
    update: () => updatePatient(props.patientId!, buildPayload()!, photoFile.value),
    onSuccess: () => {
      const updated: PatientDetails = {
        ...(buildPayload() as PatientPayload),
        id: props.patientId ? Number(props.patientId) : undefined
      } as PatientDetails
      toast.success('Patient details updated successfully!')
      emit('patientUpdated', {
        id: props.patientId,
        patientdetails: updated,
        age: ageComputed.value
      })
    }
  })
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      formDraft.initialize(props.patientData?.patientdetails || null, true)
      reset(props.patientData?.patientdetails || undefined)
      if (props.patientId) {
        loadExistingPhoto(props.patientId)
      }
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
  })
}

async function handleImageUpload(e: Event) {
  const input = e.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/jpg']
  if (!allowed.includes(file.type)) {
    toast.error('Unsupported file type')
    return
  }
  const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }
  try {
    let fileToProcess: Blob = file
    if (fileToProcess.type === 'image/heic') {
      const heic = await import('heic2any')
      try {
        fileToProcess = (await heic.default({ blob: fileToProcess, toType: 'image/jpeg' })) as Blob
      } catch {
        return toast.error('HEIC conversion failed')
      }
    }
    const fileLike: File =
      fileToProcess instanceof File
        ? fileToProcess
        : new File([fileToProcess], 'upload.jpg', { type: 'image/jpeg' })
    const comp = (await import('browser-image-compression')).default
    const compressed = await comp(fileLike, options)
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (!ev.target || typeof ev.target.result !== 'string') return
      // Revoke prior object URL (if any) to avoid leaks
      if (selectedPhoto.value && selectedPhoto.value.startsWith('blob:')) {
        URL.revokeObjectURL(selectedPhoto.value)
      }
      selectedPhoto.value = ev.target.result
      photoFile.value = compressed
    }
    reader.readAsDataURL(compressed)
  } catch (err) {
    console.error(err)
    selectedPhoto.value = ''
    toast.error('Image upload failed')
  }
}

async function loadExistingPhoto(patientId: string) {
  try {
    const blob = await getPatientPhotoBlob(patientId)
    if (selectedPhoto.value && selectedPhoto.value.startsWith('blob:')) {
      URL.revokeObjectURL(selectedPhoto.value)
    }
    selectedPhoto.value = URL.createObjectURL(blob)
  } catch (err: any) {
    if (err?.response?.status !== 404) {
      console.warn('Failed to load existing photo', err)
    }
  }
}

onBeforeUnmount(() => {
  if (selectedPhoto.value && selectedPhoto.value.startsWith('blob:')) {
    URL.revokeObjectURL(selectedPhoto.value)
  }
})
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
