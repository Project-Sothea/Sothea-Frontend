<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const toast = useToast()
const { logout, initializeAuth } = useAuth()

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      logout() // Clear token if unauthorized

      if (router.currentRoute.value.path !== '/signin') {
        // Redirect to login page if not already there
        router.push('/signin')
        toast.error('Timed out, please log in again.')
      }
    }
    return Promise.reject(error) // Propagate the error
  }
)

onMounted(() => {
  // Restore session on mount
  initializeAuth()
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
