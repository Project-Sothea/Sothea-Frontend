<template>
  <NavBar />
  <div class="container max-w-5xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <div class="flex justify-end mb-4">
        <router-link
          to="/pharmacy/batches/new"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Batch
        </router-link>
      </div>
      <!-- ── PAGE TITLE & TOGGLE ─────────────────────────────────────── -->
      <div class="flex flex-row justify-between w-full mb-4">
        <h2 class="text-3xl leading-tight" style="color: black">Drug&nbsp;Batches</h2>

        <!-- pill-style toggle -->
        <div class="space-x-2">
          <button :class="tab === 'batches' ? activeBtn : inactiveBtn" @click="tab = 'batches'">
            All&nbsp;Batches
          </button>
          <button :class="tab === 'drugs' ? activeBtn : inactiveBtn" @click="tab = 'drugs'">
            By&nbsp;Drug
          </button>
        </div>
      </div>

      <!-- ── FILTER BAR ──────────────────────────────────────────────── -->
      <div class="flex items-center space-x-4 pb-5">
        <!-- search box -->
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search batch / drug / location"
          class="rounded-lg border-transparent w-[25rem] bg-gray-300 py-3 px-5 text-sm placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <hr class="line" />

      <!-- ── TABLE AREA ──────────────────────────────────────────────── -->
      <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
        <div class="inline-block min-w-full overflow-hidden shadow">
          <!-- All-batches table -->
          <table v-if="tab === 'batches'" class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="th">Batch&nbsp;ID</th>
                <th class="th">Drug</th>
                <th class="th">Total Qty</th>
                <th class="th">Expiry</th>
                <th class="th">View Locations</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(b, idx) in filteredBatches"
                :key="b.id"
                :class="idx % 2 ? 'odd-row' : 'even-row'"
              >
                <td class="td">{{ b.batchNumber }}</td>
                <td class="td">
                  <router-link
                    :to="`/pharmacy/drugs/${b.drugId}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ drugName(b.drugId) }}
                  </router-link>
                </td>
                <td class="td">{{ batchTotalQty(b) }}</td>
                <td class="td">{{ fmtDate(b.expiryDate) }}</td>
                <td class="td">
                  <button
                    class="icon-btn"
                    aria-label="View locations"
                    title="View locations"
                    @click="openLocations(b)"
                  >
                    <EyeIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- By-drug table -->
          <table v-else class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="th">Drug</th>
                <th class="th">Total&nbsp;Qty</th>
                <th class="th">Earliest&nbsp;Expiry</th>
                <th class="th">#&nbsp;Batches</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in filteredDrugRows"
                :key="row.id"
                :class="idx % 2 ? 'odd-row' : 'even-row'"
              >
                <td class="px-4 py-2">
                  <router-link
                    :to="`/pharmacy/drugs/${row.id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ row.name }}
                  </router-link>
                </td>
                <td class="td">{{ row.totalQty }}</td>
                <td class="td">{{ fmtDate(row.earliestExpiry) }}</td>
                <td class="td">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <BatchLocationsModal v-model:open="showLocations" :batch="selectedBatch" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import {
  fetchDrugs as apiFetchDrugs,
  fetchBatches as apiFetchBatches
} from '@features/pharmacy/api/pharmacy'
import type { Drug } from '../types/Drug'
import type { DrugBatch } from '../types/DrugBatch'

import BatchLocationsModal from '../components/BatchLocationsModal.vue'

/* ---------------- state ---------------- */
const tab = ref<'batches' | 'drugs'>('batches')
const drugs = ref<Drug[]>([])
const batches = ref<DrugBatch[]>([])
const searchTerm = ref('')

// whether to show the pop up for batch locations for the selected batch
const showLocations = ref(false)
const selectedBatch = ref<DrugBatch | null>(null)

/* ---------------- API calls ---------------- */
const fetchDrugs = async () => {
  drugs.value = await apiFetchDrugs()
}

const fetchBatches = async () => {
  const data = await apiFetchBatches()
  batches.value = Array.isArray(data) ? [...data] : []
}

/* ---------------- helpers ---------------- */
const fmtDate = (s: string) => {
  if (!s || s === '–') return '–' // keep dash
  const d = new Date(s)
  return isNaN(+d) ? s : d.toLocaleDateString() // fall back to raw string
}

