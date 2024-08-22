<template>
  <div>
    <div :class="dropdownOpen ? 'bg-[#3F51B5] rounded-t-md' : 'bg-[#3F51B5] rounded-md'">
      <button
        @click="toggleDropdown"
        class="flex items-center align-center justify-between w-full rounded-md px-4 py-2 font-normal text-sm text-white"
      >
        <span>May '23</span>
        <span class="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="size-4"
          >
            <path
              :d="dropdownOpen ? 'M19.5 15.75L12 8.25l-7.5 7.5' : 'M19.5 8.25l-7.5 7.5-7.5-7.5'"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
    <div
      v-show="dropdownOpen"
      class="pl-2 text-xs text-[#626262] border-[#3F51B5] border-2 w-full rounded-b-md"
    >
      <div>Admin Details:</div>
      <div>Past Medical History:</div>
      <div>Social History:</div>
      <div>Vital Statistics:</div>
      <div>Height and Weight:</div>
      <div>Visual Acuity:</div>
      <div>Doctor's Consult:</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Record Section should take in a record as a prop and then display all the relevant information
export default defineComponent({
  name: 'RecordSection',
  data() {
    return {
      dropdownOpen: false
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    }
  }
})
</script>
