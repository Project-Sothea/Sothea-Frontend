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
        <span class="font-semibold">Drug Allergies:</span>
        <span class="ml-1">{{ patientData?.doctorsconsultation?.treatment ?? 'No Data' }}</span>
      </div>

      </section>

      <!-- Notes -->
      <section class="mt-6 rounded-2xl border border-gray-200 bg-white/90 shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold">Notes</h2>
            <span
              v-if="!isReadOnly && rx && headerNotes !== (rx.notes || '')"
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
            :disabled="isReadOnly || headerSaving"
            class="block w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm placeholder:text-gray-400
                   focus:outline-none focus:ring-4 focus:ring-[#3f51b5]/20"
          />
          <div class="mt-3 flex items-center justify-end gap-3">
            <button
              v-if="!isReadOnly && rx && headerNotes !== (rx.notes || '')"
              class="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
              type="button"
              @click="headerNotes = rx?.notes || ''"
            >
              Discard Changes
            </button>
            <button
              class="px-5 py-2 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e]
                     shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
              @click="saveHeader"
              :disabled="isReadOnly || headerSaving || headerNotes === rx?.notes"
            >
              <span v-if="headerSaving">Saving…</span>
              <span v-else>Save Notes</span>
            </button>
          </div>
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
                :rx-id="rx!.id"
                :line="line"
                :read-only="isReadOnly"
                :all-presentations="presentations"
                :exclude-presentation-ids="excludePresentationIds(idx)"
                @refresh="refreshRx"
                @discard-draft="discardDraft((line as DraftLine)._uid)"
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
import { ref, computed, onMounted } from 'vue'
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
import { listDrugs, listPresentationsForDrug } from '@/features/pharmacy/api/drug'
import type Patient from '../types/Patient'

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

// For Ui rendering
const uiLines = computed<Partial<PrescriptionLine>[]>(() => [
  ...(rx.value?.lines ?? []),
  ...draftLines.value,
])

const isReadOnly = computed(() => !!rx?.value?.isDispensed)
const allPacked = computed(() => (rx.value?.lines?.length ?? 0) > 0 && rx.value!.lines.every(l => l.isPacked))

// ─── Lifecycle ───────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([ensureHeader(), loadPresentations()]) 
})

async function ensureHeader() {
  // Try to load existing by visit
  const existing = await getPrescriptionByVisit(pid, vid)
  if (existing) {
    rx.value = await getPrescriptionByID(existing.id)
    headerNotes.value = rx.value.notes ?? ''
    return
  }
  // Otherwise create a fresh header immediately (draft)
  const created = await createPrescription({ patientId: pid, vid, notes: '' })
  rx.value = created
  headerNotes.value = ''
}

async function loadPresentations() {
  const drugs = await listDrugs()
  presentations.value = (
    await Promise.all(
      drugs.map(d => listPresentationsForDrug(d.id))
    )
  ).flat();
}

async function refreshRx() {
  if (!rx.value?.id) return
  const fresh = await getPrescriptionByID(rx.value.id)
  rx.value = fresh
  headerNotes.value = fresh.notes ?? ''
  await loadPresentations()
}

// ─── Header save ─────────────────────────────────────────────────────────
async function saveHeader() {
  if (!rx.value) return
  headerSaving.value = true
  try {
    await updatePrescription(rx.value.id, { patientId: pid, vid,  notes: headerNotes.value })
    toast.success('Notes saved.')
    await refreshRx()
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to save notes.')
  } finally {
    headerSaving.value = false
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

function discardDraft(uid?: string) {
  if (!uid) return
  const i = draftLines.value.findIndex(d => d._uid === uid)
  if (i !== -1) draftLines.value.splice(i, 1)
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
