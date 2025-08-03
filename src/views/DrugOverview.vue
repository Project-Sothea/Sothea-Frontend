<template>
  <NavBar />
  <DrugOverviewDisplay />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import DrugOverviewDisplay from '@/components/pharmacy/DrugOverviewDisplay.vue'

export default defineComponent({
  components: {
    NavBar,
    DrugOverviewDisplay
  }
})
</script>
