<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="showDrugDropdown = false" />
        <div class="relative z-10 w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">Create Presentation</h3>
            <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100" @click="emit('close')">✕</button>
          </div>

          <!-- Body -->
          <div class="px-5 py-4 space-y-6">
            <!-- Stepper -->
            <div class="flex items-center gap-3 text-sm">
              <span :class="step >= 1 ? 'font-semibold' : 'text-gray-500'">1) Drug</span>
              <span class="text-gray-400">›</span>
              <span :class="step >= 2 ? 'font-semibold' : 'text-gray-500'">2) Presentation</span>
            </div>

            <!-- Step 1: Choose/Create Drug -->
            <div v-if="step === 1" class="space-y-4">
              <div>
                <label class="block mb-1 text-gray-700">Search Drug</label>
                <div class="relative" ref="drugComboRef">
                  <input
                    v-model.trim="drugQuery"
                    @focus="showDrugDropdown = true"
                    @input="onDrugQueryInput"
                    placeholder="Search by generic/brand/ATC…"
                    :class="inputClass(errors.drug)"
                    class="w-full"
                    autocomplete="off"
                  />
                  <ul v-if="showDrugDropdown" class="absolute z-20 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-56 overflow-auto">
                    <li v-for="d in filteredDrugs" :key="d.id" @click="selectDrug(d)" class="px-3 py-2 cursor-pointer hover:bg-indigo-100">
                      <span class="font-medium">{{ d.genericName || d.brandName }}</span>
                      <span class="text-gray-500 text-xs" v-if="d.brandName && d.genericName"> ({{ d.brandName }})</span>
                      <span class="text-gray-500 text-xs" v-if="d.atcCode"> — {{ d.atcCode }}</span>
                    </li>
                    <li
                      @click="openCreateDrug = true"
                      class="px-3 py-2 cursor-pointer hover:bg-green-100 text-green-700 font-semibold border-t"
                    >
                      ➕ Create new drug…
                    </li>
                  </ul>
                  <p v-if="errors.drug" class="err">{{ errors.drug }}</p>
                </div>

                <p v-if="currentDrug" class="mt-2 text-sm text-gray-600">
                  Selected: <strong>{{ currentDrug.genericName || currentDrug.brandName }}</strong>
                  <span v-if="currentDrug.atcCode" class="text-gray-500">({{ currentDrug.atcCode }})</span>
                </p>
              </div>

              <div class="flex justify-end">
                <button class="btn-indigo" @click="goStep2">Next</button>
              </div>

              <!-- Nested Create Drug modal -->
              <CreateDrugForm
                :open="openCreateDrug"
                :preset-name="drugQuery"
                @created="onDrugCreated"
                @close="openCreateDrug = false"
              />
            </div>

            <!-- Step 2: Presentation fields -->
            <div v-else class="space-y-4">
              <div class="rounded border p-3 text-sm bg-gray-50">
                <div>Drug: <strong>{{ currentDrug?.genericName || currentDrug?.brandName }}</strong>
                  <span v-if="currentDrug?.atcCode" class="text-gray-500">({{ currentDrug?.atcCode }})</span>
                </div>
                <button class="text-indigo-600 text-xs mt-1" @click="step = 1">← Change Drug</button>
              </div>

              <div class="grid grid-cols-12 gap-3">
                <!-- Dosage Form (always visible) -->
                <div class="col-span-12 sm:col-span-6">
                  <label class="block mb-1 text-gray-700">Dosage form <span class="text-red-600">*</span></label>
                  <select v-model="pres.dosageFormCode" :class="inputClass(errors.dosageFormCode)">
                    <option value="" disabled>Select…</option>
                    <option v-for="([code, label]) in DOSAGE_FORM_OPTIONS" :key="code" :value="code">
                      {{ label }}
                    </option>
                  </select>
                  <p v-if="errors.dosageFormCode" class="err">{{ errors.dosageFormCode }}</p>
                </div>

                <!-- Route (always visible) -->
                <div class="col-span-12 sm:col-span-6">
                  <label class="block mb-1 text-gray-700">Route <span class="text-red-600">*</span></label>
                  <select v-model="pres.routeCode" :class="inputClass(errors.routeCode)">
                    <option value="" disabled>Select…</option>
                    <option v-for="([code, label]) in ROUTE_OPTIONS" :key="code" :value="code">
                      {{ label }}
                    </option>
                  </select>
                  <p v-if="errors.routeCode" class="err">{{ errors.routeCode }}</p>
                </div>

                <!-- The rest shows only after dosage form is chosen -->
                <template v-if="hasDosageForm">
                  <!-- Strength numerator -->
                  <div class="col-span-7 sm:col-span-4">
                    <label class="block mb-1 text-gray-700">Strength (num) <span class="text-red-600">*</span></label>
                    <input v-model.number="pres.strengthNum" type="number" min="0.1" step="0.1" :class="inputClass(errors.strengthNum)" />
                    <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 2.5)</p>
                    <p v-if="errors.strengthNum" class="err">{{ errors.strengthNum }}</p>
                  </div>

                  <div class="col-span-5 sm:col-span-2">
                    <label class="block mb-1 text-gray-700">Unit <span class="text-red-600">*</span></label>
                    <select v-model="pres.strengthUnitNum" :class="inputClass(errors.strengthUnitNum)">
                      <option value="" disabled>Select…</option>
                      <option v-for="u in numUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                    </select>
                    <p v-if="errors.strengthUnitNum" class="err">{{ errors.strengthUnitNum }}</p>
                  </div>

                  <!-- Denominator (liquids only) -->
                  <template v-if="isLiquidForm">
                    <div class="col-span-7 sm:col-span-4">
                      <label class="block mb-1 text-gray-700">Strength (den) <span class="text-red-600">*</span></label>
                      <input v-model.number="pres.strengthDen" type="number" min="0.1" step="0.1" :class="inputClass(errors.strengthDen)" />
                      <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 2.5 mL)</p>
                      <p v-if="errors.strengthDen" class="err">{{ errors.strengthDen }}</p>
                    </div>

                    <div class="col-span-5 sm:col-span-2">
                      <label class="block mb-1 text-gray-700">Unit <span class="text-red-600">*</span></label>
                      <select v-model="pres.strengthUnitDen" :class="inputClass(errors.strengthUnitDen)">
                        <option value="" disabled>Select…</option>
                        <option v-for="u in denUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                      </select>
                      <p v-if="errors.strengthUnitDen" class="err">{{ errors.strengthUnitDen }}</p>
                    </div>
                  </template>

                  <!-- Dispense unit -->
                  <!-- Solids: hidden, auto set to tab/cap -->
                  <template v-if="isLiquidForm">
                    <div class="col-span-12 sm:col-span-6">
                      <label class="block mb-1 text-gray-700">Dispense unit <span class="text-red-600">*</span></label>
                      <select v-model="pres.dispenseUnit" :disabled="dispenseUnitOpts.length===0" :class="inputClass(errors.dispenseUnit)">
                        <option value="" disabled>
                          {{ dispenseUnitOpts.length ? 'Select…' : 'Pick strength units first' }}
                        </option>
                        <option v-for="u in dispenseUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                      </select>
                      <p v-if="errors.dispenseUnit" class="err">{{ errors.dispenseUnit }}</p>
                    </div>
                  </template>

                  <!-- Bottle content (only when liquid + bottle) -->
                  <template v-if="isLiquidForm && pres.dispenseUnit==='bottle'">
                    <div class="col-span-7 sm:col-span-4">
                      <label class="block mb-1 text-gray-700">Bottle content amount <span class="text-red-600">*</span></label>
                      <input v-model.number="pres.pieceContentAmount" type="number" min="0.1" step="0.1" :class="inputClass(errors.pieceContentAmount)" />
                      <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 100.5)</p>
                      <p v-if="errors.pieceContentAmount" class="err">{{ errors.pieceContentAmount }}</p>
                    </div>
                    <div class="col-span-5 sm:col-span-2">
                      <label class="block mb-1 text-gray-700">Unit <span class="text-red-600">*</span></label>
                      <select v-model="pres.pieceContentUnit" :class="inputClass(errors.pieceContentUnit)">
                        <option value="" disabled>Select…</option>
                        <option v-for="u in pieceContentUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                      </select>
                      <p v-if="errors.pieceContentUnit" class="err">{{ errors.pieceContentUnit }}</p>
                    </div>
                  </template>

                  <!-- Preview -->
                  <div class="col-span-12">
                    <div class="text-sm text-gray-600">
                      Preview:&nbsp;
                      <strong>{{ previewLabel }}</strong>
                      <span class="text-gray-500"> — {{ ROUTE_LABELS[pres.routeCode as RouteCode] || 'route' }}</span>
                    </div>
                  </div>
                </template>
              </div>

              <div class="flex items-center justify-end gap-2">
                <button class="btn-gray" @click="emit('close')">Cancel</button>
                <button class="btn-indigo" :disabled="submitting" @click="submit">
                  {{ submitting ? 'Saving…' : 'Save presentation' }}
                </button>
              </div>
            </div>

          </div> <!-- /body -->
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useToast } from 'vue-toast-notification'
import CreateDrugForm from './CreateDrugForm.vue'
import type { Drug, DrugPresentation } from '../types/Drug'
import {
  DOSAGE_FORM_LABELS, ROUTE_LABELS, UNIT_LABELS,
  type DosageFormCode, type RouteCode, type UnitCode
} from '../types/Util'
import { createPresentation, listDrugs } from '../api/drug'