const drugById = computed(() => {
  const m = new Map<number, Drug>()
  for (const d of drugs.value) m.set(d.id, d)
  return m
})

const drugName = (id: number) => drugById.value.get(id)?.name ?? 'Unknown'

const batchTotalQty = (b: DrugBatch) =>
  (b.batchLocations ?? []).reduce((sum, loc) => sum + (loc.quantity ?? 0), 0)

/* ---------------- client-side search for batches / drugs ---------------- */
const filteredBatches = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return batches.value
  return batches.value.filter((b) => {
    return (
      b.batchNumber.toLowerCase().includes(term) ||
      drugName(b.drugId).toLowerCase().includes(term) ||
      (b.batchLocations ?? []).some(bl => bl.location?.toLowerCase().includes(term))
    )
  })
})

// find drug IDs that match the search term in any batch fields (batch number, location)
const matchingDrugIdsByBatchFields = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return null // no extra filtering
  const ids = new Set<number>()
  for (const b of batches.value) {
    if (b.batchNumber?.toLowerCase().includes(term)) ids.add(b.drugId)
    if ((b.batchLocations ?? []).some(bl => bl.location?.toLowerCase().includes(term))) {
      ids.add(b.drugId)
    }
  }
  return ids
})

const filteredDrugRows = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return drugRows.value

  const ids = matchingDrugIdsByBatchFields.value
  return drugRows.value.filter((row) =>
    row.name.toLowerCase().includes(term) ||
    (ids?.has(row.id) ?? false)
  )
})

/* ---------------- aggregate for By-Drug view ---------------- */
const drugRows = computed(() => {
  type Row = { id: number; name: string; totalQty: number; earliestExpiryMs: number | null; count: number }
  const map = new Map<number, Row>()

  // seed from drugs so drugs with 0 batches still show up
  for (const d of drugs.value) {
    map.set(d.id, { id: d.id, name: d.name, totalQty: 0, earliestExpiryMs: null, count: 0 })
  }

  for (const b of batches.value) {
    let row = map.get(b.drugId)
    if (!row) {
      // defensive: a batch arrived before its drug, or data mismatch
      const fallbackName = `Unknown (#${b.drugId})`
      row = { id: b.drugId, name: fallbackName, totalQty: 0, earliestExpiryMs: null, count: 0 }
      map.set(b.drugId, row)
    }

    row.totalQty += batchTotalQty(b)
    row.count += 1

    const ms = Date.parse(b.expiryDate)
    if (!Number.isNaN(ms)) {
      row.earliestExpiryMs = (row.earliestExpiryMs == null) ? ms : Math.min(row.earliestExpiryMs, ms)
    }
  }

  // convert to view model
  return Array.from(map.values()).map((r) => ({
    id: r.id,
    name: r.name,
    totalQty: r.totalQty,
    count: r.count,
    earliestExpiry: r.earliestExpiryMs == null ? '–' : new Date(r.earliestExpiryMs).toLocaleDateString('en-SG')
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
})

/* ---------------- View Batch Locations for selected batch ---------------- */
const openLocations = (b: DrugBatch) => {
  selectedBatch.value = b
  showLocations.value = true
}

/* ---------------- init ---------------- */
onMounted(async () => {
  await Promise.all([fetchDrugs(), fetchBatches()])
})


/* ---------------- styling helpers ---------------- */
const activeBtn = 'bg-indigo-600 text-white px-4 py-2 rounded transition-colors'
const inactiveBtn = 'bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors'
</script>

<style scoped>
.table {
  width: 1240px;
}
.line {
  height: 1px;
  background: rgba(0, 0, 0, 0.17);
}

/* header cells */
.th {
  padding: 1.25rem 1.25rem; /* px-5 py-5 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  text-align: left; /* text-left */
  text-transform: uppercase; /* uppercase */
  color: #1f2937; /* text-gray-800 */
  background: #c7d2fe; /* bg-indigo-200 */
  border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
}
/* body cells */
.td {
  padding: 1rem 1.25rem; /* px-5 py-4 */
  font-size: 0.875rem; /* text-sm */
}

.even-row {
  background-color: #ffffff;
}
.odd-row {
  background-color: #f2f2f2;
}
</style>
