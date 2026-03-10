<!-- components/Dialog.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 bg-black/40" @click="handleBackdrop"></div>
      <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl" @click.stop>
        <div class="px-5 py-4 border-b">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
        </div>
        <div class="px-5 py-4 text-sm text-gray-700">
          <slot>{{ message }}</slot>
        </div>
        <div class="px-5 py-4 border-t flex justify-end gap-2">
          <button class="px-4 py-2 rounded border" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
          <button
            class="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    title: 'Are you sure?',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    closeOnBackdrop: false,
    closeOnEsc: false
  }
)
const emit = defineEmits<{ confirm: []; cancel: [] }>()
function handleBackdrop() {
  if (props.closeOnBackdrop) emit('cancel')
}
</script>
