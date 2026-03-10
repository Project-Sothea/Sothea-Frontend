<template>
  <div>
    <!-- Top row: drug + packed badge -->
    <div class="flex items-start gap-6" v-if="editing || !isSaved">
      <!-- Drug selector -->
      <div class="w-2/5">
        <label :for="`drug-${uid}`" class="block text-sm font-medium text-dark">
          Drug <span class="text-red-600" v-if="!readOnly">*</span>
        </label>
        <PrescriptionDrugSelector
          v-model="form.drugId"
          :all-drugs="allDrugs"
          :exclude-ids="excludeDrugIds"
          :disabled="readOnly || saving"
        />

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span
            v-if="line.isPacked"
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
            :title="`Packed by ${line.packerName ?? '—'}${line.packedAt ? ' @ ' + fmtDate(line.packedAt) : ''}`"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>
            Packed by: {{ line.packerName ?? '—' }}
          </span>

          <span
            v-else
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
            Not packed
          </span>

          <!-- Total quantity available -->
          <span
            v-if="form.drugId && totalQtyAvailable !== null"
            :class="[
              'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border',
              totalQtyAvailable === 0
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            ]"
          >
            <span
              :class="[
                'inline-block h-2 w-2 rounded-full',
                totalQtyAvailable === 0 ? 'bg-red-600' : 'bg-blue-600'
              ]"
            ></span>
            Available: {{ totalQtyAvailable }} {{ selectedDrug?.dispenseUnit ?? '' }}
          </span>
        </div>

        <p v-if="errors.drugId" class="text-xs text-red-600 mt-1">{{ errors.drugId }}</p>
      </div>

      <!-- Remarks -->
      <div class="flex-1">
        <label :for="`remarks-${uid}`" class="block text-sm font-medium text-dark">
          Line notes <span v-if="isBottleMode" class="text-red-600">*</span>
        </label>
        <textarea
          :id="`remarks-${uid}`"
          v-model="form.remarks"
          rows="3"
          class="mt-1 w-full border p-2 rounded disabled:bg-gray-50 min-h-[2.5rem] max-h-40"
          :placeholder="isBottleMode ? `E.g. 'Take 5 mL q6h PRN'. Required.` : 'Optional'"
          :disabled="readOnly || saving"
        />
        <!-- NEW: remarks error -->
        <p v-if="errors.remarks" class="text-xs text-red-600 mt-1">{{ errors.remarks }}</p>
        <span
          v-if="isBottleMode && (editing || !isSaved)"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
          :class="notesPrescriptionClass"
        >
          Enter dosage instructions above
        </span>
      </div>
    </div>
    <div class="flex items-start gap-6" v-else>
      <!-- Drug readout -->
      <div class="w-2/5">
        <div class="text-sm text-gray-600">Drug</div>
        <div class="mt-1 text-sm font-medium text-gray-900">{{ drugLabel }}</div>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span
            v-if="line.isPacked"
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
            :title="`Packed by ${line.packerName ?? '—'}${line.packedAt ? ' @ ' + fmtDate(line.packedAt) : ''}`"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-green-600"></span>
            Packed by: {{ line.packerName ?? '—' }}
          </span>

          <span
            v-else
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
            Not packed
          </span>

          <!-- Total quantity available (read-only view) -->
          <span
            v-if="form.drugId && totalQtyAvailable !== null"
            :class="[
              'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border',
              totalQtyAvailable === 0
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            ]"
          >
            <span
              :class="[
                'inline-block h-2 w-2 rounded-full',
                totalQtyAvailable === 0 ? 'bg-red-600' : 'bg-blue-600'
              ]"
            ></span>
            Available: {{ totalQtyAvailable }} {{ selectedDrug?.dispenseUnit ?? '' }}
          </span>

          <span
            v-if="isSaved"
            class="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
          >
            Last Updated By: {{ line.updaterName ?? '—' }}
          </span>
        </div>

        <!-- Regimen chip preview (same chip as edit) -->
        <div class="mt-3">
          <span
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
            :class="scheduleChipClass"
            :title="scheduleChipTitle"
          >
            {{ scheduleReadable }}
          </span>
        </div>
      </div>

      <!-- Notes readout -->
      <div class="flex-1">
        <div class="text-sm text-gray-600">Line notes</div>
        <p class="mt-1 text-sm text-gray-900">
          {{ form.remarks && form.remarks.trim() ? form.remarks : '—' }}
        </p>
      </div>
    </div>

    <!-- ─────────── SCHEDULE (separate row) ─────────── -->
    <div class="mt-1 pt-1" v-if="(editing || !isSaved) && showFields">
      <!-- content-sized columns; any extra space stays on the right -->
      <div class="grid items-end gap-3 md:grid-flow-col md:auto-cols-max md:justify-start">
        <!-- Dose + Unit -->
        <div>
          <label class="block text-xs text-gray-600 mb-1">Dosage</label>
          <div class="flex gap-2">
            <input
              type="number"
              min="0"
              step="1"
              v-model.number="form.doseAmount"
              class="w-20 border p-2 rounded text-right disabled:bg-gray-50"
              placeholder="e.g. 1"
              :disabled="readOnly || saving"
            />
            <select
              v-model="form.doseUnit"
              class="w-28 shrink-0 border p-2 rounded disabled:bg-gray-50"
              :disabled="readOnly || saving"
            >
              <option v-for="u in allowedDoseUnits" :key="u" :value="u">
                {{ UNIT_LABELS[u] ?? u }}
              </option>
            </select>
          </div>
        </div>

        <!-- Frequency (code-based) -->
        <div v-if="!isBottleMode">
          <label :for="`sched-frequency-${uid}`" class="block text-xs text-gray-600 mb-1"
            >Frequency</label
          >
          <select
            :id="`sched-frequency-${uid}`"
            v-model="form.frequencyCode"
            class="w-40 border p-2 rounded disabled:bg-gray-50"
            :disabled="readOnly || saving"
          >
            <option disabled value="">Select frequency…</option>
            <option v-for="opt in FREQUENCY_OPTIONS" :key="opt.code" :value="opt.code">
              {{ opt.code }}
            </option>
          </select>
        </div>

        <!-- Duration -->
        <div v-if="!isBottleMode">
          <label :for="`sched-duration-${uid}`" class="block text-xs text-gray-600 mb-1"
            >Duration</label
          >
          <div class="flex items-center">
            <input
              :id="`sched-duration-${uid}`"
              type="number"
              min="1"
              v-model.number="form.duration"
              class="w-24 border p-2 rounded text-right disabled:bg-gray-50"
              placeholder="e.g. 7"
              :disabled="readOnly || saving"
            />
          </div>
        </div>

        <!-- Duration unit -->
        <div v-if="!isBottleMode">
          <label :for="`sched-kind-${uid}`" class="block text-xs text-gray-600 mb-1"
            >Duration unit</label
          >
          <select
            :id="`sched-kind-${uid}`"
            v-model="form.durationUnit"
            class="w-28 border p-2 rounded disabled:bg-gray-50"
            :disabled="readOnly || saving"
          >
            <option v-for="k in DURATION_UNITS" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>

        <!-- PRN Checkbox -->
        <div class="ml-2 -translate-y-1">
          <label
            class="shrink-0 inline-flex flex-col items-center select-none leading-none"
            :title="readOnly || saving ? 'Read-only' : 'As needed (PRN)'"
          >
            <input
              type="checkbox"
              v-model="form.prn"
              :disabled="readOnly || saving"
              class="h-5 w-5 rounded border-gray-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 translate-y-[3px]"
            />
            <span
              class="mt-1 text-[10px] uppercase tracking-wide text-gray-600 leading-none translate-y-[3px]"
            >
              PRN
            </span>
          </label>
        </div>
      </div>

      <div v-if="errors.dose || errors.schedule" class="mt-1">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <!-- Under Dose (span 2 to match) -->
          <p class="text-xs md:col-span-2" :class="errors.dose ? 'text-red-600' : 'opacity-0'">
            {{ errors.dose || ' ' }}
          </p>

          <p class="text-xs" :class="errors.schedule ? 'text-red-600' : 'opacity-0'">
            {{ errors.schedule || ' ' }}
          </p>
        </div>
      </div>

      <!-- Readable schedule chip -->
      <div class="mt-3">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
          :class="scheduleChipClass"
          :title="scheduleChipTitle"
        >
          {{ scheduleReadable }}
        </span>
      </div>
    </div>

    <!-- Action row -->
    <div class="mt-3 flex items-center justify-end gap-3" v-if="!readOnly">
      <!-- VIEW MODE: Edit + Delete for saved lines -->
      <template v-if="isSaved && !editing">
        <button
          class="px-3 py-1 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e] shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
          @click="startEditing"
        >
          Edit
        </button>
        <button
          class="px-3 py-1 rounded-lg text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60"
          @click="deleteLine"
          :disabled="saving"
        >
          Delete
        </button>
      </template>

      <!-- EDIT MODE (or DRAFT): Save/Create + Discard -->
      <template v-else>
        <button
          class="px-3 py-1 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e] shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
          @click="isSaved ? onClickSave() : saveLine()"
          :disabled="saving || !isDirty"
        >
          {{ saving ? 'Saving…' : isSaved ? 'Save' : 'Create Line' }}
        </button>
        <button
          class="px-3 py-1 rounded-lg text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60"
          @click="isSaved ? discardEditing() : $emit('discard-draft')"
          :disabled="saving"
        >
          {{ isDirty ? 'Discard changes' : 'Cancel' }}
        </button>
      </template>
    </div>

    <div class="my-4 border-t border-gray-200" v-if="isSaved && !editing">
      <!-- Summary bar under row -->
      <div class="mt-3 flex items-center justify-between text-sm">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-[#3f51b5] hover:underline disabled:opacity-60"
          @click="toggleAlloc"
          :disabled="!isSaved"
          :aria-expanded="expanded ? 'true' : 'false'"
          :aria-controls="`alloc-panel-${uid}`"
        >
          <svg
            viewBox="0 0 20 20"
            class="h-4 w-4 transition-transform"
            :class="expanded ? 'rotate-90' : ''"
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M6 4l8 6-8 6V4z" clip-rule="evenodd" />
          </svg>
          <span>{{ expanded ? 'Hide allocation' : 'View allocation' }}</span>
        </button>

        <div class="text-gray-700 justify-end" v-if="!expanded">
          Required:
          <span class="font-medium"
            >{{ line.totalToDispense ?? '—' }}
            {{ line.dispenseUnit ? line.dispenseUnit + '(s)' : '' }}</span
          >
          <span class="mx-2 text-gray-400">•</span>
          Allocated:
          <span :class="allocClass">{{ allocated }} / {{ line.totalToDispense ?? 0 }}</span>
        </div>
      </div>

      <!-- Allocation panel -->
      <transition name="fade">
        <div
          v-if="expanded && line.id && line.drugId"
          :id="`alloc-panel-${uid}`"
          class="mt-3 -mx-4 px-4 pb-4"
          role="region"
        >
          <PrescriptionBatchAllocator
            :line-id="line.id"
            :drug-id="line.drugId"
            :allocations="line.allocations ?? []"
            :requested-qty="line.totalToDispense ?? 0"
            :is-packed="line.isPacked"
            :readonly="readOnly"
            @changed="onAllocChanged"
          />
        </div>
      </transition>
    </div>
  </div>

  <ConfirmationDialogue
    :open="showDrugChangeWarn"
    title="Drug changed"
    message="You changed the drug for this saved line. This may reset allocations and units. Continue to save?"
    :close-on-esc="true"
    :close-on-backdrop="true"
    @cancel="showDrugChangeWarn = false"
    @confirm="confirmSaveAfterChange"
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toast-notification'
import type {
  PrescriptionLine,
  PrescriptionLinePostData
} from '@/features/pharmacy/types/Prescription'
import type { DrugView } from '@/features/pharmacy/types/Drug'
import {
  createLine,
  updateLine,
  deleteLine as apiDeleteLine,
  listLineAllocations
} from '@/features/pharmacy/api/prescription'
import { getDrugStock } from '@/features/pharmacy/api/drug'
import {
  fmtDate,
  type UnitCode,
  UNIT_LABELS,
  type ScheduleKind,
  type FrequencyCode,
  FREQUENCY_OPTIONS,
  fmtDrugName,
  fmtStrength
} from '@/features/pharmacy/types/Util'
import PrescriptionBatchAllocator from './PrescriptionBatchAllocator.vue'
import ConfirmationDialogue from './ConfirmationDialogue.vue'
import PrescriptionDrugSelector from './PrescriptionDrugSelector.vue'

// ─── Props & Emits ───────────────────────────────────────────────────────
const props = defineProps<{
  rxId: number
  line: Partial<PrescriptionLine> // current line state (with unsaved edits, if any)
  readOnly?: boolean
  allDrugs?: DrugView[]
  excludeDrugIds?: number[]
  hasUnsavedEdits?: boolean
  originalLine?: Partial<PrescriptionLine> // Original server data (without unsaved edits)
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'discard-draft'): void
  (e: 'update-line-edit', lineId: number, data: Partial<PrescriptionLine>): void
  (e: 'clear-line-edit', lineId: number): void
  (e: 'update-draft-line', uid: string, data: Partial<PrescriptionLine>): void
}>()

