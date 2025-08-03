<template>
  <NavBar />
  <CreateBatchForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar              from '@/components/NavBar.vue'
import CreateBatchForm     from '@/components/pharmacy/CreateBatchForm.vue'

export default defineComponent({ components: { NavBar, CreateBatchForm } })
</script>
