<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        aria-modal="true"
        role="dialog"
        @keydown.esc.prevent="emitClose"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="emitClose"></div>

        <!-- dialog -->
        <div
          class="relative w-[96%] max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-black/10 outline-none"
          tabindex="0"
          ref="dialogEl"
        >
          <div class="flex items-center justify-between border-b px-5 py-3">
            <h3 class="text-lg font-semibold">Batch {{ batch?.batchNumber ?? '—' }} — Locations</h3>
            <button class="p-2 rounded hover:bg-gray-100" aria-label="Close" @click="emitClose">
              <!-- X icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12 10.586l4.95-4.95l1.414 1.414L13.414 12l4.95 4.95l-1.414 1.414L12 13.414l-4.95 4.95l-1.414-1.414L10.586 12l-4.95-4.95l1.414-1.414z"
                />
              </svg>
            </button>
          </div>

          <div class="px-5 py-4">
            <div v-if="(batch?.batchLocations?.length ?? 0) === 0" class="text-gray-600">
              No locations recorded.
            </div>

            <table v-else class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-gray-600 border-b">
                  <th class="py-2 pr-4">Location</th>
                  <th class="py-2 pr-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(loc, i) in batch!.batchLocations"
                  :key="i"
                  class="border-b last:border-0"
                >
                  <td class="py-2 pr-4">{{ loc.location }}</td>
                  <td class="py-2 pr-4">{{ loc.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-end gap-2 border-t px-5 py-3">
            <button
              class="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 transition"
              @click="emitClose"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import type { BatchDetail } from '@/features/pharmacy/types/Batch'

// ─── Props & Emits ────────────────────────
const props = defineProps<{
  open: boolean
  batch: BatchDetail | null
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'close'): void
}>()

const emitClose = () => {
  emit('update:open', false)
  emit('close')
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) emitClose()
}

const dialogEl = ref<HTMLElement | null>(null)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      dialogEl.value?.focus()
      window.addEventListener('keydown', onKey)
    } else {
      window.removeEventListener('keydown', onKey)
    }
  },
  { immediate: true }
)

// ─── Init ────────────────────────
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped></style>