const toast = useToast()
const uid = Math.random().toString(36).slice(2)

// ─── Local editable form state ───────────────────────────────────────────

const form = reactive<Partial<PrescriptionLine>>({
  drugId: undefined,
  doseAmount: undefined,
  doseUnit: undefined,
  frequencyCode: 'OM' as FrequencyCode,
  prn: false,
  duration: 7,
  durationUnit: 'day',
  remarks: ''
})

const isSaved = computed(() => props.line.id != null) // false => draft, true => actual
const editing = ref(!isSaved.value) // drafts: editing=true, saved: false
const readOnly = computed(() => props.readOnly)
const showFields = computed(() => !!form.drugId)

const showDrugChangeWarn = ref(false)

const drugLabel = computed(() => {
  const d = selectedDrug.value
  if (!d) return form.drugId ? `#${form.drugId}` : '—'
  // same label style as your selector cache
  return `${fmtDrugName(d)} — ${fmtStrength(d)} (${d.displayRoute})`
})

// ─── Dirty Checking ───────────────────────────────────────────────────────

// Fields you care about for dirty checking
const SNAPSHOT_KEYS = [
  'drugId',
  'doseAmount',
  'doseUnit',
  'frequencyCode',
  'prn',
  'duration',
  'durationUnit',
  'remarks'
] as const
type K = (typeof SNAPSHOT_KEYS)[number]