// ─── Props & Emits ────────────────────────

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e:'close'): void; (e:'created', p: any): void }>()

const toast = useToast()

// ─── Utils for unit logic ────────────────────────

const DOSAGE_FORM_OPTIONS = Object.entries(DOSAGE_FORM_LABELS) as [DosageFormCode, string][]
const ROUTE_OPTIONS       = Object.entries(ROUTE_LABELS)       as [RouteCode, string][]

/** Unit kinds */
const UNIT_KIND: Record<UnitCode,'mass'|'volume'|'piece'> = {
  mcg:'mass', mg:'mass', g:'mass', IU:'mass',
  mL:'volume', L:'volume',
  tab:'piece', cap:'piece', drop:'piece', bottle:'piece'
}
const MASS_UNITS: UnitCode[]   = ['mcg','mg','g','IU']
const VOLUME_UNITS: UnitCode[] = ['mL','L']

// ─── UI & State ────────────────────────

/** Step + drug picker */
const step = ref<1 | 2>(1)
const drugQuery = ref('')
const showDrugDropdown = ref(false)
const drugComboRef = ref<HTMLElement | null>(null)
const drugs = ref<Drug[]>([])
const selectedDrugId = ref<number | ''>('')

const openCreateDrug = ref(false)

/** Presentation state */
const pres = ref<Partial<Omit<DrugPresentation, 'id'>>>({
  isFractionalAllowed: false
})

