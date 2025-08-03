<template>
  <table class="min-w-full leading-normal">
    <thead>
      <tr>
        <th class="px-4 py-3 bg-indigo-200">Drug</th>
        <th class="px-4 py-3 bg-indigo-200">Total Qty</th>
        <th class="px-4 py-3 bg-indigo-200">Earliest Expiry</th>
        <th class="px-4 py-3 bg-indigo-200"># Batches</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in rows" :key="row.id"
          :class="idx%2 ? 'odd-row':'even-row'">
        <td class="px-4 py-2">
          <router-link
            :to="`/pharmacy/drugs/${row.id}`"
            class="text-blue-600 hover:underline"
          >
            {{ row.name }}
          </router-link>
        </td>
        <td class="px-4 py-2">{{ row.totalQty }}</td>
        <td class="px-4 py-2">{{ fmtDate(row.earliestExpiry) }}</td>
        <td class="px-4 py-2">{{ row.count }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
defineProps<{
  rows: any[],
  fmtDate:(d:string)=>string
}>()
</script>
