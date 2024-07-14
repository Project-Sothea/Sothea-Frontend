<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Doctor's Consult</h1>
      <br />

      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex flex-row">
          <div class="font-medium text-md w-1/3">Condition</div>
          <div class="font-medium text-md w-1/6">Yes</div>
          <div class="font-medium text-md w-1/6">No</div>
        </div>
      </div>

      <!-- Healthy -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Healthy</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="healthy"
                class="w-4 h-4"
                v-model="healthy"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="healthy"
                class="w-4 h-4"
                v-model="healthy"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- MSK -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">MSK</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="msk"
                class="w-4 h-4"
                v-model="msk"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="msk"
                class="w-4 h-4"
                v-model="msk"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- CVS -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">CVS</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cvs"
                class="w-4 h-4"
                v-model="cvs"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="cvs"
                class="w-4 h-4"
                v-model="cvs"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Respi -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">Respi</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="respi"
                class="w-4 h-4"
                v-model="respi"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="respi"
                class="w-4 h-4"
                v-model="respi"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- GU -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">GU</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="gu"
                class="w-4 h-4"
                v-model="gu"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="gu"
                class="w-4 h-4"
                v-model="gu"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- GIT -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">GIT</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="git"
                class="w-4 h-4"
                v-model="git"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="git"
                class="w-4 h-4"
                v-model="git"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- EYE -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">EYE</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="eye"
                class="w-4 h-4"
                v-model="eye"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="eye"
                class="w-4 h-4"
                v-model="eye"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- DERM -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row">
          <div class="font-normal text-sm w-1/3">DERM</div>

          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="derm"
                class="w-4 h-4"
                v-model="derm"
                :value="true"
                :disabled="!isEditing"
              />
            </label>
          </div>
          <div class="flex items-center w-1/6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="derm"
                class="w-4 h-4"
                v-model="derm"
                :value="false"
                :disabled="!isEditing"
              />
            </label>
          </div>
        </div>
      </div>
      <!-- Others -->
      <div class="flex flex-col mt-4">
        <div class="flex flex-row items-center">
          <div class="font-normal text-sm w-1/3">Others:</div>

          <div class="flex w-1/3">
            <input
              v-model="others"
              type="text"
              placeholder="Specify"
              class="w-full bg-transparent rounded-md border border-stroke py-2 px-2 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Consultation Notes -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Consultation Notes</label>
        <textarea
          v-model="consultationNotes"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Diagnosis -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Diagnosis</label>
        <textarea
          v-model="diagnosis"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Treatment -->
      <div class="mt-4">
        <label for="" class="mb-2 block text-sm font-medium text-dark">Treatment</label>
        <textarea
          v-model="treatment"
          rows="3"
          placeholder="Remarks"
          class="w-full bg-transparent rounded-md border border-stroke p-3 font-normal text-sm text-dark-4 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <div class="flex flex-col mt-2">
        <!-- Referral Header -->
        <div class="flex flex-row">
          <div class="w-1/3"></div>
          <div class="font-medium text-sm pr-5">Yes</div>
          <div class="font-medium text-sm">No</div>
          <div class="font-medium text-sm w-1/3" style="padding-left: 4.3rem;">Location</div>
        </div>
      </div>

      <!-- Referral Needed? -->
      <div class="flex flex-col mt-2">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">Referral Needed?</div>

          <div class="flex w-1/6">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input type="radio" name="ref-needed" class="w-4 h-4" v-model="referralNeeded" :value="true"
                  :disabled="!isEditing" 
                  @click="yLocation=true"/>
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input type="radio" name="ref-needed" class="w-4 h-4" v-model="referralNeeded" :value="false"
                  :disabled="!isEditing" 
                  @click="yLocation=false"/>
              </label>
            </div>
          </div>

          <div class="flex w-1/3 grow">
            <textarea v-model="referralLoc" rows="1" placeholder="Enter Location"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
              :disabled="!isEditing || !yLocation" :required="yLocation"></textarea>
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

import axios, { type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import type DoctorsConsultation from '@/types/DoctorsConsultation'
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
      healthy: null as boolean | null,
      msk: null as boolean | null,
      cvs: null as boolean | null,
      respi: null as boolean | null,
      gu: null as boolean | null,
      git: null as boolean | null,
      eye: null as boolean | null,
      derm: null as boolean | null,
      others: '' as string,
      consultationNotes: '' as string | null,
      diagnosis: '' as string | null,
      treatment: '' as string | null,
      referralNeeded: null as boolean | null,
      referralLoc: '' as string | null,
      remarks: 'remarks' as string | null,
      isEditing: false,
      yLocation: false,
    }
  },
  created() {
    if (!this.isAdd) {
      const drConsult = this.patientData.doctorsconsultation;
      if (!drConsult) return;
      this.healthy = drConsult.healthy;
      this.msk = drConsult.msk;
      this.cvs = drConsult.cvs;
      this.respi = drConsult.respi;
      this.gu = drConsult.gu;
      this.git = drConsult.git;
      this.eye = drConsult.eye;
      this.derm = drConsult.derm;
      this.others = drConsult.others;
      this.consultationNotes = drConsult.consultationNotes;
      this.diagnosis = drConsult.diagnosis;
      this.treatment = drConsult.treatment;
      this.referralNeeded = drConsult.referralNeeded;
      this.referralLoc = drConsult.referralLoc;
      this.remarks = drConsult.remarks;
      this.yLocation = this.referralNeeded;
    }
  },
  methods: {
    async submitData() {
      const toast = useToast()
      try {
        if (this.healthy === null) {
          toast.error('Please indicate if patient is healthy')
          return
        }
        if (this.msk === null) {
          toast.error('Please indicate if patient has MSK')
          return
        }
        if (this.cvs === null) {
          toast.error('Please indicate if patient has CVS')
          return
        }
        if (this.respi === null) {
          toast.error('Please indicate if patient has Respi')
          return
        }
        if (this.gu === null) {
          toast.error('Please indicate if patient has GU')
          return
        }
        if (this.git === null) {
          toast.error('Please indicate if patient has GIT')
          return
        }
        if (this.eye === null) {
          toast.error('Please indicate if patient has Eye')
          return
        }
        if (this.derm === null) {
          toast.error('Please indicate if patient has Derm')
          return
        }
        if (this.others === '') {
          toast.error('Please indicate if patient has Others')
          return
        }
        if (this.referralNeeded === null) {
          toast.error('Please indicate if patient needs referral')
          return
        }
        if (this.referralNeeded && this.referralLoc === '') {
          toast.error('Please enter referral location')
          return
        }
        if (!this.referralNeeded) { // if referral not needed, set referralLoc to null
          this.referralLoc = null
        }
        const doctorsConsultation: DoctorsConsultation = { // need to define outside to catch missing fields
          healthy: this.healthy,
          msk: this.msk,
          cvs: this.cvs,
          respi: this.respi,
          gu: this.gu,
          git: this.git,
          eye: this.eye,
          derm: this.derm,
          others: this.others,
          consultationNotes: this.consultationNotes,
          diagnosis: this.diagnosis,
          treatment: this.treatment,
          referralNeeded: this.referralNeeded,
          referralLoc: this.referralLoc,
          remarks: this.remarks
        }
        await axios
          .patch(`${BaseURL}/patient/${this.patientId}`, {
            doctorsConsultation: doctorsConsultation
          })
          .then((response) => {
            console.log(response.data)
            console.log('Doctors Consultation posted successfully!')
            if (this.isEditing) {
              this.toggleEdit() // to switch back to read-only mode
            }
            toast.success('Doctors Consultation saved successfully!')
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