// Normalize so comparisons are stable
const norm = (k: K, v: unknown) => {
  if (k === 'remarks') return String(v ?? '').trim()
  if (k === 'prn') return Boolean(v ?? false)
  if (['doseAmount', 'duration'].includes(k)) {
    return v == null ? null : Number(v)
  }
  return v ?? null
}

// Make a stable string key (like your allocator)
const snapString = () => JSON.stringify(SNAPSHOT_KEYS.map((k) => [k, norm(k, (form as any)[k])]))

const baseKey = ref('') // baseline from server/seed
const currKey = computed(snapString) // current form state
const isDirty = computed(() => currKey.value !== baseKey.value)

function resetBaseline() {
  baseKey.value = currKey.value
}

// ─── Initialise Form ───────────────────────────────────────────────────────

const seeding = ref(false)

// ─── Frequency options (code-based) ─────────────────────────────────────────

type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number]

// Get frequency option by code (for preview/display purposes)
function getFrequencyOption(code?: FrequencyCode): FrequencyOption | undefined {
  return FREQUENCY_OPTIONS.find((o) => o.code === code)
}

// Seed form from incoming line
async function seedFromLine() {
  seeding.value = true
  const L = props.line
  if (L && L.id) {
    // For saved lines, use the line data (which may include unsaved edits from parent)
    // Set doseUnit BEFORE drugId to prevent watch from interfering
    form.doseAmount = L.doseAmount
    form.doseUnit = L.doseUnit
    form.drugId = L.drugId
    form.frequencyCode = L.frequencyCode
    form.prn = L.prn ?? false
    form.duration = L.duration
    form.durationUnit = L.durationUnit
    form.remarks = L.remarks
  } else if ((L as any).__draft && (L as any)._uid) {
    // For draft lines, use existing data if available (preserves user input)
    const draftLine = L as any
    form.doseAmount = draftLine.doseAmount
    form.doseUnit = draftLine.doseUnit
    form.drugId = draftLine.drugId
    form.frequencyCode = draftLine.frequencyCode ?? ('OM' as FrequencyCode)
    form.prn = draftLine.prn ?? false
    form.duration = draftLine.duration ?? 7
    form.durationUnit = draftLine.durationUnit ?? 'day'
    form.remarks = draftLine.remarks ?? ''
  } else {
    // New draft defaults
    form.drugId = undefined
    form.doseAmount = undefined
    form.doseUnit = undefined
    form.frequencyCode = 'OM' as FrequencyCode
    form.prn = false
    form.duration = 7
    form.durationUnit = 'day'
    form.remarks = ''
  }
  // Wait for next tick to ensure all computed properties and watches have settled
  await nextTick()
  seeding.value = false

  // Fetch stock quantity if drug is already selected
  if (form.drugId) {
    await fetchStockQuantity(form.drugId)
  }

  // Set baseline to original server data (if available), otherwise use current form state
  // This ensures dirty state works correctly when draft is restored
  if (L && L.id && props.originalLine) {
    // Use original server data as baseline for dirty checking
    const orig = props.originalLine
    const origForm = {
      drugId: orig.drugId,
      doseAmount: orig.doseAmount,
      doseUnit: orig.doseUnit,
      frequencyCode: orig.frequencyCode,
      prn: orig.prn ?? false,
      duration: orig.duration,
      durationUnit: orig.durationUnit,
      remarks: orig.remarks
    }
    baseKey.value = JSON.stringify(SNAPSHOT_KEYS.map((k) => [k, norm(k, (origForm as any)[k])]))
  }
}

