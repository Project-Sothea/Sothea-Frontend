<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative z-10 w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h3 class="text-lg font-semibold">{{ drugId ? 'Edit Drug' : 'Create Drug' }}</h3>
            <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100" @click="emit('close')">✕</button>
          </div>

          <!-- Body -->
          <div class="px-5 py-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div class="space-y-4">
              <!-- Drug Information Section -->
              <div class="rounded border p-4 bg-gray-50">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Drug Information</h4>
                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-12 sm:col-span-6">
                    <label class="block mb-1 text-gray-700">Name<span class="text-red-600">*</span></label>
                    <input
                      v-model.trim="drug.genericName"
                      :class="inputClass(errors.genericName)"
                      placeholder="e.g. Paracetamol"
                    />
                    <p v-if="errors.genericName" class="err">{{ errors.genericName }}</p>
                  </div>

                  <div class="col-span-12 sm:col-span-6">
                    <label class="block mb-1 text-gray-700">Brand name</label>
                    <input
                      v-model.trim="drug.brandName"
                      :class="inputClass(errors.brandName)"
                      placeholder="e.g. Panadol"
                    />
                    <p v-if="errors.brandName" class="err">{{ errors.brandName }}</p>
                  </div>

                  <div class="col-span-12 sm:col-span-6">
                    <label class="block mb-1 text-gray-700">Drug Code</label>
                    <input
                      type="number"
                      :value="drug.drugCode ?? ''"
                      @input="handleDrugCodeInput"
                      :class="inputClass(errors.drugCode)"
                      placeholder="e.g. 12345"
                    />
                    <p v-if="errors.drugCode" class="err">{{ errors.drugCode }}</p>
                  </div>

                  <div class="col-span-12">
                    <label class="block mb-1 text-gray-700">Drug Notes</label>
                    <textarea
                      v-model.trim="drug.notes"
                      :class="inputClass(errors.notes)"
                      rows="2"
                      placeholder="Optional notes about the drug"
                    />
                    <p v-if="errors.notes" class="err">{{ errors.notes }}</p>
                  </div>
                </div>
              </div>

              <!-- Drug Information Section (continued) -->
              <div class="rounded border p-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Dosage & Strength Information</h4>
                <div class="grid grid-cols-12 gap-3">
                  <!-- Dosage Form (always visible) -->
                  <div class="col-span-12 sm:col-span-6">
                    <label class="block mb-1 text-gray-700">Dosage form <span class="text-red-600">*</span></label>
                    <select v-model="drug.dosageFormCode" :class="inputClass(errors.dosageFormCode)">
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
                    <select v-model="drug.routeCode" :class="inputClass(errors.routeCode)">
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
                      <label class="block mb-1 text-gray-700">Strength (num)</label>
                      <input 
                        v-model.number="drug.strengthNum" 
                        type="number" 
                        min="0.1" 
                        step="0.1" 
                        :class="inputClass(errors.strengthNum)"
                        @input="handleStrengthChange('strengthNum')"
                      />
                      <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 2.5). Optional.</p>
                      <p v-if="errors.strengthNum" class="err">{{ errors.strengthNum }}</p>
                    </div>

                    <div class="col-span-5 sm:col-span-2">
                      <label class="block mb-1 text-gray-700">Unit</label>
                      <select v-model="drug.strengthUnitNum" :class="inputClass(errors.strengthUnitNum)" @change="handleUnitChange('strengthUnitNum')">
                        <option value=""></option>
                        <option v-for="u in numUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                      </select>
                      <p v-if="errors.strengthUnitNum" class="err">{{ errors.strengthUnitNum }}</p>
                    </div>

                    <!-- Denominator (liquids only) -->
                    <template v-if="isLiquidForm">
                      <div class="col-span-7 sm:col-span-4">
                        <label class="block mb-1 text-gray-700">Strength (den)</label>
                        <input 
                          v-model.number="drug.strengthDen" 
                          type="number" 
                          min="0.1" 
                          step="0.1" 
                          :class="inputClass(errors.strengthDen)"
                          @input="handleStrengthChange('strengthDen')"
                        />
                        <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 2.5 mL). Optional.</p>
                        <p v-if="errors.strengthDen" class="err">{{ errors.strengthDen }}</p>
                      </div>

                      <div class="col-span-5 sm:col-span-2">
                        <label class="block mb-1 text-gray-700">Unit</label>
                        <select 
                          v-model="drug.strengthUnitDen" 
                          :class="inputClass(errors.strengthUnitDen)"
                          @change="handleUnitChange('strengthUnitDen')"
                        >
                          <option value=""></option>
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
                        <select v-model="drug.dispenseUnit" :disabled="dispenseUnitOpts.length===0" :class="inputClass(errors.dispenseUnit)">
                          <option value="" disabled>
                            {{ dispenseUnitOpts.length ? 'Select…' : 'Pick strength units first' }}
                          </option>
                          <option v-for="u in dispenseUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                        </select>
                        <p v-if="errors.dispenseUnit" class="err">{{ errors.dispenseUnit }}</p>
                      </div>
                    </template>

                    <!-- Piece content (for bottle/tubes/inhaler) -->
                    <template v-if="isLiquidForm && (drug.dispenseUnit==='bottle' || drug.dispenseUnit==='tube' || drug.dispenseUnit==='inhaler')">
                      <div class="col-span-7 sm:col-span-4">
                        <label class="block mb-1 text-gray-700">
                          {{ drug.dispenseUnit === 'bottle' ? 'Bottle' : drug.dispenseUnit === 'tube' ? 'Tube' : 'Inhaler' }} content amount
                        </label>
                        <input 
                          v-model.number="drug.pieceContentAmount" 
                          type="number" 
                          min="0.1" 
                          step="0.1" 
                          :class="inputClass(errors.pieceContentAmount)"
                          @input="handleStrengthChange('pieceContentAmount')"
                        />
                        <p class="text-xs text-gray-500 mt-1">Max 1 decimal place (e.g., 5 or 100.5). Optional.</p>
                        <p v-if="errors.pieceContentAmount" class="err">{{ errors.pieceContentAmount }}</p>
                      </div>
                      <div class="col-span-5 sm:col-span-2">
                        <label class="block mb-1 text-gray-700">Unit</label>
                        <select 
                          v-model="drug.pieceContentUnit" 
                          :class="inputClass(errors.pieceContentUnit)"
                          @change="handleUnitChange('pieceContentUnit')"
                        >
                          <option value=""></option>
                          <option v-for="u in pieceContentUnitOpts" :key="u[0]" :value="u[0]">{{ u[1] }}</option>
                        </select>
                        <p v-if="errors.pieceContentUnit" class="err">{{ errors.pieceContentUnit }}</p>
                      </div>
                    </template>

                    <!-- Display as percentage (only for liquids with both numerator and denominator) -->
                    <template v-if="isLiquidForm && hasStrength && drug.strengthDen && drug.strengthUnitDen">
                      <div class="col-span-12">
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            v-model="drug.displayAsPercentage"
                            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span class="text-gray-700">Display concentration as percentage</span>
                        </label>
                        <p class="text-xs text-gray-500 mt-1 ml-6">
                          When enabled, concentration will be displayed as a percentage
                        </p>
                      </div>
                    </template>

                    <!-- Preview -->
                    <div class="col-span-12">
                      <div class="text-sm text-gray-600">
                        Preview:&nbsp;
                        <strong>{{ previewLabel }}</strong>
                        <span class="text-gray-500"> — {{ ROUTE_LABELS[drug.routeCode as RouteCode] || 'route' }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button class="btn-gray" @click="emit('close')">Cancel</button>
              <button class="btn-indigo" :disabled="submitting" @click="submit">
                {{ submitting ? 'Saving…' : 'Save' }}
              </button>
            </div>
          </div> <!-- /body -->
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { Drug } from '../types/Drug'
import {
  DOSAGE_FORM_LABELS, ROUTE_LABELS, UNIT_KIND, UNIT_LABELS,
  type DosageFormCode, type RouteCode, type UnitCode
} from '../types/Util'
import { createDrug, updateDrug, getDrugStock } from '../api/drug'

// ─── Props & Emits ────────────────────────

const props = defineProps<{ open: boolean; drugId?: number }>()
const emit = defineEmits<{ (e:'close'): void; (e:'created', p: any): void; (e:'updated', p: any): void }>()

const toast = useToast()

// ─── Utils for unit logic ────────────────────────

const DOSAGE_FORM_OPTIONS = Object.entries(DOSAGE_FORM_LABELS) as [DosageFormCode, string][]
const ROUTE_OPTIONS       = Object.entries(ROUTE_LABELS)       as [RouteCode, string][]

/** Unit kinds */
const MASS_UNITS: UnitCode[]   = ['mcg','mg','g','IU']
const VOLUME_UNITS: UnitCode[] = ['mL','L']

// ─── UI & State ────────────────────────

/** Drug state */
const drug = ref<Partial<Omit<Drug, 'id'>>>({
  isFractionalAllowed: false,
  isActive: true,
  displayAsPercentage: false
})

/** Errors / UI helpers */
const errors = ref<Record<string,string>>({})
const submitting = ref(false)
const loading = ref(false)
const inputClass = (err?: string) =>
  ['mt-1 block w-full rounded border px-3 py-2', err ? 'border-red-500' : 'border-gray-300'].join(' ')

// ─── Load drug data for edit mode ────────────────────────
watch([() => props.open, () => props.drugId], async () => {
  if (props.open && props.drugId) {
    loading.value = true
    try {
      const stock = await getDrugStock(props.drugId)
      const d = stock.drug
      // Populate form with existing drug data
      drug.value = stock.drug
      errors.value = {}
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message ?? 'Failed to load drug data')
    } finally {
      loading.value = false
    }
  } else if (props.open && !props.drugId) {
    // Reset form for create mode
    drug.value = {
      isFractionalAllowed: false,
      isActive: true,
      displayAsPercentage: false
    }
    errors.value = {}
  }
}, { immediate: true })

