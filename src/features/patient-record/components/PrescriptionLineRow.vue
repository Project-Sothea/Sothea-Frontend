<template>
  <div>
    <!-- Top row: presentation + packed badge -->
    <div class="flex items-start gap-6" v-if="editing || !isSaved">
      <!-- Presentation selector -->
      <div class="w-2/5">
        <label :for="`presentation-${uid}`" class="block text-sm font-medium text-dark">
          Presentation <span class="text-red-600" v-if="!readOnly">*</span>
        </label>
        <PresentationSelector
          v-model="form.presentationId"
          :all-presentations="allPresentations"
          :exclude-ids="excludePresentationIds"
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
        </div>  

        <p v-if="errors.presentationId" class="text-xs text-red-600 mt-1">{{ errors.presentationId }}</p>
      </div>

      
      <!-- Remarks -->
      <div class="flex-1">
        <label :for="`remarks-${uid}`" class="block text-sm font-medium text-dark">Line notes</label>
        <textarea
          :id="`remarks-${uid}`"
          v-model="form.remarks"
          rows="3"
          class="mt-1 w-full border p-2 rounded disabled:bg-gray-50 min-h-[2.5rem] max-h-40"
          placeholder="Optional notes for this line"
          :disabled="readOnly || saving"
        />
      </div>
    </div>
    <div class="flex items-start gap-6" v-else>
      <!-- Presentation readout -->
      <div class="w-2/5">
        <div class="text-sm text-gray-600">Presentation</div>
        <div class="mt-1 text-sm font-medium text-gray-900">{{ presentationLabel }}</div>
       
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

          <!-- Removed the dot here -->
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
        <p class="mt-1 text-sm text-gray-900">{{ (form.remarks && form.remarks.trim()) ? form.remarks : '—' }}</p>
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
              type="number" min="0" step="1"
              v-model.number="form.doseAmount"
              class="w-20 border p-2 rounded text-right disabled:bg-gray-50"
              placeholder="e.g. 1" :disabled="readOnly || saving"
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

        <!-- Times per period -->
        <div>
          <label :for="`sched-freq-${uid}`" class="block text-xs text-gray-600 mb-1">Times per period</label>
          <input
            :id="`sched-freq-${uid}`" type="number" min="1"
            v-model.number="form.frequencyPerSchedule"
            class="w-20 border p-2 rounded text-right disabled:bg-gray-50"
            placeholder="e.g. 3" :disabled="readOnly || saving"
          />
        </div>

        <!-- Every N -->
        <div>
          <label :for="`sched-everyN-${uid}`" class="block text-xs text-gray-600 mb-1">Every N</label>
          <input
            :id="`sched-everyN-${uid}`" type="number" min="1"
            v-model.number="form.everyN"
            class="w-20 border p-2 rounded text-right disabled:bg-gray-50"
            placeholder="e.g. 1" :disabled="readOnly || saving"
          />
        </div>

        <!-- Period unit -->
        <div>
          <label :for="`sched-kind-${uid}`" class="block text-xs text-gray-600 mb-1">Period unit</label>
          <select
            :id="`sched-kind-${uid}`" v-model="form.scheduleKind"
            class="w-28 border p-2 rounded disabled:bg-gray-50"
            :disabled="readOnly || saving"
          >
            <option v-for="k in SCHEDULE_KINDS" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>

        <!-- Duration -->
        <div>
          <label :for="`sched-duration-${uid}`" class="block text-xs text-gray-600 mb-1">Duration</label>
          <div class="flex items-center">
            <input
              :id="`sched-duration-${uid}`" type="number" min="1"
              v-model.number="form.duration"
              class="w-24 border p-2 rounded text-right disabled:bg-gray-50"
              placeholder="e.g. 7" :disabled="readOnly || saving"
            />
            <span class="ml-2 text-sm text-gray-500 whitespace-nowrap">
              {{ pluralize(1, form.scheduleKind ?? 'day') }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="errors.dose || errors.schedule"
        class="mt-1"
      >
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <!-- Under Dose (span 2 to match) -->
          <p class="text-xs md:col-span-2"
            :class="errors.dose ? 'text-red-600' : 'opacity-0'">
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
          :class="scheduleChipClass" :title="scheduleChipTitle"
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
          class="px-3 py-1 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e]
                        shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
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
          class="px-3 py-1 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e]
                        shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
          @click="isSaved ? onClickSave() : saveLine()"
          :disabled="saving || !isDirty"
        >
          {{ saving ? 'Saving…' : (isSaved ? 'Save' : 'Create Line') }}
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
          <svg viewBox="0 0 20 20" class="h-4 w-4 transition-transform" :class="expanded ? 'rotate-90' : ''" fill="currentColor">
            <path fill-rule="evenodd" d="M6 4l8 6-8 6V4z" clip-rule="evenodd" />
          </svg>
          <span>{{ expanded ? 'Hide allocation' : 'View allocation' }}</span>
        </button>

        <div class="text-gray-700 justify-end" v-if="!expanded">
          Required:
          <span class="font-medium">{{ (line.totalToDispense ?? '—') }} {{ line.dispenseUnit ? line.dispenseUnit + "(s)" : '' }}</span>
          <span class="mx-2 text-gray-400">•</span>
          Allocated:
          <span :class="allocClass">{{ allocated }} / {{ line.totalToDispense ?? 0 }}</span>
        </div>
      </div>

      <!-- Allocation panel -->
      <transition name="fade">
        <div v-if="expanded && line.id && line.presentationId" :id="`alloc-panel-${uid}`" class="mt-3 -mx-4 px-4 pb-4" role="region">
          <PrescriptionBatchAllocator
            :line-id="line.id"
            :pres-id="line.presentationId"
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
    :open="showPresChangeWarn"
    title="Presentation changed"
    message="You changed the presentation for this saved line. This may reset allocations and units. Continue to save?"
    :close-on-esc="true"
    :close-on-backdrop="true"
    @cancel="showPresChangeWarn = false"
    @confirm="confirmSaveAfterChange"
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toast-notification'
import PresentationSelector from './PresentationSelector.vue'
import type { PrescriptionLine, PrescriptionLinePostData } from '@/features/pharmacy/types/Prescription'
import type { DrugPresentationView } from '@/features/pharmacy/types/Drug'
import { createLine, updateLine, deleteLine as apiDeleteLine, listLineAllocations } from '@/features/pharmacy/api/prescription'
import { fmtDate, type UnitCode , UNIT_LABELS, SCHEDULE_KINDS} from '@/features/pharmacy/types/Util'
import PrescriptionBatchAllocator from './PrescriptionBatchAllocator.vue'
import ConfirmationDialogue from './ConfirmationDialogue.vue'

// ─── Props & Emits ───────────────────────────────────────────────────────
const props = defineProps<{
  rxId: number
  line: Partial<PrescriptionLine>
  readOnly?: boolean
  allPresentations?: DrugPresentationView[]
  excludePresentationIds?: number[]
}>()

const emit = defineEmits<{ (e: 'refresh'): void; (e: 'discard-draft'): void }>()

const toast = useToast()
const uid = Math.random().toString(36).slice(2)

// ─── Local editable form state ───────────────────────────────────────────

const form = reactive<Partial<PrescriptionLine>>({
  presentationId: undefined,
  doseAmount: undefined,
  doseUnit: undefined,
  scheduleKind: 'day',
  everyN: 1,
  frequencyPerSchedule: 1,
  duration: 7,
  remarks: '',
})


const isSaved = computed(() => (props.line.id != null)) // false => draft, true => actual
const editing = ref(!isSaved.value) // drafts: editing=true, saved: false
const readOnly = computed(() => !!props.readOnly)
const showFields = computed(() => !!form.presentationId)

const showPresChangeWarn = ref(false)

const presentationLabel = computed(() => {
  const p = selectedPresentation.value
  if (!p) return form.presentationId ? `#${form.presentationId}` : '—'
  // same label style as your selector cache
  return `${p.drugName} — ${p.displayStrength} (${p.displayRoute})`
})

// ─── Dirty Checking ───────────────────────────────────────────────────────

// Fields you care about for dirty checking
const SNAPSHOT_KEYS = [
  'presentationId','doseAmount','doseUnit',
  'scheduleKind','everyN','frequencyPerSchedule','duration','remarks',
] as const
type K = (typeof SNAPSHOT_KEYS)[number]

// Normalize so comparisons are stable
const norm = (k: K, v: unknown) => {
  if (k === 'remarks') return String(v ?? '').trim()
  if (['doseAmount','everyN','frequencyPerSchedule','duration'].includes(k)) {
    return v == null ? null : Number(v)
  }
  return v ?? null
}

// Make a stable string key (like your allocator)
const snapString = () =>
  JSON.stringify(SNAPSHOT_KEYS.map(k => [k, norm(k, (form as any)[k])]))

const baseKey = ref('')                         // baseline from server/seed
const currKey = computed(snapString)            // current form state
const isDirty = computed(() => currKey.value !== baseKey.value)

function resetBaseline() { baseKey.value = currKey.value }

// ─── Initialise Form ───────────────────────────────────────────────────────

const seeding = ref(false)

// Seed form from incoming line
function seedFromLine() {
  const L = props.line
  if (L && L.id) {
    form.presentationId = L.presentationId
    form.doseAmount = L.doseAmount
    form.doseUnit = L.doseUnit
    form.scheduleKind = L.scheduleKind
    form.everyN = L.everyN
    form.frequencyPerSchedule = L.frequencyPerSchedule
    form.duration = L.duration
    form.remarks = L.remarks
  } else {
    // draft defaults
    form.presentationId = undefined
    form.doseAmount = undefined
    form.doseUnit = undefined
    form.scheduleKind = 'day'
    form.everyN = 1
    form.frequencyPerSchedule = 1
    form.duration = 7
    form.remarks = ''
  }
  seeding.value = false
  resetBaseline()
}

watch(() => props.line, () => {
  seedFromLine()
  editing.value = !isSaved.value   // whenever a new line comes in, default to view for saved lines
}, { immediate: true })

function resetNonPresentationFields() {
  form.doseAmount = undefined
  form.doseUnit = undefined
}

watch(() => form.presentationId, (newId, oldId) => {
  if (seeding.value) return
  if (oldId != null && newId !== oldId) {
    resetNonPresentationFields()
  }
})

// ─── Dose unit choices based on selected presentation ────────────────────

const selectedPresentation = computed(() => props.allPresentations?.find(p => p.id === form.presentationId!) )

function allowedDoseUnitsFor(p?: DrugPresentationView): UnitCode[] {
  if (!p) return []  // nothing until a presentation is chosen
  const out: UnitCode[] = []
  if (p.dispenseUnit) out.push(p.dispenseUnit as UnitCode)
  if (p.strengthUnitNum) out.push(p.strengthUnitNum as UnitCode)
  if (p.strengthUnitDen) out.push(p.strengthUnitDen as UnitCode)
  // de-duplicate while preserving order
  return Array.from(new Set(out))
}

const allowedDoseUnits = computed<UnitCode[]>(() => allowedDoseUnitsFor(selectedPresentation.value))


watch(selectedPresentation, (p) => {
  if (!p) return
  if (!form.doseUnit || !allowedDoseUnits.value.includes(form.doseUnit)) {
    if (allowedDoseUnits.value.includes('tab' as UnitCode) && p.dosageFormCode === 'TAB'){
      form.doseUnit = 'tab'
    }
    else if (allowedDoseUnits.value.includes('cap' as UnitCode) && p.dosageFormCode === 'CAP') {
      form.doseUnit = 'cap'
    }
    else if (allowedDoseUnits.value.includes('drop' as UnitCode) && p.dosageFormCode === 'DROP') {
      form.doseUnit = 'drop'
    }
    else if (allowedDoseUnits.value[0] === 'bottle' && allowedDoseUnits.value.length > 1) {
      form.doseUnit = allowedDoseUnits.value[1]
    }
    else {
      form.doseUnit = allowedDoseUnits.value[0] as UnitCode | undefined
    }
  }
})


// ─── Form Validation ─────────────────────────────────────────────────────────

const errors = reactive<{ presentationId?: string; dose?: string; schedule?: string }>({})
watch(() => form.presentationId, () => {
  errors.presentationId = undefined
  errors.dose = undefined
  errors.schedule = undefined
})

watch([() => form.doseAmount, () => form.doseUnit], () => {
  errors.dose = undefined
})

watch(
  [() => form.scheduleKind, () => form.everyN, () => form.frequencyPerSchedule, () => form.duration],
  () => { errors.schedule = undefined }
)

function validate(): boolean {
  Object.assign(errors, { presentationId: undefined, dose: undefined, schedule: undefined })
  let ok = true
  if (!form.presentationId || form.presentationId <= 0) { errors.presentationId = 'Select a presentation.'; ok = false }
  if (!form.doseAmount || form.doseAmount <= 0) { errors.dose = 'Dose must be > 0.'; ok = false }
  if (!form.doseUnit) { errors.dose = (errors.dose ? errors.dose + ' ' : '') + 'Select a dose unit.'; ok = false }
  if (!form.scheduleKind || !form.everyN || !form.frequencyPerSchedule || !form.duration) { errors.schedule = 'Complete the schedule.'; ok = false }
  return ok
}

// ─── Save / Delete State Management ──────────────────────────────────────────────────────

function startEditing() {
  editing.value = true
}

function discardEditing() {
  seedFromLine()
  Object.assign(errors, { presentationId: undefined, dose: undefined, schedule: undefined })
  editing.value = false
}

const saving = ref(false)

async function onClickSave() { 
  if (isSaved.value  && form.presentationId !== props.line.presentationId) {
    showPresChangeWarn.value = true
    return
  }
  await saveAndExitEditingMode()
}

async function saveAndExitEditingMode() {
  const success = await saveLine()
  if (isSaved.value && success) {
    editing.value = false
  }
}

async function confirmSaveAfterChange() {
  showPresChangeWarn.value = false
  await saveLine()
}

async function saveLine() {
  if (readOnly.value) return false
  if (!validate()) { return false }
  saving.value = true
  try {
    const payload: PrescriptionLinePostData = {
      presentationId: form.presentationId!,
      remarks: form.remarks,
      doseAmount: form.doseAmount!,
      doseUnit: form.doseUnit!,
      scheduleKind: form.scheduleKind!,
      everyN: form.everyN!,
      frequencyPerSchedule: form.frequencyPerSchedule!,
      duration: form.duration!,
    }
    if (isSaved.value && props.line.id) {
      await updateLine(props.line.id, payload)
      toast.success(`Line #${props.line.id} saved`)
    } else {
      await createLine(props.rxId, payload)
      toast.success('Line created')
      emit('discard-draft')
    }
    emit('refresh')
    resetBaseline()
    reloadAllocations()
    return true
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to save line.')
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
    document.getElementById(`alloc-panel-${uid}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

// ─── Convert Dosing Instructions into Human Readable ────────────────────────

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
  const k = form.scheduleKind ?? 'day'
  const every = Number(form.everyN ?? 0)
  const freq = Number(form.frequencyPerSchedule ?? 0)
  const dur  = Number(form.duration ?? 0)

  if (!form.doseAmount || !form.doseUnit) {
    return 'Set Dosage'
  }

  if (!every || !freq || !dur) return 'Set frequency, interval, and duration.'

  // period phrase: "per day" vs "every 6 hours"
  const periodPhrase = every === 1 ? `per ${k}` : `every ${every} ${pluralize(every, k)}`

  // dose phrase: "1 tab" or "5 mL" (falls back to 'the dose' if not filled yet)
  const dosePart = `${form.doseAmount} ${unitLabel(form.doseUnit)}`

  // Example: "the dose, 3× per day, for 7 days."
  return `${dosePart}, ${freq}× ${periodPhrase}, for ${dur} ${pluralize(dur, k)}.`
})

const scheduleIncomplete = computed(() => {
  const doseOk = !!(form.doseAmount && form.doseUnit)
  const k = form.scheduleKind
  const every = Number(form.everyN ?? 0)
  const freq  = Number(form.frequencyPerSchedule ?? 0)
  const dur   = Number(form.duration ?? 0)
  const schedOk = !!(k && every > 0 && freq > 0 && dur > 0)
  return !(doseOk && schedOk)
})

const scheduleChipClass = computed(() =>
  scheduleIncomplete.value
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
)

const scheduleChipTitle = computed(() =>
  scheduleIncomplete.value
    ? 'Please complete dose and schedule fields'
    : 'Regimen preview'
)

// ─── Init ────────────────────────
onMounted(() => { if (isSaved.value) reloadAllocations() })
</script>
