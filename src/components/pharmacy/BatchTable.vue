<template>
  <table class="min-w-full leading-normal">
    <thead>
      <tr>
        <th class="px-4 py-3 bg-indigo-200">Batch Number</th>
        <th class="px-4 py-3 bg-indigo-200">Drug Name</th>
        <th class="px-4 py-3 bg-indigo-200">Quantity</th>
        <th class="px-4 py-3 bg-indigo-200">Expiry Date</th>
        <th class="px-4 py-3 bg-indigo-200">Location</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(b, idx) in batches" :key="b.id"
          :class="idx%2 ? 'odd-row':'even-row'">
        <td class="px-4 py-2">{{ b.batch_no }}</td>
        <td class="px-4 py-2">
          <router-link
            :to="`/pharmacy/drugs/${b.drug_id}`"
            class="text-blue-600 hover:underline"
          >
            {{ drugName(b.drug_id)  }}
          </router-link>
        </td>
        <td class="px-4 py-2">{{ b.quantity }}</td>
        <td class="px-4 py-2">{{ fmtDate(b.expiry_date) }}</td>
        <td class="px-4 py-2">{{ b.location ?? '-' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
defineProps<{
  batches: any[],
  drugName: (id: number)=>string,
  fmtDate:  (d: string)=>string
}>()
</script>