/** Errors / UI helpers */
const errors = ref<Record<string,string>>({})
const submitting = ref(false)
const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2', err ? 'border-red-500' : 'border-gray-300'].join(' ')

/** Drug derived */
const currentDrug = computed(() => drugs.value.find(d => d.id === selectedDrugId.value) ?? null)
const filteredDrugs = computed(() => {
  const q = drugQuery.value.trim().toLowerCase()
  if (!q) return drugs.value.slice(0, 50)
  return drugs.value.filter(d => `${d.genericName} ${d.brandName ?? ''} ${d.atcCode ?? ''}`.toLowerCase().includes(q))
})

// ─── Form visibility & behavior based on dosage form ────────────────────────
const hasDosageForm = computed(() => !!pres.value.dosageFormCode)
const isSolidForm = computed(() => ['TAB','CAP'].includes(pres.value.dosageFormCode as string))
const isLiquidForm = computed(() => hasDosageForm.value && !isSolidForm.value)
const isDropForm = computed(() => pres.value.dosageFormCode === 'DROP')

/** Unit options */
const numUnitOpts = computed(() => {
  // Solids: mass/IU; DROP (liquid) adds 'drop' to numerator choices
  const base = [...MASS_UNITS]
  if (isDropForm.value && isLiquidForm.value) base.push('drop' as UnitCode)
  return base.map(u => [u, UNIT_LABELS[u]] as const)
})
const denUnitOpts = computed(() => {
  // Liquids: denominator can be mass or volume
  return [...MASS_UNITS, ...VOLUME_UNITS].map(u => [u, UNIT_LABELS[u]] as const)
})

