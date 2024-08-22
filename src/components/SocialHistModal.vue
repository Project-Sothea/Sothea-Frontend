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
                <input
                  type="radio"
                  name="smoking-hist"
                  class="w-4 h-4"
                  v-model="pastSmokingHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="smoking-hist"
                  class="w-4 h-4"
                  v-model="pastSmokingHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea
              rows="1"
              placeholder="If Y, no. of years"
              type="number"
              v-model="numberOfYears"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
              ref="numberOfYears"
              @input="removeHighlight('numberOfYears')"
            ></textarea>
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
                <input
                  type="radio"
                  name="curr-smoking-hist"
                  class="w-4 h-4"
                  v-model="currentSmokingHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="curr-smoking-hist"
                  class="w-4 h-4"
                  v-model="currentSmokingHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea
              rows="1"
              placeholder="If Y, how many cigarettes/day?"
              type="number"
              v-model="cigarettesPerDay"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
              ref="cigarettesPerDay"
              @input="removeHighlight('cigarettesPerDay')"
            ></textarea>
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
                <input
                  type="radio"
                  name="alc-hist"
                  class="w-4 h-4"
                  v-model="alcoholHistory"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="alc-hist"
                  class="w-4 h-4"
                  v-model="alcoholHistory"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea
              rows="1"
              placeholder="If Y, how regularly?"
              v-model="howRegular"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
              ref="howRegular"
              @input="removeHighlight('howRegular')"
            ></textarea>
          </div>
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
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

import axios from 'axios'
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
        // Check if all Yes/No fields are filled
        if (
          this.pastSmokingHistory === null ||
          this.currentSmokingHistory === null ||
          this.alcoholHistory === null
        ) {
          toast.error('Please select yes/no for all fields')
          return
        }

        // Reset error highlighting
        Object.keys(this.$refs).forEach((ref) => {
          ;(this.$refs[ref] as HTMLElement).classList.remove('input-error')
        })

        // If Yes is selected, its corresponding field should not be empty
        let hasError = false
        if (this.pastSmokingHistory === true && this.numberOfYears === null) {
          ;(this.$refs.numberOfYears as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.currentSmokingHistory === true && this.cigarettesPerDay === null) {
          ;(this.$refs.cigarettesPerDay as HTMLElement).classList.add('input-error')
          hasError = true
        }
        if (this.alcoholHistory === true && this.howRegular === '') {
          ;(this.$refs.howRegular as HTMLElement).classList.add('input-error')
          hasError = true
        }

        if (hasError) {
          toast.error('Please fill out the highlighted fields')
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