// Watch for line changes and reseed form automatically
// This handles: initial load, draft restoration, save/discard, server refresh
// Don't reseed when actively editing - form state is the source of truth during editing
watch(
  () => props.line,
  () => {
    if (seeding.value) return // Prevent infinite loops during seeding
    if (editing.value && isSaved.value) return // Don't reseed while actively editing saved lines

    seedFromLine()
    // For saved lines: if there are unsaved edits, put in edit mode; otherwise view mode
    // For draft lines: always in edit mode
    editing.value = !isSaved.value || (isSaved.value && props.hasUnsavedEdits)
  },
  { immediate: true, deep: true }
)

// Watch for changes to hasUnsavedEdits prop (e.g., when draft is restored)
watch(
  () => props.hasUnsavedEdits,
  (hasEdits) => {
    if (isSaved.value && hasEdits && !editing.value) {
      // If this saved line has unsaved edits, put it in edit mode
      editing.value = true
    }
  },
  { immediate: true }
)

function resetNonDrugFields() {
  form.doseAmount = undefined
  form.doseUnit = undefined
}

watch(
  () => form.drugId,
  (newId, oldId) => {
    if (seeding.value) return
    if (oldId != null && newId !== oldId) {
      resetNonDrugFields()
    }
    // Fetch stock quantity when drug is selected (only if changed)
    if (newId && newId !== oldId) {
      fetchStockQuantity(newId)
    } else if (!newId) {
      totalQtyAvailable.value = null
    }
  }
)