/** Dispense options for liquids: num_unit, den_unit, or bottle */
const dispenseUnitOpts = computed(() => {
  if (!isLiquidForm.value) return []
  const opts: (UnitCode | 'bottle')[] = []
  const nu = pres.value.strengthUnitNum as UnitCode | undefined
  const du = pres.value.strengthUnitDen as UnitCode | undefined
  if (nu) opts.push(nu)
  if (du && du !== nu) opts.push(du)
  opts.push('bottle')
  return opts.map(u => [u as UnitCode | 'bottle', (UNIT_LABELS as any)[u] ?? String(u)] as const)
})

/** Bottle content unit must be num or den (when bottle) */
const pieceContentUnitOpts = computed(() => {
  const out: UnitCode[] = []
  const nu = pres.value.strengthUnitNum as UnitCode | undefined
  const du = pres.value.strengthUnitDen as UnitCode | undefined
  if (nu) out.push(nu)
  if (du && du !== nu) out.push(du)
  return out.map(u => [u, UNIT_LABELS[u]] as const)
})

// ─── Preview ────────────────────────
const previewLabel = computed(() => {
  const drugName = currentDrug.value?.genericName || currentDrug.value?.brandName || 'Drug'
  const df = pres.value.dosageFormCode ? DOSAGE_FORM_LABELS[pres.value.dosageFormCode as DosageFormCode] : 'form'
  const n = pres.value.strengthNum
  const nu = pres.value.strengthUnitNum ? UNIT_LABELS[pres.value.strengthUnitNum] : ''
  const dn = pres.value.strengthDen
  const du = pres.value.strengthUnitDen ? UNIT_LABELS[pres.value.strengthUnitDen] : ''
  let strength = (n && nu) ? `${n} ${nu}` : '—'
  if (isLiquidForm.value && dn && du) strength = `${strength}/${dn} ${du}`
  return `${drugName} ${strength} ${df}`.trim()
})

// ─── Events: Drug Picker ────────────────────────
function onDrugQueryInput() { showDrugDropdown.value = true; selectedDrugId.value = '' }
function selectDrug(d: Drug) { selectedDrugId.value = d.id; drugQuery.value = d.genericName || d.brandName || ''; showDrugDropdown.value = false }
function onClickOutside(e: MouseEvent) { 
  if (drugComboRef.value && !drugComboRef.value.contains(e.target as Node) && !openCreateDrug.value) {
    showDrugDropdown.value = false
  }
}

// ─── Lifecycle ────────────────────────
onMounted(async () => { drugs.value = await listDrugs(); document.addEventListener('click', onClickOutside) })
onUnmounted(() => document.removeEventListener('click', onClickOutside))

/** Step advance */
function goStep2() {
  errors.value = {}
  if (!currentDrug.value) { errors.value.drug = 'Choose or create a drug.'; return }
  pres.value.drugId = currentDrug.value.id
  ensureCoherence()
  step.value = 2
}

// ─── Validation ────────────────────────