// ─── Form visibility & behavior based on dosage form ────────────────────────
const hasDosageForm = computed(() => !!drug.value.dosageFormCode)
const isSolidForm = computed(() => ['TAB','CAP','SAT'].includes(drug.value.dosageFormCode as string))
const isLiquidForm = computed(() => hasDosageForm.value && !isSolidForm.value)
const isCreamForm = computed(() => drug.value.dosageFormCode === 'CREAM')
const isInhalForm = computed(() => drug.value.dosageFormCode === 'INH')
const isDropForm = computed(() => drug.value.dosageFormCode === 'DROP')

// ─── Helper computed properties for state checks ────────────────────────
const hasStrength = computed(() => {
  return drug.value.strengthNum != null && 
         drug.value.strengthNum > 0 && 
         drug.value.strengthUnitNum != null
})

const hasPieceContent = computed(() => {
  return drug.value.pieceContentAmount != null && 
         drug.value.pieceContentAmount > 0
})

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

/** Dispense options for liquids - ALL units are allowed */
const dispenseUnitOpts = computed(() => {
  // For solids, dispense unit is locked as tablet / capsule / sachet
  if (!isLiquidForm.value) return []
  
  const allUnits: UnitCode[] = ['mcg', 'mg', 'g', 'mL', 'L', 'IU', 'bottle', 'tube', 'inhaler']
  return allUnits.map(u => [u, UNIT_LABELS[u]] as const)
})

