<template>
  <div class="flex justify-between items-center py-5">
    <div class="relative flex-grow">
      <input
        v-model="searchTerm"
        type="text"
        class="rounded-lg border-transparent appearance-none w-[25rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        placeholder="Search by ID/Name/Khmer Name/Reg Date/Contact No."
        @input="emitSearch"
        @keyup.enter="emitSearch"
      />
    </div>
    <div class="flex items-center space-x-3 mx-5 hover:cursor-pointer">
      <p style="font-size: medium" class="hover:text-gray-500" @click="emit('export')">
        Export Patient Data &#x2913;
      </p>
    </div>
    <div class="flex items-center space-x-3 hover:cursor-pointer">
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
  (e: 'export'): void
  (e: 'refresh'): void
}>()

const searchTerm = ref('')

function emitSearch() {
  emit('search', searchTerm.value)
}
</script>

<style scoped></style>
