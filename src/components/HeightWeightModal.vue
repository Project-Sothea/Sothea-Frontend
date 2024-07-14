<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Height & Weight</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- Height -->
          <div class="w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Height (cm) </label>
            <input
              v-model="height"
              type="number"
              step="1"
              placeholder="cm"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>

          <!-- Weight -->
          <div class="ml-3 w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Weight (kg) </label>
            <input
              v-model="weight"
              type="number"
              step="0.1"
              placeholder="kg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-row mb-2">
          <!-- Paeds: Height % -->
          <div class="w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Paeds: Height % </label>
            <input
              v-model="paedsHeight"
              type="number"
              placeholder=""
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>

          <!-- Paeds: Weight % -->
          <div class="ml-3 w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Paeds: Weight % </label>
            <input
              v-model="paedsWeight"
              type="number"
              placeholder=""
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
            />
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-row mb-2">
          <!-- BMI -->
          <div class="w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> BMI </label>
            <input
              :value="bmi"
              disabled
              type="number"
              step="0.1"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-row mb-2">
          <!-- BMI Analysis-->
          <div class="w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> BMI Analysis </label>
            <input
              :value="bmianalysis"
              disabled
              type="text"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import type HeightAndWeight from '@/types/HeightAndWeight'
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
  data() {
    return {
      height: null as number | null,
      weight: null as number | null,
      paedsHeight: null as number | null,
      paedsWeight: null as number | null,
      isEditing: false
    }
  },
  created() {
    if (!this.isAdd) {
      const heightAndWeight = this.patientData.heightandweight
      if (!heightAndWeight) return
      this.height = heightAndWeight.height
      this.weight = heightAndWeight.weight
      this.paedsHeight = heightAndWeight.paedsHeight
      this.paedsWeight = heightAndWeight.paedsWeight
    }
  },
  computed: {
    bmi() {
      if (this.height && this.weight) {
        const heightInMeters = this.height / 100
        return this.weight / (heightInMeters * heightInMeters)
      }
      return null
    },
    bmianalysis() {
      if (this.bmi) {
        const bmiValue = this.bmi
        if (bmiValue < 18.5) {
          return 'Underweight'
        } else if (bmiValue < 25) {
          return 'Normal'
        } else if (bmiValue < 30) {
          return 'Overweight'
        } else {
          return 'Obese'
        }
      }
      return null
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        if (this.height === null) {
          toast.error('Please enter height')
          return
        }
        if (this.weight === null) {
          toast.error('Please enter weight')
          return
        } else if (this.weight < 0) {
          toast.error('Weight cannot be negative')
          return
        }
        if (this.paedsHeight === null) {
          toast.error('Please enter Paeds: Height %')
          return
        } else if (this.paedsHeight < 0) {
          toast.error('Paeds: Height % cannot be negative')
          return
        }
        if (this.paedsWeight === null) {
          toast.error('Please enter Paeds: Weight %')
          return
        } else if (this.paedsWeight < 0) {
          toast.error('Paeds: Weight % cannot be negative')
          return
        }
        if (this.bmi === null) {
          toast.error('Please enter height and weight to calculate BMI')
          return
        }
        if (this.bmianalysis === null) {
          toast.error('Please enter height and weight to calculate BMI Analysis')
          return
        }
        const heightAndWeight: HeightAndWeight = {
          // need to define outside to catch missing fields
          height: this.height,
          weight: this.weight,
          bmi: this.bmi,
          bmiAnalysis: this.bmianalysis,
          paedsHeight: this.paedsHeight,
          paedsWeight: this.paedsWeight
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}`, {
            heightAndWeight: heightAndWeight
          })
          .then((response) => {
            console.log(response.data)
            console.log('Height and Weight is posted successfully!')
            if (this.isEditing) {
              this.toggleEdit() // to switch back to read-only mode
            }
            toast.success('Height and Weight saved successfully!')
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
    },
    preventNegative(event: any) {
      if (event.key === '-' || event.key === 'e') {
        event.preventDefault()
      }
    }
  }
})
</script>

<style>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
