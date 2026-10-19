<template>
  <div class="flex items-center justify-center">
    <form
      class="flex flex-col rounded-lg w-3/4 border border-gray-300 p-10"
      @submit.prevent="submitData"
    >
      <h1 class="text-xl font-medium">Referral</h1>

      <section class="mt-6" aria-labelledby="referral-red-flags">
        <h2 id="referral-red-flags" class="text-sm font-medium">Warnings</h2>
        <ul v-if="warningLinks.length" class="mt-2 space-y-2">
          <li v-for="flag in warningLinks" :key="flag.message">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              @click="emit('update:activeSection', flag.section)"
            >
              <WarningIndicator :tooltip="flag.message" tabindex="-1" />
              <span>{{ flag.message }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="mt-2 text-sm text-gray-500">No red flags recorded.</p>
      </section>

      <label for="referral-location" class="mt-6 text-sm font-medium">Where to refer?</label>
      <input
        id="referral-location"
        v-model="whereToRefer"
        type="text"
        placeholder="Enter referral location"
        :disabled="!isEditing || isSubmitting"
        class="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-[#3f51b5] disabled:bg-gray-200"
      />

      <label for="referral-comments" class="mt-6 text-sm font-medium">Additional Comments</label>
      <textarea
        id="referral-comments"
        v-model="additionalComments"
        rows="4"
        placeholder="Enter additional comments"
        :disabled="!isEditing || isSubmitting"
        class="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-[#3f51b5] disabled:bg-gray-200"
      ></textarea>

      <div class="mt-5 flex justify-end gap-3">
        <button
          v-if="!isEditing && !isAdd"
          type="button"
          class="rounded-lg border-2 border-[#3f51b5] px-5 py-2 text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white"
          @click="toggleEdit"
        >
          Edit
        </button>
        <template v-if="isEditing && !isAdd">
          <button
            type="button"
            :disabled="isSubmitting"
            class="rounded-lg border-2 border-red-600 px-5 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50"
            @click="discardEdit"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded-lg border-2 border-[#3f51b5] px-5 py-2 text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Edits' }}
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import WarningIndicator from '@shared/ui/WarningIndicator.vue'
import { useReferralWarnings } from '@patient-record/composables/useReferralWarnings'
import { useAutoDraft } from '@patient-record/composables/useAutoDraft'
import { updateSection } from '@patient-record/api/visit'
import type Patient from '@patient-record/types/Patient'
import type Referral from '@patient-record/types/Referral'

const props = defineProps<{
  patientId: string
  patientVid?: string
  patientData: Patient | null
  age?: number | null
  isAdd?: boolean
}>()
const emit = defineEmits<{
  referralUpdated: [referral: Referral]
  'update:activeSection': [section: string]
}>()
const toast = useToast()
const { warningLinks } = useReferralWarnings(
  reactive({
    age: computed(() => props.age),
    fallRisk: computed(() => props.patientData?.fallRisk),
    visualAcuity: computed(() => props.patientData?.visualAcuity),
    temperature: computed(() => props.patientData?.vitalStatistics?.temperature),
    patientDetails: computed(() => props.patientData?.patientDetails),
    heightAndWeight: computed(() => props.patientData?.heightAndWeight),
    visitDate: computed(() => props.patientData?.admin?.regDate)
  })
)

type ReferralFields = Pick<Referral, 'whereToRefer' | 'additionalComments'>
const whereToRefer = ref('')
const additionalComments = ref('')
// Upgrade the original referral-tab draft without losing unsaved text.
if (typeof window !== 'undefined' && props.patientId && props.patientVid && !props.isAdd) {
  const key = `patient-record:draft:${props.patientId}:${props.patientVid}:referral`
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const draft = JSON.parse(raw)
      if (draft?.data && ('referralLoc' in draft.data || 'remarks' in draft.data)) {
        draft.data = {
          whereToRefer: draft.data.whereToRefer ?? draft.data.referralLoc ?? '',
          additionalComments: draft.data.additionalComments ?? draft.data.remarks ?? ''
        }
        localStorage.setItem(key, JSON.stringify(draft))
      }
    }
  } catch {
    // useAutoDraft handles unavailable storage and malformed drafts.
  }
}
const formDraft = useAutoDraft<ReferralFields>({
  storageKey: computed(() =>
    props.patientId && props.patientVid && !props.isAdd
      ? `patient-record:draft:${props.patientId}:${props.patientVid}:referral`
      : null
  ),
  fields: [
    { key: 'whereToRefer', ref: whereToRefer },
    { key: 'additionalComments', ref: additionalComments }
  ],
  restoreMessage: 'Restored unsaved referral draft from this device.'
})
const { isEditing, isSubmitting, toggleEdit } = formDraft
function savedFields(): ReferralFields {
  return {
    whereToRefer: props.patientData?.referral?.whereToRefer ?? '',
    additionalComments: props.patientData?.referral?.additionalComments ?? ''
  }
}
watch(
  () => props.patientData?.referral,
  () => {
    if (!isEditing.value) formDraft.initialize(savedFields())
  },
  { immediate: true }
)

async function submitData() {
  if (!props.patientId || !props.patientVid) return toast.error('Missing patient or visit id')
  const payload: Referral = {
    whereToRefer: whereToRefer.value.trim(),
    additionalComments: additionalComments.value.trim()
  }
  await formDraft.save({
    buildPayload: () => payload,
    update: () => updateSection(props.patientId, props.patientVid!, 'referral', payload),
    onSuccess: () => {
      emit('referralUpdated', payload)
      formDraft.initialize(payload, true)
    }
  })
}

function discardEdit() {
  formDraft.discardChanges({ onDiscard: () => formDraft.initialize(savedFields(), true) })
}
</script>
