<template>
  <!-- Stat strip (shows if requestedQtyKnown) -->
  <div class="mb-2">
    <div class="flex items-stretch gap-2">
      <!-- Requested -->
      <div class="flex-1 rounded-md border bg-gray-50/60 px-2 py-1.5">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Requested</div>
        <div class="text-base md:text-lg font-semibold leading-tight" style="font-variant-numeric: tabular-nums;">
          {{ requestedQty }}
        </div>
      </div>

      <div class="self-center px-1 text-gray-400 select-none">−</div>

      <!-- Allocated -->
      <div class="flex-1 rounded-md border bg-gray-50/60 px-2 py-1.5">
        <div class="text-[10px] uppercase tracking-wide text-gray-500">Allocated</div>
        <div class="text-base md:text-lg font-semibold leading-tight" style="font-variant-numeric: tabular-nums;">
          {{ totalAllocated }}
        </div>
      </div>

      <div class="self-center px-1 text-gray-400 select-none">⇒</div>

      <!-- Remaining -->
      <div
        class="flex-1 rounded-md border px-2 py-1.5"
        :class="[
          remainingRequested > 0 ? 'bg-amber-50/70 border-amber-200' :
          remainingRequested < 0 ? 'bg-red-50/70 border-red-200' :
          'bg-green-50/70 border-green-200'
        ]"
      >
        <div class="text-[10px] uppercase tracking-wide text-gray-600">Remaining</div>
        <div
          class="text-base md:text-lg font-semibold leading-tight"
          :class="remainingRequested > 0 ? 'text-amber-700' : remainingRequested < 0 ? 'text-red-700' : 'text-green-700'"
          style="font-variant-numeric: tabular-nums;"
        >
          {{ remainingRequested }}
        </div>
      </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="mt-2 flex items-center justify-between">
    <div class="text-sm text-gray-700">
      Total allocated: <span class="font-medium">{{ totalAllocated }}</span>
      <span v-if="anyDirty" class="ml-2 inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        Unsaved changes
      </span>
    </div>

    <!-- Right cluster: vertically centered with the row -->
    <div class="ml-auto self-center flex items-center gap-4 sm:gap-5 translate-y-[5px]">
      <label
        class="shrink-0 inline-flex flex-col items-center select-none leading-none"
        :title="readonly ? 'Read-only' : 'Mark this line as packed'"
      >
        <input
          type="checkbox"
          v-model="wantPacked"
          :disabled="readonly || saving"
          class="h-5 w-5 rounded border-gray-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 translate-y-[3px]"
        />
        <span class="mt-1 text-[10px] uppercase tracking-wide text-gray-600 leading-none translate-y-[3px]">
          Mark Packed
        </span>
      </label>

      <button
        class="px-3 py-1 rounded-lg text-sm text-white bg-[#3f51b5] hover:bg-[#32469e]
              shadow-sm hover:shadow disabled:opacity-60 disabled:shadow-none transition"
        @click="save"
        :disabled="readonly || saving || !anyDirty"
        title="Save allocations and/or packed status"
      >
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
    </div>
  </div>


  <!-- Selected allocations -->
  <div v-if="selectedOptions.length" class="mt-3 space-y-2">
    <div class="flex items-center justify-between">
      <h4 class="text-[11px] uppercase tracking-wide text-gray-500">Selected allocations</h4>
    </div>

    <div
      v-for="(sel, i) in selectedOptions"
      :key="sel.batchLocationId"
      class="flex items-center justify-between rounded border p-2"
    >
      <div class="min-w-0">
        <div class="text-sm font-medium truncate">
          {{ sel.batchNumber }} <span class="text-gray-500">• {{ sel.location }}</span>
        </div>
        <div class="text-xs text-gray-500">
          Available: {{ leftFor(sel.batchLocationId) }}
          <span v-if="sel.expiryDate" class="ml-1">• Exp: {{ fmtDate(sel.expiryDate) }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button v-if="!readonly" class="px-2 py-1 border rounded text-sm" @click="decrement(i)" :disabled="readonly || sel.allocatedQuantity <= 1">−</button>
        <input
          type="number"
          class="w-20 border rounded px-2 py-1 text-right"
          :disabled="readonly"
          v-model.number="sel.allocatedQuantity"
          @change="normalize(i)"
          min="1"
          :max="maxAllocFor(sel.batchLocationId)"
        />
        <button v-if="!readonly" class="px-2 py-1 border rounded text-sm" @click="increment(i)" :disabled="readonly || sel.allocatedQuantity >= sel.available">+</button>
        <button
          v-if="!readonly"
          class="ml-2 px-2 py-1 rounded text-sm text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
          @click="remove(i)"
          :disabled="readonly"
        >
          Remove
        </button>
      </div>
    </div>
  </div>

  <div class="my-5 border-t"></div>

  <!-- New allocation (search + list) -->
  <div v-if="!readonly" class="flex items-center justify-between">
    <h4 class="text-[11px] uppercase tracking-wide text-gray-500">New allocation</h4>
  </div>

  <div v-if="!readonly" class="mt-3 rounded-md border border-gray-200 p-3">
    <div class="flex items-center justify-between gap-3">
      <input
        v-model.trim="query"
        type="text"
        placeholder="Search by batch or location…"
        class="w-full border rounded px-3 py-2 text-sm"
        :disabled="readonly"
      />
    </div>

    <div class="space-y-2 max-h-56 overflow-auto mt-2">
      <div
        v-for="opt in filteredOptions"
        :key="opt.batchLocationId"
        class="flex items-center justify-between rounded border p-2"
      >
        <div class="min-w-0">
          <div class="text-sm font-medium truncate">
            {{ opt.batchNumber }} <span class="text-gray-500">• {{ opt.location }}</span>
          </div>
          <div class="text-xs text-gray-500">
            Available: {{ leftFor(opt.batchLocationId) }}
            <span v-if="opt.expiryDate" class="ml-1">• Exp: {{ fmtDate(opt.expiryDate) }}</span>
          </div>
        </div>

        <button
          class="px-3 py-1 border rounded text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white disabled:opacity-60"
          :disabled="readonly || opt.available <= 0 || isSelected(opt.batchLocationId) || (remainingRequested <= 0)"
          @click="add(opt)"
        >
          Add
        </button>
      </div>

      <div v-if="!filteredOptions.length" class="text-sm text-gray-500">No batches found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { LineAllocation } from '@/features/pharmacy/types/Prescription'
import { markLinePacked, setLineAllocations, unmarkLinePacked } from '@/features/pharmacy/api/prescription'
import { fmtDate } from '@/features/pharmacy/types/Util'
import type { DrugBatchLocation } from '@/features/pharmacy/types/Batch'
import { listBatchesByPresentation, listBatchLocations } from '@/features/pharmacy/api/batch'
import { getPresentation } from '@/features/pharmacy/api/drug'

// ─── Props & Emits ───────────────────────────────────────────────────────

const emit = defineEmits<{ (e: 'changed'): void }>()

const props = defineProps<{
  lineId: number;
  presId: number;
  allocations: LineAllocation[]
  requestedQty: number
  isPacked?: boolean
  readonly?: boolean
}>()
const toast = useToast()

// ─── UI State & Options  ───────────────────────────────────────────────────────

const saving  = ref(false)
const readonly = computed(() => !!props.readonly)

// replace quantity with available
// replace id with batchLocation id
// to make it less confusing when accessing the fields
type Option = Omit<DrugBatchLocation, 'quantity' | 'id'> & {
  batchLocationId: number
  batchNumber: string
  expiryDate?: string
  available: number
}

// All available options
const options = ref<Option[]>([])
const optionsById = computed(() => new Map(options.value.map(o => [o.batchLocationId, o])))

/** For search */
const query = ref('')

/** Selected view joins Optiosn with the current selected qty */
type SelectedOption = Option & {
  allocatedQuantity: number
}

// All the Options that are currently selected
const selectedOptions = ref<SelectedOption[]>([])
const selectedById = computed(() => new Map(selectedOptions.value.map(s => [s.batchLocationId, Number(s.allocatedQuantity) || 0])))

// store the saved initial allocations per batchLocation
const baselineAlloc = ref<Map<number, number>>(new Map())

/** Totals & remaining quanityt for the line */
const totalAllocated = computed(() => selectedOptions.value.reduce((s, r) => s + (Number(r.allocatedQuantity) || 0), 0))
const remainingRequested = computed(() => (props.requestedQty ?? 0) - totalAllocated.value)

// ─── Dirty Check  ───────────────────────────────────────────────────────

function keyOf(list: SelectedOption[]) {
  const core = list
    .map(r => ({ id: r.batchLocationId ?? -1, q: Number(r.allocatedQuantity) || 0 }))
    .sort((a, b) => a.id - b.id)
  return JSON.stringify(core)
}
const baseline = ref<string>('[]')
const dirty = computed(() => keyOf(selectedOptions.value) !== baseline.value)

// Pre-tick from prop, keep in sync with parent updates
const wantPacked = ref(!!props.isPacked)
watch(() => props.isPacked, v => { wantPacked.value = !!v })

// Dirty if packed state changed
const packedDirty = computed(() => wantPacked.value !== !!props.isPacked)
// Use this everywhere in the UI (chip, button enable)
const anyDirty = computed(() => dirty.value || packedDirty.value)

function maxAllocFor(batchLocationId: number) {
  const base  = optionsById.value.get(batchLocationId)?.available ?? 0
  const saved = baselineAlloc.value.get(batchLocationId) ?? 0
  return saved + base
}

function leftFor(batchLocationId: number) {
  const base   = optionsById.value.get(batchLocationId)?.available ?? 0   // API stock AFTER last save
  const current = selectedById.value.get(batchLocationId) ?? 0            // what user currently has in the UI
  const saved   = baselineAlloc.value.get(batchLocationId) ?? 0           // what was saved last time
  const delta   = current - saved                                         // pending change vs saved

  // Show stock as it would be *if you saved now*: base - delta
  // Clamp to [0, base + saved] just to be safe.
  const wouldBe = base - delta
  const maxPossible = base + saved
  return Math.min(Math.max(wouldBe, 0), maxPossible)
}

// ─── API & Option Generation  ───────────────────────────────────────────────────────

/** Load allocatable batch locations for this line */
async function loadOptions() {
  const presStock = await getPresentation(props.presId)

  const flat: Option[] = []
  presStock.batches.forEach(b => {
    b.batchLocations.forEach(bl => {
      flat.push({
        ...bl,
        batchLocationId: bl.id,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        available: bl.quantity
      })
    })
  })

  options.value = flat
  hydrateSelections()
}

function hydrateSelections(from?: LineAllocation[]) {
  const src = from ?? props.allocations ?? []
  selectedOptions.value = src.map(a => {
    const opt = optionsById.value.get(a.batchLocationId)
    if (opt) {
      return { ...opt, allocatedQuantity: Number(a.quantity) || 0 }
    }
    // Fallback if batchLocation not returned (e.g., archived):
    return {
      batchLocationId: a.batchLocationId,
      batchNumber: '(unknown batch)',
      location: '(unknown)',
      expiryDate: undefined,
      available: 0,  // base stock unknown → treat as 0
      allocatedQuantity: Number(a.quantity) || 0,
    } as SelectedOption
  })
  baselineAlloc.value = new Map(selectedOptions.value.map(s => [s.batchLocationId, Number(s.allocatedQuantity) || 0]))
  baseline.value = keyOf(selectedOptions.value) // keep dirty in sync
}

/** Persist (replace all) */
async function save() {
  if (readonly.value) return
  const post = selectedOptions.value
    .map(r => ({ batchLocationId: Number(r.batchLocationId), quantity: Number(r.allocatedQuantity) }))
    .filter(r => r.batchLocationId > 0 && r.quantity > 0)
  saving.value = true
  try {
    if (dirty.value) {
       await setLineAllocations(props.lineId, { allocations: post })
    }
    if (packedDirty.value) {
      if (wantPacked.value) {
        await markLinePacked(props.lineId)   // rename to your actual API
      } else {
        await unmarkLinePacked(props.lineId) // rename to your actual API
      }
    }
    toast.success('Allocations saved')
    emit('changed')
    await loadOptions()
  } catch (e: any) {
    toast.error(e?.message ?? 'Failed to save allocations.')
  } finally {
    saving.value = false
  }
}

// ───  List Search and Option Selection  ───────────────────────────────────────────────────────

function isSelected(batchLocationId: number) {
  return selectedOptions.value.some(r => r.batchLocationId === batchLocationId)
}
const filteredOptions = computed<Option[]>(() => {
  const q = query.value.toLowerCase()
  let list = options.value
    .filter(o => o.available > 0)
    .filter(o => !isSelected(o.batchLocationId))
  if (!q) return list
  return list
    .filter(o => (o.batchNumber?.toLowerCase().includes(q) ?? false) || o.location.toLowerCase().includes(q))
})

/** Mutations on rows */
function add(opt: Option) {
  if (readonly.value) return
  if (isSelected(opt.batchLocationId)) return
  // Qty starts at 1 (old behaviour)
  selectedOptions.value.push({
    ...opt,
    allocatedQuantity: 1
  })
}

function remove(i: number) {
  if (readonly.value) return
  selectedOptions.value.splice(i, 1)
}

function normalize(i: number) {
  const row = selectedOptions.value[i]
  if (!row) return
  row.allocatedQuantity = Math.max(1, Math.min(Number(row.allocatedQuantity || 0), maxAllocFor(row.batchLocationId)))
}

function increment(i: number) {
  const row = selectedOptions.value[i]
  if (!row) return
  row.allocatedQuantity = Math.min((row.allocatedQuantity || 0) + 1, maxAllocFor(row.batchLocationId))
}

function decrement(i: number) {
  const row = selectedOptions.value[i]
  if (!row) return
  row.allocatedQuantity = Math.max((row.allocatedQuantity || 0) - 1, 1)
}

// ─── Init  ───────────────────────────────────────────────────────

watch(() => props.lineId, () => { loadOptions() }, { immediate: true })
watch(() => props.allocations, (allocs) => {
  // Re-hydrate if parent refreshed allocations (e.g., after save)
  hydrateSelections(allocs)
}, { deep: true })
</script>
