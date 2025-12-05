<template>
  <div class="leading-tight">
    <div class="text-gray-900 font-medium">
        <router-link
        :to="`/pharmacy/drugs/${drug.id}`"
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
import type { DrugView } from '@/features/pharmacy/types/Drug'
import { computed } from 'vue';
import { fmtDispenseUnit, fmtStrengthWithRoute, fmtDrugNameWithBrand } from '../types/Util';

const props = defineProps<{
  drug: DrugView
}>()

const title = computed(() => fmtDrugNameWithBrand(props.drug))

const subtitle = computed(() => fmtStrengthWithRoute(props.drug))

const meta = computed(() => fmtDispenseUnit(props.drug))
</script>
