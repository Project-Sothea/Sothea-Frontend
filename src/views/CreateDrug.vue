<template>
  <NavBar />
  <CreateDrugForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar           from '@/components/NavBar.vue'
import CreateDrugForm   from '@/components/pharmacy/CreateDrugForm.vue'

export default defineComponent({ components: { NavBar, CreateDrugForm } })
</script>
