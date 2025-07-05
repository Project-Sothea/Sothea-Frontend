<template>
  <div class="bg-[#C3CCFF] border-none p-2 flex flex-row font-medium mb-6">
    <!-- Refresh button -->
    <button
      @click="handleReload"
      style="padding-left: 8px"
      title="Reload Patient Data"
      class="hover-icon"
    >
      <!-- Reload Icon -->
      <svg
        v-if="!isReloading"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#3F51B5"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
          clip-rule="evenodd"
        />
      </svg>
      <!-- Cross Icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#3F51B5"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div class="mr-auto pl-4 text-[#3F51B5]">Date: {{ regDate }}</div>

    <div class="mx-auto text-[#3F51B5]">Queue No: {{ queueNo }}</div>

    <div class="ml-auto pr-5 text-[#3F51B5] flex flex-row">
      <button
        class="relative flex items-center justify-center w-full rounded-md font-medium hover:text-gray-800 text-[#3F51B5]"
        @click="$emit('openModal')"
      >
        <span class="mr-2">More Visits</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  regDate?: string
  queueNo?: string
}>()

const emit = defineEmits<{
  refresh: [void]
}>()

const isReloading = ref(false)

function handleReload() {
  // Change to cross icon
  isReloading.value = true

  emit('refresh')

  // Switch back to reload icon after 0.5 seconds
  setTimeout(() => {
    isReloading.value = false
  }, 500)
}
</script>

<style scoped>
.hover-icon svg {
  transition: fill 0.2s ease-in-out;
}

.hover-icon:hover svg {
  fill: #001170;
}
</style>
