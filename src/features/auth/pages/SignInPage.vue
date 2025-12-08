<template>
  <header class="bar">Project Sothea</header>
  <div class="center-div">
    <div class="form-container">
      <form @submit.prevent="handleSignIn">
        <h1>SIGN IN</h1>
        <br />
        <!-- Profile Selection -->
        <h2>Select Profile:</h2>
        <div class="flex relative">
          <!-- Profile Icon -->
          <span class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#9ca3af"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </span>
          <select v-model="selectedProfile" class="input-style" required>
            <option value="" disabled>Select a profile...</option>
            <option v-for="profile in profiles" :key="profile.username" :value="profile.username">
              {{ profile.name }}
            </option>
          </select>
        </div>
        <br />

        <!-- Sign In Button -->
        <div class="flex w-full">
          <button type="submit" class="signin-button" :disabled="!selectedProfile">LOG IN</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { loginRequest } from '@features/auth/api/auth'
import { useAuth } from '@features/auth/composables/useAuth'
import { profiles } from '../types/Profiles'

// Composables
const toast = useToast()
const router = useRouter()
const { login } = useAuth()

// Reactive State
const selectedProfile = ref('')

// Handlers
async function handleSignIn() {
  if (!selectedProfile.value) {
    toast.error('Please select a profile')
    return
  }
  try {
    const { token } = await loginRequest(selectedProfile.value, '')
    login(token)
    await router.push('/patient-directory')
  } catch (error) {
    console.error(error)
    toast.error('Sign in failed')
  }
}
</script>

<style scoped>
.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
  margin: 0 auto;
}

.bar {
  background-color: #3f51b5;
  width: 100%;
  color: white;
  font-weight: 500;
  padding: 1rem 1rem 1rem 1.5rem;
}

.form-container {
  width: 30%;
  margin: 0 auto;
}

.signin-button {
  background-color: #3f51b5;
  color: white;
  width: 100%;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.signin-button:hover {
  background-color: #303f9f;
}

.icon-container {
  border-top: 1px solid #d1d5db;
  border-left: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0.5rem 0 0 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  display: inline-flex;
  align-items: center;
  background-color: #e5e7eb;
}

.input-style {
  border-top: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
  width: 100%;
  padding: 0.5rem;
  background-color: #e5e7eb;
  font-size: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  flex: 1;
  cursor: pointer;
}

.input-style:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

h2 {
  font-size: 1rem;
  font-weight: 600;
  color: black;
}
</style>
