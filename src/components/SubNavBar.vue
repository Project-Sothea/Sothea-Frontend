<template>
  <div class="bg-[#C3CCFF] border-none p-2 flex flex-row font-medium">
    <div class="mr-auto pl-4 text-[#3F51B5]">Date</div>

    <div class="mx-auto text-[#3F51B5]">Queue No.</div>

    <div class="ml-auto pr-5 text-[#3F51B5] flex flex-row">
      <button
        class="relative flex items-center justify-center w-full rounded-md font-medium hover:text-gray-800 text-[#3F51B5]"
        @click="$emit('openModal')"
      >
        <span class="mr-2">More Records</span>
        <!-- Bar Icon -->
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SubNavBar'
})
</script>