/** Piece content unit options - ALL units available (mass, volume, piece) */
const pieceContentUnitOpts = computed(() => {
  // All available units for piece content (no restrictions)
  // For inhalers, include puffs as a special option
  const allUnits: UnitCode[] = ['mcg', 'mg', 'g', 'mL', 'L', 'IU', 'tab', 'cap', 'drop', 'bottle', 'sachet', 'inhaler', 'puff', 'tube']
  return allUnits.map(u => [u, UNIT_LABELS[u]] as const)
})

// ─── Preview ────────────────────────
const previewLabel = computed(() => {
  // Format drug name with ATC code prefix
  const baseName = drug.value.genericName || drug.value.brandName || 'Drug'
  const drugName = drug.value.drugCode != null ? `${drug.value.drugCode}. ${baseName}` : baseName
  
  const df = drug.value.dosageFormCode ? DOSAGE_FORM_LABELS[drug.value.dosageFormCode as DosageFormCode] : 'form'
  const n = drug.value.strengthNum
  const nu = drug.value.strengthUnitNum ? UNIT_LABELS[drug.value.strengthUnitNum] : ''
  const dn = drug.value.strengthDen
  const du = drug.value.strengthUnitDen ? UNIT_LABELS[drug.value.strengthUnitDen] : ''
  const displayAsPercentage = drug.value.displayAsPercentage ?? false
  
  let strength = '—'
  if (n && nu) {
    if (isLiquidForm.value && dn && du && displayAsPercentage) {
      // Calculate percentage: (n / d) * 100
      const percentage = (n / dn) * 100
      strength = `${percentage}%`
    } else if (isLiquidForm.value && dn && du) {
      strength = `${n} ${nu}/${dn} ${du}`
    } else {
      strength = `${n} ${nu}`
    }
  }
  return `${drugName} ${strength} ${df}`.trim()
})

