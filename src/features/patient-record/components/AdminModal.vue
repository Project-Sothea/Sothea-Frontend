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
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isEditing && !isAdd"
          @click="saveChanges"
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
import { formatDateISO } from '@shared/utils/date'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@patient-record/types/Patient'
import { createPatient, updateAdmin } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import AdminFormFields from './AdminFormFields.vue'
import { getPatientPhotoBlob } from '@patient-record/api/photo'

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
const isEditing = ref(false)
const maxDate = ref(formatDateISO(new Date()))
const formRef = useAdminForm({
  initial: !props.isAdd && props.patientData?.admin ? props.patientData.admin : undefined,
  onError: (m) => toast.error(m)
})

const { name, regDate, queueNo, photoFile, selectedPhoto, ageComputed, buildPayload, validate } =
  formRef

if (props.isAdd && !regDate.value) regDate.value = formatDateISO(new Date())

// Keep form in sync if parent passes a different patient (admin fields only)
watch(
  () => props.patientData?.admin,
  (next) => {
    if (!props.isAdd) formRef.reset(next || undefined)
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

const isSubmitting = ref(false)

async function submitData() {
  if (isSubmitting.value) return
  if (!validate()) return
  isSubmitting.value = true
  try {
    if (props.isAdd && !isEditing.value) {
      const payload = buildPayload()
      if (!payload) return
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
    } else if (!props.isAdd && isEditing.value && props.patientId && props.patientVid) {
      const payload = buildPayload()
      if (!payload) return
      await updateAdmin(props.patientId, props.patientVid, payload, photoFile.value)
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
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
    return
  } finally {
    isSubmitting.value = false
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

function toggleEdit() {
  isEditing.value = !isEditing.value
}

async function saveChanges() {
  if (!isEditing.value) return
  await submitData()
  // Only toggle off editing if submission succeeded (no error toast in last attempt)
  if (!isSubmitting.value) toggleEdit()
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
