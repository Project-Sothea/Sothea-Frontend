<template>
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
        <h2 class="text-3xl leading-tight" style="color:black">
          Drug&nbsp;Batches
        </h2>

        <!-- pill-style toggle -->
        <div class="space-x-2">
          <button
            :class="tab === 'batches' ? activeBtn : inactiveBtn"
            @click="tab = 'batches'"
          >
            All&nbsp;Batches
          </button>
          <button
            :class="tab === 'drugs' ? activeBtn : inactiveBtn"
            @click="tab = 'drugs'"
          >
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
                <th class="th">Qty</th>
                <th class="th">Expiry</th>
                <th class="th">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(b, idx) in filteredBatches"
                :key="b.id"
                :class="idx % 2 ? 'odd-row' : 'even-row'"
              >
                <td class="td">{{ b.batch_no }}</td>
                <td class="td">
                  <router-link
                    :to="`/pharmacy/drugs/${b.drug_id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ drugName(b.drug_id) }}
                  </router-link>
                </td>
                <td class="td">{{ b.quantity }}</td>
                <td class="td">{{ fmtDate(b.expiry_date) }}</td>
                <td class="td">{{ b.location ?? '-' }}</td>
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
                v-for="(row, idx) in drugRows"
                :key="row.id"
                :class="idx % 2 ? 'odd-row' : 'even-row'"
              >
                <td class="px-4 py-2">
                  <router-link
                    :to="`/pharmacy/drugs/${row.id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ row.name  }}
                  </router-link>
                </td>
                <td class="td">{{ row.totalQty }}</td>
                <td class="td">{{ fmtDate(row.earliestExpiry) }}</td>
                <td class="td">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { BaseURL } from '@/main'
import type { Drug } from '@/types/Drug'
import type { DrugBatch } from '@/types/DrugBatch'

export default defineComponent({
  setup() {
    /* ---------------- state ---------------- */
    const tab            = ref<'batches' | 'drugs'>('batches')
    const drugs          = ref<any[]>([])
    const batches        = ref<any[]>([])
    const searchTerm     = ref('')

    /* ---------------- API calls ---------------- */
    const fetchDrugs = async () => {
      const { data } = await axios.get<Drug[]>(`${BaseURL}/pharmacy/drugs`);
      drugs.value = data
    }

    const fetchBatches = async () => {
      const { data } = await axios.get<DrugBatch[]>(`${BaseURL}/pharmacy/batches`)
      batches.value = Array.isArray(data) ? [...data] : []
    }

    /* ---------------- helpers ---------------- */
    const fmtDate = (s: string) => {
        if (!s || s === '–') return '–'               // keep dash
        const d = new Date(s)
        return isNaN(+d) ? s : d.toLocaleDateString() // fall back to raw string
    }
    const drugName = (id: number) =>
      drugs.value.find((d) => d.id === id)?.name ?? 'Unknown'

    /* ---------------- client-side search ---------------- */
    const filteredBatches = computed(() => {
      const term = searchTerm.value.toLowerCase()
      if (!term) return batches.value
      return batches.value.filter((b: any) => {
        return (
          b.batch_no.toLowerCase().includes(term) ||
          drugName(b.drug_id).toLowerCase().includes(term) ||
          (b.location || '').toLowerCase().includes(term)
        )
      })
    })

    /* ---------------- aggregate for By-Drug view ---------------- */
    const drugRows = computed(() => {
        const map = new Map<
            number,
            { id: number; name: string; totalQty: number; earliestExpiry: string; count: number }
        >()

        drugs.value.forEach(d => {
            map.set(d.id, {
            id: d.id,
            name: d.name,
            totalQty: 0,
            earliestExpiry: '–',   // display dash when no batches at all
            count: 0
            })
        })

        filteredBatches.value.forEach((b: any) => {
        const row = map.get(b.drug_id)!
        row.totalQty += b.quantity
        row.count    += 1

        // choose earliest expiry among that drug’s batches
        if (row.earliestExpiry === '–' ||
            new Date(b.expiry_date) < new Date(row.earliestExpiry)) {
        row.earliestExpiry = b.expiry_date
        }
    })

    return Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    )
    })


    /* ---------------- init ---------------- */
    onMounted(async () => {
      await Promise.all([fetchDrugs(), fetchBatches()])
    })

    /* ---------------- styling helpers ---------------- */
    const activeBtn =
      'bg-indigo-600 text-white px-4 py-2 rounded transition-colors'
    const inactiveBtn =
      'bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors'

    return {
      tab,
      drugs,
      batches,
      searchTerm,
      filteredBatches,
      drugRows,
      fmtDate,
      drugName,
      activeBtn,
      inactiveBtn
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