// Ensure state is coherent with rules
function ensureCoherence() {
  const df = pres.value.dosageFormCode as DosageFormCode | undefined

  // Route default (optional)
  if (!pres.value.routeCode) pres.value.routeCode = 'PO' as RouteCode

  if (!df) {
    // hide everything else
    pres.value.strengthNum = undefined
    pres.value.strengthUnitNum = undefined
    pres.value.strengthDen = undefined
    pres.value.strengthUnitDen = undefined
    pres.value.dispenseUnit = undefined
    pres.value.pieceContentAmount = undefined
    pres.value.pieceContentUnit = undefined
    return
  }

  if (['TAB','CAP'].includes(df)) {
    // SOLIDS: auto-dispense tab/cap; clear den + bottle fields
    pres.value.dispenseUnit = (df === 'CAP' ? 'cap' : 'tab') as UnitCode
    pres.value.strengthDen = undefined
    pres.value.strengthUnitDen = undefined
    pres.value.pieceContentAmount = undefined
    pres.value.pieceContentUnit = undefined
    // If numerator unit is 'drop' (from DROP previously), clear it
    if (pres.value.strengthUnitNum === 'drop') pres.value.strengthUnitNum = undefined
  } else {
    // LIQUIDS: require den later; dispense must be num, den, or bottle
    // Keep current selection if still valid; otherwise clear
    const valid = new Set(dispenseUnitOpts.value.map(([u]) => u))
    if (!valid.has((pres.value.dispenseUnit as any))) pres.value.dispenseUnit = undefined

    // If bottle not selected, clear piece content
    if (pres.value.dispenseUnit !== 'bottle') {
      pres.value.pieceContentAmount = undefined
      pres.value.pieceContentUnit = undefined
    }
  }

  if (pres.value.isFractionalAllowed == null) pres.value.isFractionalAllowed = false
}

/** React when driving fields change */
watch(() => pres.value.dosageFormCode, ensureCoherence)
watch(() => pres.value.dispenseUnit, ensureCoherence)
watch([() => pres.value.strengthUnitNum, () => pres.value.strengthUnitDen], () => {
  // If current dispense unit becomes invalid, clear it
  if (!isLiquidForm.value) return
  const valid = new Set(dispenseUnitOpts.value.map(([u]) => u))
  if (!valid.has((pres.value.dispenseUnit as any))) pres.value.dispenseUnit = undefined
  // If bottle is selected, keep pieceContentUnit within allowed set
  if (pres.value.dispenseUnit === 'bottle') {
    const allowed = pieceContentUnitOpts.value.map(([u]) => u)
    if (!pres.value.pieceContentUnit || !allowed.includes(pres.value.pieceContentUnit)) {
      pres.value.pieceContentUnit = allowed[0]
    }
  }
})

const isInt = (v: unknown) => typeof v === 'number' && Number.isInteger(v)

// Helper to check if a number has at most 1 decimal place
function hasMaxOneDecimal(value: number | undefined | null): boolean {
  if (value == null) return true
  // Convert to string to check decimal places
  const str = value.toString()
  const decimalIndex = str.indexOf('.')
  if (decimalIndex === -1) return true // No decimal point, so 0 decimal places
  const decimalPart = str.substring(decimalIndex + 1)
  return decimalPart.length <= 1
}

