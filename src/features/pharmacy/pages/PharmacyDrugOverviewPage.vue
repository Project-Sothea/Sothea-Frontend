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
          <div class="flex items-start justify-between">
            <div class="leading-snug flex-1">
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
            <div class="flex gap-2 ml-4">
              <button
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition-colors"
                @click="openEditDrugModal = true"
              >
                Edit
              </button>
              <button
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors"
                @click="openDeleteConfirm = true"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr class="line" />

      <div class="mt-6 flex flex-row justify-between w-full mb-4">
        <div class="flex items-center gap-4">
          <h3 class="text-2xl">Batches</h3>
          <button
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow sm"
            @click="openAddBatchModal = true"
          >
            + Add Batch
          </button>
        </div>

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
                <th class="th">Actions</th>
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
                <td class="td">
                  <div class="flex items-center gap-2">
                    <button
                      class="text-indigo-600 hover:text-indigo-800 transition-colors"
                      @click="handleViewBatch(b)"
                      title="View batch locations"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5">
                        <path
                          fill="currentColor"
                          d="M12 5c-5 0-9.27 3.11-10.71 7.5C3.73 16.89 8 20 12 20s8.27-3.11 10.71-7.5C20.27 8.11 16 5 12 5m0 12a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m0-7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-indigo-600 hover:text-indigo-800 transition-colors"
                      @click="handleEditBatch(b)"
                      title="Edit batch"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 transition-colors"
                      @click="handleDeleteBatch(b)"
                      title="Delete batch"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
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
                <th class="th">Actions</th>
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
                <td class="td">
                  <div class="flex items-center gap-2">
                    <button
                      class="text-indigo-600 hover:text-indigo-800 transition-colors"
                      @click="handleEditLocation(row)"
                      title="Edit location"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 transition-colors"
                      @click="handleDeleteLocation(row)"
                      title="Delete location"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditDrugForm
      :open="openEditDrugModal"
      :drug-id="drugId"
      @close="openEditDrugModal = false"
      @updated="handleDrugUpdated"
    />
    <AddBatchForDrugModal
      :open="openAddBatchModal"
      :drug-id="drugId"
      @close="openAddBatchModal = false"
      @saved="handleBatchSaved"
    />
    <BatchLocationsModal v-model:open="openViewBatchModal" :batch="selectedBatch || null" />
    <EditBatchModal
      :open="openEditBatchModal"
      :batch="selectedBatch"
      @close="openEditBatchModal = false"
      @saved="handleBatchSaved"
    />
    <EditBatchLocationModal
      :open="openEditLocationModal"
      :location="selectedLocation"
      :batch-id="selectedLocationBatchId"
      @close="openEditLocationModal = false"
      @saved="handleLocationSaved"
      @deleted="handleLocationSaved"
    />
    <ConfirmationDialogue
      :open="openDeleteConfirm"
      title="Delete Drug"
      :message="`Are you sure you want to delete ${headerTitle}? This action cannot be undone. Note that associated batches will also be deleted.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteDrug"
      @cancel="openDeleteConfirm = false"
    />
    <ConfirmationDialogue
      :open="openDeleteBatchConfirm"
      title="Delete Batch"
      :message="`Are you sure you want to delete batch ${selectedBatch?.batchNumber}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteBatchConfirm"
      @cancel="openDeleteBatchConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import EditDrugForm from '../components/EditDrugForm.vue'
import AddBatchForDrugModal from '../components/AddBatchForDrugModal.vue'
import EditBatchModal from '../components/EditBatchModal.vue'
import EditBatchLocationModal from '../components/EditBatchLocationModal.vue'
import BatchLocationsModal from '../components/BatchLocationsModal.vue'
import ConfirmationDialogue from '@features/patient-record/components/ConfirmationDialogue.vue'
import type { BatchDetail, DrugBatchLocation } from '../types/Batch'
import { getDrugStock, deleteDrug } from '../api/drug'
import { deleteBatch } from '../api/batch'
import {
  fmtDispenseUnit,
  fmtStrengthWithRoute,
  type ISODateString,
  fmtDrugNameWithBrand
} from '../types/Util'
import type { DrugView } from '../types/Drug'
import { fmtDate } from '../types/Util'

/** Route param */
const route = useRoute()
const router = useRouter()
const drugId = Number(route.params.drugId) // Route param name still uses drugId for backward compatibility
const toast = useToast()

/** State */
const tab = ref<'batches' | 'locations'>('batches')
const searchTerm = ref('')

const drug = ref<DrugView>()
const batches = ref<BatchDetail[]>([])

