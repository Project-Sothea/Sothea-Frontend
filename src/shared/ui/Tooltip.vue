<template>
  <component
    :is="as"
    ref="trigger"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
    @keydown.esc="hovered = focused = false"
  >
    <slot />
    <Teleport to="body">
      <span
        v-if="visible"
        :id="tooltipId"
        ref="popup"
        role="tooltip"
        class="pointer-events-none fixed z-50 max-w-[calc(100vw-1rem)] whitespace-pre-wrap break-words rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg"
        :style="position"
      >
        {{ text }}
      </span>
    </Teleport>
  </component>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  disabled?: boolean
  as?: string
}>(), { as: 'span' })

const tooltipId = `tooltip-${useId()}`
const trigger = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const hovered = ref(false)
const focused = ref(false)
const visible = computed(() => !props.disabled && (hovered.value || focused.value))
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

watch([visible, () => props.text], async () => {
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
