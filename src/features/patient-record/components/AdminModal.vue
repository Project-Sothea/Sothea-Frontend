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
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'
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

// Set up draft fields (excluding photo fields as they can't be serialized)
const draftFields = [
  bindRef('name', name),
  bindRef('khmerName', khmerName),
  bindRef('dob', dob),
  bindRef('gender', gender),
  bindRef('contactNo', contactNo),
  bindRef('regDate', regDate),
  bindRef('queueNo', queueNo),
  bindRef('village', village),
  bindRef('familyGroup', familyGroup),
  bindRef('pregnant', pregnant),
  bindRef('lastMenstrualPeriod', lastMenstrualPeriod),
  bindRef('drugAllergies', drugAllergies),
  bindRef('sentToId', sentToId)
]

const adminDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:admin`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey } = useEditableSection<AdminPayload>({
  draft: {
    key: adminDraftStorageKey,
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

function initialize(patientData: Patient | undefined) {
  // Don't re-initialize if already initialized, in add mode, or currently editing
  // This prevents overwriting form values with stale data after saving
  if (initialized.value || props.isAdd || isEditing.value) return
  
  // Wait for patientData to actually be loaded (not null/undefined)
  // This prevents initializing with null data on page refresh
  if (!patientData) return

  const admin = patientData.admin
  if (!admin) {
    // No saved admin data - draft should already be restored by the watch above
    // If not, try one more time
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    initialized.value = true
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  reset(admin)
  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.admin) {
    reset(undefined)
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

// Keep form in sync if parent passes a different patient (admin fields only)
// But only if not editing and already initialized
// Don't reset if we just restored a draft - the draft values should take precedence
watch(
  () => props.patientData?.admin,
  (next, prev) => {
    // Only reset if:
    // 1. Not in add mode
    // 2. Not currently editing
    // 3. Already initialized
    // 4. Haven't restored a draft (draft takes precedence)
    // 5. The admin data actually changed (not just initial load)
    if (!props.isAdd && !isEditing.value && initialized.value && !draftRestored.value && prev !== undefined) {
      reset(next || undefined)
    }
  }
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