// ─── Helper functions for value normalization ────────────────────────
function normalizeUnitValue(val: string | UnitCode | undefined): UnitCode | undefined {
  return (val === '' || val === undefined) ? undefined : (val as UnitCode)
}

function normalizeNumberValue(val: number | string | undefined | null): number | undefined {
  if (val === '' || val === null || val === undefined) return undefined
  if (typeof val === 'string') {
    const parsed = parseFloat(val)
    return isNaN(parsed) ? undefined : parsed
  }
  return (typeof val === 'number' && !isNaN(val)) ? val : undefined
}

// ─── Handle unit select changes ────────────────────────
function handleUnitChange(field: 'strengthUnitNum' | 'strengthUnitDen' | 'pieceContentUnit') {
  drug.value[field] = normalizeUnitValue(drug.value[field] as string | UnitCode | undefined)
}

// ─── Handle strength input changes ────────────────────────
function handleStrengthChange(field: 'strengthNum' | 'strengthDen' | 'pieceContentAmount') {
  drug.value[field] = normalizeNumberValue(drug.value[field] as number | string | undefined | null)
}

// ─── Helper functions for coherence logic ────────────────────────
function clearStrengthFields() {
  drug.value.strengthNum = undefined
  drug.value.strengthUnitNum = undefined
  drug.value.strengthDen = undefined
  drug.value.strengthUnitDen = undefined
}

function clearPieceContentFields() {
  drug.value.pieceContentAmount = undefined
  drug.value.pieceContentUnit = undefined
}

function ensureSolidFormCoherence(df: DosageFormCode) {
  // Solids use tab/cap/sachet as dispense unit based on form
  if (df === 'CAP') {
    drug.value.dispenseUnit = 'cap' as UnitCode
  } else if (df === 'SAT') {
    drug.value.dispenseUnit = 'sachet' as UnitCode
  } else {
    drug.value.dispenseUnit = 'tab' as UnitCode
  }
  drug.value.strengthDen = undefined
  drug.value.strengthUnitDen = undefined
  clearPieceContentFields()
  
  // If numerator unit is 'drop' (from DROP previously), clear it
  if (drug.value.strengthUnitNum === 'drop') {
    drug.value.strengthUnitNum = undefined
  }
}

