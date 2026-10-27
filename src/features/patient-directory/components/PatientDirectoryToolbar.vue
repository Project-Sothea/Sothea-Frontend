<template>
  <div class="flex flex-col gap-3 py-5 sm:flex-row sm:justify-between sm:items-center">
    <div class="relative min-w-0 flex-grow">
      <input
        v-model="searchTerm"
        type="text"
        class="rounded-lg border-transparent appearance-none w-full sm:w-[25rem] max-w-full bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        placeholder="Search by ID/Name/Khmer Name/Reg Date/Contact No."
        @input="emitSearch"
        @keyup.enter="emitSearch"
      />
    </div>
    <div class="flex shrink-0 items-center space-x-3 hover:cursor-pointer">
      <p style="font-size: medium" class="hover:text-gray-500" @click="emit('refresh')">
        Refresh List &#x21bb;
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'refresh'): void
}>()

const searchTerm = ref('')

function emitSearch() {
  emit('search', searchTerm.value)
}
</script>

<style scoped></style>
