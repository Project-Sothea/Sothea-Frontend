<template>
  <!-- Stat strip -->
  <div class="mb-2">
    <div class="flex items-stretch gap-2">
      <!-- Requested -->
      <div class="flex-1 rounded-md border bg-gray-50/60 px-2 py-1.5">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Requested</div>
        <div class="text-base md:text-lg font-semibold leading-tight"
          style="font-variant-numeric: tabular-nums;">
          {{ requestedQty }}
        </div>
      </div>

      <!-- minus -->
      <div class="self-center px-1 text-gray-400 select-none">−</div>

      <!-- Allocated -->
      <div class="flex-1 rounded-md border bg-gray-50/60 px-2 py-1.5">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Allocated</div>
        <div class="text-base md:text-lg font-semibold leading-tight"
          style="font-variant-numeric: tabular-nums;">
          {{ totalAllocated }}
        </div>
      </div>

      <!-- arrow -->
      <div class="self-center px-1 text-gray-400 select-none">⇒</div>

      <!-- Remaining -->
      <div class="flex-1 rounded-md border px-2 py-1.5"
        :class="[
          remainingRequested > 0 ? 'bg-amber-50/70 border-amber-200' :
          remainingRequested < 0 ? 'bg-red-50/70 border-red-200' :
          'bg-green-50/70 border-green-200'
        ]">
        <div class="flex items-center justify-between">
          <div class="text-[10px] uppercase tracking-wide text-gray-600">Remaining</div>
        </div>
        <div class="text-base md:text-lg font-semibold leading-tight"
          :class="remainingRequested > 0 ? 'text-amber-700' : remainingRequested < 0 ? 'text-red-700' : 'text-green-700'"
          style="font-variant-numeric: tabular-nums;">
          {{ remainingRequested }}
        </div>
      </div>
    </div>
  </div>

   <div class="mt-2 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <input
        id="mark-packed"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300"
        v-model="packedProxy"
        :disabled="disabled || !canMarkPacked"
      />
      <label for="mark-packed" class="text-sm font-medium"
        :class="disabled || !canMarkPacked ? 'text-gray-400' : 'text-gray-800'">
        Mark packed
      </label>
    </div>
   </div>

  <!-- Selected allocations -->
  <div v-if="selectedView.length" class="mt-3 space-y-2">
    <!-- header -->
    <div class="flex items-center justify-between">
      <h4 class="text-[11px] uppercase tracking-wide text-gray-500">
        Selected allocations
      </h4>
    </div>
    <div
      v-for="(sel, i) in selectedView"
      :key="sel.id"
      class="flex items-center justify-between rounded border p-2"
    >
      <div class="min-w-0">
        <div class="text-sm font-medium truncate">
          {{ sel.batchNumber }}
          <span class="text-gray-500">• {{ sel.location }}</span>
        </div>
        <div class="text-xs text-gray-500">
          Available: {{ sel.available }}
          <span v-if="sel.expiryDate" class="ml-1">• Exp: {{ fmtDate(sel.expiryDate) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="px-2 py-1 border rounded text-sm"
          @click="decrement(i)"
          :disabled="disabled || sel.allocatedQuantity <= 1"
        >
          −
        </button>
        <input
          type="number"
          class="w-20 border rounded px-2 py-1 text-right"
          :disabled="disabled"
          v-model.number="editQuantities[i]"
          @change="normalize(i)"
          min="1"
          :max="sel.available"
        />
        <button
          class="px-2 py-1 border rounded text-sm"
          @click="increment(i)"
          :disabled="disabled || editQuantities[i] >= sel.available"
        >
          +
        </button>
        <button
          class="ml-2 px-2 py-1 rounded text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
          @click="remove(i)"
          :disabled="disabled"
        >
          Remove
        </button>
      </div>
    </div>
  </div>

  <div class="my-5 border-t"></div>

  <div class="flex items-center justify-between">
    <h4 class="text-[11px] uppercase tracking-wide text-gray-500">
        New allocation
    </h4>
  </div>
  <div class="mt-3 rounded-md border border-gray-200 p-3">
    <!-- Top bar: search + remaining -->
    <div class="flex items-center justify-between gap-3">
      <input
        v-model.trim="query"
        type="text"
        placeholder="Search by batch or location…"
        class="w-full border rounded px-3 py-2 text-sm"
        :disabled="disabled"
      />
    </div>

    <!-- Search results -->
    <div class="space-y-2 max-h-56 overflow-auto">
      <div
        v-for="opt in filteredOptions"
        :key="opt.id"
        class="flex items-center justify-between rounded border p-2"
      >
        <div class="min-w-0">
          <div class="text-sm font-medium truncate">
            {{ opt.batchNumber }} <span class="text-gray-500">• {{ opt.location }}</span>
          </div>
          <div class="text-xs text-gray-500">
            Available: {{ opt.available }}
            <span v-if="opt.expiryDate" class="ml-1">• Exp: {{ fmtDate(opt.expiryDate) }}</span>
          </div>
        </div>
        <button
          class="px-3 py-1 border rounded text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white disabled:opacity-60"
          :disabled="disabled || opt.available <= 0 || isSelected(opt.id) || remainingRequested <= 0"
          @click="add(opt)"
        >
          Add
        </button>
      </div>

      <div v-if="!filteredOptions.length" class="text-sm text-gray-500">
        No batches found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { fetchDrugBatches as apiFetchDrugBatches } from '@/features/pharmacy/api/pharmacy'
import type { BatchLocation } from '@/features/pharmacy/types/BatchLocation'
import type { DrugBatch } from '@/features/pharmacy/types/DrugBatch'
import type { PrescriptionBatchItem } from '@/features/pharmacy/types/Prescription'

/**
 * Props & Emits
 */
const props = defineProps<{
  drugId: number | null
  requestedQty: number
  modelValue: PrescriptionBatchItem[]
  isPacked?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: PrescriptionBatchItem[]): void
  (e: 'update:isPacked', v: boolean): void
}>()

/**
 * Local state
 */
const batches = ref<DrugBatch[]>([])
const query = ref('')

/**
 * Build a single lookup of metadata for batchLocations
 * Option shape used in lists
 * 
 * Quantity renamed to available to avoid confusion with PrescriptionBatchItem.quantity
 */
type Option = Omit<BatchLocation, "quantity"> & {
  batchNumber: string
  expiryDate?: string
  available: number
}

type SelectedOption = Option & {
  allocatedQuantity: number
}

const allOptions = computed<Option[]>(() => {
  // DrugBatch: { batchNumber, expiryDate, batchLocations: BatchLocation[] }
  return (batches.value ?? []).flatMap(b =>
    (b.batchLocations ?? []).map((bl: BatchLocation) => {
      // destrcture to rename quantity to available
      const { quantity, ...rest } = bl
      return {
        ...rest,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        available: bl.quantity,
      }
    }),
  )
})

/**
 * Join modelValue (selected allocations) with metadata
 */
const selectedView = computed<SelectedOption[]>(() => {
    const byId = new Map(allOptions.value.map(o => [o.id, o]))
    return props.modelValue
        .map((pbi) => {
        const meta = byId.get(pbi.batchLocationId)
        if (!meta) return null
        return {
            ...meta,
            allocatedQuantity: pbi.quantity,
        }
        })
        .filter(Boolean) as Array<SelectedOption>
})

/**
 * A simple editable mirror of quantities for v-model on inputs
 * (keeps input smooth, then we emit updates on normalize)
 */
const editQuantities = ref<number[]>([])
watch(
  () => selectedView.value,
  (rows) => {
    editQuantities.value = rows.map(r => r.allocatedQuantity)
  },
  { immediate: true },
)

/**
 * Totals & remaining
 */
const totalAllocated = computed(() =>
  props.modelValue.reduce((sum, r) => sum + (r.quantity ?? 0), 0),
)

const remainingRequested = computed(() => props.requestedQty - totalAllocated.value)

const packedProxy = computed<boolean>({
  get: () => !!props.isPacked,
  set: (v) => emit('update:isPacked', v),
})

const canMarkPacked = computed(() => totalAllocated.value === props.requestedQty && props.requestedQty > 0)


/**
 * Filtering for search results
 * - hide options with 0 available
 * - hide ones already selected
 * - match by batchNumber or location
 */
function isSelected(batchLocationId: number) {
  return props.modelValue.some(m => m.batchLocationId === batchLocationId)
}

const filteredOptions = computed(() => {
  const q = query.value.toLowerCase()

  let list = allOptions.value
    .filter(o => o.available > 0)
    .filter(o => !isSelected(o.id))

  if (!q) return list

  return list.filter(o =>
    (o.batchNumber?.toLowerCase().includes(q) ?? false) ||
    o.location.toLowerCase().includes(q),
  )
})

/**
 * Helpers to mutate the v-model array safely
 */
function replaceAt(arr: PrescriptionBatchItem[], index: number, value: PrescriptionBatchItem): PrescriptionBatchItem[] {
  const copy = arr.slice()
  copy[index] = value
  return copy
}

function removeAt(arr: PrescriptionBatchItem[], index: number): PrescriptionBatchItem[] {
  const copy = arr.slice()
  copy.splice(index, 1)
  return copy
}


function normalize(i: number) {
  const row = selectedView.value[i]
  if (!row) return
  const clamped = Math.max(1, Math.min(Number(editQuantities.value[i] ?? 0), row.available))

  // write back to modelValue
  const idx = props.modelValue.findIndex(m => m.batchLocationId === row.id)
  if (idx >= 0) {
    const updated = replaceAt(props.modelValue, idx, {
      ...props.modelValue[idx],
      quantity: clamped,
    })
    emit('update:modelValue', updated)
  }
  // reflect in edit buffer (in case it was clamped)
  editQuantities.value[i] = clamped
}

function increment(i: number) {
  const row = selectedView.value[i]
  if (!row) return
  const next = Math.min((editQuantities.value[i] ?? 0) + 1, row.available)
  editQuantities.value[i] = next
  normalize(i)
}

function decrement(i: number) {
  const next = Math.max((editQuantities.value[i] ?? 0) - 1, 1)
  editQuantities.value[i] = next
  normalize(i)
}

function remove(i: number) {
  const row = selectedView.value[i]
  if (!row) return
  const idx = props.modelValue.findIndex(m => m.batchLocationId === row.id)
  if (idx >= 0) {
    emit('update:modelValue', removeAt(props.modelValue, idx))
  }
}

/**
 * Add a new selection from search results.
 * Start with min(available, remaining).
 * For new (unsaved) PBIs, you can safely use id: 0 (or undefined) and let backend assign.
 */
function add(opt: Option) {
  if (isSelected(opt.id) || remainingRequested.value <= 0 || opt.available <= 0) return
  emit('update:modelValue', [
    ...props.modelValue,
    { id: 0, batchLocationId: opt.id, quantity: 1 } as PrescriptionBatchItem,
  ])
}

/**
 * Formats given date
 */
const fmtDate = (s: string) => {
  if (!s || s === '–') return '–' // keep dash
  const d = new Date(s)
  return isNaN(+d) ? s : d.toLocaleDateString() // fall back to raw string
}

/**
 * Data loading
 */
async function fetchDrugBatches() {
  if (!props.drugId) return
  const data = await apiFetchDrugBatches(props.drugId)
  batches.value = data
}

onMounted(fetchDrugBatches)
watch(() => props.drugId, fetchDrugBatches)
watch(() => props.requestedQty, () => {
  // If requested drops, clamp all rows
  selectedView.value.forEach((_, i) => normalize(i))
})
</script>