/** Modal states */
const openEditDrugModal = ref(false)
const openAddBatchModal = ref(false)
const openEditBatchModal = ref(false)
const openViewBatchModal = ref(false)
const selectedBatch = ref<BatchDetail | undefined>(undefined)
const openEditLocationModal = ref(false)
const selectedLocation = ref<DrugBatchLocation | undefined>(undefined)
const selectedLocationBatchId = ref<number>(0)
const openDeleteConfirm = ref(false)
const openDeleteBatchConfirm = ref(false)

/** Fetchers */
async function fetchData() {
  // Fetch drug details
  const drugStock = await getDrugStock(drugId)
  drug.value = drugStock.drug
  batches.value = drugStock.batches
}

/** Header label builders */
const headerTitle = computed(() => fmtDrugNameWithBrand(drug.value))

const headerSubtitle = computed(() => fmtStrengthWithRoute(drug.value))

const headerMeta = computed(() => fmtDispenseUnit(drug.value))

function batchTotalQty(b: BatchDetail) {
  return b.batchLocations.reduce((sum, r) => sum + (r.quantity ?? 0), 0)
}

/** Search & rows */
const filteredBatches = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return batches.value
  return batches.value.filter(
    (b) =>
      (b.batchNumber ?? '').toLowerCase().includes(term) ||
      b.batchLocations.some((bL) => bL.location.toLowerCase().includes(term))
  )
})

type LocationRow = DrugBatchLocation & {
  batchNumber: string
  expiryDate: ISODateString
}
const locationRows = computed<LocationRow[]>(() =>
  (batches.value ?? []).flatMap((b) =>
    (b.batchLocations ?? []).map((bL) => ({
      ...bL,
      batchNumber: b.batchNumber,
      expiryDate: b.expiryDate
    }))
  )
)

const filteredLocationRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return locationRows.value
  return locationRows.value.filter(
    (row) =>
      row.location.toLowerCase().includes(term) ||
      (row.batchNumber ?? '').toLowerCase().includes(term)
  )
})

/** Handlers */
async function handleDrugUpdated() {
  await fetchData()
}

function handleViewBatch(batch: BatchDetail) {
  selectedBatch.value = batch
  openViewBatchModal.value = true
}

function handleEditBatch(batch: BatchDetail) {
  selectedBatch.value = batch
  openEditBatchModal.value = true
}

function handleDeleteBatch(batch: BatchDetail) {
  selectedBatch.value = batch
  openDeleteBatchConfirm.value = true
}

async function handleBatchSaved() {
  await fetchData()
  openEditBatchModal.value = false
}

function handleEditLocation(locationRow: LocationRow) {
  // Find the batch for this location
  const batch = batches.value.find((b) => b.id === locationRow.batchId)
  if (batch) {
    const location = batch.batchLocations.find((loc) => loc.id === locationRow.id)
    if (location) {
      selectedLocation.value = location
      selectedLocationBatchId.value = locationRow.batchId
      openEditLocationModal.value = true
    }
  }
}

function handleDeleteLocation(locationRow: LocationRow) {
  // Find the batch for this location
  const batch = batches.value.find((b) => b.id === locationRow.batchId)
  if (batch) {
    const location = batch.batchLocations.find((loc) => loc.id === locationRow.id)
    if (location) {
      selectedLocation.value = location
      selectedLocationBatchId.value = locationRow.batchId
      // For delete, we can use the edit modal's delete functionality
      openEditLocationModal.value = true
    }
  }
}

async function handleLocationSaved() {
  await fetchData()
  openEditLocationModal.value = false
  selectedLocation.value = undefined
}

async function handleDeleteBatchConfirm() {
  if (!selectedBatch.value) return

  try {
    await deleteBatch(selectedBatch.value.id)
    toast.success('Batch deleted successfully')
    await fetchData()
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.error ?? 'Failed to delete batch')
  } finally {
    openDeleteBatchConfirm.value = false
    selectedBatch.value = undefined
  }
}

async function handleDeleteDrug() {
  try {
    await deleteDrug(drugId)
    toast.success('Drug deleted successfully')
    await router.push('/pharmacy')
  } catch (err: any) {
    console.error(err)
    toast.error(err?.message ?? 'Failed to delete drug')
  } finally {
    openDeleteConfirm.value = false
  }
}

/** Init & watchers */
onMounted(async () => {
  await fetchData()
})

/** Styling */
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
.th {
  padding: 1.25rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  text-transform: uppercase;
  color: #1f2937;
  background: #c7d2fe;
  border-bottom: 1px solid #e5e7eb;
}
.td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
}
.even-row {
  background-color: #ffffff;
}
.odd-row {
  background-color: #f2f2f2;
}
</style>