function validatePres(): boolean {
  const e: Record<string,string> = {}
  const p = pres.value
  const df = p.dosageFormCode as DosageFormCode | undefined

  if (!df) e.dosageFormCode = 'Required.'
  if (!p.routeCode) e.routeCode = 'Required.'

  if (!df) { errors.value = e; return false }

  // Numerator (always)
  if (p.strengthNum == null || p.strengthNum <= 0) {
    e.strengthNum = 'Enter a positive number.'
  } else if (!hasMaxOneDecimal(p.strengthNum)) {
    e.strengthNum = 'Must have at most 1 decimal place.'
  }
  if (!p.strengthUnitNum) e.strengthUnitNum = 'Select a unit.'
  else {
    const isMassIU = ['mcg','mg','g','IU'].includes(p.strengthUnitNum)
    const isDropAllowed = (df === 'DROP' && isLiquidForm.value)
    if (isSolidForm.value && !isMassIU) e.strengthUnitNum = 'Tablets/capsules must use a mass/IU unit.'
    if (isLiquidForm.value && !(isMassIU || (isDropAllowed && p.strengthUnitNum === 'drop'))) {
      e.strengthUnitNum = 'Use a mass/IU unit; drops allowed only for Eye/Ear drops.'
    }
  }

  if (isLiquidForm.value) {
    // Denominator required
    if (p.strengthDen == null || p.strengthDen <= 0) {
      e.strengthDen = 'Enter a positive number.'
    } else if (!hasMaxOneDecimal(p.strengthDen)) {
      e.strengthDen = 'Must have at most 1 decimal place.'
    }
    if (!p.strengthUnitDen) e.strengthUnitDen = 'Select a unit.'
    else {
      const kind = UNIT_KIND[p.strengthUnitDen]
      if (!(kind === 'mass' || kind === 'volume')) e.strengthUnitDen = 'Denominator must be mass or volume.'
    }

    // Dispense unit must be num, den, or bottle
    const valid = new Set(dispenseUnitOpts.value.map(([u]) => u))
    if (!p.dispenseUnit || !valid.has((p.dispenseUnit as any))) e.dispenseUnit = 'Choose num unit, den unit, or bottle.'

    // Bottle specifics
    if (p.dispenseUnit === 'bottle') {
      if (p.pieceContentAmount == null || p.pieceContentAmount <= 0) {
        e.pieceContentAmount = 'Enter a positive number.'
      } else if (!hasMaxOneDecimal(p.pieceContentAmount)) {
        e.pieceContentAmount = 'Must have at most 1 decimal place.'
      }
      if (!p.pieceContentUnit) e.pieceContentUnit = 'Select a unit.'
      else {
        const allowed = [p.strengthUnitNum, p.strengthUnitDen].filter(Boolean)
        if (!allowed.includes(p.pieceContentUnit)) {
          e.pieceContentUnit = 'Must equal numerator or denominator unit.'
        }
      }
    }
  } else {
    // SOLIDS: no denominator; dispense auto-set tab/cap
    if (p.strengthDen != null || p.strengthUnitDen != null) e.strengthDen = 'Do not set denominator for tablets/capsules.'
    if (!p.dispenseUnit || !['tab','cap'].includes(p.dispenseUnit)) {
      e.dispenseUnit = 'Auto-set by form (tab/cap).'
    }
    if (p.pieceContentAmount != null || p.pieceContentUnit != null) {
      e.pieceContentAmount = 'No bottle content for tablets/capsules.'
    }
  }

  errors.value = e
  return Object.keys(e).length === 0
}

// ─── Form Submission ────────────────────────

/** Build payload (strip undefined) */
function stripUndefined<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== undefined)) as T
}
function buildPayload() {
  const p = pres.value
  return stripUndefined({
    drugId: p.drugId!,
    dosageFormCode: p.dosageFormCode!,
    routeCode: p.routeCode!,
    strengthNum: p.strengthNum!,
    strengthUnitNum: p.strengthUnitNum!,
    strengthDen: isLiquidForm.value ? p.strengthDen : undefined,
    strengthUnitDen: isLiquidForm.value ? p.strengthUnitDen : undefined,
    dispenseUnit: p.dispenseUnit!,
    pieceContentAmount: (isLiquidForm.value && p.dispenseUnit === 'bottle') ? p.pieceContentAmount : undefined,
    pieceContentUnit: (isLiquidForm.value && p.dispenseUnit === 'bottle') ? p.pieceContentUnit : undefined,
    isFractionalAllowed: !!p.isFractionalAllowed,
    barcode: p.barcode || undefined,
    notes: p.notes || undefined
  })
}

/** Submit */
async function submit() {
  if (!validatePres()) return
  const payload = buildPayload()
  submitting.value = true
  try {
    const data = await createPresentation(payload.drugId, payload)
    toast.success('Presentation created')
    emit('created', data)
  } catch (err:any) {
    console.error(err)
    toast.error(err?.message ?? 'Failed to create presentation')
  } finally {
    submitting.value = false
  }
}

/** Drug created shortcut */
function onDrugCreated(newDrug: Drug) {
  drugs.value.unshift(newDrug)
  selectedDrugId.value = newDrug.id
  drugQuery.value = newDrug.genericName || newDrug.brandName || ''
  openCreateDrug.value = false
  nextTick(() => goStep2())
}
</script>


<style scoped>
.err { color:#ef4444; font-size:.875rem; margin-top:.25rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.btn-indigo { background:#4f46e5; color:#fff; padding:.5rem 1rem; border-radius:.25rem; }
.btn-indigo:hover { background:#4338ca; }
.btn-gray { background:#d1d5db; color:#000; padding:.5rem 1rem; border-radius:.25rem; }
.btn-gray:hover { background:#9ca3af; }
</style>
