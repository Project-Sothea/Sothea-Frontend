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

      <!-- Tuberculosis -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Tuberculosis</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosis"
                class="w-4 h-4"
                v-model="tuberculosis"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="tuberculosis"
                class="w-4 h-4"
                v-model="tuberculosis"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Diabetes -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Diabetes</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="diabetes"
                class="w-4 h-4"
                v-model="diabetes"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="diabetes"
                class="w-4 h-4"
                v-model="diabetes"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hypertension -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hypertension</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hypertension"
                class="w-4 h-4"
                v-model="hypertension"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hypertension"
                class="w-4 h-4"
                v-model="hypertension"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Hyperlipidemia -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Hyperlipidemia</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hyperlipidemia"
                class="w-4 h-4"
                v-model="hyperlipidemia"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="hyperlipidemia"
                class="w-4 h-4"
                v-model="hyperlipidemia"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Chronic Joint Pains -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Chronic Joint Pains</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-joint-pains"
                class="w-4 h-4"
                v-model="chronicJointPains"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-joint-pains"
                class="w-4 h-4"
                v-model="chronicJointPains"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Chronic Muscle Aches -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Chronic Muscle Aches</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-muscle-aches"
                class="w-4 h-4"
                v-model="chronicMuscleAches"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="chronic-muscle-aches"
                class="w-4 h-4"
                v-model="chronicMuscleAches"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- STD -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Sexually Transmitted Disease</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="std" class="w-4 h-4" v-model="sexuallyTransmittedDisease" :value="true"
                :disabled="!isEditing" 
                @click="yStd=true"/>
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input type="radio" name="std" class="w-4 h-4" v-model="sexuallyTransmittedDisease" :value="false"
                :disabled="!isEditing" 
                @click="yStd=false"/>
            </label>
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div class="mt-4">
        <label>
          <label for="" class="mb-2 block text-sm font-normal text-dark"
            >If Y to STD, specify:
          </label>
          <textarea rows="2" placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            v-model="specifiedSTDs" :disabled="!isEditing || !yStd" :required="yStd"></textarea>
        </label>
      </div>

      <!-- Others -->
      <div class="mt-2">
        <label>
          <label for="" class="mb-2 block text-sm font-normal text-dark">Others: </label>
          <textarea
            rows="2"
            placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            v-model="others"
            :disabled="!isEditing"
          ></textarea>
        </label>
      </div>

      <!-- Edit Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="!isEditing && !isAdd"
          @click="toggleEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Edit
        </button>
      </div>

      <!-- Save Edits Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isEditing && !isAdd"
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save Edits
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

import axios, { type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import type PastMedicalHistory from '@/types/PastMedicalHistory'
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
    }
  },
  created() {
    if (!this.isAdd) {
      console.log('past medical history is: ' + this.patientData.pastmedicalhistory)
      const pastMedHist = this.patientData.pastmedicalhistory
      if (!pastMedHist) return
      this.tuberculosis = pastMedHist.tuberculosis
      this.diabetes = pastMedHist.diabetes
      this.hypertension = pastMedHist.hypertension
      this.hyperlipidemia = pastMedHist.hyperlipidemia
      this.chronicJointPains = pastMedHist.chronicJointPains
      this.chronicMuscleAches = pastMedHist.chronicMuscleAches
      this.sexuallyTransmittedDisease = pastMedHist.sexuallyTransmittedDisease
      this.specifiedSTDs = pastMedHist.specifiedSTDs
      this.others = pastMedHist.others
      this.yStd = this.sexuallyTransmittedDisease
    }
  },
  data() {
    return {
      tuberculosis: null as boolean | null,
      diabetes: null as boolean | null,
      hypertension: null as boolean | null,
      hyperlipidemia: null as boolean | null,
      chronicJointPains: null as boolean | null,
      chronicMuscleAches: null as boolean | null,
      sexuallyTransmittedDisease: null as boolean | null,
      specifiedSTDs: '' as string | null,
      others: '' as string | null,
      isEditing: false,
      yStd: false
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        if (
          this.tuberculosis === null ||
          this.diabetes === null ||
          this.hypertension === null ||
          this.hyperlipidemia === null ||
          this.chronicJointPains === null ||
          this.chronicMuscleAches === null ||
          this.sexuallyTransmittedDisease === null
        ) {
          toast.error('Please select yes/no for all fields')
          return
        }
        if (this.yStd && !this.specifiedSTDs) {
          toast.error('Please specify the sexually transmitted disease')
          return
        }
        if (!this.yStd) { // clear specifiedSTDs if STD is no
          this.specifiedSTDs = ''
        }
        const pastMedicalHistory: PastMedicalHistory = { // need to define outside to catch missing fields
          tuberculosis: this.tuberculosis,
          diabetes: this.diabetes,
          hypertension: this.hypertension,
          hyperlipidemia: this.hyperlipidemia,
          chronicJointPains: this.chronicJointPains,
          chronicMuscleAches: this.chronicMuscleAches,
          sexuallyTransmittedDisease: this.sexuallyTransmittedDisease,
          specifiedSTDs: this.specifiedSTDs,
          others: this.others
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}`, {
            pastMedicalHistory: pastMedicalHistory
          })
          .then((response) => {
            console.log(response)
            console.log('Past medical history posted successfully!')
            this.toggleEdit() // to switch back to read-only mode
            toast.success('Past medical history saved successfully!')
          })
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.response)
          if (error.response) {
            toast.error(error.response.data.error)
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