function ensureLiquidFormCoherence() {
  const invalidDispenseUnit = !drug.value.dispenseUnit || !dispenseUnitOpts.value.some(([u]) => u === drug.value.dispenseUnit)

  // Auto-set dispense unit based on form type
  if (isCreamForm.value && invalidDispenseUnit) {
    drug.value.dispenseUnit = 'tube' as UnitCode
  } else if (isInhalForm.value && invalidDispenseUnit) {
    drug.value.dispenseUnit = 'inhaler' as UnitCode
  } else if (invalidDispenseUnit) {
    // For other liquids, default to bottle if not set or invalid
      drug.value.dispenseUnit = 'bottle' as UnitCode
  }

  // Clear piece content if not a piece-dispensed unit (bottle, tube, inhaler)
  if (!['bottle', 'tube', 'inhaler'].includes(drug.value.dispenseUnit as string)) {
    clearPieceContentFields()
  }
}

// Ensure state is coherent with rules
function ensureCoherence() {
  const df = drug.value.dosageFormCode as DosageFormCode | undefined

  // Route default (optional)
  if (!drug.value.routeCode) drug.value.routeCode = 'PO' as RouteCode

  if (!df) {
    // No dosage form: clear all dependent fields
    clearStrengthFields()
    drug.value.dispenseUnit = undefined
    clearPieceContentFields()
    return
  }

  if (isSolidForm.value) {
    ensureSolidFormCoherence(df)
  } else if (isLiquidForm.value) {
    ensureLiquidFormCoherence()
  }

  if (drug.value.isFractionalAllowed == null) {
    drug.value.isFractionalAllowed = false
  }
}

/** React when driving fields change */
watch(() => drug.value.dosageFormCode, ensureCoherence)
watch(() => drug.value.dispenseUnit, ensureCoherence)

// Normalize and watch strength fields
watch([() => drug.value.strengthNum, () => drug.value.strengthUnitNum], () => {
  drug.value.strengthUnitNum = normalizeUnitValue(drug.value.strengthUnitNum as string | UnitCode | undefined)
  ensureCoherence()
})

watch(() => drug.value.strengthUnitDen, () => {
  drug.value.strengthUnitDen = normalizeUnitValue(drug.value.strengthUnitDen as string | UnitCode | undefined)
  ensureCoherence()
})

// Watch strength units for liquid form dispense unit validation
watch([() => drug.value.strengthUnitNum, () => drug.value.strengthUnitDen], () => {
  if (!isLiquidForm.value) return
  
  const validUnits = new Set(dispenseUnitOpts.value.map(([u]) => u))
  if (!validUnits.has((drug.value.dispenseUnit as any))) {
    drug.value.dispenseUnit = 'bottle' as UnitCode
  }
})

// Watch piece content amount
watch(() => drug.value.pieceContentAmount, () => {
  const normalized = normalizeNumberValue(drug.value.pieceContentAmount as number | string | undefined | null)
  drug.value.pieceContentAmount = normalized
  if (normalized === undefined) { 
    drug.value.pieceContentUnit = undefined
  }
  ensureCoherence()
})

// Watch piece content unit
watch(() => drug.value.pieceContentUnit, () => {
  drug.value.pieceContentUnit = normalizeUnitValue(drug.value.pieceContentUnit as string | UnitCode | undefined)
  ensureCoherence()
})

