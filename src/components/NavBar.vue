<template>
  <nav class="bg-[#3F51B5]">
    <div class="pl-6 mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="py-4">Project Sothea</h1>
          <div class="flex items-baseline ml-10">
            <router-link
              class="text-white hover:text-gray-300 px-3 py-4 text-base font-medium"
              active-class="active"
              to="/allpatients"
            >
              All Patients
            </router-link>
            <router-link
              class="text-white hover:text-gray-300 px-3 py-4 text-base font-medium"
              active-class="active"
              to="/addpatient"
            >
              Add Patient
            </router-link>
          </div>
        </div>

        <div class="flex items-center ml-4 md:ml-6">
          <button
            type="button"
            class="relative ml-3 text-left flex items-center justify-center w-full rounded-md px-4 py-2 text-base font-medium hover:text-gray-300 text-white"
            id="options-menu"
            @click="logout"
          >
            <h2 class="hover:text-gray-300">Logout</h2>
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  methods: {
    logout() {
      this.$router.push('/signin')
    }
  }
})
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

.active {
  background-color: white;
  color: #3f51b5;
  border: 0;
}
</style>
