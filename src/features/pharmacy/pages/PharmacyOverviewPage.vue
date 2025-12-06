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
                  <DrugLabel
                    :drug="drugsById.get(b.drugId)!"
                  />
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
                    <svg xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="h-5 w-5"
                    >
                      <path
                        fill="currentColor"
                        d="M12 5c-5 0-9.27 3.11-10.71 7.5C3.73 16.89 8 20 12 20s8.27-3.11 10.71-7.5C20.27 8.11 16 5 12 5m0 12a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m0-7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- By-drug table -->
          <table v-else-if="tab === 'drugs'" class="min-w-full leading-normal">
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
                  <DrugLabel
                    :drug="row.drug"
                  />
                </td>
                <td class="td">{{ row.totalQty }}</td>
                <td class="td">{{ fmtDate(row.earliestExpiry) }}</td>
                <td class="td">{{ row.numBatches }}</td>
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
import BatchLocationsModal from '../components/BatchLocationsModal.vue'
import { listAllBatches } from '../api/batch'
import { listDrugs } from '../api/drug'
import type { BatchDetail, DrugBatchLocation } from '../types/Batch'
import type { DrugView } from '../types/Drug'
import DrugLabel from '../components/DrugLabel.vue'
import { fmtDate, fmtDrugName } from '../types/Util'


// ---------------- state ----------------
const tab = ref<'batches' | 'drugs'>('batches')

// raw data
const drugs = ref<DrugView[]>([])
const drugsById = ref<Map<number, DrugView>>(new Map())

const batches = ref<BatchDetail[]>([])

const searchTerm = ref('')

// modal state
const showLocations = ref(false)
const selectedBatch = ref<BatchDetail | null>(null)

// ---------------- fetchers ----------------
async function loadAll() {
  // Drugs now contain all information (merged)
  drugs.value = await listDrugs()
  
  const drugMap = new Map<number, DrugView>()
  for (const drug of drugs.value) {
    drugMap.set(drug.id, drug)
  }
  drugsById.value = drugMap

  batches.value = await listAllBatches()
}

// ---------------- helpers ----------------
function drugForBatch(b: BatchDetail): DrugView | null {
  return drugsById.value.get(b.drugId) ?? null
}

function batchTotalQty(b: BatchDetail): number {
  // If your BatchDetail has a server-computed total, prefer it:
  if (typeof b.quantity === 'number') return b.quantity
  // else, sum locations if present (often you won’t have them on overview)
  const locs = b.batchLocations as DrugBatchLocation[] | undefined
  if (!Array.isArray(locs)) return 0
  return locs.reduce((sum, r) => sum + (r.quantity ?? 0), 0)
}

// ---------------- client-side search ----------------
const filteredBatches = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return batches.value

  return batches.value.filter(b => {
    const byBatchNum = (b.batchNumber ?? '').toLowerCase().includes(term)
    const drug = drugForBatch(b)
    if (drug) {
      const searchText = `${drug.atcCode || ''} ${drug.genericName || ''} ${drug.brandName || ''} ${drug.displayLabel || ''}`.toLowerCase()
      const byDrug = searchText.includes(term)
      const byLocs = b.batchLocations.some(bL => bL.location.toLowerCase().includes(term))
      return byBatchNum || byDrug || byLocs
    }
    const byLocs = b.batchLocations.some(bL => bL.location.toLowerCase().includes(term))
    return byBatchNum || byLocs
  })
})

// ---------------- aggregate for "By Drug" view ----------------
const drugRows = computed(() => {
  type Row = {
    id: number
    drug: DrugView
    totalQty: number
    earliestExpiryMs: number | null
    numBatches: number
  }
  const map = new Map<number, Row>()

  // seed from drugs
  for (const d of drugs.value) {
    map.set(d.id, {
      id: d.id,
      drug: d,
      totalQty: 0,
      earliestExpiryMs: null,
      numBatches: 0,
    })
  }

  // fold in batches (you already have batches with b.drugId)
  for (const b of batches.value) {
    const row = map.get(b.drugId)
    if (!row) continue
    row.totalQty += batchTotalQty(b)
    row.numBatches += 1
    const ms = Date.parse(b.expiryDate)
    if (!Number.isNaN(ms)) {
      row.earliestExpiryMs = row.earliestExpiryMs == null ? ms : Math.min(row.earliestExpiryMs, ms)
    }
  }

  return Array.from(map.values())
    .map(r => ({
      ...r,
      earliestExpiry: r.earliestExpiryMs == null
        ? '–'
        : new Date(r.earliestExpiryMs).toLocaleDateString('en-SG'),
    }))
    .sort((a, b) => {
      const nameA = fmtDrugName(a.drug)
      const nameB = fmtDrugName(b.drug)
      return nameA.localeCompare(nameB)
    })
})

const filteredDrugRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return drugRows.value
  return drugRows.value.filter(r => {
    const searchText = `${r.drug.atcCode || ''} ${r.drug.genericName || ''} ${r.drug.brandName || ''} ${r.drug.displayLabel || ''}`.toLowerCase()
    return searchText.includes(term)
  })
})


// ---------------- modal ----------------
const openLocations = (b: BatchDetail) => {
  selectedBatch.value = b
  showLocations.value = true
  // If your modal fetches locations by batchId internally, nothing else to do here.
}

// ---------------- init ----------------
onMounted(loadAll)

// ---------------- styling helpers (as before) ----------------
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
