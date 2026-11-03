<template>
  <Tooltip
    :text="tooltip"
    :disabled="noTooltip"
    :class="['relative inline-flex shrink-0', props.color || 'text-yellow-400']"
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
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue'

const props = defineProps<{
  tooltip: string,
  color?: string,
  noTooltip?: boolean
}>()
</script>
