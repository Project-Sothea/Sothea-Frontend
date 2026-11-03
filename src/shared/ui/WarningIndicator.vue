<template>
  <span
    ref="trigger"
    :class="['relative inline-flex shrink-0', props.color || 'text-yellow-400']"
    tabindex="0"
    :aria-label="tooltip"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focus="focused = true"
    @blur="focused = false"
    @keydown.esc="hovered = focused = false"
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
    <Teleport to="body" v-if="!props.noTooltip">
      <span
        v-if="visible"
        ref="popup"
        role="tooltip"
        class="pointer-events-none fixed z-50 max-w-[calc(100vw-1rem)] whitespace-pre-wrap break-words rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg"
        :style="position"
      >
        {{ tooltip }}
      </span>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  tooltip: string,
  color?: string,
  noTooltip?: boolean
}>()

const trigger = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const hovered = ref(false)
const focused = ref(false)
const visible = computed(() => hovered.value || focused.value)
const position = ref({ left: '0px', top: '0px' })

function updatePosition() {
  if (!visible.value || !trigger.value || !popup.value) return
  const anchor = trigger.value.getBoundingClientRect()
  const { width, height } = popup.value.getBoundingClientRect()
  const margin = 8
  let left = anchor.right + margin
  if (left + width > window.innerWidth - margin) left = anchor.left - width - margin
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
  const top = Math.max(
    margin,
    Math.min(anchor.top + (anchor.height - height) / 2, window.innerHeight - height - margin)
  )
  position.value = { left: `${left}px`, top: `${top}px` }
}

watch([visible, () => props.tooltip], async () => {
  await nextTick()
  updatePosition()
})

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>
