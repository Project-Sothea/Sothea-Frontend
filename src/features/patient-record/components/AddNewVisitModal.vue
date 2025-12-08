<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>New Visit Admin Details</h1>
      <br />
      <AdminFormFields
        :form="formRef"
        :disabled="false"
        :maxDate="maxDate"
        :gender="patientData?.patientDetails?.gender || ''"
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
import { createPatientVisit } from '@patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import AdminFormFields from './AdminFormFields.vue'
import { formatDateISO } from '@shared/utils/date'

const props = defineProps<{ patientId?: string; patientVid?: string; patientData?: Patient }>()
const emit = defineEmits<{
  patientVisitCreated: [{ id: string; vid: string }]
}>()
const toast = useToast()
const maxDate = ref(formatDateISO(new Date()))
// Initialize with patient admin data if provided (for convenience when adding new visit)
const adminInitial = props.patientData?.admin ? { ...props.patientData.admin } : undefined
const formRef = useAdminForm({ initial: adminInitial })
const { regDate, buildPayload } = formRef

// Override regDate with "today" for a new visit scenario
if (!regDate.value) regDate.value = new Date()
else regDate.value = new Date()

// Image handling helper kept inline for now

const isSubmitting = ref(false)

async function submitData() {
  if (isSubmitting.value) return
  if (!props.patientId) return toast.error('Missing patient id')
  const admin = buildPayload()
  if (!admin) return
  isSubmitting.value = true
  try {
    const response = await createPatientVisit(props.patientId, admin)
    toast.success('New Patient Visit created successfully!')
    emit('patientVisitCreated', { id: props.patientId, vid: String(response.vid) })
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
