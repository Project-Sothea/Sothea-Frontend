<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Past Medical history</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Condition:</div>
          <div class="font-medium text-md w-1/6">Yes</div>
          <div class="font-medium text-md w-1/6">No</div>
        </div>
      </div>

      <!-- Patient fallen in the past year? -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Patient fallen in the past year?</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="pastYearFall" class="w-4 h-4" v-model="pastYearFall" :value="true"
                :disabled="!isEditing" />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="pastYearFall" class="w-4 h-4" v-model="pastYearFall" :value="false"
                :disabled="!isEditing" />
            </label>
          </div>
        </div>
      </div>

      <!-- Feels unsteady when standing / walking -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Feels unsteady when standing / walking?</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="unsteadyStandingFalling" class="w-4 h-4" v-model="unsteadyStandingFalling" :value="true"
                :disabled="!isEditing" />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="unsteadyStandingFalling" class="w-4 h-4" v-model="unsteadyStandingFalling" :value="false"
                :disabled="!isEditing" />
            </label>
          </div>
        </div>
      </div>

      <!-- Worries about falling -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Worries about falling?</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="fallWorries" class="w-4 h-4" v-model="fallWorries" :value="true"
                :disabled="!isEditing" />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="fallWorries" class="w-4 h-4" v-model="fallWorries" :value="false"
                :disabled="!isEditing" />
            </label>
          </div>
        </div>
      </div>

      <!-- Others -->
      <div class="mt-2">
        <label>
          <label for="" class="mb-2 block text-sm font-normal text-dark">Others: </label>
          <textarea rows="2" placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            v-model="others" :disabled="!isEditing"></textarea>
        </label>
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

import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import { BaseURL } from '@/main'
import type FallRisk from '@/types/FallRisk'

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
        const fallRisk = this.patientData.fallrisk
        if (!fallRisk) {
          this.pastYearFall = null
          this.unsteadyStandingFalling = null
          this.fallWorries = null
          this.others = null
          this.furtherReferral = null
        } else {
          this.pastYearFall = fallRisk.pastYearFall
          this.unsteadyStandingFalling = fallRisk.unsteadyStandingFalling
          this.fallWorries = fallRisk.fallWorries
          this.others = fallRisk.others
          this.furtherReferral = fallRisk.furtherReferral
        }
      }
    },
  },
  created() {
    if (!this.isAdd) {
      const fallRisk = this.patientData.fallrisk
      if (!fallRisk) return
      this.pastYearFall = fallRisk.pastYearFall
      this.unsteadyStandingFalling = fallRisk.unsteadyStandingFalling
      this.fallWorries = fallRisk.fallWorries
      this.others = fallRisk.others
      this.furtherReferral = fallRisk.furtherReferral
    }
  },
  data() {
    return {
      pastYearFall: null as boolean | null,
      unsteadyStandingFalling: null as boolean | null,
      fallWorries: null as boolean | null,
      others: '' as string | null,
      furtherReferral: null as boolean | null,
      isEditing: false
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        if (
          this.pastYearFall === null ||
          this.unsteadyStandingFalling === null ||
          this.fallWorries === null ||
          this.furtherReferral === null
        ) {
          toast.error('Please select yes/no for all fields')
          return
        }
        const fallRisk : FallRisk = {
          // need to define outside to catch missing fields
          pastYearFall: this.pastYearFall,
          unsteadyStandingFalling: this.unsteadyStandingFalling,
          fallWorries: this.fallWorries,
          others: this.others,
          furtherReferral: this.furtherReferral
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}/${this.patientVid}`, {
            fallRisk: fallRisk 
          })
          .then((response) => {
            console.log(response)
            console.log('Fall Risk posted successfully!')
            this.toggleEdit() // to switch back to read-only mode
            toast.success('Fall Risk saved successfully!')
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
