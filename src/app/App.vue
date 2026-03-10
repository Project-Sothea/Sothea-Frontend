<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuth } from '@features/auth/composables/useAuth'

const { initializeAuth } = useAuth()

onMounted(() => initializeAuth())
</script>

<template>
  <router-view />
</template>

<style scoped></style>
