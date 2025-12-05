<template>
  <NavBar />
  <div class="container max-w-5xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <!-- Back & Title -->
      <div class="flex flex-row justify-between w-full mb-4">
        <h2 class="text-3xl leading-tight" style="color: black">Drug Overview</h2>
        <div class="space-x-2">
          <router-link
            to="/pharmacy"
            class="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded shadow"
          >
            ← Back
          </router-link>
        </div>
      </div>

      <!-- Drug Header (bigger/clearer) -->
      <div class="mb-8">
        <div class="rounded-2xl border bg-indigo-50 p-5 sm:p-6">
          <div class="leading-snug">
            <!-- Line 1: Drug -->
            <div class="text-gray-900 font-semibold text-2xl sm:text-3xl">
              {{ headerTitle }}
            </div>

            <!-- Line 2: Strength + Route -->
            <div class="text-gray-700 text-base sm:text-lg mt-1">
              {{ headerSubtitle }}
            </div>

            <!-- Line 3: Meta -->
            <div v-if="headerMeta" class="text-gray-600 text-sm sm:text-base mt-2">
              {{ headerMeta }}
            </div>

            <!-- Notes -->
            <div class="mt-3 text-sm sm:text-base text-gray-800">
              <span class="font-semibold">Notes:</span> {{ drug?.notes || '–' }}
            </div>
          </div>
        </div>
      </div>

      <hr class="line" />

      <div class="mt-6 flex flex-row justify-between w-full mb-4">
        <h3 class="text-2xl">Batches</h3>

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

      <!-- Filters -->
      <div class="flex items-center space-x-4 pb-5">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search batch / location"
          class="rounded-lg border-transparent w-[25rem] bg-gray-300 py-3 px-5 text-sm placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <!-- Tables -->
      <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
        <div class="inline-block min-w-full overflow-hidden shadow">
          <!-- All Batches -->
          <table v-if="tab === 'batches'" class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="th">Batch Number</th>
                <th class="th">Total Quantity</th>
                <th class="th">Expiry</th>
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

          <!-- By Location (flattened rows: location × batch) -->
          <table v-else class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="th">Location</th>
                <th class="th">Batch Number</th>
                <th class="th">Quantity</th>
                <th class="th">Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in filteredLocationRows"
                :key="`${row.location}-${row.batchId}`"
                :class="idx % 2 ? 'odd-row' : 'even-row'"
              >
                <td class="td">{{ row.location }}</td>
                <td class="td">{{ row.batchNumber }}</td>
                <td class="td">{{ row.quantity }}</td>
                <td class="td">{{ fmtDate(row.expiryDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import type { BatchDetail, DrugBatchLocation } from '../types/Batch'
import { getDrugStock } from '../api/drug'
import { fmtDispenseUnit, fmtStrengthWithRoute, type ISODateString, fmtDrugName } from '../types/Util'
import type { DrugView } from '../types/Drug'
import { fmtDate } from '../types/Util'

/** Route param */
const route = useRoute()
const drugId = Number(route.params.drugId) // Route param name still uses drugId for backward compatibility

/** State */
const tab = ref<'batches' | 'locations'>('batches')
const searchTerm = ref('')

const drug = ref<DrugView>()

const batches = ref<BatchDetail[]>([])


/** Fetchers */
async function fetchData() {
  // Fetch drug details
  const drugStock = await getDrugStock(drugId)
  drug.value = drugStock.drug
  batches.value = drugStock.batches
}

/** Header label builders */
const headerTitle = computed(() => fmtDrugName(drug.value))

const headerSubtitle = computed(() => fmtStrengthWithRoute(drug.value))

const headerMeta = computed(() => fmtDispenseUnit(drug.value))

function batchTotalQty(b: BatchDetail) {
  return b.batchLocations.reduce((sum, r) => sum + (r.quantity ?? 0), 0)
}

/** Search & rows */
const filteredBatches = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return batches.value
  return batches.value.filter(b =>
    (b.batchNumber ?? '').toLowerCase().includes(term) ||
    b.batchLocations.some(bL => bL.location.toLowerCase().includes(term))
  )
})

type LocationRow = DrugBatchLocation & {
  batchNumber: string
  expiryDate: ISODateString
}
const locationRows = computed<LocationRow[]>(() =>
  (batches.value ?? []).flatMap(b =>
    (b.batchLocations ?? []).map(bL => ({
      ...bL,
      batchNumber: b.batchNumber,
      expiryDate: b.expiryDate,
    }))
  )
);

const filteredLocationRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return locationRows.value
  return locationRows.value.filter(row =>
    row.location.toLowerCase().includes(term) ||
    (row.batchNumber ?? '').toLowerCase().includes(term)
  )
})

/** Init & watchers */
onMounted(async () => {
  await fetchData()
})

/** Styling */
const activeBtn = 'bg-indigo-600 text-white px-4 py-2 rounded transition-colors'
const inactiveBtn = 'bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors'
</script>

<style scoped>
.table { width: 1240px; }
.line { height: 1px; background: rgba(0, 0, 0, 0.17); }
.th {
  padding: 1.25rem 1.25rem; font-size: 0.875rem; font-weight: 500;
  text-align: left; text-transform: uppercase; color: #1f2937;
  background: #c7d2fe; border-bottom: 1px solid #e5e7eb;
}
.td { padding: 1rem 1.25rem; font-size: 0.875rem; }
.even-row { background-color: #ffffff; }
.odd-row { background-color: #f2f2f2; }
</style>
