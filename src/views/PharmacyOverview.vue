<template>
  <NavBar />
  <PharmacyTableModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar                from '@/components/NavBar.vue'
import PharmacyTableModal    from '@/components/pharmacy/PharmacyTableModal.vue'

export default defineComponent({
  components: {
    NavBar,
    PharmacyTableModal
  }
})
</script>
