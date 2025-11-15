<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Admin Details</h1>
      <br />
      <AdminFormFields
        :form="formRef"
        :disabled="!isEditing && !isAdd"
        :maxDate="maxDate"
        @imageUpload="handleImageUpload"
      />

      <!-- Save Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isAdd"
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save
        </button>
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
import { ref, watch, computed } from 'vue'
import { formatDateISO } from '@shared/utils/date'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import { createPatient, updateAdmin } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import AdminFormFields from './AdminFormFields.vue'
import { getPatientPhotoBlob } from '@patient-record/api/photo'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import type { AdminPayload } from '@features/patient-record/api/visit'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const emit = defineEmits<{
  patientCreated: [
    {
      id: string
      name: string
      age: number | null
      vid: string
      regDate: string | null
      queueNo: string | null
    }
  ]
  patientUpdated: [
    {
      id: string | undefined
      name: string
      age: number
      vid: string | undefined
      regDate: string | null
      queueNo: string | null
    }
  ]
}>()

const toast = useToast()
const maxDate = ref(formatDateISO(new Date()))
const formRef = useAdminForm({
  initial: !props.isAdd && props.patientData?.admin ? props.patientData.admin : undefined,
  onError: (m) => toast.error(m)
})

const {
  name,
  khmerName,
  dob,
  gender,
  contactNo,
  regDate,
  queueNo,
  village,
  familyGroup,
  pregnant,
  lastMenstrualPeriod,
  drugAllergies,
  sentToId,
  photoFile,
  selectedPhoto,
  ageComputed,
  buildPayload,
  validate,
  reset
} = formRef

if (props.isAdd && !regDate.value) regDate.value = formatDateISO(new Date())

// Automatic draft management - handles everything
const formDraft = useAutoDraft<AdminPayload>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:admin`
  }),
  fields: [
    { key: 'name', ref: name },
    { key: 'khmerName', ref: khmerName },
    { key: 'dob', ref: dob },
    { key: 'gender', ref: gender },
    { key: 'contactNo', ref: contactNo },
    { key: 'regDate', ref: regDate },
    { key: 'queueNo', ref: queueNo },
    { key: 'village', ref: village },
    { key: 'familyGroup', ref: familyGroup },
    { key: 'pregnant', ref: pregnant },
    { key: 'lastMenstrualPeriod', ref: lastMenstrualPeriod },
    { key: 'drugAllergies', ref: drugAllergies },
    { key: 'sentToId', ref: sentToId },
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved admin details draft from this device.',
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges } = formDraft

// Initialize when patientData changes
watch(
  () => props.patientData,
  (patientData) => {
    if (props.isAdd || isEditing.value) return
    if (!patientData) return
    formDraft.initialize(patientData.admin || null)
  },
  { immediate: true }
)

// Load existing photo when patient id/vid becomes available or changes
watch(
  [() => props.isAdd, () => props.patientId, () => props.patientVid],
  ([isAdd, pid, vid]) => {
    if (!isAdd && pid && vid) {
      loadExistingPhoto(pid as string, vid as string)
    }
  },
  { immediate: true }
)

async function submitData() {
  if (props.isAdd) {
    // For new patients, use the existing logic
    if (!validate()) return
    const payload = buildPayload()
    if (!payload) return
    try {
      const response = await createPatient(payload, photoFile.value)
      toast.success('New Patient created successfully!')
      emit('patientCreated', {
        id: String(response.id),
        name: name.value,
        age: ageComputed.value,
        vid: '1',
        regDate: regDate.value,
        queueNo: queueNo.value
      })
    } catch (error) {
      console.error(error)
      toast.error(handleApiError(error))
    }
  } else if (!props.isAdd && props.patientId && props.patientVid) {
    // For existing patients, use useEditableSection's save
    await save({
      buildPayload: () => {
        if (!validate()) return null
        return buildPayload()
      },
      update: () => updateAdmin(props.patientId!, props.patientVid!, buildPayload()!, photoFile.value),
      onSuccess: () => {
        toast.success('Admin Details updated successfully!')
        emit('patientUpdated', {
          id: props.patientId,
          name: name.value,
          age: ageComputed.value as number,
          vid: props.patientVid,
          regDate: regDate.value,
          queueNo: queueNo.value
        })
      }
    })
  }
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

async function loadExistingPhoto(patientId: string, vid: string) {
  try {
    const blob = await getPatientPhotoBlob(patientId, vid)
    // Revoke prior object URL (if any) to avoid leaks
    if (selectedPhoto.value && selectedPhoto.value.startsWith('blob:')) {
      URL.revokeObjectURL(selectedPhoto.value)
    }
    selectedPhoto.value = URL.createObjectURL(blob)
  } catch (err: any) {
    // 404 means no photo; ignore silently
    if (err?.response?.status !== 404) {
      console.warn('Failed to load existing photo', err)
    }
  }
}

async function saveChanges() {
  if (!isEditing.value) return
  await submitData()
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      // Reset to server data or defaults (force re-initialization)
      formDraft.initialize(props.patientData?.admin || null, true)
      reset(props.patientData?.admin || undefined)
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
