<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Vital Statistics</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- Temperature -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Temperature </label>
            <input
              v-model="temperature"
              type="number"
              step="0.01"
              placeholder="Degree Celsius"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="temperature"
              @input="removeHighlight('temperature')"
            />
          </div>

          <!-- SpO2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> SpO2 </label>
            <input
              v-model="spO2"
              type="number"
              step="0.01"
              placeholder="%"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="spO2"
              @input="removeHighlight('spO2')"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-row mb-2">
          <!-- Systolic BP1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Systolic BP1 </label>
            <input
              v-model="systolicBP1"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="systolicBP1"
              @input="removeHighlight('systolicBP1')"
            />
          </div>
          <!-- Systolic BP2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Systolic BP2 </label>
            <input
              v-model="systolicBP2"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="systolicBP2"
              @input="removeHighlight('systolicBP2')"
            />
          </div>

          <!-- Avg Systolic BP -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Avg Systolic BP </label>
            <input
              :value="avgSystolicBP"
              disabled
              type="number"
              step="0.01"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              ref="avgSystolicBP"
              @input="removeHighlight('avgSystolicBP')"
            />
          </div>
        </div>

        <!-- Row 3 -->
        <div class="flex flex-row mb-2">
          <!-- Diastolic BP1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Diastolic BP1 </label>
            <input
              v-model="diastolicBP1"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="diastolicBP1"
              @input="removeHighlight('diastolicBP1')"
            />
          </div>
          <!-- Diastolic BP2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Diastolic BP2 </label>
            <input
              v-model="diastolicBP2"
              type="number"
              step="0.01"
              placeholder="mmHg"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="diastolicBP2"
              @input="removeHighlight('diastolicBP2')"
            />
          </div>

          <!-- Avg Diastolic BP -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Avg Diastolic BP
            </label>
            <input
              :value="avgDiastolicBP"
              disabled
              type="number"
              step="0.01"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              ref="avgDiastolicBP"
              @input="removeHighlight('avgDiastolicBP')"
            />
          </div>
        </div>

        <!-- Row 4 -->
        <div class="flex flex-row mb-2">
          <!-- HR1 -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> HR1 </label>
            <input
              v-model="hr1"
              type="number"
              step="1"
              placeholder="BPM"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="hr1"
              @input="removeHighlight('hr1')"
            />
          </div>
          <!-- HR2 -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> HR2 </label>
            <input
              v-model="hr2"
              type="number"
              step="1"
              placeholder="BPM"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="hr2"
              @input="removeHighlight('hr2')"
            />
          </div>

          <!-- Avg HR -->
          <div class="ml-3 w-1/3">
            <label for="" class="mb-1 block text-sm font-medium text-dark"> Avg HR </label>
            <input
              :value="avgHR"
              disabled
              type="number"
              step="1"
              placeholder=""
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              ref="avgHR"
              @input="removeHighlight('avgHR')"
            />
          </div>
        </div>

        <!-- Row 5 -->
        <div class="flex flex-row mb-2">
          <!-- Random Blood Glucose (mmol/L) -->
          <div class="w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Random Blood Glucose (mmol/L)
            </label>
            <input
              v-model="randomBloodGlucoseMmolL"
              type="number"
              step="0.01"
              placeholder="mmol/L"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="randomBloodGlucoseMmolL"
              @input="removeHighlight('randomBloodGlucoseMmolL')"
            />
          </div>

          <!-- Random Blood Glucose (mg/dL) -->
          <div class="ml-3 w-1/4">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              Random Blood Glucose (mg/dL)
            </label>
            <input
              v-model="randomBloodGlucoseMmolLp"
              type="number"
              step="0.01"
              placeholder="mg/dL"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              @keydown="preventNegative"
              min="0"
              ref="randomBloodGlucoseMmolLp"
              @input="removeHighlight('randomBloodGlucoseMmolLp')"
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
import type VitalStatistics from '@/types/VitalStatistics'
import type Patient from '@/types/Patient'
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
  data() {
    return {
      temperature: null as number | null,
      spO2: null as number | null,
      systolicBP1: null as number | null,
      systolicBP2: null as number | null,
      diastolicBP1: null as number | null,
      diastolicBP2: null as number | null,
      averageSystolicBP: null as number | null,
      averageDiastolicBP: null as number | null,
      hr1: null as number | null,
      hr2: null as number | null,
      averageHR: null as number | null,
      randomBloodGlucoseMmolL: null as number | null,
      randomBloodGlucoseMmolLp: null as number | null,
      isEditing: false
    }
  },
  computed: {
    avgSystolicBP() {
      if (this.systolicBP1 && this.systolicBP2) {
        return (Number(this.systolicBP1) + Number(this.systolicBP2)) / 2
      }
      return null
    },
    avgDiastolicBP() {
      if (this.diastolicBP1 && this.diastolicBP2) {
        return (Number(this.diastolicBP1) + Number(this.diastolicBP2)) / 2
      }
      return null
    },
    avgHR() {
      if (this.hr1 && this.hr2) {
        return (Number(this.hr1) + Number(this.hr2)) / 2
      }
      return null
    }
  },
  created() {
    if (!this.isAdd) {
      const vitalStatistics = this.patientData.vitalstatistics
      if (!vitalStatistics) return
      this.temperature = vitalStatistics.temperature
      this.spO2 = vitalStatistics.spO2
      this.systolicBP1 = vitalStatistics.systolicBP1
      this.systolicBP2 = vitalStatistics.systolicBP2
      this.diastolicBP1 = vitalStatistics.diastolicBP1
      this.diastolicBP2 = vitalStatistics.diastolicBP2
      this.hr1 = vitalStatistics.hr1
      this.hr2 = vitalStatistics.hr2
      this.randomBloodGlucoseMmolL = vitalStatistics.randomBloodGlucoseMmolL
      this.randomBloodGlucoseMmolLp = vitalStatistics.randomBloodGlucoseMmolLp
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        let hasError = false
        // Check for missing fields
        if (this.temperature === null) {
          ;(this.$refs.temperature as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.spO2 === null) {
          ;(this.$refs.spO2 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.systolicBP1 === null) {
          ;(this.$refs.systolicBP1 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.systolicBP2 === null) {
          ;(this.$refs.systolicBP2 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.diastolicBP1 === null) {
          ;(this.$refs.diastolicBP1 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.diastolicBP2 === null) {
          ;(this.$refs.diastolicBP2 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.hr1 === null) {
          ;(this.$refs.hr1 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.hr2 === null) {
          ;(this.$refs.hr2 as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.randomBloodGlucoseMmolL === null) {
          ;(this.$refs.randomBloodGlucoseMmolL as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.randomBloodGlucoseMmolLp === null) {
          ;(this.$refs.randomBloodGlucoseMmolLp as HTMLElement).classList.add('input-error')
          hasError = true
        }

        // If any field is missing, display error message and return
        if (hasError) {
          toast.error('Please fill out the highlighted fields')
          return
        }

        const vitalStatistics: VitalStatistics = {
          // need to define outside to catch missing fields
          temperature: this.temperature,
          spO2: this.spO2,
          systolicBP1: this.systolicBP1,
          systolicBP2: this.systolicBP2,
          diastolicBP1: this.diastolicBP1,
          diastolicBP2: this.diastolicBP2,
          averageSystolicBP: this.avgSystolicBP, // pre-computed value
          averageDiastolicBP: this.avgDiastolicBP, // pre-computed value
          hr1: this.hr1,
          hr2: this.hr2,
          averageHR: this.avgHR, // pre-computed value
          randomBloodGlucoseMmolL: this.randomBloodGlucoseMmolL,
          randomBloodGlucoseMmolLp: this.randomBloodGlucoseMmolLp
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}/${this.patientVid}`, {
            vitalStatistics: vitalStatistics
          })
          .then((response) => {
            console.log(response.data)
            console.log('Vital Statistics posted successfully!')
            if (this.isEditing) {
              this.toggleEdit() // to switch back to read-only mode
            }
            toast.success('Vital Statistics saved successfully!')
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
    removeHighlight(ref: string) {
      ;(this.$refs[ref] as HTMLElement).classList.remove('input-error')
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
.input-error {
  border: 1px solid red;
}
</style>
