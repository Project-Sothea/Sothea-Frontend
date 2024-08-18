<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Visual Acuity</h1>
      <br />
      <div class="flex flex-col">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- L eye vision -->
          <div class="w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              L eye vision (6/)
            </label>
            <input
              v-model="lEyeVision"
              type="number"
              step="1"
              placeholder=""
              @keydown="preventNegative"
              min="0"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              ref="lEyeVision"
              @input="removeHighlight('lEyeVision')"
            />
          </div>

          <!-- R eye vision -->
          <div class="ml-3 w-1/2">
            <label for="" class="mb-1 block text-sm font-medium text-dark">
              R eye vision (6/)
            </label>
            <input
              v-model="rEyeVision"
              type="number"
              step="1"
              placeholder=""
              @keydown="preventNegative"
              min="0"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
              ref="rEyeVision"
              @input="removeHighlight('rEyeVision')"
            />
          </div>
        </div>

        <!-- Additional Intervention -->
        <div class="mt-4">
          <label for="" class="mb-2 block text-sm font-medium text-dark"
            >Additional Intervention:
          </label>
          <textarea
            v-model="additionalIntervention"
            rows="3"
            placeholder="Remarks"
            class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            :disabled="!isEditing"
          ></textarea>
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
import type VisualAcuity from '@/types/VisualAcuity'
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
      lEyeVision: null as number | null,
      rEyeVision: null as number | null,
      additionalIntervention: '' as string | null,
      isEditing: false
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        let hasError = false

        if (this.lEyeVision === null) {
          (this.$refs.lEyeVision as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.rEyeVision === null) {
          (this.$refs.rEyeVision as HTMLElement).classList.add('input-error')
          hasError = true
        }

        if (hasError) {
          toast.error('Please fill out the highlighted fields');
          return
        }

        const visualAcuity: VisualAcuity = {
          // need to define outside to catch missing fields
          lEyeVision: this.lEyeVision,
          rEyeVision: this.rEyeVision,
          additionalIntervention: this.additionalIntervention
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}`, {
            visualAcuity: visualAcuity
          })
          .then((response) => {
            console.log(response.data)
            console.log('Visual Acuity posted successfully!')
            if (this.isEditing) {
              this.toggleEdit() // to switch back to read-only mode
            }
            toast.success('Visual Acuity saved successfully!')
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
      (this.$refs[ref] as HTMLElement).classList.remove('input-error')
    },
    preventNegative(event: any) {
      if (event.key === '-' || event.key === 'e') {
        event.preventDefault()
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
.input-error {
  border: 1px solid red;
}
</style>
