<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Admin Details</h1>
      <br />
      <AdminFormFields
        :form="formRef"
        :disabled="!isEditing && !isAdd"
        :maxDate="maxDate"
        :gender="patientGender"
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
import { createPatientVisit, updateAdmin } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import AdminFormFields from './AdminFormFields.vue'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'
import type { AdminPayload } from '@features/patient-record/api/visit'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const emit = defineEmits<{
  patientVisitCreated: [{ id: string; vid: string; regDate: string | null; queueNo: string | null }]
  adminUpdated: [
    {
      id: string | undefined
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

const { regDate, queueNo, pregnant, lastMenstrualPeriod, sentToId, buildPayload, validate, reset } =
  formRef

const patientGender = computed(() => props.patientData?.patientDetails?.gender ?? '')

if (props.isAdd && !regDate.value) regDate.value = new Date()

// Automatic draft management - handles everything
const formDraft = useAutoDraft<AdminPayload>({
  storageKey: computed(() => {
    if (!props.patientId || !props.patientVid || props.isAdd) return null
    return `patient-record:draft:${props.patientId}:${props.patientVid}:admin`
  }),
  fields: [
    { key: 'regDate', ref: regDate },
    { key: 'queueNo', ref: queueNo },
    { key: 'pregnant', ref: pregnant },
    { key: 'lastMenstrualPeriod', ref: lastMenstrualPeriod },
    { key: 'sentToId', ref: sentToId }
  ],
  persistWhen: (isEditing) => isEditing.value && !props.isAdd,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved admin details draft from this device.'
})

// Extract functions from formDraft
const { isEditing, toggleEdit, save, discardChanges } = formDraft

// Reset form when entering create mode
watch(
  () => props.isAdd,
  (isAdd) => {
    if (isAdd) {
      // Clear form when entering create mode
      reset()
      if (!regDate.value) regDate.value = new Date()
    }
  },
  { immediate: true }
)

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

watch(
  patientGender,
  (gender) => {
    if (gender === 'M') {
      pregnant.value = false
      lastMenstrualPeriod.value = null
    }
  },
  { immediate: true }
)

async function submitData() {
  if (props.isAdd) {
    if (!props.patientId) {
      toast.error('Create a patient before adding admin details.')
      return
    }
    if (!validate()) return
    const payload = buildPayload()
    if (!payload) return
    try {
      const response = await createPatientVisit(props.patientId, payload)
      toast.success('New patient visit created successfully!')
      emit('patientVisitCreated', {
        id: String(props.patientId),
        vid: String(response.vid),
        regDate: regDate.value ? formatDateISO(regDate.value as any) : null,
        queueNo: queueNo.value
      })
    } catch (error) {
      console.error(error)
      toast.error(handleApiError(error))
    }
  } else if (!props.isAdd && props.patientId && props.patientVid) {
    await save({
      buildPayload: () => {
        if (!validate()) return null
        return buildPayload()
      },
      update: () => updateAdmin(props.patientId!, props.patientVid!, buildPayload()!),
      onSuccess: () => {
        toast.success('Admin Details updated successfully!')
        emit('adminUpdated', {
          id: props.patientId,
          vid: props.patientVid,
          regDate: regDate.value ? formatDateISO(regDate.value as any) : null,
          queueNo: queueNo.value
        })
      }
    })
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
</style>