// Handle drug code input - convert empty/NaN to null
function handleDrugCodeInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  if (value === '' || value === null || value === undefined) {
    drug.value.drugCode = null as any
  } else {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      drug.value.drugCode = numValue
    } else {
      drug.value.drugCode = null as any
    }
  }
}

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
  const p = drug.value
  const df = p.dosageFormCode as DosageFormCode | undefined

  // Drug field validation
  if (!p.genericName?.trim()) e.genericName = 'Required.'

  if (!df) e.dosageFormCode = 'Required.'
  if (!p.routeCode) e.routeCode = 'Required.'

  if (!df) { errors.value = e; return false }

  // Strength is optional, but if provided, must be valid
  const hasStrengthValue = p.strengthNum != null && p.strengthNum > 0
  const hasStrengthUnit = !!p.strengthUnitNum

  // If numerator is partially filled, require both
  if (hasStrengthValue && !hasStrengthUnit) {
    e.strengthUnitNum = 'Please select a unit for the strength value.'
  }
  if (hasStrengthUnit && !hasStrengthValue) {
    e.strengthNum = 'Please enter a strength value when a unit is selected.'
  }

  // Validate numerator if provided
  if (hasStrengthValue) {
    if (!hasMaxOneDecimal(p.strengthNum)) {
      e.strengthNum = 'The strength value can have at most 1 decimal place.'
    }
    if (hasStrengthUnit && p.strengthUnitNum) {
      const isMassIU = ['mcg','mg','g','IU'].includes(p.strengthUnitNum)
      const isDropAllowed = (df === 'DROP' && isLiquidForm.value)
      if (isSolidForm.value && !isMassIU) {
        e.strengthUnitNum = 'For tablets and capsules, please use a mass or IU unit (e.g., mg, g, IU).'
      }
      if (isLiquidForm.value && !(isMassIU || (isDropAllowed && p.strengthUnitNum === 'drop'))) {
        e.strengthUnitNum = 'For liquids, please use a mass or IU unit. Drops are only allowed for eye/ear drops.'
      }
    }
  }

  if (isLiquidForm.value) {
    const hasDenValue = p.strengthDen != null && p.strengthDen > 0
    const hasDenUnit = !!p.strengthUnitDen
    
    // Denominator: cannot be provided without numerator
    if ((hasDenValue || hasDenUnit) && !hasStrength.value) {
      e.strengthDen = 'Please fill in the numerator (strength num) before setting the denominator.'
    }

    // Validate denominator if provided
    const pHasStrength = hasStrength.value
    if (pHasStrength && (hasDenValue || hasDenUnit)) {
      if (hasDenUnit && !hasDenValue) {
        e.strengthDen = 'Please enter a positive number for the denominator.'
      } else if (hasDenValue) {
        if (!hasMaxOneDecimal(p.strengthDen)) {
          e.strengthDen = 'The denominator can have at most 1 decimal place.'
        }
        if (!hasDenUnit) {
          e.strengthUnitDen = 'Please select a unit for the denominator.'
        } else if (p.strengthUnitDen) {
          const kind = UNIT_KIND[p.strengthUnitDen]
          if (!(kind === 'mass' || kind === 'volume')) {
            e.strengthUnitDen = 'The denominator unit must be a mass or volume unit (e.g., mg, g, mL, L).'
          }
        }
      }
    }

    // Dispense unit validation - all units are allowed, just check it's selected
    if (!p.dispenseUnit) {
      e.dispenseUnit = 'Please select a dispense unit.'
    }

    // Piece-dispensed units (bottle/tubes/inhaler) specifics (optional)
    if (p.dispenseUnit === 'bottle' || p.dispenseUnit === 'tube' || p.dispenseUnit === 'inhaler') {
      const unitName = p.dispenseUnit === 'bottle' ? 'bottle' : p.dispenseUnit === 'tube' ? 'tube' : 'inhaler'
      const hasPieceAmount = p.pieceContentAmount != null && p.pieceContentAmount > 0
      const hasPieceUnit = !!p.pieceContentUnit
      
      if (hasPieceAmount) {
        // If amount is provided, validate it
        if (!hasMaxOneDecimal(p.pieceContentAmount)) {
          e.pieceContentAmount = `The ${unitName} content amount can have at most 1 decimal place.`
        }
        // If amount is provided, unit should also be provided
        if (!hasPieceUnit) {
          e.pieceContentUnit = `Please select a unit for the ${unitName} content.`
        }
      } else if (hasPieceUnit) {
        // If unit is provided but amount is not, show error
        e.pieceContentAmount = `Please enter a ${unitName} content amount when a unit is selected.`
      }
    }
  } else {
    // SOLIDS: no denominator; dispense auto-set tab/cap
    if (p.strengthDen != null || p.strengthUnitDen != null) {
      e.strengthDen = 'Denominator is not used for tablets and capsules. Please leave it empty.'
    }
    if (!p.dispenseUnit || !['tab','cap','sachet'].includes(p.dispenseUnit)) {
      e.dispenseUnit = 'Dispense unit is automatically set to tablet, capsule, or sachet based on the dosage form.'
    }
    if (p.pieceContentAmount != null || p.pieceContentUnit != null) {
      e.pieceContentAmount = 'Piece content is not applicable for tablets, capsules, and sachets.'
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
  const d = drug.value
  // Convert empty strings to undefined before building payload
  const strengthUnitNumVal = d.strengthUnitNum as string | UnitCode | undefined
  const strengthUnitDenVal = d.strengthUnitDen as string | UnitCode | undefined
  const strengthUnitNum = (strengthUnitNumVal === '' || strengthUnitNumVal === undefined) ? undefined : d.strengthUnitNum
  const strengthUnitDen = (strengthUnitDenVal === '' || strengthUnitDenVal === undefined) ? undefined : d.strengthUnitDen
  
  // Convert empty string, null, undefined, or NaN to undefined for strength values
  let strengthNum: number | undefined = undefined
  const strengthNumVal = d.strengthNum as number | string | undefined | null
  if (strengthNumVal !== null && strengthNumVal !== undefined && strengthNumVal !== '') {
    if (typeof strengthNumVal === 'string') {
      const parsed = parseFloat(strengthNumVal)
      strengthNum = isNaN(parsed) ? undefined : parsed
    } else if (typeof strengthNumVal === 'number' && !isNaN(strengthNumVal)) {
      strengthNum = strengthNumVal
    }
  }
  
  let strengthDen: number | undefined = undefined
  const strengthDenVal = d.strengthDen as number | string | undefined | null
  if (strengthDenVal !== null && strengthDenVal !== undefined && strengthDenVal !== '') {
    if (typeof strengthDenVal === 'string') {
      const parsed = parseFloat(strengthDenVal)
      strengthDen = isNaN(parsed) ? undefined : parsed
    } else if (typeof strengthDenVal === 'number' && !isNaN(strengthDenVal)) {
      strengthDen = strengthDenVal
    }
  }
  
  return stripUndefined({
    genericName: d.genericName!,
    brandName: d.brandName || undefined,
    drugCode: d.drugCode != null ? d.drugCode : null,
    notes: d.notes || undefined,
    isActive: d.isActive ?? true,
    dosageFormCode: d.dosageFormCode!,
    routeCode: d.routeCode!,
    strengthNum: strengthNum,
    strengthUnitNum: strengthUnitNum,
    strengthDen: isLiquidForm.value ? strengthDen : undefined,
    strengthUnitDen: isLiquidForm.value ? strengthUnitDen : undefined,
    dispenseUnit: d.dispenseUnit!,
    pieceContentAmount: (isLiquidForm.value && ['bottle', 'tube', 'inhaler'].includes(d.dispenseUnit as string)) ? d.pieceContentAmount : undefined,
    pieceContentUnit: (isLiquidForm.value && ['bottle', 'tube', 'inhaler'].includes(d.dispenseUnit as string)) ? d.pieceContentUnit : undefined,
    isFractionalAllowed: !!d.isFractionalAllowed,
    displayAsPercentage: isLiquidForm.value && d.strengthNum && d.strengthDen ? !!d.displayAsPercentage : undefined,
    barcode: d.barcode || undefined,
  })
}

/** Submit */
async function submit() {
  if (!validatePres()) return
  const payload = buildPayload()
  submitting.value = true
  try {
    if (props.drugId) {
      // Update existing drug
      const data = await updateDrug(props.drugId, payload)
      toast.success('Drug updated')
      emit('updated', data)
      emit('close')
    } else {
      // Create new drug
      const data = await createDrug(payload)
      toast.success('Drug created')
      emit('created', data)
      emit('close') // Close the modal after successful creation
      // Reset form
      drug.value = {
        isFractionalAllowed: false,
        isActive: true,
        displayAsPercentage: false
      }
      errors.value = {}
    }
  } catch (err:any) {
    toast.error(err?.response.data.error ?? 'Failed to save line.') ?? (props.drugId ? 'Failed to update drug' : 'Failed to create drug')
  } finally {
    submitting.value = false
  }
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