// Fetch stock quantity for selected drug
async function fetchStockQuantity(drugId: number) {
  loadingStock.value = true
  try {
    const stock = await getDrugStock(drugId)
    totalQtyAvailable.value = stock.totalQty
  } catch (error) {
    console.error('Failed to fetch stock quantity:', error)
    totalQtyAvailable.value = null
  } finally {
    loadingStock.value = false
  }
}

// ─── Dose unit choices based on selected drug ────────────────────

const selectedDrug = computed(() => props.allDrugs?.find((d) => d.id === form.drugId!))
const isBottleMode = computed(() => form.doseUnit === 'bottle')

function allowedDoseUnitsFor(p?: DrugView): UnitCode[] {
  if (!p) return []

  const out: UnitCode[] = []
  const hasNumStrengthOnly =
    p.strengthNum != null && p.strengthNum > 0 && p.strengthUnitNum != null && !p.strengthUnitDen
  const hasBothStrength =
    p.strengthNum != null &&
    p.strengthNum > 0 &&
    p.strengthUnitNum != null &&
    p.strengthDen != null &&
    p.strengthUnitDen != null
  const hasNoStrength = !hasNumStrengthOnly && !hasBothStrength

  if (hasNumStrengthOnly) {
    // Only strength numerator (solids)
    // - dispenseUnit is allowed
    // - strengthUnitNum is allowed
    if (p.dispenseUnit) out.push(p.dispenseUnit as UnitCode)
    if (p.strengthUnitNum) out.push(p.strengthUnitNum as UnitCode)
  } else {
    // Liquids
    const dispenseUnit = p.dispenseUnit
    const pieceUnit = p.pieceContentUnit
    const numUnit = p.strengthUnitNum
    const denUnit = p.strengthUnitDen
    const isBottle = dispenseUnit === 'bottle'
    const isTube = dispenseUnit === 'tube'
    const isInhaler = dispenseUnit === 'inhaler'
    const isPieceDispensed = isBottle || isTube || isInhaler
    const hasPieceUnit = pieceUnit != null

    if (hasNoStrength) {
      // No strength data
      // dispenseUnit is always allowed
      if (dispenseUnit) out.push(dispenseUnit as UnitCode)

      // If piece-dispensed unit (bottle/tube/inhaler) and pieceContentUnit is provided, that's also allowed
      if (isPieceDispensed && hasPieceUnit) {
        out.push(pieceUnit as UnitCode)
      }
    } else if (hasBothStrength) {
      // Both strength numerator and denominator
      // dispenseUnit is always allowed
      if (dispenseUnit) out.push(dispenseUnit as UnitCode)

      if (!isPieceDispensed || !hasPieceUnit) {
        // Not piece-dispensed or no piece unit
        // If dispenseUnit equals numUnit OR denUnit, then both numUnit and denUnit are allowed
        if (numUnit && denUnit && (dispenseUnit === numUnit || dispenseUnit === denUnit)) {
          out.push(numUnit as UnitCode)
          out.push(denUnit as UnitCode)
        }
      } else {
        // Piece-dispensed (bottle/tube/inhaler) with pieceContentUnit
        // pieceContentUnit is always allowed
        if (pieceUnit) out.push(pieceUnit as UnitCode)

        // If pieceContentUnit equals numUnit OR denUnit, then both numUnit and denUnit are allowed
        if (numUnit && denUnit && (pieceUnit === numUnit || pieceUnit === denUnit)) {
          out.push(numUnit as UnitCode)
          out.push(denUnit as UnitCode)
        }
      }
    }
  }
  // de-duplicate while preserving order
  return Array.from(new Set(out))
}

