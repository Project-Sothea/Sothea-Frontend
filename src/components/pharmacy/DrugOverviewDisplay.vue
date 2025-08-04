<template>
  <div class="container max-w-5xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">

      <!-- Back & Title -->
      <div class="flex flex-row justify-between w-full mb-4">
        <h2 class="text-3xl leading-tight" style="color:black">
          Drug Overview
        </h2>
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
        <p><strong>Default Size:</strong> {{ drug?.default_size }}</p>
        <p><strong>Notes:</strong> {{ drug?.notes || '–' }}</p>
      </div>

      <hr class="line" />

      <!-- Batches Table -->
      <div class="mt-6">
        <h3 class="text-2xl mb-4">Batches</h3>

        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden shadow">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th class="th">Batch No</th>
                  <th class="th">Quantity</th>
                  <th class="th">Expiry Date</th>
                  <th class="th">Location</th>
                  <th class="th">Created At</th>
                  <th class="th">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(b, idx) in batches"
                  :key="b.id"
                  :class="idx % 2 ? 'odd-row' : 'even-row'"
                >
                  <td class="td">{{ b.batch_no }}</td>
                  <td class="td">{{ b.quantity }}</td>
                  <td class="td">{{ fmtDate(b.expiry_date) }}</td>
                  <td class="td">{{ b.location || '–' }}</td>
                  <td class="td">{{ fmtDate(b.created_at) }}</td>
                  <td class="td">{{ b.notes || '–' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { BaseURL } from '@/main'
import type { Drug } from '@/types/Drug'
import type { DrugBatch } from '@/types/DrugBatch'

export default defineComponent({
  name: 'DrugOverviewDisplay',
  setup() {
    const route = useRoute()
    const drugId = route.params.drugId as string

    const drug = ref<Drug | null>(null)
    const batches = ref<DrugBatch[]>([])

    const fmtDate = (s: string) => {
      if (!s || s === '–') return '–'
      const d = new Date(s)
      return isNaN(+d) ? s : d.toLocaleDateString()
    }

    const fetchDrug = async () => {
      const { data } = await axios.get<Drug>(`${BaseURL}/pharmacy/drugs/${drugId}`)
      drug.value = data
    }

    const fetchBatches = async () => {
      const { data } = await axios.get<DrugBatch[]>(`${BaseURL}/pharmacy/batches?drug_id=${drugId}`)
      batches.value = Array.isArray(data) ? [...data] : []
    }

    onMounted(async () => {
      await Promise.all([fetchDrug(), fetchBatches()])
    })

    return {
      drug,
      batches,
      fmtDate
    }
  }
})
</script>

<style scoped>
.table     { width: 1240px; }
.line      { height: 1px; background: rgba(0, 0, 0, 0.17); }

/* header cells */
.th {
  @apply px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200;
}
/* body cells */
.td {
  @apply px-5 py-4 text-sm;
}

.even-row { background-color: #ffffff; }
.odd-row  { background-color: #f2f2f2; }
</style>
