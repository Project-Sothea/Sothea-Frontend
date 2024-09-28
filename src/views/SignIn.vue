<template>
  <div class="bar">Project Sothea</div>
  <div class="center-div">
    <div class="form-container">
      <form @submit.prevent="getToken">
        <h1>SIGN IN</h1>
        <br />
        <!-- Username Input -->
        <h2>Username:</h2>
        <div class="flex relative">
          <!-- Profile Icon -->
          <span class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af"
              class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </span>
          <input type="text" v-model="username" class="input-style" placeholder="Enter username" />
        </div>

        <!-- Password Input -->
        <h2>Password:</h2>
        <div class="flex relative">
          <!-- Lock Icon -->
          <span class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af"
              class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </span>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" class="input-style"
            placeholder="Enter password" />
          <button type="button" @click="togglePasswordVisibility" class="absolute right-0 inset-y-0 px-3">
            <!-- Eye Icon -->
            <div v-if="showPassword">
              <img src="../assets/eye.svg" alt="Eye Icon" class="w-5 h-5" />
            </div>

            <!-- Slash Icon -->
            <div v-else>
              <img src="../assets/eyeslash.svg" alt="Eye Slash Icon" class="w-5 h-5" />
            </div>
          </button>
        </div>
        <br />

        <!-- Sign In Button -->
        <div class="flex w-full">
          <button type="submit" class="signin-button">SIGN IN</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { defineComponent } from 'vue'
import { BaseURL } from '@/main'

export default defineComponent({
  name: 'SignIn',
  data() {
    return {
      username: '',
      password: '',
      token: '' as string,
      showPassword: false
    }
  },
  methods: {
    async getToken(event: Event) {
      const toast = useToast()
      event.preventDefault()
      console.log('getToken method called')

      try {
        const response = await axios.post(`${BaseURL}/login`, {
          username: this.username,
          password: this.password,
        });
        // Save the token and set it in axios headers
        this.token = response.data.token;
        console.log(this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Redirect after successful login
        this.$router.push('/allpatients');
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError; // Safe casting
          if (axiosError.response) {
            // The request was made and server responded with a status code out of range 2xx
            console.log(axiosError.response.data)
            toast.error(axiosError.message)
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request)
            toast.error('No server response received, check your connection.')
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', axiosError.message);
            toast.error('An internal server error occurred.')
          }
        } else {
          console.log(error)
          toast.error('An internal server error occurred.')
        }
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  }
})
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

.form-div {
  justify-content: flex-start;
}

.bar {
  background-color: #3f51b5;
  padding: 1rem;
  width: 100%;
  color: white;
  font-weight: 500;
  padding-left: 1.5rem;
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