const allowedDoseUnits = computed<UnitCode[]>(() => allowedDoseUnitsFor(selectedDrug.value))

watch(selectedDrug, (p) => {
  if (!p) return
  if (seeding.value) return // Don't auto-set doseUnit during seeding - let seedFromLine handle it
  if (!form.doseUnit || !allowedDoseUnits.value.includes(form.doseUnit)) {
    if (allowedDoseUnits.value.includes('tab' as UnitCode) && p.dosageFormCode === 'TAB') {
      form.doseUnit = 'tab'
    } else if (allowedDoseUnits.value.includes('cap' as UnitCode) && p.dosageFormCode === 'CAP') {
      form.doseUnit = 'cap'
    } else if (allowedDoseUnits.value.includes('drop' as UnitCode) && p.dosageFormCode === 'DROP') {
      form.doseUnit = 'drop'
    } else if (allowedDoseUnits.value[0] === 'bottle' && allowedDoseUnits.value.length > 1) {
      form.doseUnit = allowedDoseUnits.value[1]
    } else {
      form.doseUnit = allowedDoseUnits.value[0] as UnitCode | undefined
    }
  }
})

// ─── Form Validation ─────────────────────────────────────────────────────────

const errors = reactive<{ drugId?: string; dose?: string; schedule?: string; remarks?: string }>({})
watch(
  () => form.drugId,
  () => {
    errors.drugId = undefined
    errors.dose = undefined
    errors.schedule = undefined
    errors.remarks = undefined
  }
)

watch([() => form.doseAmount, () => form.doseUnit], () => {
  errors.dose = undefined
})

watch([() => form.frequencyCode, () => form.duration, () => form.durationUnit], () => {
  errors.schedule = undefined
})

watch(
  () => form.remarks,
  () => {
    errors.remarks = undefined
  }
)

// Emit form changes for saved lines in edit mode (debounced)
let updateTimer: ReturnType<typeof setTimeout> | undefined = undefined
watch(
  () => form,
  () => {
    if (seeding.value) return // Don't emit during seeding
    const lineId = props.line.id
    const draftUid = (props.line as any)._uid

    if (isSaved.value && editing.value && lineId) {
      // Clear any pending update
      if (updateTimer) {
        clearTimeout(updateTimer)
      }
      // Debounce updates to avoid too many emissions
      updateTimer = setTimeout(() => {
        const editData: Partial<PrescriptionLine> = {
          drugId: form.drugId,
          doseAmount: form.doseAmount,
          doseUnit: form.doseUnit,
          frequencyCode: form.frequencyCode,
          prn: form.prn ?? false,
          duration: form.duration,
          durationUnit: form.durationUnit,
          remarks: form.remarks
        }
        emit('update-line-edit', lineId, editData)
      }, 300)
    } else if (!isSaved.value && draftUid) {
      // For draft lines, emit updates immediately (debounced) to update the parent's draftLines array
      if (updateTimer) {
        clearTimeout(updateTimer)
      }
      updateTimer = setTimeout(() => {
        const draftData: Partial<PrescriptionLine> = {
          drugId: form.drugId,
          doseAmount: form.doseAmount,
          doseUnit: form.doseUnit,
          frequencyCode: form.frequencyCode,
          prn: form.prn ?? false,
          duration: form.duration,
          durationUnit: form.durationUnit,
          remarks: form.remarks
        }
        emit('update-draft-line', draftUid, draftData)
      }, 300)
    }
  },
  { deep: true }
)

