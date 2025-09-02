<template>
  <div class="flex justify-between items-center py-5">
    <div class="relative flex-grow flex flex-row">
      <div class="mr-2">
        <input
          type="text"
          v-model="localSearch"
          @input="emitSearch"
          @keyup.enter="emitSearch"
          class="rounded-lg border-transparent appearance-none w-[26rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          placeholder="Search by Queue No/ID/Name/Khmer Name/Drug Allergies"
        />
      </div>
      <div>
        <input
          type="date"
          :max="maxDate"
          v-model="localDate"
          @input="emitDateChange"
          class="rounded-lg border-transparent appearance-none w-48 bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>
    </div>
    <div class="flex items-center space-x-3 hover:cursor-pointer">
      <p style="font-size: medium" class="hover:text-gray-500" @click="$emit('refresh')">
        Refresh List &#x21bb;
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'

const props = defineProps<{ search?: string; date?: string; maxDate: string }>()
const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'date-change', value: string): void
  (e: 'refresh'): void
}>()

const { search, date } = toRefs(props)
const localSearch = ref(search?.value || '')
const localDate = ref(date?.value || '')

watch(search, (v) => {
  if (v !== undefined && v !== localSearch.value) localSearch.value = v
})
watch(date, (v) => {
  if (v !== undefined && v !== localDate.value) localDate.value = v
})

function emitSearch() {
  emit('search', localSearch.value)
}
function emitDateChange() {
  emit('date-change', localDate.value)
}
</script>
