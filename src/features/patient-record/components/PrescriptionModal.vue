<template>
  <div class="flex items-start justify-center">
    <div class="w-full max-w-5xl px-4 py-6">
      <!-- Title -->
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-semibold">
          {{ rx?.id ? 'Update Prescription' : 'Create Prescription' }}
        </h1>

        <!-- status chip -->
        <span
          v-if="rx"
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
          :class="isReadOnly ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-emerald-300 bg-emerald-50 text-emerald-700'"
        >
          <span class="inline-block h-2 w-2 rounded-full" :class="isReadOnly ? 'bg-amber-500' : 'bg-emerald-500'"></span>
          {{ isReadOnly ? 'Dispensed' : 'Open' }}
        </span>
      </div>

      <!-- Read-only banner -->
      <div
        v-if="isReadOnly"
        class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm"
      >
        This prescription has already been <strong>dispensed</strong> by <strong>{{ rx?.dispenserName }}</strong> and can’t be edited.
      </div>

      <section class="mt-6 rounded-2xl border border-gray-200 bg-white/90 shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold">Patient Info</h2>
          </div>
        </header>

      <div class="px-5 py-4 text-sm text-gray-900">
        <span class="font-semibold">Drug Allergies:</span>
        <span class="ml-1">{{ patientData?.admin?.drugAllergies ?? 'No Data' }}</span>
      </div>
      <div class="px-5 text-sm text-gray-900">
        <span class="font-semibold">Diagnosis:</span>
        <span class="ml-1">{{ patientData?.doctorsconsultation?.diagnosis ?? 'No Data' }}</span>
      </div>
      <div class="px-5 py-4 text-sm text-gray-900">
        <span class="font-semibold">Treatment:</span>
        <span class="ml-1">{{ patientData?.doctorsconsultation?.treatment ?? 'No Data' }}</span>
      </div>

      </section>

      <!-- Notes -->
      <section class="mt-6 rounded-2xl border border-gray-200 bg-white/90 shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold">Notes</h2>
            <span
              v-if="!isReadOnly && formDraft.isEditing.value && formDraft.draftRestored.value"
              class="text-xs text-gray-500"
            >
              Unsaved changes
            </span>
          </div>
          <div class="text-xs text-gray-400">
            {{ (headerNotes || '').length }}/300
          </div>
        </header>

        <div class="px-5 py-4">
          <textarea
            v-model="headerNotes"
            maxlength="300"
            rows="3"
            placeholder="Add any instructions for the pharmacist (optional)…"
            :disabled="!headerNotesEditing || headerSaving"
            class="block w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm placeholder:text-gray-400
                   focus:outline-none focus:ring-4 focus:ring-[#3f51b5]/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Edit Button -->
        <div class="flex flex-row-reverse w-full px-5 pb-4">
          <button
            v-if="!headerNotesEditing"
            @click="headerNotesEditing = true"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
          >
            Edit
          </button>
        </div>

        <!-- Save/Discard Buttons -->
        <div class="flex flex-row-reverse w-full px-5 pb-4 gap-3" v-if="headerNotesEditing">
          <button
            @click="saveHeader"
            :disabled="headerSaving || formDraft.isSubmitting.value"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="headerSaving">Saving…</span>
            <span v-else>Save Notes</span>
          </button>
          <button
            type="button"
            @click="discardHeaderNotes"
            class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 focus:outline-none"
          >
            Discard Changes
          </button>
        </div>
      </section>

      <!-- Lines -->
      <section class="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b">
          <h2 class="text-base font-semibold">Lines</h2>
          <button
            v-if="!isReadOnly"
            class="px-3 py-1.5 rounded-lg text-sm text-[#3f51b5] border border-[#3f51b5]
                   hover:bg-[#3f51b5] hover:text-white transition disabled:opacity-60"
            @click="addLine"
            :disabled="!rx"
          >
            + Add Line
          </button>
        </header>

        <div class="px-5 py-4">
          <!-- Empty state -->
          <div
            v-if="uiLines.length === 0"
            class="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500"
          >
            No lines yet.
            <span v-if="!isReadOnly">Click <strong>“+ Add Line”</strong> to get started.</span>
          </div>

          <!-- List -->
          <div v-else class="space-y-4">
            <div
              v-for="(line, idx) in uiLines"
              :key="line.id ?? (line as DraftLine)._uid ?? idx"
              class="rounded-lg border border-gray-200 p-4"
            >
              <PrescriptionLineRow
                v-if="rx"
                :rx-id="rx.id"
                :line="line"
                :read-only="isReadOnly"
                :all-presentations="presentations"
                :exclude-presentation-ids="excludePresentationIds(idx)"
                :has-unsaved-edits="line.id ? !!unsavedLineEdits[line.id] : false"
                :original-line="line.id && rx ? rx.lines?.find((l: PrescriptionLine) => l.id === line.id) : undefined"
                @refresh="refreshRx"
                @discard-draft="discardDraftLine((line as DraftLine)._uid)"
                @update-line-edit="updateLineEdit"
                @clear-line-edit="clearLineEdit"
                @update-draft-line="updateDraftLine"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Footer actions -->
      <div class="w-full mt-6 flex justify-end">
        <div class="grid grid-cols-[max-content] gap-3">
          <button
            class="px-5 py-2 rounded-lg text-sm text-white bg-orange-500 hover:bg-orange-600
                   shadow-sm hover:shadow disabled:opacity-60 transition"
            @click="onDispense"
            :disabled="!rx || isReadOnly || !allPacked || dispensing"
            :title="!allPacked ? 'All lines must be packed' : ''"
          >
            {{ dispensing ? 'Dispensing…' : 'Mark Dispensed' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { Prescription, PrescriptionLine } from '@/features/pharmacy/types/Prescription'
import {
  getPrescriptionByVisit,
  getPrescriptionByID,
  createPrescription,
  updatePrescription,
  dispensePrescription,
} from '@/features/pharmacy/api/prescription'
import type { DrugPresentationView } from '@/features/pharmacy/types/Drug'
import PrescriptionLineRow from './PrescriptionLineRow.vue'
import { listAllPresentations, listDrugs, listPresentationsForDrug } from '@/features/pharmacy/api/drug'
import type Patient from '../types/Patient'
import { useAutoDraft } from '@features/patient-record/composables/useAutoDraft'

// ─── Props ────────────────────────────────────────────────────────────────
const props = defineProps<{
  patientData?: Patient
  patientId: string | number;
  patientVid: string | number;
}>()
const pid = Number(props.patientId)
const vid = Number(props.patientVid)

// ─── State ───────────────────────────────────────────────────────────────
const toast = useToast()
const rx = ref<Prescription | null>(null)
const headerNotes = ref<string>('')
const headerSaving = ref(false)
const dispensing = ref(false)

// optional: preload this if you have an endpoint; otherwise child can remote-search
const presentations = ref<DrugPresentationView[]>([])

// All existing server lines
const lines = computed<Partial<PrescriptionLine>[]>(() => rx.value?.lines ?? [])

// New draft lines which have not been added yet
type DraftLine = Partial<PrescriptionLine> & { __draft: true; _uid: string }
const draftLines = ref<DraftLine[]>([])

// Unsaved edits to existing lines (lineId -> partial line data)
const unsavedLineEdits = ref<Record<number, Partial<PrescriptionLine>>>({})

// Independent edit state for header notes
const headerNotesEditing = ref(false)

// Computed to check if we should persist (any unsaved changes)
const shouldPersist = computed(() => {
  return headerNotesEditing.value || draftLines.value.length > 0 || Object.keys(unsavedLineEdits.value).length > 0
})

// Automatic draft management
const formDraft = useAutoDraft<{
  headerNotes: string
  draftLines: DraftLine[]
  unsavedLineEdits: Record<number, Partial<PrescriptionLine>>
}>({
  storageKey: computed(() => {
    if (!pid || !vid) return null
    return `patient-record:draft:${pid}:${vid}:prescription`
  }),
  fields: [
    { key: 'headerNotes', ref: headerNotes },
    { key: 'draftLines', ref: draftLines },
    { key: 'unsavedLineEdits', ref: unsavedLineEdits },
  ],
  persistWhen: () => shouldPersist.value,
  expirationMs: 30 * 60 * 1000, // 30 minutes
  restoreMessage: 'Restored unsaved prescription draft from this device.',
})

// For UI rendering - merge saved lines with unsaved edits
const uiLines = computed<Partial<PrescriptionLine>[]>(() => {
  const savedLines = (rx.value?.lines ?? []).map(line => {
    // If there are unsaved edits for this line, merge them
    if (line.id && unsavedLineEdits.value[line.id]) {
      return { ...line, ...unsavedLineEdits.value[line.id] }
    }
    return line
  })
  return [...savedLines, ...draftLines.value]
})

const isReadOnly = computed(() => !!rx?.value?.isDispensed)
const allPacked = computed(() => (rx.value?.lines?.length ?? 0) > 0 && rx.value!.lines.every(l => l.isPacked))

// ─── Lifecycle ───────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([ensureHeader(), loadPresentations()])
  
  // After data is loaded, initialize form draft
  // If draft was restored, it will have already been applied to the refs
  // If not, initialize with server data
  if (!formDraft.draftRestored.value) {
    formDraft.initialize({
      headerNotes: rx.value?.notes ?? '',
      draftLines: [],
      unsavedLineEdits: {},
    })
  } else {
    // Draft was restored - filter out unsaved edits for lines that no longer exist
    if (rx.value) {
      const existingLineIds = new Set(rx.value.lines?.map(l => l.id) ?? [])
      const validEdits: Record<number, Partial<PrescriptionLine>> = {}
      Object.entries(unsavedLineEdits.value).forEach(([id, edits]) => {
        if (existingLineIds.has(Number(id))) {
          validEdits[Number(id)] = edits
        }
      })
      unsavedLineEdits.value = validEdits
    }
    // If header notes differ from server, enter edit mode for header notes
    if (headerNotes.value !== (rx.value?.notes ?? '')) {
      headerNotesEditing.value = true
    }
  }
})

async function ensureHeader() {
  // Try to load existing by visit
  const existing = await getPrescriptionByVisit(pid, vid)
  if (existing) {
    rx.value = await getPrescriptionByID(existing.id)
    // Only set headerNotes if no draft was restored (draft takes priority)
    if (!formDraft.draftRestored.value) {
      headerNotes.value = rx.value.notes ?? ''
    }
    return
  }
  // Otherwise create a fresh header immediately (draft)
  const created = await createPrescription({ patientId: pid, vid, notes: '' })
  rx.value = created
  // Only set headerNotes if no draft was restored
  if (!formDraft.draftRestored.value) {
    headerNotes.value = ''
  }
}

async function loadPresentations() {
  presentations.value = await listAllPresentations()
}

async function refreshRx() {
  if (!rx.value?.id) return
  const fresh = await getPrescriptionByID(rx.value.id)
  rx.value = fresh
  // Only update header notes if we don't have unsaved changes
  if (!formDraft.isEditing.value || headerNotes.value === (rx.value.notes ?? '')) {
    headerNotes.value = fresh.notes ?? ''
  }
  // Clear unsaved edits for lines that no longer exist
  const existingLineIds = new Set(fresh.lines?.map(l => l.id) ?? [])
  const newEdits = { ...unsavedLineEdits.value }
  Object.keys(newEdits).forEach(id => {
    if (!existingLineIds.has(Number(id))) {
      delete newEdits[Number(id)]
    }
  })
  unsavedLineEdits.value = newEdits
  await loadPresentations()
  
  // Clear draft if everything is saved
  if (draftLines.value.length === 0 && 
      Object.keys(unsavedLineEdits.value).length === 0 &&
      !formDraft.isEditing.value) {
    formDraft.clearDraft()
  }
}

// ─── Header save ─────────────────────────────────────────────────────────
async function saveHeader() {
  if (!rx.value || headerSaving.value) return
  headerSaving.value = true
  try {
    await updatePrescription(rx.value.id, { patientId: pid, vid, notes: headerNotes.value })
    toast.success('Notes saved.')
    await refreshRx()
    // Exit edit mode for header notes
    headerNotesEditing.value = false
    // Clear draft only if there are no other unsaved changes
    if (draftLines.value.length === 0 && Object.keys(unsavedLineEdits.value).length === 0) {
      formDraft.clearDraft()
    }
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to save notes.')
  } finally {
    headerSaving.value = false
  }
}

// Discard header notes changes (but keep other draft data)
function discardHeaderNotes() {
  if (rx.value) {
    headerNotes.value = rx.value.notes ?? ''
    // Exit edit mode for header notes
    headerNotesEditing.value = false
    // Clear draft only if there are no other unsaved changes
    if (draftLines.value.length === 0 && Object.keys(unsavedLineEdits.value).length === 0) {
      formDraft.clearDraft()
    }
  }
}

// ─── Lines: drafts management ────────────────────────────────────────────
function addLine() {
  draftLines.value.push({
    __draft: true,
    _uid: `d-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    presentationId: undefined,
    doseAmount: undefined,
    doseUnit: undefined,
    scheduleKind: 'day',
    everyN: 1,
    frequencyPerSchedule: 1,
    duration: 7
  })
}

// Handle unsaved edits to existing lines
function updateLineEdit(lineId: number, data: Partial<PrescriptionLine>) {
  unsavedLineEdits.value = {
    ...unsavedLineEdits.value,
    [lineId]: { ...unsavedLineEdits.value[lineId], ...data },
  }
}

function clearLineEdit(lineId: number) {
  const newEdits = { ...unsavedLineEdits.value }
  delete newEdits[lineId]
  unsavedLineEdits.value = newEdits
  // useAutoDraft watch should detect the change and persist the updated state
  // Use nextTick to ensure the watch fires after the state update
  nextTick(() => {
    // Clear draft if everything is saved
    if (!shouldPersist.value) {
      formDraft.clearDraft()
    }
  })
}

// Handle updates to draft lines
function updateDraftLine(uid: string, data: Partial<PrescriptionLine>) {
  const i = draftLines.value.findIndex(d => d._uid === uid)
  if (i !== -1) {
    draftLines.value[i] = { ...draftLines.value[i], ...data }
  }
}

function discardDraftLine(uid?: string) {
  if (!uid) return
  const i = draftLines.value.findIndex(d => d._uid === uid)
  if (i !== -1) {
    draftLines.value.splice(i, 1)
    // useAutoDraft watch should detect the change and persist the updated state
    // Use nextTick to ensure the watch fires after the state update
    nextTick(() => {
      // Clear draft if everything is saved
      if (!shouldPersist.value) {
        formDraft.clearDraft()
      }
    })
  }
}


// Helpers to avoid duplicate presentations across lines
function excludePresentationIds(idx: number) {
  const chosen = new Set<number>()
  uiLines.value.forEach((l, i) => {
    if (i === idx) return
    const id = (l as any).presentationId as number | undefined
    if (id) chosen.add(id)
  })
  return Array.from(chosen)
}

// ─── Dispense ────────────────────────────────────────────────────────────
async function onDispense() {
  if (!rx.value?.id) return
  if (!allPacked.value) {
    toast.error('All lines must be packed before dispensing.')
    return
  }
  dispensing.value = true
  try {
    const updated = await dispensePrescription(rx.value.id)
    rx.value = updated
    // Clear draft and exit edit mode
    formDraft.clearDraft()
    formDraft.setEditing(false)
    toast.success('Prescription dispensed')
  } catch (err: any) {
    toast.error(err?.message ?? 'Failed to dispense prescription.')
  } finally {
    dispensing.value = false
  }
}
</script>

<style scoped>
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 160ms ease;
}
.list-fade-enter-from {
  opacity: 0;
  transform: translateY(2px);
}
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
