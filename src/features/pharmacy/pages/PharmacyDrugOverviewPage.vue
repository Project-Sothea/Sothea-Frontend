<template>
  <NavBar />
  <div class="container max-w-5xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <!-- Back & Title -->
      <div class="flex flex-row justify-between w-full mb-4">
        <h2 class="text-3xl leading-tight" style="color: black">Drug Overview</h2>
        <router-link
          to="/pharmacy"
          class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded shadow"
        >
          ← Back
        </router-link>
      </div>

      <!-- Drug Info -->
      <div class="mb-6 space-y-2">
        <p><strong>Name:</strong> {{ drug?.name }}</p>
        <p><strong>Unit:</strong> {{ drug?.unit }}</p>
        <p><strong>Default Size:</strong> {{ drug?.defaultSize }}</p>
        <p><strong>Notes:</strong> {{ drug?.notes || '–' }}</p>
      </div>

      <hr class="line" />
      <div class="mt-6">
        <h3 class="text-2xl mb-4">Batches</h3>
      </div>

      <div class="flex flex-row justify-between w-full mb-4">

        <!-- pill-style toggle -->
        <div class="space-x-2">
          <button :class="tab === 'batches' ? activeBtn : inactiveBtn" @click="tab = 'batches'">
            All&nbsp;Batches
          </button>
          <button :class="tab === 'locations' ? activeBtn : inactiveBtn" @click="tab = 'locations'">
            By&nbsp;Location
          </button>
        </div>
      </div>

      <!-- ── FILTER BAR ──────────────────────────────────────────────── -->
      <div class="flex items-center space-x-4">
        <!-- search box -->
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search batch / location"
          class="rounded-lg border-transparent w-[25rem] bg-gray-300 py-3 px-5 text-sm placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <!-- Batches Table -->
      <div>
        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden shadow">
            <table v-if="tab === 'batches'" class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th class="th">Batch Number</th>
                  <th class="th">Total Quantity</th>
                  <th class="th">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(b, idx) in filteredBatches"
                  :key="b.id"
                  :class="idx % 2 ? 'odd-row' : 'even-row'"
                >
                  <td class="td">{{ b.batchNumber }}</td>
                  <td class="td">{{ batchTotalQty(b) }}</td>
                  <td class="td">{{ fmtDate(b.expiryDate) }}</td>
                </tr>
              </tbody>
            </table>
            <table v-else class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th class="th">Location</th>
                  <th class="th">Batch Number</th>
                  <th class="th">Quantity</th>
                  <th class="th">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(bL, idx) in filteredBatchLocations"
                  :key="bL.id"
                  :class="idx % 2 ? 'odd-row' : 'even-row'"
                >
                  <td class="td">{{ bL.location }}</td>
                  <td class="td">{{ bL.batchNumber }}</td>
                  <td class="td">{{ bL.quantity }}</td>
                  <td class="td">{{ fmtDate(bL.expiryDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import { fetchDrug as apiFetchDrug, fetchDrugBatches } from '@features/pharmacy/api/pharmacy'
import type { Drug } from '@features/pharmacy/types/Drug'
import type { DrugBatch } from '@/features/pharmacy/types/DrugBatch'

const route = useRoute()
const drugId = route.params.drugId as string

/* ---------------- State ---------------- */
const drug = ref<Drug | null>(null)
const batches = ref<DrugBatch[]>([])
const searchTerm = ref('')
const tab = ref<'batches' | 'locations'>('batches')

/* ---------------- API calls ---------------- */
const fetchDrug = async () => {
  drug.value = await apiFetchDrug(drugId)
}

const fetchBatches = async () => {
  const data = await fetchDrugBatches(drugId)
  batches.value = Array.isArray(data) ? [...data] : []
}

/* ---------------- helpers ---------------- */
const batchTotalQty = (b: DrugBatch) =>
  (b.batchLocations ?? []).reduce((sum, loc) => sum + (loc.quantity ?? 0), 0)

const fmtDate = (s: string) => {
  if (!s || s === '–') return '–'
  const d = new Date(s)
  return isNaN(+d) ? s : d.toLocaleDateString()
}

/* ---------------- client-side search for batches / drugs ---------------- */
const filteredBatches = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return batches.value
  return batches.value.filter((b) => {
    return (
      b.batchNumber.toLowerCase().includes(term) ||
      (b.batchLocations ?? []).some(bl => bl.location?.toLowerCase().includes(term))
    )
  })
})

const batchLocations = computed(() => {
  return batches.value.flatMap(b => (b.batchLocations ?? [])
                    .map(bL => ({ ...bL, batchNumber: b.batchNumber, expiryDate: b.expiryDate })))
})

const filteredBatchLocations = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return batchLocations.value
  return batchLocations.value.filter(bL => 
    bL.batchNumber.toLowerCase().includes(term) ||
    bL.location?.toLowerCase().includes(term)
  )
})

/* ---------------- init ---------------- */

onMounted(async () => {
  await Promise.all([fetchDrug(), fetchBatches()])
})

/* ---------------- Styling Helpers ---------------- */

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