// Helper to check if a number has at most 2 decimal places
function hasMaxTwoDecimals(value: number | undefined): boolean {
  if (value == null) return true
  // Convert to string to check decimal places
  const str = value.toString()
  const decimalIndex = str.indexOf('.')
  if (decimalIndex === -1) return true // No decimal point, so 0 decimal places
  const decimalPart = str.substring(decimalIndex + 1)
  return decimalPart.length <= 2
}

function validate(): boolean {
  Object.assign(errors, { drugId: undefined, dose: undefined, schedule: undefined })
  let ok = true
  if (!form.drugId || form.drugId <= 0) {
    errors.drugId = 'Select a drug.'
    ok = false
  }
  if (!form.doseAmount || form.doseAmount <= 0) {
    errors.dose = 'Dose must be > 0.'
    ok = false
  }
  if (form.doseAmount && !hasMaxTwoDecimals(form.doseAmount)) {
    errors.dose =
      (errors.dose ? errors.dose + ' ' : '') + 'Dose must have at most 2 decimal places.'
    ok = false
  }
  if (!form.doseUnit) {
    errors.dose = (errors.dose ? errors.dose + ' ' : '') + 'Select a dose unit.'
    ok = false
  }
  if (!isBottleMode.value) {
    if (!form.frequencyCode) {
      errors.schedule = 'Select a frequency.'
      ok = false
    }
    if (!form.duration || !form.durationUnit) {
      errors.schedule = (errors.schedule ? errors.schedule + ' ' : '') + 'Complete the duration.'
      ok = false
    }
  }
  if (isBottleMode.value && !form.remarks) {
    errors.remarks = 'Please enter dosage instruction above'
    ok = false
  }
  return ok
}

// ─── Save / Delete State Management ──────────────────────────────────────────────────────

function startEditing() {
  editing.value = true
  expanded.value = false
  // Immediately emit current form state when starting to edit
  if (isSaved.value && props.line.id) {
    const editData: Partial<PrescriptionLine> = {
      drugId: form.drugId,
      doseAmount: form.doseAmount,
      doseUnit: form.doseUnit,
      frequencyCode: form.frequencyCode,
      prn: form.prn ?? false,
      duration: form.duration,
      durationUnit: form.durationUnit,
      remarks: form.remarks
    }
    emit('update-line-edit', props.line.id, editData)
  }
}

function discardEditing() {
  // Set editing to false first so watch can reseed
  editing.value = false
  // Clear unsaved edits - watch on props.line will handle reseeding automatically
  if (isSaved.value && props.line.id) {
    emit('clear-line-edit', props.line.id)
  }
  // Reset form and errors
  Object.assign(errors, { drugId: undefined, dose: undefined, schedule: undefined })
}

const saving = ref(false)

async function onClickSave() {
  // Check if drug changed (compare against original server value, not props.line which may have unsaved edits)
  const originaldrugId = props.originalLine?.drugId ?? props.line.drugId
  const drugChanged = isSaved.value && form.drugId !== originaldrugId

  // Check if line has allocations
  const hasAllocations = props.line.allocations && props.line.allocations.length > 0

  // Show warning if drug changed AND line has allocations
  if (drugChanged && hasAllocations) {
    showDrugChangeWarn.value = true
    return
  }

  // Also validate that drug is set
  if (!form.drugId || form.drugId <= 0) {
    errors.drugId = 'Select a drug.'
    return
  }

  await saveAndExitEditingMode()
}

async function saveAndExitEditingMode() {
  await saveLine()
}

async function confirmSaveAfterChange() {
  showDrugChangeWarn.value = false
  await saveLine()
}

async function saveLine() {
  if (readOnly.value) return false
  if (!validate()) {
    return false
  }
  saving.value = true
  try {
    const payload: PrescriptionLinePostData = {
      drugId: form.drugId!,
      remarks: form.remarks,
      doseAmount: form.doseAmount!,
      doseUnit: form.doseUnit!,
      frequencyCode: isBottleMode.value ? ('OM' as FrequencyCode) : form.frequencyCode!,
      prn: form.prn ?? false,
      duration: isBottleMode.value ? 1 : form.duration!,
      durationUnit: isBottleMode.value ? 'day' : form.durationUnit!
    }
    if (isSaved.value && props.line.id) {
      await updateLine(props.line.id, payload)
      toast.success(`Line #${props.line.id} saved`)
      // Clear unsaved edits after successful save
      emit('clear-line-edit', props.line.id)
      // Set editing to false before refresh so watch can reseed
      editing.value = false
      // Close batch allocator after edit
      expanded.value = false
    } else {
      await createLine(props.rxId, payload)
      toast.success('Line created')
      emit('discard-draft')
    }
    emit('refresh')
    // Watch on props.line will handle reseeding automatically after refresh
    resetBaseline()
    await reloadAllocations()
    return true
  } catch (e: any) {
    toast.error(e?.response.data.error ?? 'Failed to save line.')
  } finally {
    saving.value = false
  }
  return false
}

