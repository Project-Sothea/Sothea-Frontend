<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const router = useRouter()
const toast = useToast()

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      router.push('/signin')
      toast.error("Timed out, please log in again.")
    }
    return Promise.reject(error);  // Propagate the error
  },
);

onMounted(() => {
  router.push('/signin')
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
