<template>
  <span
    class="group relative inline-flex shrink-0 text-yellow-400"
    tabindex="0"
    :aria-label="tooltip"
  >
    <svg
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 1.8 18.6A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.4L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
    <span
      role="tooltip"
      class="pointer-events-none invisible absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-pre rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg group-hover:visible group-focus:visible"
    >
      {{ tooltip }}
    </span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  tooltip: string
}>()
</script>
