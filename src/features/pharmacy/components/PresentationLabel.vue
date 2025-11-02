<template>
  <div class="leading-tight">
    <div class="text-gray-900 font-medium">
        <router-link
        :to="`/pharmacy/presentations/${pres.id}`"
        class="text-blue-600 hover:underline"
        >
            {{ title }}
        </router-link>
    </div>
    <div class="text-gray-700 text-sm">{{ subtitle }}</div>
    <div v-if="meta" class="text-gray-500 text-xs">{{ meta }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Drug, DrugPresentationView } from '@/features/pharmacy/types/Drug'
import { computed } from 'vue';
import { fmtDispenseUnit, fmtStrengthWithRoute } from '../types/Util';

const props = defineProps<{
  drug: Drug | null,
  pres: DrugPresentationView
}>()

const title = computed(() => {
  if (!props.drug) {
    return props.pres.displayLabel
  }
  const brand = props.drug?.brandName ? ` (${props.drug.brandName})` : ''
  return `${props.drug?.genericName}${brand}`
})

const subtitle = computed(() => fmtStrengthWithRoute(props.pres))

const meta = computed(() => fmtDispenseUnit(props.pres))
</script>