async function deleteLine() {
  if (!isSaved.value || readOnly.value) return
  saving.value = true
  try {
    await apiDeleteLine((props.line as any).id)
    toast.success(`Line #${(props.line as any).id} deleted`)
    emit('refresh')
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to delete line.')
  } finally {
    saving.value = false
  }
}

// ─── Allocation & pack/unpack logic (saved lines only) ────────────────────────

const expanded = ref(false)
const allocated = ref(0)
const totalQtyAvailable = ref<number | null>(null)
const loadingStock = ref(false)

const allocClass = computed(() => {
  const need = (props.line as any).totalToDispense ?? 0
  return allocated.value === need
    ? 'text-green-700 font-medium'
    : allocated.value < need
      ? 'text-amber-700 font-medium'
      : 'text-red-700 font-medium'
})

async function reloadAllocations() {
  if (!isSaved.value) return
  try {
    const list = await listLineAllocations((props.line as any).id)
    allocated.value = list.reduce((s, a) => s + (Number(a.quantity) || 0), 0)
  } catch {
    allocated.value = 0
  }
}

function onAllocChanged() {
  reloadAllocations()
  // Upstream may recompute totals; refresh whole Rx so packed/dispense buttons stay accurate
  emit('refresh')
}

async function toggleAlloc() {
  expanded.value = !expanded.value
  if (expanded.value) {
    await nextTick()
    await reloadAllocations()
    document
      .getElementById(`alloc-panel-${uid}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

// ─── Convert Dosing Instructions into Human Readable ────────────────────────

const DURATION_UNITS: ScheduleKind[] = ['day', 'week']

// Pluralize a word (very simple; adjust if you localize)
function pluralize(n: number, word: string) {
  return n === 1 ? word : `${word}s`
}

// Short human label for units like 'tab', 'cap', etc. Falls back to code.
function unitLabel(u?: UnitCode) {
  return u ? (UNIT_LABELS[u] ?? u) : ''
}

// A clearer, doctor-readable description of the regimen.
const scheduleReadable = computed(() => {
  if (isBottleMode.value && form.doseAmount && form.doseUnit) {
    const baseSchedule = `${form.doseAmount} ${unitLabel(form.doseUnit)} total.`
    return form.prn ? `${baseSchedule} (PRN)` : baseSchedule
  }

  const freqOpt = getFrequencyOption(form.frequencyCode)
  const dur = Number(form.duration ?? 0)
  const durUnit = form.durationUnit ?? 'day'

  if (!form.doseAmount || !form.doseUnit) {
    return 'Set Dosage'
  }

  if (!freqOpt || !dur) return 'Set frequency and duration.'

  // dose phrase: "1 tab" or "5 mL" (falls back to 'the dose' if not filled yet)
  const dosePart = `${form.doseAmount} ${unitLabel(form.doseUnit)}`

  // frequency phrase: "Once Morning (OM)" or "Every other day (EOD)" etc.
  const frequencyPhrase = `${freqOpt.label} (${freqOpt.code})`

  // Example: "1 tab, Once Morning (OM), for 7 days."
  const baseSchedule = `${dosePart}, ${frequencyPhrase}, for ${dur} ${pluralize(dur, durUnit)}.`
  return form.prn ? `${baseSchedule} (PRN)` : baseSchedule
})

const scheduleIncomplete = computed(() => {
  const doseOk = !!(form.doseAmount && form.doseUnit)
  const freqOk = !!form.frequencyCode
  const dur = Number(form.duration ?? 0)
  const durUnit = form.durationUnit
  const schedOk = !!(freqOk && dur > 0 && durUnit)
  return !(doseOk && schedOk)
})

const scheduleChipClass = computed(() =>
  scheduleIncomplete.value
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
)

const scheduleChipTitle = computed(() =>
  scheduleIncomplete.value ? 'Please complete dose and schedule fields' : 'Regimen preview'
)

const notesPrescriptionClass = computed(() =>
  form.remarks
    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-red-50 text-red-700 border-red-200'
)

// ─── Init ────────────────────────
onMounted(() => {
  if (isSaved.value) reloadAllocations()
})
</script>
