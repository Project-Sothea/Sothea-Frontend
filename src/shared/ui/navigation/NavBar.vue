<template>
  <nav class="bg-[#3F51B5]">
    <div class="px-4 sm:px-6 mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex min-w-0 items-center">
          <h1 class="min-w-0 py-4"><span class="hidden sm:inline">Project </span>Sothea</h1>
          <div class="flex min-w-0 items-baseline ml-2 sm:ml-10">
            <router-link
              class="min-w-0 break-words text-white hover:text-gray-300 px-1 sm:px-3 py-4 text-base font-medium"
              active-class="active"
              to="/patient-queue"
            >
              <span class="hidden sm:inline">Patient </span>Queue
            </router-link>
            <router-link
              class="min-w-0 break-words text-white hover:text-gray-300 px-1 sm:px-3 py-4 text-base font-medium"
              active-class="active"
              to="/patient-directory"
            >
              <span class="hidden sm:inline">Patient </span>Directory
            </router-link>
            <router-link
              class="min-w-0 break-words text-white hover:text-gray-300 px-1 sm:px-3 py-4 text-base font-medium"
              active-class="active"
              to="/patient/new"
            >
              Add<span class="hidden sm:inline"> Patient</span>
            </router-link>
            <!-- <router-link
              class="text-white hover:text-gray-300 px-3 py-4 text-base font-medium"
              active-class="active"
              to="/pharmacy"
            >
              Pharmacy
            </router-link> -->
          </div>
        </div>

        <div class="flex shrink-0 items-center ml-auto pl-1 sm:pl-4 md:pl-6">
          <button
            type="button"
            class="relative text-left flex items-center justify-center gap-1 rounded-md px-1 sm:px-4 py-2 text-base font-medium hover:text-gray-300 text-white"
            id="options-menu"
            @click="logout"
          >
            <label>Logout</label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@features/auth/composables/useAuth'

const router = useRouter()
const { logout: authLogout } = useAuth()

function logout() {
  authLogout()
  router.push('/sign-in')
}
</script>

<style scoped>
h1 {
  color: white;
  font-weight: 500;
  font-size: medium;
}

h2 {
  color: white;
  padding: 0.25rem;
}
</style>
