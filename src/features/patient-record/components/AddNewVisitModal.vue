<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>New Visit Admin Details</h1>
      <br />
      <AdminFormFields
        :form="formRef"
        :disabled="false"
        :maxDate="maxDate"
        @imageUpload="handleImageUpload"
      />

      <!-- Save Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useToast } from 'vue-toast-notification'
import type Patient from '@patient-record/types/Patient'
import { addVisit } from '@patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import AdminFormFields from './AdminFormFields.vue'
import { formatDateISO } from '@shared/utils/date'

const props = defineProps<{ patientId?: string; patientVid?: string; patientData?: Patient }>()
const emit = defineEmits<{
  patientVisitCreated: [{ id: string; name: string; age: number; vid: string }]
}>()
const toast = useToast()
const maxDate = ref(formatDateISO(new Date()))
// Initialize with patient admin data if provided (for convenience when adding new visit)
const adminInitial = props.patientData?.admin ? { ...props.patientData.admin } : undefined
const formRef = useAdminForm({ initial: adminInitial })
const { regDate, photoFile, selectedPhoto, buildPayload } = formRef

// Override regDate with "today" for a new visit scenario
if (!regDate.value) regDate.value = formatDateISO(new Date())
else regDate.value = formatDateISO(new Date())

// Image handling helper kept inline for now

const isSubmitting = ref(false)

async function submitData() {
  if (isSubmitting.value) return
  if (!props.patientId) return toast.error('Missing patient id')
  const admin = buildPayload()
  if (!admin) return
  isSubmitting.value = true
  try {
    console.log(photoFile.value)
    const response = await addVisit(props.patientId, admin, photoFile.value)
    toast.success('New Patient Visit created successfully!')
    emit('patientVisitCreated', {
      id: props.patientId,
      name: admin.name,
      age: admin.age as number,
      vid: String(response.vid)
    })
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
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
      const mod = await import('heic2any')
      try {
        fileToProcess = (await mod.default({ blob: fileToProcess, toType: 'image/jpeg' })) as Blob
      } catch (err) {
        toast.error('HEIC conversion failed')
        return
      }
    }
    const imgComp = (await import('browser-image-compression')).default
    const fileLike: File =
      fileToProcess instanceof File
        ? fileToProcess
        : new File([fileToProcess], 'upload.jpg', { type: 'image/jpeg' })
    const compressed = await imgComp(fileLike, options)
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (!ev.target || typeof ev.target.result !== 'string') return
      selectedPhoto.value = ev.target.result
      photoFile.value = compressed
    }
    reader.readAsDataURL(compressed)
  } catch (err) {
    selectedPhoto.value = ''
    toast.error('Image upload failed')
  }
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
