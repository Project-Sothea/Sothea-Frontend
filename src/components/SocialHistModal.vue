<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Social History</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">History</div>
          <div class="font-medium text-md pr-5">Yes</div>
          <div class="font-medium text-md">No</div>
          <div class="font-medium text-md w-1/3 pl-10">Remarks</div>
        </div>
      </div>

      <!-- Past Smoking History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">Past Smoking History</div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input type="radio" name="smoking-hist" class="w-4 h-4" v-model="pastSmokingHistory" :value="true"
                  :disabled="!isEditing" />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input type="radio" name="smoking-hist" class="w-4 h-4" v-model="pastSmokingHistory" :value="false"
                  :disabled="!isEditing" />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea rows="1" placeholder="If Y, no. of years" type="number" v-model="numberOfYears"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"></textarea>
          </div>
        </div>
      </div>

      <!-- Current Smoking History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Current Smoking History
          </div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input type="radio" name="curr-smoking-hist" class="w-4 h-4" v-model="currentSmokingHistory"
                  :value="true" :disabled="!isEditing" />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input type="radio" name="curr-smoking-hist" class="w-4 h-4" v-model="currentSmokingHistory"
                  :value="false" :disabled="!isEditing" />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea rows="1" placeholder="If Y, how many cigarettes/day?" type="number" v-model="cigarettesPerDay"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"></textarea>
          </div>
        </div>
      </div>

      <!-- Alcohol History -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">Alcohol History</div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input type="radio" name="alc-hist" class="w-4 h-4" v-model="alcoholHistory" :value="true"
                  :disabled="!isEditing" />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input type="radio" name="alc-hist" class="w-4 h-4" v-model="alcoholHistory" :value="false"
                  :disabled="!isEditing" />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea rows="1" placeholder="If Y, how regularly?" v-model="howRegular"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"></textarea>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button v-if="!isEditing && !isAdd" @click="toggleEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none">
          Edit
        </button>
      </div>

      <!-- Save Edits Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button v-if="isEditing && !isAdd" @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none">
          Save Edits
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import type SocialHistory from '@/types/SocialHistory'
import { BaseURL } from '@/main'

export default defineComponent({
  props: {
    patientId: {
      type: String,
      default: null
    },
    patientData: {
      type: Object as PropType<Patient>,
      default: null
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    patientVid: {
      type: String,
      default: null
    }
  },
  watch: {
    patientData: function (newVal: Patient, oldVal: Patient) {
      // watch it
      if (!this.isAdd) {
        const socialHistory = this.patientData.socialhistory
        if (!socialHistory) {
          this.pastSmokingHistory = null
          this.numberOfYears = null
          this.currentSmokingHistory = null
          this.cigarettesPerDay = null
          this.alcoholHistory = null
          this.howRegular = null
        } else {
          this.pastSmokingHistory = socialHistory.pastSmokingHistory
          this.numberOfYears = socialHistory.numberOfYears
          this.currentSmokingHistory = socialHistory.currentSmokingHistory
          this.cigarettesPerDay = socialHistory.cigarettesPerDay
          this.alcoholHistory = socialHistory.alcoholHistory
          this.howRegular = socialHistory.howRegular
        }
      }
    },
  },
  data() {
    return {
      pastSmokingHistory: null as boolean | null,
      numberOfYears: null as number | null,
      currentSmokingHistory: null as boolean | null,
      cigarettesPerDay: null as number | null,
      alcoholHistory: null as boolean | null,
      howRegular: '' as string | null,
      isEditing: false
    }
  },
  created() {
    if (!this.isAdd) {
      const socialHistory = this.patientData.socialhistory
      if (!socialHistory) return
      this.pastSmokingHistory = socialHistory.pastSmokingHistory
      this.numberOfYears = socialHistory.numberOfYears
      this.currentSmokingHistory = socialHistory.currentSmokingHistory
      this.cigarettesPerDay = socialHistory.cigarettesPerDay
      this.alcoholHistory = socialHistory.alcoholHistory
      this.howRegular = socialHistory.howRegular
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        if (this.pastSmokingHistory === null) {
          toast.error('Please indicate past smoking history')
          return
        }
        if (this.currentSmokingHistory === null) {
          toast.error('Please indicate current smoking history')
          return
        }
        if (this.alcoholHistory === null) {
          toast.error('Please indicate alcohol history')
          return
        }
        const socialHistory: SocialHistory = {
          // need to define outside to catch missing fields
          pastSmokingHistory: this.pastSmokingHistory,
          numberOfYears: this.numberOfYears,
          currentSmokingHistory: this.currentSmokingHistory,
          cigarettesPerDay: this.cigarettesPerDay,
          alcoholHistory: this.alcoholHistory,
          howRegular: this.howRegular
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}/${this.patientVid}`, {
            socialHistory: socialHistory
          })
          .then((response) => {
            console.log(response)
            console.log('Social history posted successfully!')
            if (this.isEditing) {
              this.toggleEdit() // to switch back to read-only mode
            }
            toast.success('Social history saved successfully!')
          })
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
          // No response received at all
          console.log(error)
          toast.error('An internal server error occurred.')
        }
      }
    },
    toggleEdit() {
      console.log('toggleEdit')
      this.isEditing = !this.isEditing
      console.log(this.isEditing)
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
